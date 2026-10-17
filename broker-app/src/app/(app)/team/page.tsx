import { Avatar, Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { money, prettyPhone } from "@/lib/format";
import type { User } from "@/lib/types";
import { InviteForm, RoleButton } from "./TeamForms";

export default async function Team({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { office, user } = await requireCtx();
  const { p = "month" } = await searchParams;
  const since = new Date();
  if (p === "week") since.setDate(since.getDate() - 7);
  else if (p === "quarter") since.setMonth(since.getMonth() - 3);
  else since.setDate(1);
  since.setHours(0, 0, 0, 0);
  const t0 = since.getTime();

  const members = all<User>("SELECT * FROM users WHERE office_id = ? ORDER BY role, name", office.id);
  const stats = members.map((m) => ({
    m,
    signed: get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE agent_id = ? AND status = 'signed' AND completed_at >= ?", m.id, t0)!.n,
    showings: get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE agent_id = ? AND template = 'showing_form' AND created_at >= ?", m.id, t0)!.n,
    stale: get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE agent_id = ? AND status IN ('sent','partial') AND created_at < ?", m.id, Date.now() - 48 * 3600_000)!.n,
    commission: get<{ s: number | null }>("SELECT SUM(commission) AS s FROM deals WHERE agent_id = ? AND stage = 'paid' AND paid_at >= ?", m.id, t0)!.s ?? 0,
  }));
  const totals = {
    signed: stats.reduce((a, s) => a + s.signed, 0),
    deals: get<{ n: number }>("SELECT COUNT(*) AS n FROM deals WHERE office_id = ? AND stage = 'paid' AND paid_at >= ?", office.id, t0)!.n,
    commission: stats.reduce((a, s) => a + s.commission, 0),
  };
  const weeks = [3, 2, 1, 0].map((w) => {
    const end = Date.now() - w * 7 * 86_400_000;
    return get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE office_id = ? AND status = 'signed' AND completed_at >= ? AND completed_at < ?", office.id, end - 7 * 86_400_000, end)!.n;
  });
  const maxW = Math.max(1, ...weeks);
  const top = [...stats].sort((a, b) => b.commission - a.commission || b.signed - a.signed)[0];

  return (
    <main className="page">
      <Header title={user.role === "manager" ? "המשרד שלי" : "הצוות"} back="/more" />
      <div className="seg" style={{ marginBottom: 14 }}>
        {[
          ["week", "שבוע"],
          ["month", "חודש"],
          ["quarter", "רבעון"],
        ].map(([k, l]) => (
          <a key={k} href={`/team?p=${k}`} className={p === k ? "on" : ""}>
            {l}
          </a>
        ))}
      </div>
      <div className="grid3">
        <div className="card">
          <div className="s">חתימות</div>
          <div className="big" style={{ fontSize: 24 }}>{totals.signed}</div>
        </div>
        <div className="card">
          <div className="s">עסקאות</div>
          <div className="big" style={{ fontSize: 24 }}>{totals.deals}</div>
        </div>
        <div className="card">
          <div className="s">עמלות</div>
          <div className="big" style={{ fontSize: 24 }}>{money(totals.commission, true)}</div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="t">חתימות לפי שבוע</div>
        <div className="row" style={{ alignItems: "flex-end", gap: 14, height: 110, marginTop: 12 }}>
          {weeks.map((n, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span className="xs">{n}</span>
              <div style={{ width: "100%", height: Math.max(4, (n / maxW) * 80), background: i === 3 ? "var(--teal)" : "#c7d2f5", borderRadius: "8px 8px 4px 4px" }} />
              <span className="xs">{i === 3 ? "השבוע" : `לפני ${3 - i}`}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sec">
        <h3>הצוות ({members.length})</h3>
      </div>
      <div className="card list-in" style={{ padding: "4px 14px" }}>
        {stats.map(({ m, signed, showings, stale, commission }) => (
          <div key={m.id} className="row">
            <Avatar name={m.name ?? m.phone} />
            <div className="grow">
              <div className="t">
                {m.name ?? prettyPhone(m.phone)} {m.role === "manager" ? <span className="chip c-navy">מנהל</span> : null}
              </div>
              <div className="s">{m.name ? `${signed} חתימות · ${showings} סיורים${stale ? ` · ${stale} ממתינות מעל 48ש׳` : ""}` : "הוזמן – טרם התחבר"}</div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="r" style={{ fontWeight: 700 }}>{money(commission, true)}</div>
              {stale > 2 ? <span className="chip c-red">דורש מעקב</span> : top && top.m.id === m.id && commission > 0 ? <span className="chip c-green">מוביל</span> : null}
              {user.role === "manager" && m.id !== user.id ? <RoleButton userId={m.id} role={m.role} /> : null}
            </div>
          </div>
        ))}
      </div>
      {user.role === "manager" ? <InviteForm /> : null}
    </main>
  );
}
