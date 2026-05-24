"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeadScoreRing from "@/components/LeadScoreRing";
import CategoryBadge from "@/components/CategoryBadge";
import type { ConversationResult, LeadCategory } from "@/types";
import { CATEGORY_LABELS, CATEGORY_COLORS, END_TYPE_LABELS } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CategoryBar({ category, score }: { category: string; score: number }) {
  const label = CATEGORY_LABELS[category as LeadCategory] ?? category;
  const color = CATEGORY_COLORS[category as LeadCategory] ?? "#6b7280";
  const pct = Math.min(100, score);
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function SummaryPage() {
  const router = useRouter();
  const [result, setResult] = useState<ConversationResult | null>(null);
  const [emailStatus, setEmailStatus] = useState<"sent" | "error" | "pending">("pending");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ms_result");
    if (!stored) {
      router.replace("/");
      return;
    }
    const r: ConversationResult = JSON.parse(stored);
    setResult(r);

    // Re-send email (in case the call page failed)
    setEmailStatus("pending");
    fetch("/api/send-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    })
      .then((res) => res.json())
      .then((data) => setEmailStatus(data.ok ? "sent" : "error"))
      .catch(() => setEmailStatus("error"));
  }, [router]);

  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!result) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm animate-pulse-gentle">טוען סיכום...</div>
      </div>
    );
  }

  const { session, scores, primaryCategory, leadScore, endType, history } = result;

  const endLabel = END_TYPE_LABELS[endType];
  const endBg =
    endType === "hot"
      ? "#fff8e1"
      : endType === "warm"
      ? "#f0f9ff"
      : "#f9fafb";
  const endBorder =
    endType === "hot"
      ? "#FF9D00"
      : endType === "warm"
      ? "#3BBDD4"
      : "#e5e7eb";

  const categoryEntries = (
    Object.entries(scores) as [string, number][]
  )
    .filter(([k]) => k !== "global" && k !== "uncategorized")
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">

      {/* Header */}
      <div
        className="safe-top px-4 py-4"
        style={{ background: "linear-gradient(135deg, #0d21a1, #1a33c8)" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-base"
          >
            ←
          </button>
          <h1 className="text-white font-black text-lg">סיכום שיחה</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">

        {/* Hero score card */}
        <div
          className="mx-4 mt-4 rounded-3xl p-5 border-2 animate-fade-in"
          style={{ background: endBg, borderColor: endBorder }}
        >
          <div className="flex items-center gap-4">
            <LeadScoreRing score={leadScore} size={100} />
            <div className="flex-1">
              <div className="text-2xl font-black text-gray-900 leading-tight">
                {session.clientName}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{session.clientPhone}</div>
              <div className="mt-2">
                <CategoryBadge category={primaryCategory} size="md" />
              </div>
              <div
                className="mt-2 text-sm font-bold"
                style={{
                  color:
                    endType === "hot"
                      ? "#b45309"
                      : endType === "warm"
                      ? "#0369a1"
                      : "#6b7280",
                }}
              >
                {endLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Email status */}
        <div className="mx-4 mt-3">
          {emailStatus === "sent" && (
            <div className="rounded-2xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>הליד נשלח למייל sp.makesense@gmail.com</span>
            </div>
          )}
          {emailStatus === "error" && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>לא נשלח מייל — בדוק הגדרות SMTP</span>
            </div>
          )}
          {emailStatus === "pending" && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500 font-medium flex items-center gap-2">
              <span className="animate-pulse-gentle">📤</span>
              <span>שולח מייל...</span>
            </div>
          )}
        </div>

        {/* Session details */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-base font-bold text-gray-800">פרטי שיחה</h2>
          </div>
          <div className="px-4 py-3 space-y-2">
            {[
              { label: "סוכן", value: session.agentName },
              { label: "התחלה", value: formatDate(session.startTime) },
              { label: "סיום", value: formatDate(result.endTime) },
              { label: "שאלות שהוצגו", value: `${history.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-base font-bold text-gray-800">ניתוח קטגוריות</h2>
          </div>
          <div className="px-4 pt-3 pb-4">
            {categoryEntries.map(([cat, score]) => (
              <CategoryBar key={cat} category={cat} score={score} />
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">מעורבות כללית</span>
                <span className="text-sm font-bold text-gray-800">{scores.global}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation history */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-base font-bold text-gray-800">מהלך השיחה</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {history.map((h, i) => (
              <div key={i} className="px-4 py-3">
                <div className="text-xs text-gray-400 mb-1 leading-snug">
                  {h.questionScript.substring(0, 90)}{h.questionScript.length > 90 ? "…" : ""}
                </div>
                <div className="text-sm font-bold" style={{ color: "#0d21a1" }}>
                  ▸ {h.answerText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary text */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">סיכום טקסט</h2>
            <button
              onClick={handleCopySummary}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: copied ? "#f0fdf4" : "#f3f4f6",
                color: copied ? "#16a34a" : "#6b7280",
              }}
            >
              {copied ? "✓ הועתק!" : "העתק"}
            </button>
          </div>
          <div className="px-4 py-4">
            <pre
              className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-right"
              style={{ fontFamily: "inherit" }}
            >
              {result.summary}
            </pre>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 safe-bottom bg-white border-t border-gray-100">
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-2xl text-white text-base font-black mt-3 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #0d21a1, #1a33c8)",
            boxShadow: "0 6px 20px rgba(13,33,161,0.35)",
          }}
        >
          🆕 שיחה חדשה
        </button>
      </div>
    </div>
  );
}
