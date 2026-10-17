"use client";

import { useState, useTransition } from "react";
import { saveOnboarding } from "@/app/actions/auth";
import { SignaturePad } from "@/components/SignaturePad";

export function OnboardingForm(props: { name: string; license: string; email: string; officeName?: string }) {
  const [f, setF] = useState({ name: props.name, license: props.license, email: props.email, officeName: "", companyId: "", officeAddress: "" });
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = () =>
    start(async () => {
      const r = await saveOnboarding({ ...f, signature });
      if (r?.error) setError(r.error);
    });

  return (
    <form onSubmit={(e) => (e.preventDefault(), submit())}>
      {error ? <div className="err">{error}</div> : null}
      <div className="card stack">
        <label className="f">
          <span>שם מלא</span>
          <input className="inp" value={f.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="f">
          <span>מספר רישיון תיווך</span>
          <input className="inp ltr" inputMode="numeric" value={f.license} onChange={set("license")} />
        </label>
        <label className="f">
          <span>דוא״ל (לא חובה)</span>
          <input className="inp ltr" type="email" value={f.email} onChange={set("email")} />
        </label>
      </div>
      {props.officeName ? (
        <p className="s" style={{ margin: "14px 4px" }}>
          הצטרפת למשרד <b>{props.officeName}</b>
        </p>
      ) : (
        <div className="card stack" style={{ marginTop: 12 }}>
          <label className="f">
            <span>שם המשרד / העסק</span>
            <input className="inp" value={f.officeName} onChange={set("officeName")} />
          </label>
          <label className="f">
            <span>ח.פ. / ע.מ. (לא חובה)</span>
            <input className="inp ltr" inputMode="numeric" value={f.companyId} onChange={set("companyId")} />
          </label>
          <label className="f">
            <span>כתובת המשרד (לא חובה)</span>
            <input className="inp" value={f.officeAddress} onChange={set("officeAddress")} />
          </label>
        </div>
      )}
      <div className="card" style={{ marginTop: 12 }}>
        <SignaturePad onChange={setSignature} label="החתימה שלך (תתווסף למסמכים כחתימת המתווך)" />
      </div>
      <button className="btn bp" style={{ marginTop: 16 }} disabled={pending}>
        {pending ? "שומר…" : "סיום והתחלה"}
      </button>
    </form>
  );
}
