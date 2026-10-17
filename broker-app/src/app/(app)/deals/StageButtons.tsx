"use client";

import { useTransition } from "react";
import { deleteDeal, setDealStage } from "@/app/actions/crm";
import { DEAL_STAGES } from "@/lib/types";

export function StageButtons({ id, stage }: { id: string; stage: string }) {
  const [pending, start] = useTransition();
  const i = DEAL_STAGES.findIndex((s) => s.key === stage);
  const next = DEAL_STAGES[i + 1];
  const prev = DEAL_STAGES[i - 1];
  return (
    <div className="row" style={{ marginTop: 10, gap: 8 }}>
      {next ? (
        <button className={`btn sm ${next.key === "paid" ? "bn" : "bp"}`} disabled={pending} onClick={() => start(() => setDealStage(id, next.key))}>
          {next.key === "paid" ? "סימון כשולם" : `העברה ל${next.label}`}
        </button>
      ) : null}
      {prev ? (
        <button className="btn bo xs" disabled={pending} onClick={() => start(() => setDealStage(id, prev.key))}>
          חזרה
        </button>
      ) : null}
      <button className="btn bd xs" disabled={pending} onClick={() => confirm("למחוק את העסקה?") && start(() => deleteDeal(id))}>
        מחיקה
      </button>
    </div>
  );
}
