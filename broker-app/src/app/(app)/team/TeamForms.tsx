"use client";

import { useActionState, useTransition } from "react";
import { inviteAgent, setRole } from "@/app/actions/crm";

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteAgent, undefined);
  return (
    <form action={action} className="card" style={{ marginTop: 12 }}>
      <div className="t" style={{ marginBottom: 8 }}>הוספת סוכן למשרד</div>
      {state?.error ? <div className="err">{state.error}</div> : state ? <div className="okmsg">נוסף. הסוכן נכנס עם מספר הטלפון שלו.</div> : null}
      <div className="grid2">
        <input className="inp" name="name" placeholder="שם" />
        <input className="inp ltr" name="phone" placeholder="טלפון" inputMode="tel" required />
      </div>
      <button className="btn bp sm" style={{ marginTop: 8 }} disabled={pending}>
        הוספה
      </button>
    </form>
  );
}

export function RoleButton({ userId, role }: { userId: string; role: string }) {
  const [pending, start] = useTransition();
  return (
    <button className="link" style={{ fontSize: 11 }} disabled={pending} onClick={() => start(() => setRole(userId, role === "manager" ? "agent" : "manager"))}>
      {role === "manager" ? "הפוך לסוכן" : "הפוך למנהל"}
    </button>
  );
}
