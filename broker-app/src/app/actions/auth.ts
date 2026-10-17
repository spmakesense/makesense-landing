"use server";

import { redirect } from "next/navigation";
import { checkOtp, currentUser, endSession, issueOtp, otpThrottled, startSession } from "@/lib/auth";
import { get, run, tx } from "@/lib/db";
import { normalizePhone } from "@/lib/format";
import { newId, now } from "@/lib/ids";
import { DEMO_MODE, sendSms } from "@/lib/sms";
import type { User } from "@/lib/types";

export async function requestLoginCode(raw: string): Promise<{ error?: string; phone?: string; demoCode?: string }> {
  const phone = normalizePhone(raw);
  if (!phone) return { error: "מספר טלפון לא תקין" };
  if (otpThrottled(`login:${phone}`)) return { error: "קוד נשלח לפני רגע. נסו שוב בעוד חצי דקה." };
  const code = issueOtp(`login:${phone}`);
  await sendSms(phone, `קוד הכניסה שלך לחותמים: ${code}`);
  return { phone, demoCode: DEMO_MODE ? code : undefined };
}

export async function verifyLoginCode(phone: string, code: string): Promise<{ error?: string }> {
  const res = checkOtp(`login:${phone}`, code);
  if (res === "expired") return { error: "הקוד פג תוקף. שלחו קוד חדש." };
  if (res === "locked") return { error: "יותר מדי ניסיונות. שלחו קוד חדש." };
  if (res === "wrong") return { error: "קוד שגוי" };
  let user = get<User>("SELECT * FROM users WHERE phone = ?", phone);
  if (!user) {
    const id = newId();
    run("INSERT INTO users (id, phone, role, created_at) VALUES (?, ?, 'manager', ?)", id, phone, now());
    user = get<User>("SELECT * FROM users WHERE id = ?", id)!;
  }
  await startSession(user.id);
  redirect(user.office_id && user.name && user.license ? "/" : "/onboarding");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

export async function saveOnboarding(input: {
  name: string;
  license: string;
  email: string;
  officeName: string;
  companyId: string;
  officeAddress: string;
  signature: string;
}): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!input.name.trim()) return { error: "נא למלא שם מלא" };
  if (!/^\d{3,10}$/.test(input.license.trim())) return { error: "מספר רישיון תיווך לא תקין" };
  if (!user.office_id && !input.officeName.trim()) return { error: "נא למלא את שם המשרד" };
  if (!input.signature.startsWith("data:image/png")) return { error: "נא לחתום בתיבת החתימה" };
  tx(() => {
    let officeId = user.office_id;
    if (!officeId) {
      officeId = newId();
      run(
        "INSERT INTO offices (id, name, company_id, address, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        officeId,
        input.officeName.trim(),
        input.companyId.trim() || null,
        input.officeAddress.trim() || null,
        user.phone,
        now(),
      );
    }
    run(
      "UPDATE users SET name = ?, license = ?, email = ?, signature = ?, office_id = ? WHERE id = ?",
      input.name.trim(),
      input.license.trim(),
      input.email.trim() || null,
      input.signature,
      officeId,
      user.id,
    );
  });
  redirect("/");
}
