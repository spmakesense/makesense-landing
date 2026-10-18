import "server-only";
import { all, get, run, tx } from "./db";
import { newId, newToken, now, sha256 } from "./ids";
import { driveUserFor, savePdfToDrive } from "./gdrive";
import { renderPdf } from "./pdf";
import { sendSms } from "./sms";
import { getTemplate, type Interest, type RenderCtx, type Values } from "./templates";
import type { AuditRow, Doc, Office, Property, Signer, User } from "./types";

export const SHARE_TTL_MS = 30 * 86_400_000;

export interface FullDoc {
  doc: Doc;
  data: Values;
  annex: Interest | null;
  signers: Signer[];
  agent: User;
  office: Office;
  property: Property | null;
  audit: AuditRow[];
}

export async function loadDoc(id: string): Promise<FullDoc | null> {
  const doc = await get<Doc>("SELECT * FROM documents WHERE id = ?", id);
  if (!doc) return null;
  return {
    doc,
    data: JSON.parse(doc.data),
    annex: doc.annex ? JSON.parse(doc.annex) : null,
    signers: await all<Signer>("SELECT * FROM signers WHERE document_id = ? ORDER BY position", id),
    agent: (await get<User>("SELECT * FROM users WHERE id = ?", doc.agent_id))!,
    office: (await get<Office>("SELECT * FROM offices WHERE id = ?", doc.office_id))!,
    property: doc.property_id ? (await get<Property>("SELECT * FROM properties WHERE id = ?", doc.property_id) ?? null) : null,
    audit: await all<AuditRow>("SELECT * FROM audit WHERE document_id = ? ORDER BY at, id", id),
  };
}

export function renderCtx(f: FullDoc): RenderCtx {
  const p = f.property;
  return {
    data: f.data,
    date: f.doc.created_at,
    agent: { name: f.agent.name ?? "", license: f.agent.license ?? "", phone: f.agent.phone },
    office: { name: f.office.name, company_id: f.office.company_id, address: f.office.address },
    property: p
      ? {
          address: p.address,
          city: p.city,
          parcel: p.parcel,
          kind: p.kind,
          rooms: p.rooms,
          sqm: p.sqm,
          floor: p.floor,
          price: p.price,
          deal_type: p.deal_type,
          disclosure: p.disclosure ? JSON.parse(p.disclosure) : null,
        }
      : null,
    signers: f.signers.map((s) => {
      const v = JSON.parse(s.values_json) as Values;
      return { name: String(v.name || s.name), phone: s.phone, id_number: String(v.id_number ?? ""), address: String(v.address ?? "") };
    }),
  };
}

export async function audit(documentId: string, actor: string, action: string, meta?: Record<string, unknown>) {
  await run("INSERT INTO audit (document_id, actor, action, meta, at) VALUES (?, ?, ?, ?, ?)", documentId, actor, action, meta ? JSON.stringify(meta) : null, now());
}

export interface NewDocInput {
  officeId: string;
  agent: User;
  templateKey: string;
  propertyId: string | null;
  data: Values;
  signers: { clientId: string | null; name: string; phone: string | null; email: string | null }[];
}

export async function createDocument(input: NewDocInput): Promise<string> {
  const t = getTemplate(input.templateKey);
  if (!t) throw new Error("unknown template");
  const property = input.propertyId ? await get<Property>("SELECT * FROM properties WHERE id = ? AND office_id = ?", input.propertyId, input.officeId) : undefined;
  const interest: Interest | null = property?.interest ? JSON.parse(property.interest) : null;
  const annex = t.buyerSide(input.data) && interest ? interest : null;
  const title = property ? `${t.title} · ${property.address}` : t.title;
  const id = newId();
  await tx(async () => {
    await run(
      "INSERT INTO documents (id, office_id, agent_id, template, title, property_id, data, annex, status, agent_signature, share_token, share_expires, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?, ?)",
      id,
      input.officeId,
      input.agent.id,
      t.key,
      title,
      property?.id ?? null,
      JSON.stringify(input.data),
      annex ? JSON.stringify(annex) : null,
      input.agent.signature,
      newToken(),
      now() + SHARE_TTL_MS,
      now(),
    );
    for (const [i, s] of input.signers.entries()) {
      await run(
        "INSERT INTO signers (id, document_id, client_id, position, name, phone, email, token, values_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        newId(),
        id,
        s.clientId,
        i,
        s.name,
        s.phone,
        s.email,
        newToken(),
        JSON.stringify({ name: s.name }),
      );
    }
    await audit(id, input.agent.name ?? "מתווך", "created", { template: t.key, signers: input.signers.length, annex: Boolean(annex) });
  });
  return id;
}

