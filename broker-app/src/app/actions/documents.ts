"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requestMeta, requireCtx } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { audit, createDocument, loadDoc, saveToDriveSafe } from "@/lib/documents";
import { disconnectDrive } from "@/lib/gdrive";
import { normalizePhone } from "@/lib/format";
import { newId, now } from "@/lib/ids";
import { DEMO_MODE, sendSms } from "@/lib/sms";
import { getTemplate, missingFields, type DefaultsCtx, type Values } from "@/lib/templates";
import type { Client, Property, Signer } from "@/lib/types";

export interface WizardSigner {
  clientId: string | null;
  name: string;
  phone: string;
}

export async function createDocumentAction(input: {
  template: string;
  propertyId: string | null;
  data: Values;
  signers: WizardSigner[];
}): Promise<{ error?: string }> {
  const { office, user } = await requireCtx();
  const t = getTemplate(input.template);
  if (!t) return { error: "תבנית לא קיימת" };
  const property = input.propertyId ? get<Property>("SELECT * FROM properties WHERE id = ? AND office_id = ?", input.propertyId, office.id) : undefined;
  if (t.needsProperty && !property) return { error: "נא לבחור נכס" };
  if (input.signers.length === 0) return { error: "נא להוסיף לפחות חותם אחד" };
  if (!t.multiSigner && input.signers.length > 1) return { error: "תבנית זו מיועדת לחותם אחד" };

  const missing = missingFields(t.fields, input.data);
  if (missing.length) return { error: `חסר: ${missing.map((f) => f.label).join(", ")}` };
  const dctx: DefaultsCtx = {
    feePct: office.default_fee_pct,
    feeIncludesVat: Boolean(office.fee_includes_vat),
    property: property
      ? {
          ...property,
          disclosure: property.disclosure ? JSON.parse(property.disclosure) : null,
          interest: property.interest ? JSON.parse(property.interest) : null,
        }
      : null,
  };
  const invalid = t.validate?.(input.data, dctx);
  if (invalid) return { error: invalid };

  // Every signer becomes (or is linked to) a client card; the phone is needed for SMS verification.
  const kind: Client["kind"] =
    t.audience === "seller" ? (property?.deal_type === "rent" ? "landlord" : "seller") : property?.deal_type === "rent" ? "tenant" : "buyer";
  const signers = [];
  for (const s of input.signers) {
    const phone = normalizePhone(s.phone);
    if (!s.name.trim()) return { error: "לכל חותם צריך שם" };
    if (!phone) return { error: `מספר טלפון לא תקין עבור ${s.name}` };
    let clientId = s.clientId && get("SELECT id FROM clients WHERE id = ? AND office_id = ?", s.clientId, office.id) ? s.clientId : null;
    if (!clientId) {
      clientId = get<{ id: string }>("SELECT id FROM clients WHERE office_id = ? AND phone = ?", office.id, phone)?.id ?? null;
    }
    if (!clientId) {
      clientId = newId();
      run(
        "INSERT INTO clients (id, office_id, owner_id, name, phone, kind, temperature, source, created_at) VALUES (?,?,?,?,?,?, 'warm', ?, ?)",
        clientId,
        office.id,
        user.id,
        s.name.trim(),
        phone,
        kind,
        t.title,
        now(),
      );
    }
    const c = get<Client>("SELECT * FROM clients WHERE id = ?", clientId)!;
    signers.push({ clientId, name: s.name.trim(), phone, email: c.email });
  }

  const id = createDocument({ officeId: office.id, agent: user, templateKey: t.key, propertyId: property?.id ?? null, data: input.data, signers });
  revalidatePath("/", "layout");
  redirect(`/documents/${id}?new=1`);
}

async function ownedDoc(id: string) {
  const ctx = await requireCtx();
  const f = loadDoc(id);
  if (!f || f.doc.office_id !== ctx.office.id) throw new Error("not found");
  return { ...ctx, f };
}

