"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormState {
  clientName: string;
  agentName: string;
  // Section 1
  employment: string[];
  employmentField: string;
  spouseEmployment: string;
  propertyStatus: string;
  hasObligations: string;
  hasGoals: string;
  painPoint: string;
  cashFlow: string;
  hasLazySavings: string;
  futurePlan: string;
  // Section 2 - owner
  hasMortgage: string;
  hasExtraLoans: string;
  extraLoansAmount: string;
  feelInflation: string;
  knowsTerms: string;
  interestedAdvice: string;
  // Section 2 - renter
  planToBuy: string;
  // Per-question notes
  notes: Record<string, string>;
  // Final
  summaryNote: string;
}

const INIT: FormState = {
  clientName: "",
  agentName: "",
  employment: [],
  employmentField: "",
  spouseEmployment: "",
  propertyStatus: "",
  hasObligations: "",
  hasGoals: "",
  painPoint: "",
  cashFlow: "",
  hasLazySavings: "",
  futurePlan: "",
  hasMortgage: "",
  hasExtraLoans: "",
  extraLoansAmount: "",
  feelInflation: "",
  knowsTerms: "",
  interestedAdvice: "",
  planToBuy: "",
  notes: {},
  summaryNote: "",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10"
      style={{ background: "linear-gradient(135deg,#0d21a1,#1a33c8)" }}>
      <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm flex-shrink-0">{num}</span>
      <span className="text-white font-bold text-base">{title}</span>
    </div>
  );
}

function NoteInput({ id, notes, onChange }: {
  id: string;
  notes: Record<string, string>;
  onChange: (id: string, val: string) => void;
}) {
  return (
    <input
      type="text"
      value={notes[id] ?? ""}
      onChange={e => onChange(id, e.target.value)}
      placeholder="הערות..."
      className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-right text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-blue-400 bg-white"
      style={{ fontSize: 13 }}
    />
  );
}

function CheckRow({
  id, question, options, value, onChange, notes, onNote, wide
}: {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  notes: Record<string, string>;
  onNote: (id: string, val: string) => void;
  wide?: boolean;
}) {
  const isMulti = Array.isArray(value);

  const toggle = (v: string) => {
    if (isMulti) {
      const arr = value as string[];
      onChange(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  const isChecked = (v: string) =>
    isMulti ? (value as string[]).includes(v) : value === v;

  return (
    <tr className="border-b border-gray-100 align-top">
      {/* Question */}
      <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug" style={{ minWidth: wide ? 180 : 140 }}>
        {question}
      </td>
      {/* Checkboxes */}
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: isChecked(opt.value) ? "#0d21a1" : "#f3f4f6",
                color: isChecked(opt.value) ? "#fff" : "#374151",
                border: `1.5px solid ${isChecked(opt.value) ? "#0d21a1" : "#e5e7eb"}`,
              }}
            >
              <span className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: isChecked(opt.value) ? "#fff" : "#9ca3af", background: isChecked(opt.value) ? "#fff2" : "transparent" }}>
                {isChecked(opt.value) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </td>
      {/* Notes */}
      <td className="px-3 py-3" style={{ minWidth: 100 }}>
        <NoteInput id={id} notes={notes} onChange={onNote} />
      </td>
    </tr>
  );
}

