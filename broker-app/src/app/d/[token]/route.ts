import { get } from "@/lib/db";
import { audit, loadDoc, pdfFileName, readPdf } from "@/lib/documents";
import { now } from "@/lib/ids";
import type { Doc } from "@/lib/types";

// Public download of a signed copy by its share link (valid for 30 days after the last send).
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const d = await get<Doc>("SELECT * FROM documents WHERE share_token = ?", token);
  const pdf = d?.status === "signed" ? await readPdf(d.id) : null;
  if (!d || !pdf) return new Response("המסמך לא נמצא", { status: 404 });
  if ((d.share_expires ?? 0) < now()) return new Response("תוקף הקישור פג. בקשו מהמתווך לשלוח שוב.", { status: 410 });
  const f = (await loadDoc(d.id))!;
  await audit(d.id, "לקוח", "copy_downloaded");
  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(pdfFileName(f))}`,
      "cache-control": "private, no-store",
    },
  });
}
