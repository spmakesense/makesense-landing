import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Avatar, Empty, Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { KIND_LABEL, prettyPhone, TEMP_LABEL } from "@/lib/format";
import type { Client } from "@/lib/types";

const FILTERS = [
  { k: "", label: "הכל" },
  { k: "buyer", label: "קונים" },
  { k: "seller", label: "מוכרים" },
  { k: "tenant", label: "שוכרים" },
  { k: "landlord", label: "משכירים" },
];

export default async function Clients({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string }> }) {
  const { office } = await requireCtx();
  const { q = "", kind = "" } = await searchParams;
  const like = `%${q.trim()}%`;
  const rows = await all<Client>(
    `SELECT * FROM clients WHERE office_id = ? AND (? = '' OR name LIKE ? OR phone LIKE ?) AND (? = '' OR kind = ?) ORDER BY created_at DESC LIMIT 200`,
    office.id,
    q.trim(),
    like,
    like.replace(/-/g, ""),
    kind,
    kind,
  );
  return (
    <main className="page">
      <Header
        title="לקוחות"
        start
        action={
          <Link href="/clients/new" className="ib" aria-label="לקוח חדש">
            <Icon name="uplus" />
          </Link>
        }
      />
      <form className="inp row" style={{ marginBottom: 12, color: "var(--mute)" }}>
        <Icon name="search" />
        <input name="q" defaultValue={q} placeholder="חיפוש לפי שם או טלפון" style={{ border: 0, outline: 0, flex: 1, height: 46, background: "none", fontSize: 16 }} />
        {kind ? <input type="hidden" name="kind" value={kind} /> : null}
      </form>
      <div className="seg" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <Link key={f.k} href={`/clients?kind=${f.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={kind === f.k ? "on" : ""}>
            {f.label}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <Empty icon="users" text={q ? "לא נמצאו לקוחות" : "עוד אין לקוחות. לקוח נוסף אוטומטית בכל החתמה, או ידנית."}>
          <Link href="/clients/new" className="btn bp sm">
            לקוח חדש
          </Link>
        </Empty>
      ) : (
        <div className="stack">
          {rows.map((c) => (
            <Link key={c.id} href={`/clients/${c.id}`} className="card row">
              <Avatar name={c.name} />
              <div className="grow">
                <div className="t ellipsis">{c.name}</div>
                <div className="s" style={{ direction: "ltr", textAlign: "right" }}>
                  {prettyPhone(c.phone)}
                </div>
              </div>
              <span className="chip c-navy">{KIND_LABEL[c.kind]}</span>
              {c.temperature === "hot" ? <span className="chip c-red">{TEMP_LABEL.hot}</span> : null}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
