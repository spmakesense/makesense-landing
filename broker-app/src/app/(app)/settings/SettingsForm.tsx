"use client";

import { useActionState, useState } from "react";
import { saveSettings } from "@/app/actions/crm";
import { SignaturePad } from "@/components/SignaturePad";

export function SettingsForm(p: {
  isManager: boolean;
  user: { name: string; license: string; email: string; phone: string; signature: string | null };
  office: { name: string; company_id: string; address: string; fee: number; vat: boolean; auto: boolean };
}) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [redraw, setRedraw] = useState(false);
  const [sig, setSig] = useState("");
  return (
    <form action={action}>
      {state?.error ? <div className="err">{state.error}</div> : state ? <div className="okmsg">נשמר</div> : null}
      <div className="lbl">הפרופיל שלי</div>
      <div className="card">
        <label className="f">
          <span>שם מלא</span>
          <input className="inp" name="name" defaultValue={p.user.name} />
        </label>
        <label className="f">
          <span>מספר רישיון תיווך</span>
          <input className="inp ltr" name="license" defaultValue={p.user.license} inputMode="numeric" />
        </label>
        <label className="f">
          <span>דוא״ל</span>
          <input className="inp ltr" name="email" type="email" defaultValue={p.user.email} />
        </label>
        <div className="s">טלפון לכניסה: {p.user.phone}</div>
      </div>

      <div className="lbl" style={{ marginTop: 14 }}>חתימת המתווך</div>
      <div className="card">
        {redraw || !p.user.signature ? (
          <SignaturePad onChange={setSig} />
        ) : (
          <div className="row between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.user.signature} alt="החתימה שלך" style={{ height: 60 }} />
            <button type="button" className="link" onClick={() => setRedraw(true)}>
              חתימה מחדש
            </button>
          </div>
        )}
        <input type="hidden" name="signature" value={sig} />
      </div>

      {p.isManager ? (
        <>
          <div className="lbl" style={{ marginTop: 14 }}>המשרד</div>
          <div className="card">
            <label className="f">
              <span>שם המשרד</span>
              <input className="inp" name="office_name" defaultValue={p.office.name} />
            </label>
            <label className="f">
              <span>ח.פ. / ע.מ.</span>
              <input className="inp ltr" name="company_id" defaultValue={p.office.company_id} />
            </label>
            <label className="f">
              <span>כתובת</span>
              <input className="inp" name="office_address" defaultValue={p.office.address} />
            </label>
            <label className="f">
              <span>דמי תיווך ברירת מחדל (%)</span>
              <input className="inp ltr" name="default_fee_pct" inputMode="decimal" defaultValue={p.office.fee} />
            </label>
            <label className="chk">
              <input type="checkbox" name="fee_includes_vat" defaultChecked={p.office.vat} />
              <span>דמי התיווך כוללים מע״מ (ברירת מחדל)</span>
            </label>
            <label className="chk">
              <input type="checkbox" name="auto_send_copy" defaultChecked={p.office.auto} />
              <span>שליחת העתק חתום אוטומטית לכל החותמים ב-SMS כשהמסמך הושלם</span>
            </label>
          </div>
        </>
      ) : null}
      <button className="btn bp" style={{ marginTop: 14 }} disabled={pending}>
        {pending ? "שומר…" : "שמירה"}
      </button>
    </form>
  );
}
