export type LeadCategory =
  | "mortgage_refinance"
  | "debt_consolidation"
  | "home_purchase"
  | "investment"
  | "business_loan"
  | "personal_loan"
  | "uncategorized";

export type EndType = "hot" | "warm" | "info" | "cold" | "callback" | "polite";

export interface AnswerOption {
  id: string;
  text: string;
  nextNodeId: string;
  scoreDeltas?: Partial<Record<LeadCategory | "global", number>>;
}

export interface ConversationNode {
  id: string;
  script: string;
  tip?: string;
  answers: AnswerOption[];
  isTerminal?: boolean;
  terminalType?: EndType;
}

export interface SessionInfo {
  agentName: string;
  clientName: string;
  clientPhone: string;
  startTime: string;
}

export interface AnswerRecord {
  nodeId: string;
  questionScript: string;
  answerText: string;
  timestamp: string;
}

export type CategoryScores = Record<LeadCategory | "global", number>;

export interface ConversationResult {
  session: SessionInfo;
  history: AnswerRecord[];
  scores: CategoryScores;
  primaryCategory: LeadCategory;
  leadScore: number;
  endType: EndType;
  endTime: string;
  summary: string;
}

export const CATEGORY_LABELS: Record<LeadCategory, string> = {
  mortgage_refinance: "מחזור משכנתא",
  debt_consolidation: "איחוד הלוואות",
  home_purchase: "רכישת דירה",
  investment: "השקעה",
  business_loan: "הלוואה עסקית",
  personal_loan: "הלוואה אישית",
  uncategorized: "לא מוגדר",
};

export const CATEGORY_COLORS: Record<LeadCategory, string> = {
  mortgage_refinance: "#0d21a1",
  debt_consolidation: "#e08800",
  home_purchase: "#16a34a",
  investment: "#7c3aed",
  business_loan: "#dc2626",
  personal_loan: "#0891b2",
  uncategorized: "#6b7280",
};

export const END_TYPE_LABELS: Record<EndType, string> = {
  hot: "ליד חם 🔥",
  warm: "ליד פושר",
  info: "מבקש מידע",
  cold: "ליד קר",
  callback: "ביקש להתקשר",
  polite: "לא מעוניין",
};
