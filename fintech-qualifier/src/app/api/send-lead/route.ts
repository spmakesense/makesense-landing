import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { ConversationResult } from "@/types";
import { CATEGORY_LABELS, END_TYPE_LABELS } from "@/types";
import { buildEmailHtml, buildEmailText } from "@/lib/email-template";

export async function POST(req: NextRequest) {
  try {
    const result: ConversationResult = await req.json();

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      LEAD_EMAIL_TO,
    } = process.env;

    const toEmail = LEAD_EMAIL_TO ?? "sp.makesense@gmail.com";

    // Graceful degradation: if no SMTP config, log and return success
    if (!SMTP_USER || !SMTP_PASS) {
      console.log("=== LEAD CAPTURED (no SMTP configured) ===");
      console.log(JSON.stringify(result, null, 2));
      return NextResponse.json({ ok: true, method: "console" });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST ?? "smtp.gmail.com",
      port: Number(SMTP_PORT ?? 587),
      secure: SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `🔥 ליד חדש — ${CATEGORY_LABELS[result.primaryCategory]} | ${result.session.clientName} | ציון ${result.leadScore}/100`;

    await transporter.sendMail({
      from: `"Make Sense Qualifier" <${SMTP_USER}>`,
      to: toEmail,
      subject,
      text: buildEmailText(result),
      html: buildEmailHtml(result),
    });

    return NextResponse.json({ ok: true, method: "email", to: toEmail });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
