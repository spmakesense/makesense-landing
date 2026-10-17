"use client";

import { useState, useTransition } from "react";
import { verifyPdf } from "./actions";

export function VerifyForm() {
  const [res, setRes] = useState<{ ok: boolean; message: string }>();
  const [pending, start] = useTransition();
  return (
    <form className="card" action={(fd) => start(async () => setRes(await verifyPdf(fd)))}>
      <input className="inp" type="file" name="file" accept="application/pdf" style={{ paddingTop: 12 }} required />
      <button className="btn bp" style={{ marginTop: 12 }} disabled={pending}>
        {pending ? "בודק…" : "בדיקה"}
      </button>
      {res ? <div className={res.ok ? "okmsg" : "err"} style={{ marginTop: 12, marginBottom: 0 }}>{res.message}</div> : null}
    </form>
  );
}
