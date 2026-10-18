import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { get, run } from "./db";
import { appSecret, newToken, now, sha256 } from "./ids";
import type { Office, User } from "./types";

const SESSION_COOKIE = "sid";
const SESSION_DAYS = 60;
const OTP_TTL_MS = 10 * 60_000;
const OTP_MAX_ATTEMPTS = 5;

const hashCode = (key: string, code: string) => sha256(`${appSecret()}:${key}:${code}`);

const OTP_RESEND_MS = 30_000;

/** True when a code for `key` was sent less than 30 seconds ago (limits SMS spam). */
export async function otpThrottled(key: string): Promise<boolean> {
  const row = await get<{ expires_at: number }>("SELECT expires_at FROM otps WHERE key = ?", key);
  return Boolean(row && row.expires_at - OTP_TTL_MS > now() - OTP_RESEND_MS);
}

/** Creates a 6-digit one-time code for `key` and returns it (the caller decides how to deliver it). */
export async function issueOtp(key: string): Promise<string> {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  await run(
    "INSERT INTO otps (key, code_hash, expires_at, attempts) VALUES (?, ?, ?, 0) ON CONFLICT(key) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0",
    key,
    hashCode(key, code),
    now() + OTP_TTL_MS,
  );
  return code;
}

export async function checkOtp(key: string, code: string): Promise<"ok" | "expired" | "wrong" | "locked"> {
  const row = await get<{ code_hash: string; expires_at: number; attempts: number }>("SELECT * FROM otps WHERE key = ?", key);
  if (!row || row.expires_at < now()) return "expired";
  if (row.attempts >= OTP_MAX_ATTEMPTS) return "locked";
  const a = Buffer.from(row.code_hash);
  const b = Buffer.from(hashCode(key, code.trim()));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    await run("UPDATE otps SET attempts = attempts + 1 WHERE key = ?", key);
    return "wrong";
  }
  await run("DELETE FROM otps WHERE key = ?", key);
  return "ok";
}

export async function startSession(userId: string) {
  const id = newToken(32);
  await run("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", sha256(id), userId, now() + SESSION_DAYS * 86_400_000);
  (await cookies()).set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await run("DELETE FROM sessions WHERE id = ?", sha256(id));
  jar.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const user = await get<User>(
    "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > ?",
    sha256(id),
    now(),
  );
  return user ?? null;
}

export interface Ctx {
  user: User & { office_id: string };
  office: Office;
}

/** Returns the signed-in, onboarded user and their office, redirecting otherwise. */
export async function requireCtx(): Promise<Ctx> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!user.office_id || !user.name || !user.license) redirect("/onboarding");
  const office = (await get<Office>("SELECT * FROM offices WHERE id = ?", user.office_id))!;
  return { user: user as Ctx["user"], office };
}

export async function requestMeta() {
  const h = await headers();
  return {
    ip: (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown",
    userAgent: h.get("user-agent") || "unknown",
    origin: process.env.APP_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`,
  };
}