export async function cancelDocument(id: string) {
  const { f, user } = await ownedDoc(id);
  if (f.doc.status === "signed") return;
  run("UPDATE documents SET status = 'cancelled', cancelled_at = ? WHERE id = ?", now(), id);
  audit(id, user.name ?? "מתווך", "cancelled");
  revalidatePath(`/documents/${id}`);
}

/** Sends the signing link to a signer by SMS (also used as a reminder). */
export async function sendSigningSms(docId: string, signerId: string): Promise<{ ok?: boolean; demo?: boolean; error?: string }> {
  const { f, user } = await ownedDoc(docId);
  const s = f.signers.find((x) => x.id === signerId);
  if (!s?.phone) return { error: "לחותם אין מספר טלפון" };
  if (f.doc.status === "cancelled") return { error: "המסמך בוטל" };
  const { origin } = await requestMeta();
  const ok = await sendSms(s.phone, `שלום ${s.name}, ${user.name} (${f.office.name}) שלח/ה לך מסמך לחתימה: "${f.doc.title}". לחתימה: ${origin}/s/${s.token}`);
  audit(docId, user.name ?? "מתווך", s.status === "pending" ? "sent_sms" : "reminder_sms", { to: s.name });
  revalidatePath(`/documents/${docId}`);
  return ok ? { ok: true, demo: DEMO_MODE } : { error: "שליחת ה-SMS נכשלה" };
}

/** Records a share made from the device (WhatsApp / mail / copy link / download / native share). */
export async function logShare(docId: string, action: string, to?: string) {
  const { user } = await ownedDoc(docId);
  audit(docId, user.name ?? "מתווך", action, to ? { to } : undefined);
  revalidatePath(`/documents/${docId}`);
}

/** Sends the signed copy by SMS to the chosen signers and/or an extra phone number. */
export async function sendCopySms(docId: string, signerIds: string[], extraPhone: string): Promise<{ sent?: number; demo?: boolean; error?: string }> {
  const { f, user } = await ownedDoc(docId);
  if (f.doc.status !== "signed") return { error: "המסמך עוד לא נחתם על ידי כולם" };
  const { origin } = await requestMeta();
  const link = `${origin}/d/${f.doc.share_token}`;
  const targets: { name: string; phone: string }[] = f.signers
    .filter((s: Signer) => signerIds.includes(s.id) && s.phone)
    .map((s) => ({ name: s.name, phone: s.phone! }));
  if (extraPhone.trim()) {
    const p = normalizePhone(extraPhone);
    if (!p) return { error: "מספר טלפון לא תקין" };
    targets.push({ name: p, phone: p });
  }
  if (!targets.length) return { error: "נא לבחור נמענים" };
  for (const t of targets) {
    await sendSms(t.phone, `העתק חתום של "${f.doc.title}" מאת ${f.office.name}: ${link}`);
    audit(docId, user.name ?? "מתווך", "copy_sent", { to: t.name, channel: "sms" });
  }
  // A fresh send extends the download link.
  run("UPDATE documents SET share_expires = ? WHERE id = ?", now() + 30 * 86_400_000, docId);
  revalidatePath(`/documents/${docId}`);
  return { sent: targets.length, demo: DEMO_MODE };
}

/** Saves a signed document to the agent's connected Google Drive (manual "save to Drive"). */
export async function saveDocToDrive(docId: string): Promise<{ link?: string; error?: string; notConnected?: boolean }> {
  const { f, user } = await ownedDoc(docId);
  if (f.doc.status !== "signed") return { error: "המסמך עוד לא נחתם על ידי כולם" };
  if (!user.google_refresh) return { notConnected: true };
  const link = await saveToDriveSafe(f, user);
  revalidatePath(`/documents/${docId}`);
  return link ? { link } : { error: "השמירה ל-Google Drive נכשלה. נסו שוב או חברו מחדש בהגדרות." };
}

export async function disconnectDriveAction() {
  const { user } = await requireCtx();
  await disconnectDrive(user);
  revalidatePath("/settings");
}

export async function setDriveAuto(on: boolean) {
  const { user } = await requireCtx();
  run("UPDATE users SET drive_auto = ? WHERE id = ?", on ? 1 : 0, user.id);
  revalidatePath("/settings");
}
