"use server";

import { get } from "@/lib/db";
import { dateTimeHe } from "@/lib/format";
import { sha256 } from "@/lib/ids";

export async function verifyPdf(fd: FormData): Promise<{ ok: boolean; message: string }> {
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "נא לבחור קובץ PDF" };
  const hash = sha256(new Uint8Array(await file.arrayBuffer()));
  const doc = await get<{ title: string; completed_at: number }>("SELECT title, completed_at FROM documents WHERE pdf_sha256 = ?", hash);
  if (!doc) return { ok: false, message: "הקובץ לא נמצא במערכת – ייתכן שהוא שונה אחרי החתימה, או שלא נחתם בחותמים." };
  return { ok: true, message: `המסמך מקורי ולא שונה: "${doc.title}", נחתם ${dateTimeHe(doc.completed_at)}.` };
}
