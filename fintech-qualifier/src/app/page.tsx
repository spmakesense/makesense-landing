"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SessionInfo } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    agentName: "",
    clientName: "",
    clientPhone: "",
  });
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!form.agentName.trim()) {
      setError("יש להזין שם סוכן");
      return;
    }
    if (!form.clientName.trim()) {
      setError("יש להזין שם לקוח");
      return;
    }
    if (!form.clientPhone.trim()) {
      setError("יש להזין טלפון לקוח");
      return;
    }

    const session: SessionInfo = {
      agentName: form.agentName.trim(),
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      startTime: new Date().toISOString(),
    };

    localStorage.setItem("ms_session", JSON.stringify(session));
    localStorage.removeItem("ms_result");
    router.push("/call");
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "linear-gradient(160deg, #0d21a1 0%, #1a33c8 40%, #3BBDD4 100%)" }}>

      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6 safe-top">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#FF9D00" opacity="0.9"/>
            <path d="M10 16l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Make Sense</h1>
        <p className="text-blue-200 text-sm mt-1 font-medium">מסייע מכירות חכם לסוכנים</p>
      </div>

      {/* Card */}
      <div className="flex-1 mx-4 mb-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">שיחה חדשה</h2>
            <p className="text-sm text-gray-500 mt-0.5">הזן את פרטי השיחה לפני ההתחלה</p>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                שם הסוכן <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.agentName}
                onChange={(e) => { setForm(f => ({ ...f, agentName: e.target.value })); setError(""); }}
                placeholder="השם שלך"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-medium text-right text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                style={{ fontSize: 16 }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                שם הלקוח <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => { setForm(f => ({ ...f, clientName: e.target.value })); setError(""); }}
                placeholder="שם מלא של הלקוח"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-medium text-right text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                style={{ fontSize: 16 }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                טלפון לקוח <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.clientPhone}
                onChange={(e) => { setForm(f => ({ ...f, clientPhone: e.target.value })); setError(""); }}
                placeholder="05X-XXXXXXX"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-medium text-right text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                style={{ fontSize: 16 }}
                dir="ltr"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium text-right">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="px-6 pb-6">
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl text-white text-lg font-black tracking-wide transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #0d21a1, #1a33c8)",
                boxShadow: "0 8px 28px rgba(13,33,161,0.4)",
              }}
            >
              🚀 התחל שיחה
            </button>
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="text-center pb-8 safe-bottom">
        <p className="text-blue-200 text-xs font-medium">
          הנחיות מכירה בזמן אמת • ניקוד ליד אוטומטי
        </p>
      </div>
    </div>
  );
}