function TextRow({ id, question, value, onChange, notes, onNote, placeholder }: {
  id: string; question: string; value: string;
  onChange: (v: string) => void;
  notes: Record<string, string>;
  onNote: (id: string, v: string) => void;
  placeholder?: string;
}) {
  return (
    <tr className="border-b border-gray-100 align-top">
      <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug">{question}</td>
      <td className="px-3 py-3" colSpan={1}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "תשובה חופשית..."}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-right text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-blue-400"
          style={{ fontSize: 14 }}
        />
      </td>
      <td className="px-3 py-3">
        <NoteInput id={id} notes={notes} onChange={onNote} />
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TizromPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INIT);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof FormState, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));

  const setNote = (id: string, val: string) =>
    setForm(f => ({ ...f, notes: { ...f.notes, [id]: val } }));

  const isOwner = form.propertyStatus === "owned";
  const isRenter = form.propertyStatus === "renting" || form.propertyStatus === "family";

  const buildSummary = () => {
    const yn = (v: string) => v === "yes" ? "כן" : v === "no" ? "לא" : v || "—";
    const lines = [
      `לקוח: ${form.clientName || "—"}`,
      `סוכן: ${form.agentName || "—"}`,
      ``,
      `=== שלב 1 — שאלות חובה ===`,
      `תעסוקה: ${form.employment.join(", ")} | תחום: ${form.employmentField || "—"} | בן/בת זוג: ${form.spouseEmployment || "—"}`,
      `מצב דיור: ${form.propertyStatus === "owned" ? "נכס בבעלות" : form.propertyStatus === "renting" ? "שכירות" : form.propertyStatus === "family" ? "אצל משפחה" : "—"}`,
      `התחייבויות: ${yn(form.hasObligations)}`,
      `יעד גדול: ${yn(form.hasGoals)}`,
      `כאב כלכלי: ${form.painPoint || "—"}`,
      `דינמיקת תזרים: ${form.cashFlow === "a" ? "על הקצה" : form.cashFlow === "b" ? "לא גומרים חודש" : form.cashFlow === "c" ? "מתנהלים נכון" : "—"}`,
      `חסכונות עצלים: ${yn(form.hasLazySavings)}`,
      `תוכנית עתיד: ${form.futurePlan || "—"}`,
    ];

    if (isOwner) {
      lines.push(``, `=== שלב 2 — בעל נכס ===`);
      lines.push(`משכנתה: ${yn(form.hasMortgage)}`);
      lines.push(`הלוואות נוספות: ${yn(form.hasExtraLoans)} ${form.extraLoansAmount ? `| סכום: ${form.extraLoansAmount}` : ""}`);
      lines.push(`מרגיש התייקרות: ${yn(form.feelInflation)}`);
      lines.push(`יודע תנאים: ${yn(form.knowsTerms)}`);
      lines.push(`מעוניין ייעוץ: ${yn(form.interestedAdvice)}`);
    }
    if (isRenter) {
      lines.push(``, `=== שלב 2 — שוכר ===`);
      lines.push(`מתכנן לקנות: ${yn(form.planToBuy)}`);
    }

    if (form.summaryNote) {
      lines.push(``, `=== הערות כלליות ===`, form.summaryNote);
    }
    return lines.join("\n");
  };

  const handleSend = async () => {
    setSending(true);
    const summary = buildSummary();
    const payload = {
      session: {
        agentName: form.agentName || "סוכן",
        clientName: form.clientName || "לקוח",
        clientPhone: form.notes["phone"] || "—",
        startTime: new Date().toISOString(),
      },
      history: [],
      scores: {
        mortgage_refinance: isOwner && form.hasMortgage === "yes" ? 60 : 0,
        debt_consolidation: form.hasObligations === "yes" ? 40 : 0,
        home_purchase: isRenter && form.planToBuy === "yes" ? 60 : 0,
        investment: form.hasLazySavings === "yes" ? 30 : 0,
        business_loan: form.employment.includes("company") ? 40 : 0,
        personal_loan: form.hasGoals === "yes" ? 20 : 0,
        uncategorized: 0,
        global:
          (form.hasObligations === "yes" ? 15 : 0) +
          (form.cashFlow === "b" ? 20 : form.cashFlow === "a" ? 10 : 0) +
          (form.interestedAdvice === "yes" ? 30 : 0),
      },
      primaryCategory: isOwner
        ? "mortgage_refinance"
        : isRenter && form.planToBuy === "yes"
        ? "home_purchase"
        : form.hasObligations === "yes"
        ? "debt_consolidation"
        : "personal_loan",
      leadScore:
        form.interestedAdvice === "yes"
          ? 82
          : form.interestedAdvice === "no"
          ? 25
          : form.hasObligations === "yes" || form.cashFlow === "b"
          ? 55
          : 40,
      endType:
        form.interestedAdvice === "yes" || form.planToBuy === "yes"
          ? "hot"
          : form.interestedAdvice === "no"
          ? "cold"
          : "warm",
      endTime: new Date().toISOString(),
      summary,
    };

    try {
      await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      localStorage.setItem("ms_result", JSON.stringify(payload));
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">

      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg,#0d21a1,#1a33c8)" }}
        className="safe-top px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.push("/")}
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-lg">←</button>
        <div className="text-white font-black text-base">דף תזרים שיחה</div>
        <div className="w-9" />
      </div>

      {/* Client + Agent header */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="text-sm font-bold text-gray-700">פרטי שיחה</div>
        </div>
        <div className="px-4 py-3 flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">שם הלקוח</label>
            <input type="text" value={form.clientName}
              onChange={e => set("clientName", e.target.value)}
              placeholder="שם מלא"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:border-blue-400"
              style={{ fontSize: 15 }} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">שם הסוכן</label>
            <input type="text" value={form.agentName}
              onChange={e => set("agentName", e.target.value)}
              placeholder="שם הסוכן"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:border-blue-400"
              style={{ fontSize: 15 }} />
          </div>
        </div>
      </div>

      {/* Opening script */}
      <div className="mx-4 mt-3 rounded-2xl p-4" style={{ background: "#fff8e1", border: "1.5px solid #FF9D0050" }}>
        <div className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
          <span>📢</span> סקריפט פתיחה — קרא ללקוח
        </div>
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          &quot;{form.clientName ? form.clientName : "[שם הלקוח]"}, כחלק מהשירות המשולב שלנו בסוכנות, עלו הרבה שאלות וחששות דומים מלקוחות בעקבות אי וודאות לרמת החוסן והביטחון הכלכלי בבית ובעסק, במיוחד בתקופה הזו במדינה.
          אני רוצה לשאול אותך עוד כמה שאלות מהירות כדי לעזור גם לך לעשות סדר במה שצריך, ולראות שאתם באמת על המסלול הנכון ולא זורקים כסף לפח. זה ייקח 3 דקות, בסדר?&quot;
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Mandatory questions */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <SectionTitle num="1" title="שאלות חובה — עם כל לקוח" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 520 }}>
            <thead>
              <tr style={{ background: "#f8f9ff" }}>
                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>שאלה</th>
                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>סימון</th>
                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "24%" }}>הערות</th>
              </tr>
            </thead>
            <tbody>

              {/* 1. Employment */}
              <tr className="border-b border-gray-100 align-top">
                <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug">
                  תעסוקה<br/>
                  <span className="text-xs text-gray-400 font-normal">מה תחום העיסוק? ובן/בת זוגך?</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      { label: "שכיר", value: "employed" },
                      { label: "עצמאי", value: "self" },
                      { label: "חברה בע\"מ", value: "company" },
                    ].map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => {
                          const arr = form.employment;
                          set("employment", arr.includes(opt.value) ? arr.filter(x => x !== opt.value) : [...arr, opt.value]);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: form.employment.includes(opt.value) ? "#0d21a1" : "#f3f4f6",
                          color: form.employment.includes(opt.value) ? "#fff" : "#374151",
                          border: `1.5px solid ${form.employment.includes(opt.value) ? "#0d21a1" : "#e5e7eb"}`,
                        }}>
                        {form.employment.includes(opt.value) ? "☑" : "☐"} {opt.label}
                      </button>
                    ))}
                  </div>
                  <input type="text" value={form.employmentField}
                    onChange={e => set("employmentField", e.target.value)}
                    placeholder="תחום ______"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-right text-gray-700 focus:outline-none focus:border-blue-400 mb-1.5"
                    style={{ fontSize: 12 }} />
                  <input type="text" value={form.spouseEmployment}
                    onChange={e => set("spouseEmployment", e.target.value)}
                    placeholder="בן/בת זוג ______"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-right text-gray-700 focus:outline-none focus:border-blue-400"
                    style={{ fontSize: 12 }} />
                </td>
                <td className="px-3 py-3"><NoteInput id="employment" notes={form.notes} onChange={setNote} /></td>
              </tr>

              {/* 2. Property */}
              <CheckRow id="property" question="נכס בבעלות"
                options={[
                  { label: "נכס בבעלות", value: "owned" },
                  { label: "שכירות", value: "renting" },
                  { label: "אצל משפחה", value: "family" },
                ]}
                value={form.propertyStatus}
                onChange={v => set("propertyStatus", v)}
                notes={form.notes} onNote={setNote} />

              {/* 3. Obligations */}
              <CheckRow id="obligations" question="התחייבויות"
                options={[{ label: "כן", value: "yes" }, { label: "לא", value: "no" }]}
                value={form.hasObligations}
                onChange={v => set("hasObligations", v)}
                notes={form.notes} onNote={setNote} />

              {/* 4. Goals */}
              <CheckRow id="goals" question="שאיפות — יעד גדול בשנה הקרובה?"
                options={[{ label: "כן", value: "yes" }, { label: "לא", value: "no" }]}
                value={form.hasGoals}
                onChange={v => set("hasGoals", v)}
                notes={form.notes} onNote={setNote} />

              {/* 5. Pain point */}
              <TextRow id="pain" question="מצוקה — מה הכי מפריע לך בכסף?"
                value={form.painPoint}
                onChange={v => set("painPoint", v)}
                placeholder="תשובה חופשית..."
                notes={form.notes} onNote={setNote} />

              {/* 6. Cash flow */}
              <tr className="border-b border-gray-100 align-top">
                <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug">
                  דינמיקת תזרים<br/>
                  <span className="text-xs text-gray-400 font-normal">הכנסות מול הוצאות</span>
                </td>
                <td className="px-3 py-3">
                  {[
                    { value: "a", label: "א׳ — על הקצה, לא מצליחים לחסוך" },
                    { value: "b", label: "ב׳ — לא גומרים חודש, מעמיקים מינוס" },
                    { value: "c", label: "ג׳ — מתנהלים נכון, יש חיסכון" },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => set("cashFlow", opt.value)}
                      className="flex items-center gap-2 w-full text-right mb-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: form.cashFlow === opt.value ? "#0d21a1" : "#f3f4f6",
                        color: form.cashFlow === opt.value ? "#fff" : "#374151",
                        border: `1.5px solid ${form.cashFlow === opt.value ? "#0d21a1" : "#e5e7eb"}`,
                      }}>
                      <span>{form.cashFlow === opt.value ? "●" : "○"}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </td>
                <td className="px-3 py-3"><NoteInput id="cashflow" notes={form.notes} onChange={setNote} /></td>
              </tr>

              {/* 7. Lazy savings */}
              <CheckRow id="savings" question='כסף עצלן — חסכונות בעו"ש / פק"מ שנשחקים?'
                options={[{ label: "כן", value: "yes" }, { label: "לא", value: "no" }]}
                value={form.hasLazySavings}
                onChange={v => set("hasLazySavings", v)}
                notes={form.notes} onNote={setNote} />

              {/* 8. Future plan */}
              <tr className="border-b border-gray-100 align-top">
                <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug">
                  חרדת עתיד<br/>
                  <span className="text-xs text-gray-400 font-normal">תוכנית לעזרה לילדים, שדרוג דירה וכו׳?</span>
                </td>
                <td className="px-3 py-3">
                  {[
                    { value: "has_plan", label: "יש תוכנית ברורה" },
                    { value: "no_plan", label: "אין תוכנית — צריך לדאוג" },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => set("futurePlan", opt.value)}
                      className="flex items-center gap-2 w-full text-right mb-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: form.futurePlan === opt.value ? "#0d21a1" : "#f3f4f6",
                        color: form.futurePlan === opt.value ? "#fff" : "#374151",
                        border: `1.5px solid ${form.futurePlan === opt.value ? "#0d21a1" : "#e5e7eb"}`,
                      }}>
                      <span>{form.futurePlan === opt.value ? "●" : "○"}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </td>
                <td className="px-3 py-3"><NoteInput id="future" notes={form.notes} onChange={setNote} /></td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2A — Property owner */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isOwner && (
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <SectionTitle num="2" title="שאלות בחירה — בעל נכס" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 520 }}>
              <thead>
                <tr style={{ background: "#f8f9ff" }}>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>שאלה</th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>סימון</th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "24%" }}>הערות</th>
                </tr>
              </thead>
              <tbody>

                {/* Mortgage */}
                <CheckRow id="mortgage" question="יש על הבית משכנתה?"
                  options={[{ label: "יש", value: "yes" }, { label: "אין", value: "no" }]}
                  value={form.hasMortgage}
                  onChange={v => set("hasMortgage", v)}
                  notes={form.notes} onNote={setNote} />

                {/* Extra loans */}
                <tr className="border-b border-gray-100 align-top">
                  <td className="px-3 py-3 text-sm font-medium text-gray-800 leading-snug">
                    הלוואות נוספות?<br/>
                    <span className="text-xs text-gray-400 font-normal">מימון רכב, בנק, אשראי</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2 mb-2">
                      {[{ label: "יש", value: "yes" }, { label: "אין", value: "no" }].map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => set("hasExtraLoans", opt.value)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: form.hasExtraLoans === opt.value ? "#0d21a1" : "#f3f4f6",
                            color: form.hasExtraLoans === opt.value ? "#fff" : "#374151",
                            border: `1.5px solid ${form.hasExtraLoans === opt.value ? "#0d21a1" : "#e5e7eb"}`,
                          }}>
                          {form.hasExtraLoans === opt.value ? "☑" : "☐"} {opt.label}
                        </button>
                      ))}
                    </div>
                    {form.hasExtraLoans === "yes" && (
                      <input type="text" value={form.extraLoansAmount}
                        onChange={e => set("extraLoansAmount", e.target.value)}
                        placeholder="כמה בחודש? ₪"
                        className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-right focus:outline-none focus:border-blue-400"
                        style={{ fontSize: 13 }} />
                    )}
                  </td>
                  <td className="px-3 py-3"><NoteInput id="extraloans" notes={form.notes} onChange={setNote} /></td>
                </tr>

                {/* Inflation */}
                <CheckRow id="inflation" question="הרגשתם שהכל מתייקר בשנתיים האחרונות?"
                  options={[{ label: "כן", value: "yes" }, { label: "לא", value: "no" }]}
                  value={form.feelInflation}
                  onChange={v => set("feelInflation", v)}
                  notes={form.notes} onNote={setNote} />

                {/* Knows terms */}
                <CheckRow id="terms" question="בטוחים שאתם לא משלמים יותר ממה שצריך?"
                  options={[{ label: "כן יודעים", value: "yes" }, { label: "לא בטוחים", value: "no" }]}
                  value={form.knowsTerms}
                  onChange={v => set("knowsTerms", v)}
                  notes={form.notes} onNote={setNote} />

                {/* Interested */}
                <CheckRow id="advice" question={`מעוניין לשמוע מייעוץ מקצועי, ללא עלות?`}
                  options={[{ label: "כן מעוניין", value: "yes" }, { label: "לא מעוניין", value: "no" }]}
                  value={form.interestedAdvice}
                  onChange={v => set("interestedAdvice", v)}
                  notes={form.notes} onNote={setNote} />

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2B — Renter */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isRenter && (
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <SectionTitle num="2" title="שאלות בחירה — שוכר" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 520 }}>
              <thead>
                <tr style={{ background: "#f8f9ff" }}>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>שאלה</th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "38%" }}>סימון</th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 border-b border-gray-100" style={{ width: "24%" }}>הערות</th>
                </tr>
              </thead>
              <tbody>
                <CheckRow id="buysoon" question="תכננתם לעבור לדירה מתאימה יותר או לקנות משלכם?"
                  options={[{ label: "כן", value: "yes" }, { label: "לא", value: "no" }]}
                  value={form.planToBuy}
                  onChange={v => set("planToBuy", v)}
                  notes={form.notes} onNote={setNote} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Closing script */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <SectionTitle num="3" title="שיקוף, Vision והעלאת הפתרון" />
        <div className="p-4">
          <div className="rounded-2xl p-4 text-sm leading-relaxed font-medium text-gray-800"
            style={{ background: "linear-gradient(135deg,#0d21a1,#1a33c8)", color: "white", fontSize: 15, lineHeight: 1.65 }}>
            &quot;אוקיי {form.clientName || "[שם]"}, אז ממה שאני מבין ומסכם מהשיחה שלנו:<br/><br/>
            מצד אחד הבית שלכם,<br/>
            אבל מצד שני הוצאות ה{isOwner ? "(משכנתה/הלוואות)" : "(שכירות)"} לוקחים לכם נתח מטורף מהתזרים,
            וכרגע אין לכם גוף מקצועי שמגן עליכם מולם.<br/><br/>
            זה אומר שאם היית יכול לקבל מפה ברורה שמראה איך לקחת את הנתונים הקיימים שלכם,
            ופשוט להחזיר אליכם לחשבון עוד 1,500 עד 3,000 ₪ בכל חודש — זה משהו שהיה לכם אינטרס לראות?&quot;
          </div>

          <div className="mt-3 rounded-2xl p-3 text-sm leading-relaxed text-gray-700"
            style={{ background: "#f0fdf4", border: "1.5px solid #86efac" }}>
            <strong className="text-green-800">לאחר שהלקוח אמר כן:</strong><br/>
            &quot;מעולה. בשביל זה בדיוק אני מחבר אותך ליועץ הפיננסי שעובד צמוד עם הלקוחות שלי.
            אני מעביר לו את הנתונים היבשים שרשמתי כאן, והוא ירים אליך שיחה קצרה — ללא שום עלות או התחייבות.
            הוא יתקשר מחר, תענה לו.&quot;
          </div>
        </div>
      </div>

      {/* Summary notes */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="text-sm font-bold text-gray-700">📝 הערות כלליות</div>
        </div>
        <div className="p-4">
          <textarea value={form.summaryNote}
            onChange={e => set("summaryNote", e.target.value)}
            placeholder="הערות נוספות, תצפיות, או מידע רלוונטי..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right text-gray-700 resize-none focus:outline-none focus:border-blue-400"
            style={{ fontSize: 14 }} />
        </div>
      </div>

      {/* Send button */}
      <div className="mx-4 mt-4 mb-8 safe-bottom">
        {sent ? (
          <div className="rounded-2xl p-4 text-center" style={{ background: "#f0fdf4", border: "2px solid #86efac" }}>
            <div className="text-2xl mb-1">✅</div>
            <div className="text-green-700 font-bold">הטופס נשלח בהצלחה!</div>
            <div className="text-green-600 text-sm mt-0.5">נשלח ל-sp.makesense@gmail.com</div>
            <button onClick={() => { setForm(INIT); setSent(false); }}
              className="mt-3 px-6 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: "#0d21a1" }}>
              שיחה חדשה
            </button>
          </div>
        ) : (
          <button onClick={handleSend} disabled={sending}
            className="w-full py-4 rounded-2xl text-white text-lg font-black transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#0d21a1,#1a33c8)", boxShadow: "0 8px 28px rgba(13,33,161,0.4)" }}>
            {sending ? "שולח..." : "📤 שלח ליועץ"}
          </button>
        )}
      </div>
    </div>
  );
}
