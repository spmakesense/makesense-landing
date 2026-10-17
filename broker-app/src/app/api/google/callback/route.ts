import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser, requestMeta } from "@/lib/auth";
import { connectDrive, DRIVE_STATE_COOKIE } from "@/lib/gdrive";

export async function GET(req: Request) {
  const user = await currentUser();
  const { origin } = await requestMeta();
  if (!user) return NextResponse.redirect(`${origin}/login`);
  const url = new URL(req.url);
  const jar = await cookies();
  const expected = jar.get(DRIVE_STATE_COOKIE)?.value;
  jar.delete(DRIVE_STATE_COOKIE);
  const code = url.searchParams.get("code");
  if (!code || !expected || url.searchParams.get("state") !== expected) {
    return NextResponse.redirect(`${origin}/settings?drive=${url.searchParams.get("error") === "access_denied" ? "denied" : "failed"}`);
  }
  try {
    await connectDrive(user.id, code, origin);
  } catch (e) {
    console.error("drive connect failed", e);
    return NextResponse.redirect(`${origin}/settings?drive=failed`);
  }
  return NextResponse.redirect(`${origin}/settings?drive=connected`);
}
