"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import ScriptBubble from "@/components/ScriptBubble";
import CategoryBadge from "@/components/CategoryBadge";
import type {
  SessionInfo,
  CategoryScores,
  AnswerRecord,
  ConversationResult,
  LeadCategory,
  EndType,
} from "@/types";
import { CONVERSATION_TREE, INITIAL_NODE_ID, TOTAL_NODES_ESTIMATE } from "@/lib/conversation-tree";
import {
  initScores,
  applyScoreDeltas,
  determinePrimaryCategory,
  computeLeadScore,
  buildResult,
} from "@/lib/lead-engine";

export default function CallPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(INITIAL_NODE_ID);
  const [scores, setScores] = useState<CategoryScores>(initScores());
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ms_session");
    if (!stored) {
      router.replace("/");
      return;
    }
    setSession(JSON.parse(stored));
  }, [router]);

  const currentNode = CONVERSATION_TREE[currentNodeId];
  const primaryCategory = determinePrimaryCategory(scores);
  const currentScore = computeLeadScore(scores, "warm", history.length);

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (isTransitioning) return;

      const answer = currentNode?.answers.find((a) => a.id === answerId);
      if (!answer) return;

      setIsTransitioning(true);

      // Apply score deltas
      const newScores = applyScoreDeltas(scores, answer.scoreDeltas ?? {});
      setScores(newScores);

      // Record history
      const record: AnswerRecord = {
        nodeId: currentNodeId,
        questionScript: currentNode.script,
        answerText: answer.text,
        timestamp: new Date().toISOString(),
      };
      const newHistory = [...history, record];
      setHistory(newHistory);
      setStep((s) => s + 1);

      const nextNode = CONVERSATION_TREE[answer.nextNodeId];

      if (nextNode?.isTerminal) {
        // Build and save result, then navigate
        const endType: EndType = nextNode.terminalType ?? "cold";
        const updatedScores = applyScoreDeltas(newScores, {});
        const result = buildResult(
          session!,
          newHistory,
          updatedScores,
          endType
        );
        localStorage.setItem("ms_result", JSON.stringify(result));

        // Send email in background
        fetch("/api/send-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        }).catch(console.error);

        // Show terminal node script briefly then navigate
        setCurrentNodeId(answer.nextNodeId);
        setTimeout(() => {
          router.push("/summary");
        }, 2200);
      } else {
        setTimeout(() => {
          setCurrentNodeId(answer.nextNodeId);
          setIsTransitioning(false);
        }, 300);
      }
    },
    [currentNode, currentNodeId, history, isTransitioning, router, scores, session]
  );

  if (!session || !currentNode) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm animate-pulse-gentle">טוען...</div>
      </div>
    );
  }

  const isTerminal = currentNode.isTerminal;
  const scoreColor =
    currentScore >= 70 ? "#16a34a" : currentScore >= 45 ? "#FF9D00" : "#dc2626";

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">

      {/* Top bar */}
      <div
        className="safe-top"
        style={{ background: "linear-gradient(135deg, #0d21a1, #1a33c8)" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-lg"
          >
            ←
          </button>

          {/* Client info */}
          <div className="text-center">
            <div className="text-white font-bold text-base leading-tight">{session.clientName}</div>
            <div className="text-blue-200 text-xs">{session.clientPhone}</div>
          </div>

          {/* Live score badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-white font-black text-lg leading-none">{currentScore}</span>
            <div className="flex flex-col items-start">
              <span className="text-white/70 text-xs leading-none">ציון</span>
              <span className="text-xs leading-none" style={{ color: scoreColor === "#16a34a" ? "#86efac" : scoreColor === "#FF9D00" ? "#fde68a" : "#fca5a5" }}>
                {currentScore >= 70 ? "חם" : currentScore >= 45 ? "פושר" : "קר"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-3">
          <ProgressBar current={step} total={TOTAL_NODES_ESTIMATE} />
        </div>
      </div>

      {/* Category indicator (if determined) */}
      {primaryCategory !== "uncategorized" && (
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-b border-gray-100">
          <span className="text-xs text-gray-400 font-medium">קטגוריה זוהתה:</span>
          <CategoryBadge category={primaryCategory} size="sm" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Script bubble */}
        <div className={`mt-4 animate-fade-in ${isTransitioning ? "opacity-50" : ""} transition-opacity`} key={currentNodeId}>
          <ScriptBubble
            script={currentNode.script}
            tip={currentNode.tip}
            agentName={session.agentName}
          />
        </div>

        {/* Answer buttons */}
        {!isTerminal && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in" key={`answers-${currentNodeId}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400 font-semibold px-2">תגובת הלקוח</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {currentNode.answers.map((answer, i) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(answer.id)}
                disabled={isTransitioning}
                className="w-full text-right rounded-2xl px-5 py-4 text-base font-semibold transition-all active:scale-95 disabled:opacity-50"
                style={{
                  background: "#ffffff",
                  border: "2px solid #e5e7eb",
                  color: "#1f2937",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  animationDelay: `${i * 60}ms`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#0d21a1";
                  (e.currentTarget as HTMLButtonElement).style.background = "#f0f3ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                }}
              >
                <span className="flex items-center justify-between gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "#f3f4f6", color: "#6b7280" }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">{answer.text}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Terminal state */}
        {isTerminal && (
          <div className="mx-4 mt-2 mb-6 rounded-2xl p-5 text-center animate-fade-in"
            style={{ background: "#f0fdf4", border: "2px solid #86efac" }}>
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-700 font-bold text-base">השיחה הסתיימה</p>
            <p className="text-green-600 text-sm mt-1">מעביר לדף הסיכום...</p>
          </div>
        )}
      </div>

      {/* History toggle */}
      <div className="px-4 pb-4 safe-bottom">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-200 transition-all"
        >
          {showHistory ? "הסתר היסטוריה" : `📋 היסטוריית שיחה (${history.length} תשובות)`}
        </button>

        {showHistory && history.length > 0 && (
          <div className="mt-2 rounded-2xl bg-white border border-gray-100 overflow-hidden">
            {history.slice().reverse().map((h, i) => (
              <div key={i} className="px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="text-xs text-gray-400 mb-0.5 leading-tight">
                  {h.questionScript.substring(0, 60)}...
                </div>
                <div className="text-sm font-semibold text-royal" style={{ color: "#0d21a1" }}>
                  ▸ {h.answerText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
