"use client";

import { useActionState, useState } from "react";
import { clearInterest, setInterest } from "@/app/actions/crm";
import { Icon } from "@/components/Icon";
import { INTEREST_TYPES, interestLabel, type Interest } from "@/lib/templates";

export function InterestForm({ propertyId, interest }: { propertyId: string; interest: Interest | null }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(async (s: { error?: string } | undefined, fd: FormData) => {
    const r = await setInterest(s, fd);
    if (!r?.error) setOpen(false);
    return r;
  }, undefined);

  if (interest && !open) {
    return (
      <div className="card warn">
        <div className="row top" style={{ gap: 8 }}>
          <Icon name="shield" style={{ color: "var(--amber)" }} />
          <div className="grow" style={{ fontSize: 14, color: "#92400e" }}>
            <b>יש לך עניין אישי בנכס – נספח גילוי נאות יצורף אוטומטית</b>
            <div>{interestLabel(interest.type)}</div>
            <div>{interest.relation}</div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn bo xs" onClick={() => setOpen(true)}>
            עריכה
          </button>
          <button className="btn bd xs" onClick={() => clearInterest(propertyId)}>
            הסרה
          </button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button className="card row" style={{ width: "100%", textAlign: "start" }} onClick={() => setOpen(true)}>
        <div className="av c-gray">
          <Icon name="shield" />
        </div>
        <div className="grow">
          <div className="t">יש לי קשר למוכר / לנכס</div>
          <div className="s">קרבה משפחתית, בעלות, קשר עסקי – יצרף נספח גילוי נאות לכל קונה</div>
        </div>
      </button>
    );
  }

  return (
    <form action={action} className="card">
      {state?.error ? <div className="err">{state.error}</div> : null}
      <input type="hidden" name="property_id" value={propertyId} />
      <label className="f">
        <span>סוג העניין האישי</span>
        <select className="inp" name="type" defaultValue={interest?.type ?? "family_seller"}>
          {INTEREST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="f">
        <span>הקשר</span>
        <input className="inp" name="relation" defaultValue={interest?.relation} placeholder="למשל: המוכר, משה פרץ, הוא אחי" required />
      </label>
      <label className="f">
        <span>פירוט נוסף (לא חובה)</span>
        <textarea className="inp" name="details" defaultValue={interest?.details} />
      </label>
      <div className="grid2">
        <button type="button" className="btn bo sm" onClick={() => setOpen(false)}>
          ביטול
        </button>
        <button className="btn bp sm" disabled={pending}>
          שמירה
        </button>
      </div>
    </form>
  );
}
