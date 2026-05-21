import type {
  AnswerRecord,
  CategoryScores,
  ConversationResult,
  EndType,
  LeadCategory,
  SessionInfo,
} from "@/types";
import { CATEGORY_LABELS } from "@/types";

const EMPTY_SCORES = (): CategoryScores => ({
  mortgage_refinance: 0,
  debt_consolidation: 0,
  home_purchase: 0,
  investment: 0,
  business_loan: 0,
  personal_loan: 0,
  uncategorized: 0,
  global: 0,
});

export function initScores(): CategoryScores {
  return EMPTY_SCORES();
}

export function applyScoreDeltas(
  scores: CategoryScores,
  deltas: Partial<CategoryScores>
): CategoryScores {
  const next = { ...scores };
  for (const [key, delta] of Object.entries(deltas)) {
    if (delta !== undefined) {
      const k = key as keyof CategoryScores;
      next[k] = Math.min(100, (next[k] ?? 0) + delta);
    }
  }
  return next;
}

export function determinePrimaryCategory(scores: CategoryScores): LeadCategory {
  const CATEGORIES: LeadCategory[] = [
    "mortgage_refinance",
    "debt_consolidation",
    "home_purchase",
    "investment",
    "business_loan",
    "personal_loan",
  ];

  let best: LeadCategory = "uncategorized";
  let bestScore = 9; // minimum threshold to be categorized

  for (const cat of CATEGORIES) {
    if (scores[cat] > bestScore) {
      bestScore = scores[cat];
      best = cat;
    }
  }
  return best;
}

export function computeLeadScore(
  scores: CategoryScores,
  endType: EndType,
  historyLength: number
): number {
  const primary = determinePrimaryCategory(scores);
  const categoryScore = primary === "uncategorized" ? 0 : scores[primary];
  const globalScore = scores.global;

  // Weighted: 55% primary category, 45% global engagement
  let raw = categoryScore * 0.55 + globalScore * 0.45;

  // Engagement bonus based on conversation depth
  const depthBonus = Math.min(10, historyLength * 0.8);
  raw += depthBonus;

  // End-type modifiers
  const multipliers: Record<EndType, number> = {
    hot: 1.25,
    warm: 1.0,
    info: 0.85,
    cold: 0.5,
    callback: 0.7,
    polite: 0.2,
  };
  raw *= multipliers[endType];

  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function generateSummary(
  session: SessionInfo,
  history: AnswerRecord[],
  scores: CategoryScores,
  primaryCategory: LeadCategory,
  leadScore: number,
  endType: EndType
): string {
  const categoryLabel = CATEGORY_LABELS[primaryCategory];
  const endLabels: Record<EndType, string> = {
    hot: "הביע עניין מלא ומוכן להתקדם",
    warm: "מעוניין אך ביקש זמן לחשיבה",
    info: "ביקש לקבל מידע נוסף",
    cold: "אינו מעוניין בשלב זה",
    callback: "ביקש שנחזור אליו בזמן אחר",
    polite: "סיים את השיחה בנימוס",
  };

  // Extract key data points from history
  const keyAnswers = history
    .filter((h) => !["greeting", "soft_pitch", "callback_request", "closing_pitch"].includes(h.nodeId))
    .map((h) => `• ${h.answerText}`)
    .join("\n");

  const scoreLabel =
    leadScore >= 70
      ? "גבוה"
      : leadScore >= 45
      ? "בינוני"
      : "נמוך";

  return `לקוח: ${session.clientName} | טלפון: ${session.clientPhone}
סוכן: ${session.agentName}

קטגוריה מובילה: ${categoryLabel}
ציון ליד: ${leadScore}/100 (${scoreLabel})
תוצאת שיחה: ${endLabels[endType]}

נקודות מפתח מהשיחה:
${keyAnswers || "• לא נאספו נתונים"}`;
}

export function buildResult(
  session: SessionInfo,
  history: AnswerRecord[],
  scores: CategoryScores,
  endType: EndType
): ConversationResult {
  const primaryCategory = determinePrimaryCategory(scores);
  const leadScore = computeLeadScore(scores, endType, history.length);
  const summary = generateSummary(
    session,
    history,
    scores,
    primaryCategory,
    leadScore,
    endType
  );

  return {
    session,
    history,
    scores,
    primaryCategory,
    leadScore,
    endType,
    endTime: new Date().toISOString(),
    summary,
  };
}
