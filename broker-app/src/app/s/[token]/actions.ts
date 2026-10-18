"use server";

import { checkOtp, issueOtp, otpThrottled, requestMeta } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { audit, finalizeIfComplete } from "@/lib/documents";
import { validIsraeliId } from "@/lib/format";
import { now } from "@/lib/ids";
import { DEMO_MODE, sendSms } from "@/lib/sms";
import { ANNEX_CONSENTS, getTemplate, type Values } from "@/lib/templates";
import type { Doc, Signer } from "@/lib/types";

async function load(token: string) {
  const s = await get<Signer>("SELECT * FROM signers WHERE token = ?", token);
  if (!s) return null;
  const d = (await get<Doc>("SELECT * FROM documents WHERE id = ?", s.document_id))!;
  return { s, d };
}

export async function markViewed(token: string) {
  const x = await load(token);
  if (!x || x.s.viewed_at) return;
  const meta = await requestMeta();
  await run("UPDATE signers SET viewed_at = ?, status = CASE WHEN status = 'pending' THEN 'viewed' ELSE status END WHERE id = ?", now(), x.s.id);
  await audit(x.d.id, x.s.name, "viewed", { ip: meta.ip });
}

export async function signAnnex(token: string, signature: string, consents: boolean[]): Promise<{ error?: string }> {
  const x = await load(token);
  if (!x || x.d.status === "cancelled") return { error: "הקישור אינו בתוקף" };
  if (!x.d.annex) return {};
  if (consents.length !== ANNEX_CONSENTS.length || consents.some((c) => !c)) return { error: "נא לאשר את כל ההצהרות בנספח" };
  if (!signature.startsWith("data:image/png")) return { error: "נא לחתום על הנספח" };
  await run("UPDATE signers SET annex_signature = ?, annex_signed_at = ? WHERE id = ?", signature, now(), x.s.id);
  await audit(x.d.id, x.s.name, "annex_signed");
  return {};
}

export async function requestSignCode(token: string): Promise<{ error?: string; demoCode?: string; phone?: string }> {
  const x = await load(token);
  if (!x || x.d.status === "cancelled") return { error: "הקישור אינו בתוקף" };
  if (!x.s.phone) return { error: "לא הוגדר טלפון לחותם" };
  if (await otpThrottled(`sign:${x.s.id}`)) return { error: "קוד נשלח לפני רגע. נסו שוב בעוד חצי דקה." };
  const code = await issueOtp(`sign:${x.s.id}`);
  await sendSms(x.s.phone, `קוד האימות לחתימה על "${x.d.title}": ${code}`);
  await audit(x.d.id, x.s.name, "otp_sent");
  return { demoCode: DEMO_MODE ? code : undefined, phone: x.s.phone.slice(-4) };
}

export interface SubmitInput {
  identity: { name: string; id_number: string; address: string };
  primary: Values;
  consents: boolean[];
  signature: string;
  code: string;
  geo: { lat: number; lng: number; acc: number } | null;
}

export async function submitSignature(token: string, input: SubmitInput): Promise<{ error?: string; done?: boolean }> {
  const x = await load(token);
  if (!x) return { error: "הקישור אינו בתוקף" };
  if (x.d.status === "cancelled") return { error: "המסמך בוטל על ידי המתווך" };
  if (x.s.status === "signed") return { done: true };
  const t = getTemplate(x.d.template)!;
  if (x.d.annex && !(await get<Signer>("SELECT annex_signed_at FROM signers WHERE id = ?", x.s.id))?.annex_signed_at) return { error: "יש לחתום קודם על נספח הגילוי" };
  if (!input.identity.name.trim()) return { error: "נא למלא שם מלא" };
  if (!validIsraeliId(input.identity.id_number)) return { error: "מספר תעודת זהות לא תקין" };
  if (t.signerAddressRequired && !input.identity.address.trim()) return { error: "נא למלא כתובת" };
  if (input.consents.length !== t.consents.length || input.consents.some((c) => !c)) return { error: "נא לאשר את כל ההצהרות" };
  if (!input.signature.startsWith("data:image/png")) return { error: "נא לחתום בתיבת החתימה" };

  const isPrimary = x.s.position === 0 && Boolean(t.primarySections);
  if (isPrimary) {
    const missing = t.primarySections!.flatMap((s) => s.fields).filter((f) => f.required && (!f.showIf || f.showIf(input.primary)) && !input.primary[f.key]);
    if (missing.length) return { error: `חסר: ${missing.map((f) => f.label).join(", ")}` };
  }

  const otp = await checkOtp(`sign:${x.s.id}`, input.code);
  if (otp !== "ok") return { error: otp === "wrong" ? "קוד האימות שגוי" : "קוד האימות פג תוקף – שלחו קוד חדש" };

  const meta = await requestMeta();
  const values = { name: input.identity.name.trim(), id_number: input.identity.id_number.replace(/\D/g, ""), address: input.identity.address.trim() };
  await run(
    "UPDATE signers SET status = 'signed', signed_at = ?, otp_verified_at = ?, signature = ?, values_json = ?, ip = ?, user_agent = ?, geo = ?, viewed_at = COALESCE(viewed_at, ?) WHERE id = ?",
    now(),
    now(),
    input.signature,
    JSON.stringify(values),
    meta.ip,
    meta.userAgent,
    input.geo ? JSON.stringify(input.geo) : null,
    now(),
    x.s.id,
  );
  if (isPrimary) {
    const data = { ...JSON.parse(x.d.data), ...input.primary };
    await run("UPDATE documents SET data = ? WHERE id = ?", JSON.stringify(data), x.d.id);
  }
  await audit(x.d.id, x.s.name, "signed", { ip: meta.ip, geo: Boolean(input.geo) });
  await finalizeIfComplete(x.d.id, meta.origin);
  return { done: true };
}
