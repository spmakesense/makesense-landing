import "server-only";
import crypto from "node:crypto";
import { get, run } from "./db";
import { appSecret } from "./ids";
import type { User } from "./types";

// Google Drive for saving signed agreements. Each agent connects their own Drive (OAuth, scope drive.file:
// the app sees only files it created). Endpoints are overridable for tests.
const AUTH_URL = process.env.GOOGLE_AUTH_URL || "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token";
const API = process.env.GOOGLE_API_URL || "https://www.googleapis.com";
const SCOPES = "openid email https://www.googleapis.com/auth/drive.file";
export const ROOT_FOLDER = "חותמים – הסכמים חתומים";

export const driveConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// The refresh token is stored encrypted with a key derived from the app secret.
const key = () => crypto.createHash("sha256").update(`drive:${appSecret()}`).digest();

function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}

function decrypt(blob: string): string {
  const [iv, tag, data] = blob.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString("utf8");
}

export function authUrl(origin: string, state: string): string {
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/google/callback`,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `${AUTH_URL}?${q}`;
}

async function tokenRequest(params: Record<string, string>) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, ...params }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}: ${await res.text()}`);
  return (await res.json()) as { access_token: string; refresh_token?: string };
}

/** Completes the OAuth flow: stores the refresh token and creates the root folder in the agent's Drive. */
export async function connectDrive(userId: string, code: string, origin: string) {
  const t = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: `${origin}/api/google/callback` });
  if (!t.refresh_token) throw new Error("Google did not return a refresh token");
  const info = await gfetch<{ email: string }>(t.access_token, `${API}/oauth2/v2/userinfo`);
  const folder = await ensureFolder(t.access_token, ROOT_FOLDER, null);
  await run(
    "UPDATE users SET google_email = ?, google_refresh = ?, drive_folder_id = ?, drive_auto = 1 WHERE id = ?",
    info.email,
    encrypt(t.refresh_token),
    folder,
    userId,
  );
}

export async function disconnectDrive(user: User) {
  if (user.google_refresh) {
    // Best effort: revoke the grant at Google too.
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(decrypt(user.google_refresh))}`, { method: "POST" }).catch(() => {});
  }
  await run("UPDATE users SET google_email = NULL, google_refresh = NULL, drive_folder_id = NULL WHERE id = ?", user.id);
}

async function accessToken(user: User): Promise<string> {
  if (!user.google_refresh) throw new Error("Drive not connected");
  return (await tokenRequest({ refresh_token: decrypt(user.google_refresh), grant_type: "refresh_token" })).access_token;
}

async function gfetch<T>(token: string, url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`google ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

const FOLDER = "application/vnd.google-apps.folder";
const q = (s: string) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function ensureFolder(token: string, name: string, parent: string | null): Promise<string> {
  const query = `name = '${q(name)}' and mimeType = '${FOLDER}' and trashed = false${parent ? ` and '${parent}' in parents` : ""}`;
  const found = await gfetch<{ files: { id: string }[] }>(token, `${API}/drive/v3/files?${new URLSearchParams({ q: query, fields: "files(id)", spaces: "drive" })}`);
  if (found.files[0]) return found.files[0].id;
  const created = await gfetch<{ id: string }>(token, `${API}/drive/v3/files?fields=id`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER, ...(parent ? { parents: [parent] } : {}) }),
  });
  return created.id;
}

/**
 * Uploads a signed PDF to the agent's Drive: "חותמים – הסכמים חתומים / <property address> / <file>".
 * Returns the Drive link. Saves the file id on the document so it is uploaded only once.
 */
export async function savePdfToDrive(user: User, doc: { id: string; drive_link: string | null }, fileName: string, folderName: string, bytes: Uint8Array): Promise<string> {
  if (doc.drive_link) return doc.drive_link;
  const token = await accessToken(user);
  let root = user.drive_folder_id;
  // The root folder may have been deleted by the user – recreate it.
  if (!root || !(await folderExists(token, root))) {
    root = await ensureFolder(token, ROOT_FOLDER, null);
    await run("UPDATE users SET drive_folder_id = ? WHERE id = ?", root, user.id);
  }
  const folder = await ensureFolder(token, folderName, root);
  const boundary = `chotmim${crypto.randomBytes(8).toString("hex")}`;
  const meta = JSON.stringify({ name: fileName, parents: [folder], mimeType: "application/pdf" });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\ncontent-type: application/pdf\r\n\r\n`),
    Buffer.from(bytes),
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const file = await gfetch<{ id: string; webViewLink: string }>(token, `${API}/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink`, {
    method: "POST",
    headers: { "content-type": `multipart/related; boundary=${boundary}` },
    body,
  });
  await run("UPDATE documents SET drive_file_id = ?, drive_link = ? WHERE id = ?", file.id, file.webViewLink, doc.id);
  return file.webViewLink;
}

async function folderExists(token: string, id: string): Promise<boolean> {
  try {
    const f = await gfetch<{ trashed: boolean }>(token, `${API}/drive/v3/files/${id}?fields=trashed`);
    return !f.trashed;
  } catch {
    return false;
  }
}

/** Agent who owns the document, when their Drive is connected. */
export async function driveUserFor(agentId: string): Promise<User | null> {
  const u = await get<User>("SELECT * FROM users WHERE id = ?", agentId);
  return u?.google_refresh ? u : null;
}

export const DRIVE_STATE_COOKIE = "g_state";
