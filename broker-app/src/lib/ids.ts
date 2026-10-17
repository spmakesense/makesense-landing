import crypto from "node:crypto";

export const newId = () => crypto.randomUUID();
export const newToken = (bytes = 18) => crypto.randomBytes(bytes).toString("base64url");
export const sha256 = (data: string | Uint8Array) => crypto.createHash("sha256").update(data).digest("hex");
export const now = () => Date.now();
