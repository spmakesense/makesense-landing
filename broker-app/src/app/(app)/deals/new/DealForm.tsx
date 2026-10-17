"use client";

import { useActionState, useState } from "react";
import { saveDeal } from "@/app/actions/crm";
import { DEAL_STAGES } from "@/lib/types";

export function DealForm(p: {
  properties: { id: string; address: string; price: number | null }[];
  clients: { id: string; name: string }[];
  agents: { id: string; name: string | null }[];
  me: string;
  feePct: number;
}) {
  const [state, action, pending] = useActionState(saveDeal, undefined);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  return (
    <form action={action}>
      {state?.error ? <div className="err">{state.error}</div> : null}
      <div className="card">
        <label className="f">
          <span>נכס</span>
          <select
            className="inp"
            name="property_id"
            onChange={(e) => {
              const pr = p.properties.find((x) => x.id === e.target.value);
              if (pr && !title) setTitle(pr.address);
              if (pr?.price && !price) setPrice(String(pr.price));
            }}
          >
            <option value="">—</option>
            {p.properties.map((x) => (
              <option key={x.id} value={x.id}>
                {x.address}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          <span>שם העסקה</span>
          <input className="inp" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="f">
          <span>לקוח</span>
          <select className="inp" name="client_id">
            <option value="">—</option>
            {p.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid2">
          <label className="f">
            <span>מחיר עסקה (₪)</span>
            <input className="inp ltr" name="price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="f">
            <span>עמלה %</span>
            <input className="inp ltr" name="pct" inputMode="decimal" defaultValue={p.feePct} />
          </label>
        </div>
        <label className="f">
          <span>או סכום עמלה קבוע (₪)</span>
          <input className="inp ltr" name="commission" inputMode="numeric" placeholder="ריק = לפי האחוז" />
        </label>
        <div className="grid2">
          <label className="f">
            <span>שלב</span>
            <select className="inp" name="stage" defaultValue="negotiation">
              {DEAL_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="f">
            <span>מועד תשלום</span>
            <input className="inp ltr" name="due_date" type="date" />
          </label>
        </div>
        {p.agents.length > 1 ? (
          <label className="f">
            <span>סוכן</span>
            <select className="inp" name="agent_id" defaultValue={p.me}>
              {p.agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name ?? "סוכן"}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="f">
          <span>הערות</span>
          <textarea className="inp" name="notes" />
        </label>
      </div>
      <button className="btn bp" style={{ marginTop: 14 }} disabled={pending}>
        {pending ? "שומר…" : "שמירה"}
      </button>
    </form>
  );
}
