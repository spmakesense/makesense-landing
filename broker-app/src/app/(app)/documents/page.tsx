import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Empty, Header, STATUS_CHIP } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { dateHe } from "@/lib/format";
import { getTemplate } from "@/lib/templates";
import type { Doc } from "@/lib/types";

const TABS = [
  { k: "open", label: "ממתינים" },
  { k: "signed", label: "נחתמו" },
  { k: "cancelled", label: "בוטלו" },
  { k: "all", label: "הכל" },
];

export default async function Documents({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { office } = await requireCtx();
  const { status = "all", q = "" } = await searchParams;
  const docs = all<Doc & { signer_names: string }>(
    `SELECT d.*, (SELECT GROUP_CONCAT(name, ', ') FROM signers s WHERE s.document_id = d.id) AS signer_names
     FROM documents d WHERE d.office_id = ?
     AND (? = 'all' OR (? = 'open' AND d.status IN ('sent','partial')) OR d.status = ?)
     AND (? = '' OR d.title LIKE ? OR EXISTS (SELECT 1 FROM signers s WHERE s.document_id = d.id AND s.name LIKE ?))
     ORDER BY d.created_at DESC LIMIT 300`,
    office.id,
    status,
    status,
    status,
    q.trim(),
    `%${q.trim()}%`,
    `%${q.trim()}%`,
  );
  return (
    <main className="page">
      <Header title="מסמכים" back="/more" />
      <form className="inp row" style={{ marginBottom: 12, color: "var(--mute)" }}>
        <Icon name="search" />
        <input name="q" defaultValue={q} placeholder="חיפוש לפי כתובת או שם חותם" style={{ border: 0, outline: 0, flex: 1, height: 46, background: "none", fontSize: 16 }} />
        <input type="hidden" name="status" value={status} />
      </form>
      <div className="seg" style={{ marginBottom: 14 }}>
        {TABS.map((t) => (
          <Link key={t.k} href={`/documents?status=${t.k}`} className={status === t.k ? "on" : ""}>
            {t.label}
          </Link>
        ))}
      </div>
      {docs.length === 0 ? (
        <Empty icon="file" text="אין מסמכים להצגה">
          <Link href="/documents/new" className="btn bp sm">
            מסמך חדש
          </Link>
        </Empty>
      ) : (
        <div className="stack">
          {docs.map((d) => {
            const t = getTemplate(d.template);
            return (
              <Link key={d.id} href={`/documents/${d.id}`} className="card row">
                <div className={`av c-${t?.tone ?? "navy"}`}>
                  <Icon name={t?.icon ?? "file"} />
                </div>
                <div className="grow">
                  <div className="t ellipsis">{d.title}</div>
                  <div className="s ellipsis">
                    {d.signer_names} · {dateHe(d.created_at)}
                  </div>
                </div>
                <span className={`chip ${STATUS_CHIP[d.status].cls}`}>{STATUS_CHIP[d.status].label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
