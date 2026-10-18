import crypto from "node:crypto";

export const newId = () => crypto.randomUUID();
export const newToken = (bytes = 18) => crypto.randomBytes(bytes).toString("base64url");
export const sha256 = (data: string | Uint8Array) => crypto.createHash("sha256").update(data).digest("hex");
export const now = () => Date.now();

/**
 * Server secret for hashing codes and encrypting tokens. APP_SECRET when set; otherwise derived from the
 * database connection string, which is itself secret – so a Vercel + Postgres deploy needs no extra setting.
 */
export function appSecret(): string {
  const base = process.env.APP_SECRET || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (base) return sha256(`chotmim:${base}`);
  if (process.env.NODE_ENV === "production") console.warn("APP_SECRET is not set – set a long random value in production.");
  return "dev-secret-change-me";
}
