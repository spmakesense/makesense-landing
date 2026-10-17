"use client";

import { useActionState } from "react";
import { saveProperty } from "@/app/actions/crm";
import type { Property } from "@/lib/types";

const KINDS = ["דירה", "דירת גן", "פנטהאוז", "דופלקס", "בית פרטי", "יחידת דיור", "מגרש", "מסחרי", "משרד"];

export function PropertyForm({ p, owners, back }: { p?: Property; owners: { id: string; name: string }[]; back?: string }) {
  const [state, action, pending] = useActionState(saveProperty, undefined);
  return (
    <form action={action}>
      {state?.error ? <div className="err">{state.error}</div> : null}
      <input type="hidden" name="id" value={p?.id ?? ""} />
      <input type="hidden" name="back" value={back ?? ""} />
      <div className="card">
        <label className="f">
          <span>רחוב ומספר</span>
          <input className="inp" name="address" defaultValue={p?.address} required />
        </label>
        <div className="grid2">
          <label className="f">
            <span>עיר</span>
            <input className="inp" name="city" defaultValue={p?.city ?? ""} />
          </label>
          <label className="f">
            <span>עסקה</span>
            <select className="inp" name="deal_type" defaultValue={p?.deal_type ?? "sale"}>
              <option value="sale">מכירה</option>
              <option value="rent">השכרה</option>
            </select>
          </label>
        </div>
        <label className="f">
          <span>מחיר מבוקש (₪)</span>
          <input className="inp ltr" name="price" inputMode="numeric" defaultValue={p?.price ?? ""} />
        </label>
        <div className="grid2">
          <label className="f">
            <span>סוג נכס</span>
            <select className="inp" name="kind" defaultValue={p?.kind ?? "דירה"}>
              {KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="f">
            <span>חדרים</span>
            <input className="inp ltr" name="rooms" inputMode="decimal" defaultValue={p?.rooms ?? ""} />
          </label>
          <label className="f">
            <span>מ״ר</span>
            <input className="inp ltr" name="sqm" inputMode="numeric" defaultValue={p?.sqm ?? ""} />
          </label>
          <label className="f">
            <span>קומה</span>
            <input className="inp ltr" name="floor" defaultValue={p?.floor ?? ""} placeholder="3/8" />
          </label>
        </div>
        <label className="f">
          <span>גוש / חלקה / תת-חלקה</span>
          <input className="inp ltr" name="parcel" defaultValue={p?.parcel ?? ""} placeholder="6123/45/12" />
        </label>
        <label className="f">
          <span>בעל הנכס</span>
          <select className="inp" name="owner_client_id" defaultValue={p?.owner_client_id ?? ""}>
            <option value="">— לא נבחר —</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        {p ? (
          <label className="f">
            <span>סטטוס</span>
            <select className="inp" name="status" defaultValue={p.status}>
              <option value="active">פעיל</option>
              <option value="sold">נמכר</option>
              <option value="rented">הושכר</option>
              <option value="off">ירד מהשיווק</option>
            </select>
          </label>
        ) : null}
      </div>
      <button className="btn bp" style={{ marginTop: 14 }} disabled={pending}>
        {pending ? "שומר…" : "שמירה"}
      </button>
    </form>
  );
}
