import type { ConversationResult } from "@/types";
import { CATEGORY_LABELS, CATEGORY_COLORS, END_TYPE_LABELS } from "@/types";

function scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty) + ` ${score}/100`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildEmailHtml(result: ConversationResult): string {
  const { session, history, scores, primaryCategory, leadScore, endType } = result;
  const catColor = CATEGORY_COLORS[primaryCategory];
  const catLabel = CATEGORY_LABELS[primaryCategory];
  const endLabel = END_TYPE_LABELS[endType];

  const hotBorder = endType === "hot" ? "#FF9D00" : endType === "warm" ? "#3BBDD4" : "#9ca3af";
  const scoreColor =
    leadScore >= 70 ? "#16a34a" : leadScore >= 45 ? "#FF9D00" : "#dc2626";

  const historyRows = history
    .map(
      (h, i) => `
      <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
        <td style="padding:10px 14px;font-size:14px;color:#374151;border-bottom:1px solid #e5e7eb;direction:rtl;">${h.questionScript.substring(0, 80)}${h.questionScript.length > 80 ? "…" : ""}</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;color:#0d21a1;border-bottom:1px solid #e5e7eb;direction:rtl;">${h.answerText}</td>
      </tr>`
    )
    .join("");

  const categoryBars = (
    Object.entries(scores) as [string, number][]
  )
    .filter(([k]) => k !== "global" && k !== "uncategorized")
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => {
      const label = CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS] ?? k;
      const color = CATEGORY_COLORS[k as keyof typeof CATEGORY_COLORS] ?? "#6b7280";
      const pct = Math.min(100, v);
      return `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:13px;color:#374151;font-weight:600;">${label}</span>
            <span style="font-size:13px;color:${color};font-weight:700;">${v}</span>
          </div>
          <div style="background:#e5e7eb;border-radius:4px;height:8px;overflow:hidden;">
            <div style="width:${pct}%;background:${color};height:100%;border-radius:4px;"></div>
          </div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>ליד חדש — Make Sense</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;direction:rtl;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,33,161,0.12);border:3px solid ${hotBorder};">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d21a1,#1a33c8);padding:28px 32px;text-align:center;">
      <div style="font-size:13px;color:#a5b4fc;font-weight:600;letter-spacing:2px;margin-bottom:4px;">MAKE SENSE</div>
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">ליד חדש התקבל!</h1>
      <div style="margin-top:8px;display:inline-block;background:${catColor};color:#fff;padding:5px 16px;border-radius:20px;font-size:14px;font-weight:700;">${catLabel}</div>
    </div>

    <!-- Score + Status -->
    <div style="padding:24px 32px;background:#f8f9ff;border-bottom:1px solid #e5e7eb;display:flex;gap:20px;align-items:center;">
      <div style="text-align:center;flex:1;">
        <div style="font-size:48px;font-weight:900;color:${scoreColor};line-height:1;">${leadScore}</div>
        <div style="font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">ציון ליד</div>
      </div>
      <div style="flex:2;">
        <div style="background:#e5e7eb;border-radius:8px;height:16px;overflow:hidden;margin-bottom:8px;">
          <div style="width:${leadScore}%;background:linear-gradient(90deg,${scoreColor},${scoreColor}aa);height:100%;border-radius:8px;transition:width 0.5s;"></div>
        </div>
        <div style="font-size:16px;font-weight:700;color:#0d21a1;">${endLabel}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">${formatDate(result.endTime)}</div>
      </div>
    </div>

    <!-- Contact Info -->
    <div style="padding:24px 32px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0d21a1;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">פרטי הלקוח</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;width:120px;">שם לקוח:</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;color:#111827;">${session.clientName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">טלפון:</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;color:#0d21a1;">${session.clientPhone}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">סוכן:</td>
          <td style="padding:8px 0;font-size:14px;color:#374151;">${session.agentName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#6b7280;">זמן שיחה:</td>
          <td style="padding:8px 0;font-size:14px;color:#374151;">${formatDate(session.startTime)} – ${formatDate(result.endTime)}</td>
        </tr>
      </table>
    </div>

    <!-- Category Scores -->
    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0d21a1;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">ניתוח קטגוריות</h2>
      ${categoryBars}
    </div>

    <!-- Conversation History -->
    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0d21a1;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">מהלך השיחה</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right;font-weight:600;">שאלה</th>
            <th style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right;font-weight:600;">תשובה</th>
          </tr>
        </thead>
        <tbody>${historyRows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f8f9ff;border-top:1px solid #e5e7eb;text-align:center;">
      <div style="font-size:13px;color:#9ca3af;">Make Sense Lead Qualifier • נוצר אוטומטית</div>
      <div style="font-size:12px;color:#d1d5db;margin-top:4px;">sp.makesense@gmail.com</div>
    </div>
  </div>
</body>
</html>`;
}

export function buildEmailText(result: ConversationResult): string {
  const { session, primaryCategory, leadScore, endType } = result;
  return `
MAKE SENSE — ליד חדש
====================
לקוח: ${session.clientName}
טלפון: ${session.clientPhone}
סוכן: ${session.agentName}
קטגוריה: ${CATEGORY_LABELS[primaryCategory]}
ציון: ${leadScore}/100
תוצאה: ${END_TYPE_LABELS[endType]}
זמן: ${formatDate(result.endTime)}

${result.summary}
`.trim();
}
