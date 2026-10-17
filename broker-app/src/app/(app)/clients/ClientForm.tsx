"use client";

import { useActionState } from "react";
import { saveClient } from "@/app/actions/crm";
import type { Client } from "@/lib/types";

export function ClientForm({ c, back }: { c?: Client; back?: string }) {
  const [state, action, pending] = useActionState(saveClient, undefined);
  return (
    <form action={action}>
      {state?.error ? <div className="err">{state.error}</div> : null}
      <input type="hidden" name="id" value={c?.id ?? ""} />
      <input type="hidden" name="back" value={back ?? ""} />
      <div className="card">
        <label className="f">
          <span>שם מלא</span>
          <input className="inp" name="name" defaultValue={c?.name} required />
        </label>
        <label className="f">
          <span>טלפון נייד</span>
          <input className="inp ltr" name="phone" inputMode="tel" defaultValue={c?.phone ?? ""} />
        </label>
        <div className="grid2">
          <label className="f">
            <span>סוג</span>
            <select className="inp" name="kind" defaultValue={c?.kind ?? "buyer"}>
              <option value="buyer">קונה</option>
              <option value="seller">מוכר</option>
              <option value="tenant">שוכר</option>
              <option value="landlord">משכיר</option>
            </select>
          </label>
          <label className="f">
            <span>סטטוס</span>
            <select className="inp" name="temperature" defaultValue={c?.temperature ?? "warm"}>
              <option value="hot">חם</option>
              <option value="warm">פושר</option>
              <option value="cold">קר</option>
            </select>
          </label>
        </div>
        <label className="f">
          <span>מחפש/ת (למשל: 4 חד׳ ברמת גן עד 3 מיליון)</span>
          <input className="inp" name="wants" defaultValue={c?.wants ?? ""} />
        </label>
        <label className="f">
          <span>מקור</span>
          <input className="inp" name="source" defaultValue={c?.source ?? ""} placeholder="יד2, פייסבוק, המלצה…" />
        </label>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <label className="f">
          <span>דוא״ל</span>
          <input className="inp ltr" name="email" type="email" defaultValue={c?.email ?? ""} />
        </label>
        <label className="f">
          <span>ת״ז</span>
          <input className="inp ltr" name="id_number" inputMode="numeric" defaultValue={c?.id_number ?? ""} />
        </label>
        <label className="f">
          <span>כתובת</span>
          <input className="inp" name="address" defaultValue={c?.address ?? ""} />
        </label>
        <label className="f">
          <span>הערות</span>
          <textarea className="inp" name="notes" defaultValue={c?.notes ?? ""} />
        </label>
      </div>
      <button className="btn bp" style={{ marginTop: 14 }} disabled={pending}>
        {pending ? "שומר…" : "שמירה"}
      </button>
    </form>
  );
}
