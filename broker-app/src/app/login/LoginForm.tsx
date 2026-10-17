"use client";

import { useState, useTransition } from "react";
import { requestLoginCode, verifyLoginCode } from "@/app/actions/auth";

export function LoginForm() {
  const [phone, setPhone] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, start] = useTransition();

  const send = () =>
    start(async () => {
      setError(undefined);
      const r = await requestLoginCode(phone);
      if (r.error) return setError(r.error);
      setSentTo(r.phone!);
      setDemo(r.demoCode);
    });

  const verify = () =>
    start(async () => {
      setError(undefined);
      const r = await verifyLoginCode(sentTo!, code);
      if (r?.error) setError(r.error);
    });

  return (
    <div className="card" style={{ padding: 18 }}>
      {error ? <div className="err">{error}</div> : null}
      {!sentTo ? (
        <form onSubmit={(e) => (e.preventDefault(), send())}>
          <label className="f">
            <span>מספר טלפון נייד</span>
            <input className="inp ltr" inputMode="tel" autoComplete="tel" placeholder="050-000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <button className="btn bp" disabled={pending || phone.length < 9}>
            {pending ? "שולח…" : "שליחת קוד ב-SMS"}
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => (e.preventDefault(), verify())}>
          {demo ? <div className="demo">מצב הדגמה (לא מוגדר ספק SMS): הקוד הוא <b>{demo}</b></div> : null}
          <label className="f">
            <span>הקוד שנשלח ל-{sentTo}</span>
            <input className="inp ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
          </label>
          <button className="btn bp" disabled={pending || code.length !== 6}>
            {pending ? "מאמת…" : "כניסה"}
          </button>
          <button type="button" className="btn bo sm" style={{ marginTop: 8 }} onClick={() => (setSentTo(null), setCode(""))}>
            שינוי מספר
          </button>
        </form>
      )}
    </div>
  );
}
