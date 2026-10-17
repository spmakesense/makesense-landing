import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser, requestMeta } from "@/lib/auth";
import { authUrl, DRIVE_STATE_COOKIE, driveConfigured } from "@/lib/gdrive";
import { newToken } from "@/lib/ids";

export async function GET() {
  const user = await currentUser();
  const { origin } = await requestMeta();
  if (!user) return NextResponse.redirect(`${origin}/login`);
  if (!driveConfigured()) return NextResponse.redirect(`${origin}/settings?drive=not_configured`);
  const state = newToken();
  (await cookies()).set(DRIVE_STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  return NextResponse.redirect(authUrl(origin, state));
}
