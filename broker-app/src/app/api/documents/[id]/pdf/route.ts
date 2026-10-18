import { currentUser } from "@/lib/auth";
import { loadDoc, pdfFileName, readPdf } from "@/lib/documents";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const f = await loadDoc(id);
  if (!user || !f || f.doc.office_id !== user.office_id) return new Response("not found", { status: 404 });
  const pdf = await readPdf(id);
  if (!pdf) return new Response("המסמך עוד לא נחתם", { status: 409 });
  const download = new URL(req.url).searchParams.get("download") === "1";
  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(pdfFileName(f))}`,
      "cache-control": "private, no-store",
    },
  });
}
