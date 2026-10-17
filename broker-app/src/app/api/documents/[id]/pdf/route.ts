import fs from "node:fs";
import { currentUser } from "@/lib/auth";
import { loadDoc, pdfFileName, pdfPath } from "@/lib/documents";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const f = loadDoc(id);
  if (!user || !f || f.doc.office_id !== user.office_id) return new Response("not found", { status: 404 });
  if (!fs.existsSync(pdfPath(id))) return new Response("המסמך עוד לא נחתם", { status: 409 });
  const download = new URL(req.url).searchParams.get("download") === "1";
  return new Response(new Uint8Array(fs.readFileSync(pdfPath(id))), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(pdfFileName(f))}`,
      "cache-control": "private, no-store",
    },
  });
}
