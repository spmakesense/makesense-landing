import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Empty, Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { daysBetween, money, todayIso } from "@/lib/format";
import type { Property } from "@/lib/types";

export default async function Properties({ searchParams }: { searchParams: Promise<{ q?: string; f?: string }> }) {
  const { office } = await requireCtx();
  const { q = "", f = "active" } = await searchParams;
  const like = `%${q.trim()}%`;
  const rows = all<Property>(
    `SELECT * FROM properties WHERE office_id = ? AND (? = '' OR address LIKE ? OR city LIKE ?)
     AND (? = 'all' OR (? = 'active' AND status = 'active') OR (? = 'exclusive' AND exclusive_to >= ?) OR (? = 'closed' AND status != 'active'))
     ORDER BY created_at DESC LIMIT 200`,
    office.id,
    q.trim(),
    like,
    like,
    f,
    f,
    f,
    todayIso(),
    f,
  );
  const today = todayIso();
  const tabs = [
    { k: "active", label: "פעילים" },
    { k: "exclusive", label: "בלעדיות" },
    { k: "closed", label: "נסגרו" },
    { k: "all", label: "הכל" },
  ];
  return (
    <main className="page">
      <Header
        title="נכסים"
        start
        action={
          <Link href="/properties/new" className="ib" aria-label="נכס חדש">
            <Icon name="plus" />
          </Link>
        }
      />
      <form className="inp row" style={{ marginBottom: 12, color: "var(--mute)" }}>
        <Icon name="search" />
        <input name="q" defaultValue={q} placeholder="חיפוש לפי כתובת או עיר" style={{ border: 0, outline: 0, flex: 1, height: 46, background: "none", fontSize: 16 }} />
        <input type="hidden" name="f" value={f} />
      </form>
      <div className="seg" style={{ marginBottom: 14 }}>
        {tabs.map((t) => (
          <Link key={t.k} href={`/properties?f=${t.k}`} className={f === t.k ? "on" : ""}>
            {t.label}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <Empty icon="bld" text="אין נכסים להצגה">
          <Link href="/properties/new" className="btn bp sm">
            נכס חדש
          </Link>
        </Empty>
      ) : (
        <div className="stack">
          {rows.map((p) => {
            const excl = p.exclusive_to && p.exclusive_to >= today;
            return (
              <Link key={p.id} href={`/properties/${p.id}`} className="card row">
                <div className="thumb" />
                <div className="grow">
                  <div className="t ellipsis">
                    {p.address}
                    {p.city ? `, ${p.city}` : ""}
                  </div>
                  <div className="s">
                    {[p.rooms ? `${p.rooms} חד׳` : "", p.sqm ? `${p.sqm} מ״ר` : "", money(p.price, true)].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {excl ? <span className="chip c-amber">בלעדי · {daysBetween(today, p.exclusive_to!)} ימים</span> : null}
                {p.interest ? <span className="chip c-red">עניין אישי</span> : null}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