/** Signed PDFs are stored in the database, so the app needs no persistent disk (works on Vercel). */
export async function savePdf(docId: string, bytes: Uint8Array) {
  await run("INSERT INTO files (document_id, data) VALUES (?, ?) ON CONFLICT(document_id) DO UPDATE SET data = excluded.data", docId, bytes);
}

export async function readPdf(docId: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const row = await get<{ data: Uint8Array }>("SELECT data FROM files WHERE document_id = ?", docId);
  return row ? Uint8Array.from(row.data) : null;
}

export function pdfFileName(f: FullDoc): string {
  const t = getTemplate(f.doc.template);
  const d = new Date(f.doc.completed_at ?? f.doc.created_at).toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });
  const parts = [t?.title ?? "מסמך", f.property?.address, f.signers[0]?.name, d];
  return parts.filter(Boolean).join("_").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "_") + ".pdf";
}

/** Called after each signature. When everyone has signed: render the PDF, seal it, apply side effects, send copies. */
export async function finalizeIfComplete(docId: string, origin: string): Promise<boolean> {
  const f = await loadDoc(docId);
  if (!f || f.doc.status === "signed" || f.doc.status === "cancelled") return false;
  if (f.signers.some((s) => s.status !== "signed")) {
    await run("UPDATE documents SET status = 'partial' WHERE id = ? AND status = 'sent'", docId);
    return false;
  }
  const completedAt = now();
  // Two signers can finish at the same moment: only the first caller seals the document.
  if ((await run("UPDATE documents SET completed_at = ? WHERE id = ? AND completed_at IS NULL", completedAt, docId)).changes === 0) return false;
  f.doc.completed_at = completedAt;
  const bytes = await renderPdf(f, renderCtx(f));
  await savePdf(docId, bytes);
  const hash = sha256(bytes);
  await run("UPDATE documents SET status = 'signed', completed_at = ?, pdf_sha256 = ?, share_expires = ? WHERE id = ?", completedAt, hash, completedAt + SHARE_TTL_MS, docId);
  await audit(docId, "מערכת", "completed", { sha256: hash });
  await applySideEffects(f);

  const driveUser = await driveUserFor(f.doc.agent_id);
  if (driveUser?.drive_auto) await saveToDriveSafe(f, driveUser, bytes);

  if (f.office.auto_send_copy) {
    const link = `${origin}/d/${f.doc.share_token}`;
    for (const s of f.signers) {
      if (!s.phone) continue;
      await sendSms(s.phone, `שלום ${s.name}, העתק חתום של "${f.doc.title}" מאת ${f.office.name}: ${link}`);
      await audit(docId, "מערכת", "copy_sent", { to: s.name, channel: "sms" });
    }
  }
  return true;
}

async function applySideEffects(f: FullDoc) {
  if (!f.property) return;
  if (f.doc.template === "exclusivity") {
    const marketing = Object.fromEntries((Array.isArray(f.data.marketing) ? (f.data.marketing as string[]) : []).map((k) => [k, false]));
    await run(
      "UPDATE properties SET exclusive_from = ?, exclusive_to = ?, marketing = ? WHERE id = ?",
      String(f.data.from),
      String(f.data.to),
      JSON.stringify(marketing),
      f.property.id,
    );
  }
  if (f.doc.template === "seller_questionnaire") {
    await run("UPDATE properties SET disclosure = ? WHERE id = ?", JSON.stringify({ ...f.data, _doc: f.doc.id, _at: now() }), f.property.id);
  }
}

export function driveFolderName(f: FullDoc): string {
  return f.property ? [f.property.address, f.property.city].filter(Boolean).join(", ") : "מסמכים ללא נכס";
}

/** Uploads the signed PDF to the agent's Google Drive. Never throws: a Drive problem must not break signing. */
export async function saveToDriveSafe(f: FullDoc, user: User, bytes?: Uint8Array): Promise<string | null> {
  try {
    const data = bytes ?? (await readPdf(f.doc.id));
    if (!data) return null;
    const fresh = (await get<Doc>("SELECT * FROM documents WHERE id = ?", f.doc.id))!;
    const link = await savePdfToDrive(user, fresh, pdfFileName(f), driveFolderName(f), data);
    if (!fresh.drive_link) await audit(f.doc.id, "מערכת", "drive_saved", { to: user.google_email });
    return link;
  } catch (e) {
    console.error("drive upload failed", e);
    await audit(f.doc.id, "מערכת", "drive_failed");
    return null;
  }
}
