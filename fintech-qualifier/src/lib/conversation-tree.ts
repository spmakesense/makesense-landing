import type { ConversationNode } from "@/types";

export const CONVERSATION_TREE: Record<string, ConversationNode> = {
  // ─── OPENING ────────────────────────────────────────────────────────────────
  greeting: {
    id: "greeting",
    script:
      'שלום! שמי {agentName} מחברת Make Sense. אנחנו עוזרים לאנשים לשפר את המצב הפיננסי שלהם — לפעמים זה חיסכון של כמה מאות עד אלפי שקלים בחודש. יש לך 2-3 דקות?',
    tip: "פתח בחיוך ובנימה חיובית. ציין את השם שלך בבירור.",
    answers: [
      { id: "g1", text: "כן, בטח", nextNodeId: "property_status", scoreDeltas: { global: 5 } },
      { id: "g2", text: "על מה מדובר בדיוק?", nextNodeId: "soft_pitch", scoreDeltas: { global: 2 } },
      { id: "g3", text: "לא כרגע", nextNodeId: "callback_request" },
    ],
  },

  soft_pitch: {
    id: "soft_pitch",
    script:
      "ב-Make Sense אנחנו מסייעים ללקוחות לבחון מחדש משכנתאות, לאחד הלוואות ולמצוא הזדמנויות פיננסיות שרוב האנשים מפספסים. הרבה מאוד אנשים לא יודעים כמה כסף הם יכולים לחסוך. כדאי לנצל 3 דקות לבדוק?",
    answers: [
      { id: "sp1", text: "אוקיי, בוא נראה", nextNodeId: "property_status", scoreDeltas: { global: 3 } },
      { id: "sp2", text: "לא מעוניין, תודה", nextNodeId: "end_polite" },
    ],
  },

  callback_request: {
    id: "callback_request",
    script: "בהחלט, אין בעיה! מתי יהיה נוח יותר לדבר?",
    answers: [
      { id: "cb1", text: "מחר בבוקר", nextNodeId: "end_callback" },
      { id: "cb2", text: "בשעות הערב", nextNodeId: "end_callback" },
      { id: "cb3", text: "בתחילת השבוע הבא", nextNodeId: "end_callback" },
    ],
  },

  // ─── PROPERTY STATUS ────────────────────────────────────────────────────────
  property_status: {
    id: "property_status",
    script: "מצוין! כדי להבין מה מתאים לך — מה מצב הדיור שלך?",
    tip: "הקשב היטב לתשובה — זה מכוון את כל השיחה",
    answers: [
      {
        id: "ps1",
        text: "אני גר בדירה שלי",
        nextNodeId: "mortgage_check",
        scoreDeltas: { mortgage_refinance: 10 },
      },
      {
        id: "ps2",
        text: "אני שוכר",
        nextNodeId: "rent_bridge",
        scoreDeltas: { home_purchase: 10 },
      },
      {
        id: "ps3",
        text: "גר עם משפחה / הורים",
        nextNodeId: "family_bridge",
        scoreDeltas: { home_purchase: 15 },
      },
      {
        id: "ps4",
        text: "יש לי כמה נכסים",
        nextNodeId: "investor_profile",
        scoreDeltas: { investment: 25 },
      },
    ],
  },

  // ─── OWNS PROPERTY PATHS ─────────────────────────────────────────────────
  mortgage_check: {
    id: "mortgage_check",
    script: "נהדר! האם יש משכנתא פעילה על הנכס?",
    answers: [
      {
        id: "mc1",
        text: "כן, יש משכנתא",
        nextNodeId: "mortgage_vintage",
        scoreDeltas: { mortgage_refinance: 10 },
      },
      {
        id: "mc2",
        text: "לא, הנכס שלם",
        nextNodeId: "equity_option",
        scoreDeltas: { investment: 15, personal_loan: 10 },
      },
      {
        id: "mc3",
        text: "כן, ויש גם הלוואות נוספות",
        nextNodeId: "debt_full_picture",
        scoreDeltas: { mortgage_refinance: 10, debt_consolidation: 15 },
      },
    ],
  },

  mortgage_vintage: {
    id: "mortgage_vintage",
    script: "מתי לקחתם את המשכנתא?",
    tip: "ריביות על משכנתאות ישנות לרוב גבוהות יותר — הזדמנות טובה!",
    answers: [
      {
        id: "mv1",
        text: "לפני יותר מ-5 שנים",
        nextNodeId: "refinance_hot",
        scoreDeltas: { mortgage_refinance: 30 },
      },
      {
        id: "mv2",
        text: "לפני 3–5 שנים",
        nextNodeId: "refinance_warm",
        scoreDeltas: { mortgage_refinance: 20 },
      },
      {
        id: "mv3",
        text: "לפני פחות מ-3 שנים",
        nextNodeId: "debt_probe",
        scoreDeltas: { mortgage_refinance: 5 },
      },
      {
        id: "mv4",
        text: "לא זוכר בדיוק",
        nextNodeId: "refinance_warm",
        scoreDeltas: { mortgage_refinance: 15 },
      },
    ],
  },

  refinance_hot: {
    id: "refinance_hot",
    script:
      "מעולה! זה בדיוק מה שאנחנו מתמחים בו. משכנתאות שנלקחו לפני יותר מ-5 שנים — ברוב המקרים ניתן להפחית את ההחזר ב-500 עד 2,000 ₪ בחודש. מה ההחזר החודשי הנוכחי שלך?",
    tip: "לקוח חם! הדגש את הסכום שאפשר לחסוך. שמור על נימה נלהבת.",
    answers: [
      {
        id: "rh1",
        text: "עד 3,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 10 },
      },
      {
        id: "rh2",
        text: "3,000–6,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 20 },
      },
      {
        id: "rh3",
        text: "מעל 6,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 30 },
      },
      {
        id: "rh4",
        text: "לא יודע בדיוק",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 15 },
      },
    ],
  },

  refinance_warm: {
    id: "refinance_warm",
    script:
      "מעניין. גם בטווח הזה לפעמים כדאי לבחון מחדש. האם אי פעם השווית את תנאי המשכנתא שלך לעומת מה שיש בשוק היום?",
    answers: [
      {
        id: "rw1",
        text: "לא, מעולם לא בדקתי",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 15 },
      },
      {
        id: "rw2",
        text: "כן, בדקתי אבל לא עשיתי שינוי",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 10 },
      },
      {
        id: "rw3",
        text: "לא ידעתי שאפשר",
        nextNodeId: "income_type",
        scoreDeltas: { mortgage_refinance: 12 },
      },
    ],
  },

  equity_option: {
    id: "equity_option",
    script:
      "נכס שלם הוא נכס עם פוטנציאל אדיר! האם חשבת לנצל את ההון העצמי — לצורך השקעה, שיפוץ, או מטרה אחרת?",
    answers: [
      {
        id: "eo1",
        text: "כן, לצורך השקעה",
        nextNodeId: "income_type",
        scoreDeltas: { investment: 25 },
      },
      {
        id: "eo2",
        text: "כן, לשיפוץ / הרחבה",
        nextNodeId: "income_type",
        scoreDeltas: { personal_loan: 20 },
      },
      {
        id: "eo3",
        text: "כן, לצורך עסקי",
        nextNodeId: "income_type",
        scoreDeltas: { business_loan: 20 },
      },
      {
        id: "eo4",
        text: "לא, לא חשבתי על זה",
        nextNodeId: "debt_probe",
      },
    ],
  },

  debt_full_picture: {
    id: "debt_full_picture",
    script:
      "בוא נסתכל על התמונה הכוללת. כמה הלוואות פעילות יש לך מלבד המשכנתא?",
    answers: [
      {
        id: "dfp1",
        text: "1–2 הלוואות",
        nextNodeId: "debt_monthly",
        scoreDeltas: { debt_consolidation: 10, mortgage_refinance: 5 },
      },
      {
        id: "dfp2",
        text: "3–4 הלוואות",
        nextNodeId: "debt_monthly",
        scoreDeltas: { debt_consolidation: 20 },
      },
      {
        id: "dfp3",
        text: "יותר מ-4 הלוואות",
        nextNodeId: "debt_monthly",
        scoreDeltas: { debt_consolidation: 30 },
      },
    ],
  },

  debt_monthly: {
    id: "debt_monthly",
    script:
      "מה סך התשלום החודשי על כל ההלוואות ביחד (כולל המשכנתא)?",
    tip: "ככל שהסכום גבוה יותר — פוטנציאל גדול יותר לאיחוד ולחיסכון",
    answers: [
      {
        id: "dm1",
        text: "עד 3,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 5 },
      },
      {
        id: "dm2",
        text: "3,000–6,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 15 },
      },
      {
        id: "dm3",
        text: "6,000–10,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 25 },
      },
      {
        id: "dm4",
        text: "מעל 10,000 ₪",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 35 },
      },
    ],
  },

  // ─── RENTING PATHS ──────────────────────────────────────────────────────────
  rent_bridge: {
    id: "rent_bridge",
    script: "כמה שנים אתה שוכר כרגע?",
    answers: [
      {
        id: "rb1",
        text: "פחות משנה",
        nextNodeId: "purchase_interest",
        scoreDeltas: { home_purchase: 5 },
      },
      {
        id: "rb2",
        text: "1–3 שנים",
        nextNodeId: "purchase_interest",
        scoreDeltas: { home_purchase: 10 },
      },
      {
        id: "rb3",
        text: "3–5 שנים",
        nextNodeId: "purchase_interest",
        scoreDeltas: { home_purchase: 15 },
      },
      {
        id: "rb4",
        text: "יותר מ-5 שנים",
        nextNodeId: "purchase_interest",
        scoreDeltas: { home_purchase: 20 },
      },
    ],
  },

  purchase_interest: {
    id: "purchase_interest",
    script: "האם אי פעם חשבת ברצינות לרכוש דירה?",
    answers: [
      {
        id: "pi1",
        text: "כן, זה חלום שלי",
        nextNodeId: "purchase_timeline",
        scoreDeltas: { home_purchase: 25 },
      },
      {
        id: "pi2",
        text: "כן, אבל לא יודע מאיפה להתחיל",
        nextNodeId: "purchase_timeline",
        scoreDeltas: { home_purchase: 20 },
      },
      {
        id: "pi3",
        text: "כן, אבל בעיית ההון הראשוני",
        nextNodeId: "purchase_timeline",
        scoreDeltas: { home_purchase: 20 },
      },
      {
        id: "pi4",
        text: "לא ממש, מעדיף לשכור",
        nextNodeId: "debt_probe",
      },
    ],
  },

  // ─── FAMILY HOME PATH ───────────────────────────────────────────────────────
  family_bridge: {
    id: "family_bridge",
    script:
      "מגניב! גרים עם משפחה לרוב מאפשר לחסוך הון ראשוני. האם אתה חוסך לקראת קניית דירה?",
    answers: [
      {
        id: "fb1",
        text: "כן, זה המטרה שלי",
        nextNodeId: "purchase_timeline",
        scoreDeltas: { home_purchase: 25 },
      },
      {
        id: "fb2",
        text: "חשבתי על זה אבל לא בטוח",
        nextNodeId: "purchase_timeline",
        scoreDeltas: { home_purchase: 15 },
      },
      {
        id: "fb3",
        text: "לא, לא בסדר עדיפויות עכשיו",
        nextNodeId: "debt_probe",
        scoreDeltas: { home_purchase: 5 },
      },
    ],
  },

  purchase_timeline: {
    id: "purchase_timeline",
    script: "מתי היית רוצה לרכוש?",
    tip: "ככל שהאופק קרוב יותר — הליד חם יותר",
    answers: [
      {
        id: "pt1",
        text: "בשנה הקרובה",
        nextNodeId: "income_type",
        scoreDeltas: { home_purchase: 25 },
      },
      {
        id: "pt2",
        text: "בתוך 2–3 שנים",
        nextNodeId: "income_type",
        scoreDeltas: { home_purchase: 15 },
      },
      {
        id: "pt3",
        text: "בעוד 5 שנים ויותר",
        nextNodeId: "income_type",
        scoreDeltas: { home_purchase: 8 },
      },
      {
        id: "pt4",
        text: "לא יודע מתי",
        nextNodeId: "income_type",
        scoreDeltas: { home_purchase: 10 },
      },
    ],
  },

  // ─── INVESTOR PATH ──────────────────────────────────────────────────────────
  investor_profile: {
    id: "investor_profile",
    script: "מרשים! הנכסים מניבים הכנסות (מושכרים)?",
    tip: "משקיע מנוסה — בדוק אם יש מקום להרחבת תיק ההשקעות",
    answers: [
      {
        id: "ip1",
        text: "כן, יש לי הכנסות שכירות",
        nextNodeId: "income_type",
        scoreDeltas: { investment: 25 },
      },
      {
        id: "ip2",
        text: "חלקית",
        nextNodeId: "income_type",
        scoreDeltas: { investment: 20 },
      },
      {
        id: "ip3",
        text: "לא, מחפש הזדמנויות נוספות",
        nextNodeId: "income_type",
        scoreDeltas: { investment: 30 },
      },
    ],
  },

  // ─── DEBT PROBE ─────────────────────────────────────────────────────────────
  debt_probe: {
    id: "debt_probe",
    script: "להשלמת התמונה — האם יש לך הלוואות פעילות?",
    answers: [
      {
        id: "dp1",
        text: "כן, כמה הלוואות",
        nextNodeId: "debt_pressure",
        scoreDeltas: { debt_consolidation: 15 },
      },
      {
        id: "dp2",
        text: "כן, אחת קטנה",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 5 },
      },
      {
        id: "dp3",
        text: "לא, אין לי הלוואות",
        nextNodeId: "income_type",
      },
    ],
  },

  debt_pressure: {
    id: "debt_pressure",
    script: "איך אתה מרגיש לגבי ההלוואות האלה?",
    tip: "שים לב לטון — לחץ גדול = פוטנציאל גבוה לאיחוד",
    answers: [
      {
        id: "dpr1",
        text: "לחוץ מאוד, קשה בסוף החודש",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 25, global: 10 },
      },
      {
        id: "dpr2",
        text: "מסתדר אבל לא נעים",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 15 },
      },
      {
        id: "dpr3",
        text: "בנוח לגמרי",
        nextNodeId: "income_type",
        scoreDeltas: { debt_consolidation: 5 },
      },
    ],
  },

  // ─── INCOME TYPE ────────────────────────────────────────────────────────────
  income_type: {
    id: "income_type",
    script: "כמעט סיימנו! מה אופי ההכנסה שלך?",
    answers: [
      {
        id: "it1",
        text: "שכיר (עובד חברה / מוסד)",
        nextNodeId: "closing_pitch",
        scoreDeltas: { global: 10 },
      },
      {
        id: "it2",
        text: "עצמאי / פרילנסר",
        nextNodeId: "closing_pitch",
        scoreDeltas: { global: 8, business_loan: 5 },
      },
      {
        id: "it3",
        text: "בעל עסק",
        nextNodeId: "business_probe",
        scoreDeltas: { business_loan: 20 },
      },
      {
        id: "it4",
        text: "פנסיונר / קצבה",
        nextNodeId: "closing_pitch",
        scoreDeltas: { global: 5 },
      },
    ],
  },

  business_probe: {
    id: "business_probe",
    script: "כבעל עסק — האם העסק צריך מימון כרגע?",
    tip: "בעלי עסקים לרוב צריכים הון חוזר או מימון לצמיחה",
    answers: [
      {
        id: "bp1",
        text: "כן, הון חוזר",
        nextNodeId: "closing_pitch",
        scoreDeltas: { business_loan: 25 },
      },
      {
        id: "bp2",
        text: "כן, לגידול / ציוד / מלאי",
        nextNodeId: "closing_pitch",
        scoreDeltas: { business_loan: 30 },
      },
      {
        id: "bp3",
        text: "לא, העסק בסדר",
        nextNodeId: "closing_pitch",
        scoreDeltas: { business_loan: 10, global: 5 },
      },
    ],
  },

  // ─── CLOSING ────────────────────────────────────────────────────────────────
  closing_pitch: {
    id: "closing_pitch",
    script:
      "מצוין! על סמך כל מה ששיתפת אותי, יש לי כמה רעיונות מעניינים עבורך. אפשר לתאם ייעוץ ממוקד של 30 דקות — בלי עלות ובלי התחייבות?",
    tip: "זה הרגע הכי חשוב — היה נחוש ואנרגטי. חייך!",
    answers: [
      {
        id: "cp1",
        text: "כן, נשמע מצוין!",
        nextNodeId: "end_hot",
        scoreDeltas: { global: 20 },
      },
      {
        id: "cp2",
        text: "אני רוצה לחשוב על זה",
        nextNodeId: "end_warm",
        scoreDeltas: { global: 10 },
      },
      {
        id: "cp3",
        text: "שלח לי מידע בהודעה",
        nextNodeId: "end_info",
        scoreDeltas: { global: 5 },
      },
      {
        id: "cp4",
        text: "לא, תודה",
        nextNodeId: "end_cold",
      },
    ],
  },

  // ─── TERMINAL NODES ─────────────────────────────────────────────────────────
  end_hot: {
    id: "end_hot",
    script:
      "מעולה! אני כבר רושם את הפרטים ואצור קשר בהקדם לתיאום הפגישה. תודה על הזמן שלך!",
    answers: [],
    isTerminal: true,
    terminalType: "hot",
  },
  end_warm: {
    id: "end_warm",
    script:
      "בהחלט, אין לחץ! אני אצור קשר עוד כמה ימים אחרי שתחשוב על זה. אנחנו כאן לכשתהיה מוכן.",
    answers: [],
    isTerminal: true,
    terminalType: "warm",
  },
  end_info: {
    id: "end_info",
    script:
      "כמובן! אשלח לך מידע כללי. אם יהיו שאלות — אני כאן. תודה!",
    answers: [],
    isTerminal: true,
    terminalType: "info",
  },
  end_cold: {
    id: "end_cold",
    script:
      "בהחלט, אין בעיה. אם אי פעם תרצה לבחון אפשרויות — אנחנו כאן. תודה על הזמן!",
    answers: [],
    isTerminal: true,
    terminalType: "cold",
  },
  end_callback: {
    id: "end_callback",
    script:
      "מצוין! אני רושם ואחזור אליך בזמן שציינת. תודה!",
    answers: [],
    isTerminal: true,
    terminalType: "callback",
  },
  end_polite: {
    id: "end_polite",
    script:
      "בהחלט, מובן לגמרי. תודה על הזמן, ואם אי פעם תחשוב שכדאי לבדוק — אנחנו כאן!",
    answers: [],
    isTerminal: true,
    terminalType: "polite",
  },
};

export const INITIAL_NODE_ID = "greeting";

export const TOTAL_NODES_ESTIMATE = 14; // for progress bar
