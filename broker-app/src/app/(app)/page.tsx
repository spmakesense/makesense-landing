import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Avatar, STATUS_CHIP } from "@/components/ui";
import { toggleTask } from "@/app/actions/crm";
import { requireCtx } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { ago, daysBetween, longDateHe, money, todayIso } from "@/lib/format";
import type { Doc, Property, Signer, Task } from "@/lib/types";

export default async function Home() {
  const { user, office } = await requireCtx();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const expected = (await get<{ s: number | null }>("SELECT SUM(commission) AS s FROM deals WHERE office_id = ? AND agent_id = ? AND stage != 'paid'", office.id, user.id))?.s ?? 0;
  const paid = (await get<{ s: number | null }>("SELECT SUM(commission) AS s FROM deals WHERE office_id = ? AND agent_id = ? AND stage = 'paid' AND paid_at >= ?", office.id, user.id, monthStart.getTime()))?.s ?? 0;
  const signedMonth = (await get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE office_id = ? AND agent_id = ? AND status = 'signed' AND completed_at >= ?", office.id, user.id, monthStart.getTime()))!.n;
  const pending = await all<Doc>("SELECT * FROM documents WHERE office_id = ? AND agent_id = ? AND status IN ('sent','partial') ORDER BY created_at DESC LIMIT 6", office.id, user.id);
  const signers = pending.length
    ? await all<Signer>(`SELECT * FROM signers WHERE document_id IN (${pending.map(() => "?").join(",")}) ORDER BY position`, ...pending.map((d) => d.id))
    : [];
  const today = todayIso();
  const tasks = await all<Task & { client_name: string | null }>(
    "SELECT t.*, c.name AS client_name FROM tasks t LEFT JOIN clients c ON c.id = t.client_id WHERE t.user_id = ? AND t.done = 0 AND (t.due IS NULL OR t.due <= ?) ORDER BY t.due LIMIT 5",
    user.id,
    today,
  );
  const ending = (await all<Property>(
    "SELECT * FROM properties WHERE office_id = ? AND exclusive_to IS NOT NULL AND exclusive_to >= ? AND status = 'active' ORDER BY exclusive_to LIMIT 3",
    office.id,
    today,
  )).filter((p) => daysBetween(today, p.exclusive_to!) <= 30);
  const pendingCount = (await get<{ n: number }>("SELECT COUNT(*) AS n FROM documents WHERE office_id = ? AND agent_id = ? AND status IN ('sent','partial')", office.id, user.id))!.n;

  const quick = [
    { t: "brokerage_order", label: "הזמנת תיווך", icon: "file", tone: "c-teal" },
    { t: "showing_form", label: "הצגת נכס", icon: "eye", tone: "c-navy" },
    { t: "exclusivity", label: "בלעדיות", icon: "key", tone: "c-amber" },
    { t: "seller_questionnaire", label: "שאלון מוכר", icon: "list", tone: "c-green" },
  ];

  return (
    <main className="page">
      <header className="hdr">
        <div>
          <div className="s">{longDateHe(Date.now())}</div>
          <h1 className="start">שלום, {user.name?.split(" ")[0]}</h1>
        </div>
        <Link href="/settings">
          <Avatar name={user.name} tone="c-navy" />
        </Link>
      </header>

      <Link href="/deals" className="card hero" style={{ display: "block" }}>
        <div className="row between">
          <div>
            <div style={{ opacity: 0.75, fontSize: 13 }}>עמלות צפויות</div>
            <div className="big">{money(expected)}</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ opacity: 0.75, fontSize: 13 }}>נחתמו החודש</div>
            <div className="big">{signedMonth}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>נגבו החודש: {money(paid)}</div>
      </Link>

      <div className="grid4" style={{ marginTop: 14 }}>
        {quick.map((q) => (
          <Link key={q.t} href={`/documents/new?t=${q.t}`} className="card center" style={{ padding: "12px 4px" }}>
            <div className={`av ${q.tone}`} style={{ margin: "0 auto 6px" }}>
              <Icon name={q.icon} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{q.label}</div>
          </Link>
        ))}
      </div>

      <div className="sec">
        <h3>
          ממתינים לחתימה {pendingCount ? <span className="chip c-amber">{pendingCount}</span> : null}
        </h3>
        <Link href="/documents?status=open">הכל</Link>
      </div>
      {pending.length === 0 ? (
        <div className="card s center">אין מסמכים שממתינים לחתימה 🎉</div>
      ) : (
        <div className="stack">
          {pending.map((d) => {
            const ss = signers.filter((s) => s.document_id === d.id);
            const waiting = ss.filter((s) => s.status !== "signed");
            const viewed = waiting.find((s) => s.viewed_at);
            const chip = viewed ? { cls: "c-amber", label: `נצפה ${ago(viewed.viewed_at)}` } : STATUS_CHIP[d.status === "partial" ? "partial" : "pending"];
            return (
              <Link key={d.id} href={`/documents/${d.id}`} className="card row">
                <Avatar name={waiting[0]?.name ?? ss[0]?.name ?? ""} />
                <div className="grow">
                  <div className="t ellipsis">{waiting.map((s) => s.name).join(", ") || ss[0]?.name}</div>
                  <div className="s ellipsis">{d.title}</div>
                </div>
                <span className={`chip ${chip.cls}`}>{chip.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {tasks.length ? (
        <>
          <div className="sec">
            <h3>משימות להיום</h3>
          </div>
          <div className="card list-in" style={{ padding: "4px 14px" }}>
            {tasks.map((t) => (
              <form key={t.id} action={toggleTask.bind(null, t.id)} className="row">
                <button className="ib" style={{ width: 28, height: 28, border: "2px solid #fbbf24", borderRadius: 8 }} aria-label="סימון כבוצע" />
                <div className="grow">
                  <div className="t">{t.title}</div>
                  <div className="s">
                    {t.client_name ?? ""} {t.due && t.due < todayIso() ? "· באיחור" : ""}
                  </div>
                </div>
              </form>
            ))}
          </div>
        </>
      ) : null}

      {ending.length ? (
        <>
          <div className="sec">
            <h3>בלעדיות שמסתיימת בקרוב</h3>
          </div>
          <div className="stack">
            {ending.map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`} className="card row">
                <div className="av c-amber">
                  <Icon name="key" />
                </div>
                <div className="grow">
                  <div className="t">{p.address}</div>
                  <div className="s">עוד {daysBetween(today, p.exclusive_to!)} ימים</div>
                </div>
                <Icon name="chev" style={{ color: "var(--mute)" }} />
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}
