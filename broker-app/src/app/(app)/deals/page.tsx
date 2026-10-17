import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Avatar, Empty, Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { dateHe, money } from "@/lib/format";
import { DEAL_STAGES, type Deal } from "@/lib/types";
import { StageButtons } from "./StageButtons";

const STAGE_CHIP: Record<string, string> = { lead: "c-gray", showing: "c-navy", negotiation: "c-amber", memo: "c-amber", contract: "c-teal", paid: "c-green" };

export default async function Deals({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const { office } = await requireCtx();
  const { stage = "" } = await searchParams;
  const deals = all<Deal & { agent_name: string | null; client_name: string | null }>(
    `SELECT d.*, u.name AS agent_name, c.name AS client_name FROM deals d LEFT JOIN users u ON u.id = d.agent_id LEFT JOIN clients c ON c.id = d.client_id
     WHERE d.office_id = ? ORDER BY d.created_at DESC`,
    office.id,
  );
  const sum = (keys: string[]) => deals.filter((d) => keys.includes(d.stage)).reduce((a, d) => a + (d.commission ?? 0), 0);
  const paid = sum(["paid"]);
  const contract = sum(["contract", "memo"]);
  const nego = sum(["lead", "showing", "negotiation"]);
  const total = paid + contract + nego;
  const shown = stage ? deals.filter((d) => d.stage === stage) : deals.filter((d) => d.stage !== "paid");

  return (
    <main className="page">
      <Header
        title="עסקאות ועמלות"
        start
        action={
          <Link href="/deals/new" className="ib" aria-label="עסקה חדשה">
            <Icon name="plus" />
          </Link>
        }
      />
      <div className="card" style={{ padding: 16 }}>
        <div className="s">סה״כ עמלות בצנרת</div>
        <div className="big" style={{ color: "var(--navy)" }}>{money(total)}</div>
        <div style={{ display: "flex", height: 10, borderRadius: 10, overflow: "hidden", margin: "12px 0 10px", gap: 2, background: "var(--line)" }}>
          {total > 0 ? (
            <>
              <div style={{ flex: paid, background: "var(--green)" }} />
              <div style={{ flex: contract, background: "var(--teal)" }} />
              <div style={{ flex: nego, background: "var(--amber)" }} />
            </>
          ) : null}
        </div>
        <div className="row wrap xs" style={{ gap: 14 }}>
          <span className="row" style={{ gap: 5 }}>
            <span className="dot" style={{ background: "var(--green)" }} />
            שולם {money(paid, true)}
          </span>
          <span className="row" style={{ gap: 5 }}>
            <span className="dot" style={{ background: "var(--teal)" }} />
            זכ״ד / חוזה {money(contract, true)}
          </span>
          <span className="row" style={{ gap: 5 }}>
            <span className="dot" style={{ background: "var(--amber)" }} />
            בתהליך {money(nego, true)}
          </span>
        </div>
      </div>

      <div className="scroll-x" style={{ margin: "14px 0" }}>
        <Link href="/deals" className={`chip ${stage === "" ? "c-navy" : "c-gray"}`} style={{ padding: "7px 12px" }}>
          פתוחות
        </Link>
        {DEAL_STAGES.map((s) => (
          <Link key={s.key} href={`/deals?stage=${s.key}`} className="chip" style={{ padding: "7px 12px", background: stage === s.key ? "var(--navy)" : "#eef0f5", color: stage === s.key ? "#fff" : "var(--mute)" }}>
            {s.label} {deals.filter((d) => d.stage === s.key).length}
          </Link>
        ))}
      </div>

      {shown.length === 0 ? (
        <Empty icon="case" text="אין עסקאות בשלב הזה">
          <Link href="/deals/new" className="btn bp sm">
            עסקה חדשה
          </Link>
        </Empty>
      ) : (
        <div className="stack">
          {shown.map((d) => (
            <div key={d.id} className={`card ${d.stage === "contract" ? "ok" : ""}`}>
              <div className="row between">
                <div className="t">{d.title}</div>
                <span className={`chip ${STAGE_CHIP[d.stage]}`}>{DEAL_STAGES.find((s) => s.key === d.stage)?.label}</span>
              </div>
              <div className="s" style={{ margin: "4px 0 10px" }}>
                {[d.client_name, d.price ? `מחיר ${money(d.price, true)}` : "", d.due_date ? `תשלום עד ${dateHe(d.due_date)}` : ""].filter(Boolean).join(" · ")}
              </div>
              <div className="row between">
                <div>
                  <div className="s">עמלה</div>
                  <div className="r" style={{ fontWeight: 700, fontSize: 18 }}>{money(d.commission)}</div>
                </div>
                <Avatar name={d.agent_name} tone="c-navy" />
              </div>
              <StageButtons id={d.id} stage={d.stage} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
