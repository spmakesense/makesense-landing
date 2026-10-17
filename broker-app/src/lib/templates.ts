// Document templates. Shared by server (PDF, validation) and client (wizard, signing page).
// Legal wording is a working draft based on docs/broker-app/templates – it must be reviewed by a lawyer.

import { addMonthsIso, dateHe, money, todayIso } from "./format";

export type FieldType = "text" | "textarea" | "number" | "money" | "percent" | "date" | "select" | "bool" | "multi" | "issue";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  showIf?: (data: Values) => boolean;
}

export interface Section {
  title: string;
  fields: Field[];
}

export type Values = Record<string, string | number | boolean | string[] | null | undefined>;

export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "kv"; rows: [string, string][] }
  | { t: "checks"; items: { label: string; on: boolean }[] }
  | { t: "signers" }
  | { t: "note"; text: string };

export interface RenderCtx {
  data: Values;
  date: number;
  agent: { name: string; license: string; phone: string };
  office: { name: string; company_id: string | null; address: string | null };
  property: null | {
    address: string;
    city: string | null;
    parcel: string | null;
    kind: string;
    rooms: number | null;
    sqm: number | null;
    floor: string | null;
    price: number | null;
    deal_type: string;
    disclosure: Values | null;
  };
  signers: { name: string; phone: string | null; id_number: string; address: string }[];
}

export interface DefaultsCtx {
  feePct: number;
  feeIncludesVat: boolean;
  property: RenderCtx["property"] & { interest: Interest | null; exclusive_to: string | null; kind: string } | null;
}

export interface Interest {
  type: string;
  relation: string;
  details: string;
}

export interface Template {
  key: string;
  title: string;
  short: string;
  icon: "file" | "eye" | "key" | "shield" | "list" | "info";
  tone: "navy" | "teal" | "amber" | "green" | "gray";
  audience: "buyer" | "seller" | "any";
  multiSigner: boolean;
  needsProperty: boolean;
  signerAddressRequired: boolean;
  fields: Field[];
  /** Filled on the signing page by the first signer (e.g. the seller questionnaire). */
  primarySections?: Section[];
  consents: string[];
  defaults: (c: DefaultsCtx) => Values;
  validate?: (data: Values, c: DefaultsCtx) => string | null;
  /** Buyer-side documents get the personal-interest annex attached automatically. */
  buyerSide: (data: Values) => boolean;
  build: (c: RenderCtx) => Block[];
}

// ---------- shared pieces ----------

export const INTEREST_TYPES = [
  { value: "family_seller", label: "קרבה משפחתית של המתווך למוכר / משכיר" },
  { value: "family_staff", label: "קרבה משפחתית של עובד במשרד למוכר / משכיר" },
  { value: "owner", label: "המתווך או בן משפחתו בעל זכויות בנכס" },
  { value: "company", label: "תאגיד בשליטת המתווך (או שהוא שותף בו) הוא בעל הנכס" },
  { value: "business", label: "קשר עסקי עם המוכר / המשכיר" },
  { value: "third_party", label: "טובת הנאה מגורם שאינו צד לעסקה" },
  { value: "dual", label: "המתווך מייצג גם את המוכר / המשכיר" },
  { value: "other", label: "עניין אחר" },
];

export const MARKETING_ACTIONS = [
  { value: "sign", label: "שילוט – שלט על הנכס או בסמוך לו, או על לוח מודעות ציבורי" },
  { value: "clients_web", label: "פרסום בקרב לקוחות ממאגר המתווך או מודעה באתר אינטרנט" },
  { value: "daily_paper", label: "פרסום בעיתון יומי נפוץ אחד לפחות" },
  { value: "local_paper", label: "פרסום בעיתון מקומי או בעיתון לקהל יעד" },
  { value: "visits", label: "הזמנת רוכשים / שוכרים לביקור בנכס (כולל בית פתוח)" },
  { value: "brokers", label: "הזמנת חמישה מתווכים אחרים לפחות ביישוב לשתף פעולה" },
];

const APARTMENT_KINDS = ["דירה", "דירת גן", "פנטהאוז", "דופלקס", "יחידת דיור", "סטודיו"];

const feeFields: Field[] = [
  {
    key: "fee_mode",
    label: "דמי תיווך",
    type: "select",
    required: true,
    options: [
      { value: "pct", label: "אחוז ממחיר העסקה" },
      { value: "fixed", label: "סכום קבוע" },
      { value: "rent_month", label: "שכר דירה חודשי אחד" },
    ],
  },
  { key: "fee_pct", label: "שיעור דמי התיווך (%)", type: "percent", required: true, showIf: (d) => d.fee_mode === "pct" },
  { key: "fee_fixed", label: "סכום דמי התיווך (₪)", type: "money", required: true, showIf: (d) => d.fee_mode === "fixed" },
  {
    key: "fee_vat",
    label: "מע״מ",
    type: "select",
    required: true,
    options: [
      { value: "plus", label: "בתוספת מע״מ כדין" },
      { value: "incl", label: "כולל מע״מ" },
    ],
  },
];

export function feeText(d: Values): string {
  const vat = d.fee_vat === "incl" ? "כולל מע״מ" : "בתוספת מע״מ כדין";
  if (d.fee_mode === "fixed") return `${money(Number(d.fee_fixed))} ${vat}`;
  if (d.fee_mode === "rent_month") return `סכום השווה לדמי שכירות של חודש אחד, ${vat}`;
  return `${d.fee_pct}% ממחיר העסקה, ${vat}`;
}

const feeDefaults = (c: DefaultsCtx, rent = false): Values => ({
  fee_mode: rent ? "rent_month" : "pct",
  fee_pct: c.feePct,
  fee_vat: c.feeIncludesVat ? "incl" : "plus",
});

function propertyDesc(p: RenderCtx["property"]): string {
  if (!p) return "—";
  const bits = [p.kind, p.rooms ? `${p.rooms} חד׳` : "", p.sqm ? `${p.sqm} מ״ר` : "", p.floor ? `קומה ${p.floor}` : ""];
  return bits.filter(Boolean).join(" · ");
}

function propertyAddress(p: RenderCtx["property"]): string {
  if (!p) return "—";
  return [p.address, p.city].filter(Boolean).join(", ") + (p.parcel ? ` (${p.parcel})` : "");
}

function partiesBlocks(c: RenderCtx): Block[] {
  return [
    { t: "h", text: "פרטי המתווך" },
    {
      t: "kv",
      rows: [
        ["שם המתווך", c.agent.name],
        ["מס׳ רישיון תיווך", c.agent.license],
        ["משרד", [c.office.name, c.office.company_id ? `ח.פ. ${c.office.company_id}` : ""].filter(Boolean).join(" · ")],
        ["כתובת וטלפון", [c.office.address, c.agent.phone].filter(Boolean).join(" · ")],
      ],
    },
    { t: "h", text: "פרטי הלקוח/ות" },
    { t: "signers" },
  ];
}

const ESIGN_CONSENT = "אני מסכים/ה לחתום על מסמך זה בחתימה אלקטרונית ולקבל אותו ואת העתקו באמצעים אלקטרוניים.";
const EXPLAINED_CONSENT = "המתווך הסביר לי בשפה פשוטה את מהות העסקה ואת הפרטים במסמך זה, לפני שחתמתי.";

export function interestLabel(type: string) {
  return INTEREST_TYPES.find((t) => t.value === type)?.label ?? type;
}

/** Blocks of the personal-interest annex (signed before the main document). */
export function annexBlocks(i: Interest, c: RenderCtx): Block[] {
  return [
    { t: "h", text: "נספח גילוי נאות – עניין אישי של המתווך" },
    {
      t: "note",
      text: "לפי סעיף 10 לחוק המתווכים במקרקעין, התשנ״ו-1996 ותקנות המתווכים במקרקעין (אתיקה וחובות מקצועיות), התשפ״ד-2024.",
    },
    {
      t: "kv",
      rows: [
        ["המתווך", `${c.agent.name}, רישיון ${c.agent.license}`],
        ["הנכס", propertyAddress(c.property)],
        ["סוג העניין האישי", interestLabel(i.type)],
        ["הקשר", i.relation || "—"],
        ["פירוט", i.details || "—"],
      ],
    },
    { t: "h", text: "מה הוסבר לי" },
    {
      t: "p",
      text: "בגלל העניין האישי, למתווך עשוי להיות אינטרס שהעסקה תיחתם או שתיחתם בתנאים מסוימים. המתווך ממשיך לחוב כלפיי בחובת נאמנות ויעביר לי כל מידע מהותי על הנכס, גם מידע שאינו נוח לצד השני. אני רשאי/ת לקיים קשר ישיר עם הצד השני, להיעזר בשמאי, עו״ד או מתווך אחר מטעמי, ולא להתקשר בעסקה.",
    },
    {
      t: "checks",
      items: [
        { label: "המתווך גילה לי את העניין האישי המפורט לעיל לפני שהוצג לי הנכס / לפני שחתמתי על מסמך התיווך.", on: true },
        { label: "הבנתי את משמעות הגילוי ואני מסכים/ה להמשיך לקבל שירותי תיווך מהמתווך בעסקה זו.", on: true },
      ],
    },
  ];
}

export const ANNEX_CONSENTS = [
  "המתווך גילה לי את העניין האישי המפורט בנספח לפני שהוצג לי הנכס / לפני שחתמתי.",
  "הבנתי את משמעות הגילוי ואני מסכים/ה להמשיך לקבל שירותי תיווך מהמתווך בעסקה זו.",
];

// ---------- templates ----------

const brokerageOrder: Template = {
  key: "brokerage_order",
  title: "הזמנת שירותי תיווך",
  short: "מכירה · קנייה · השכרה · שכירות",
  icon: "file",
  tone: "navy",
  audience: "any",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: true,
  fields: [
    {
      key: "deal_type",
      label: "סוג העסקה",
      type: "select",
      required: true,
      options: [
        { value: "sale", label: "מכירה (הלקוח מוכר)" },
        { value: "buy", label: "קנייה (הלקוח קונה)" },
        { value: "let", label: "השכרה (הלקוח משכיר)" },
        { value: "rent", label: "שכירות (הלקוח שוכר)" },
      ],
    },
    { key: "price", label: "מחיר משוער (₪)", type: "money", required: true },
    ...feeFields,
    { key: "exclusive", label: "ניתנה בלעדיות בהסכם בלעדיות נפרד", type: "bool" },
    { key: "dual_rep", label: "המתווך מייצג גם את הצד השני (בהסכמת שני הצדדים בכתב)", type: "bool" },
    { key: "third_party", label: "תשלום / טובת הנאה מגורם שאינו צד לעסקה (ריק = אין)", type: "text" },
    { key: "notes", label: "תנאים נוספים", type: "textarea" },
  ],
  consents: [EXPLAINED_CONSENT, ESIGN_CONSENT],
  defaults: (c) => {
    const rent = c.property?.deal_type === "rent";
    return { deal_type: rent ? "rent" : "buy", price: c.property?.price ?? "", ...feeDefaults(c, rent) };
  },
  buyerSide: (d) => d.deal_type === "buy" || d.deal_type === "rent",
  build: (c) => {
    const d = c.data;
    const dealLabel = brokerageOrder.fields[0].options!.find((o) => o.value === d.deal_type)?.label ?? "—";
    return [
      { t: "note", text: "לפי חוק המתווכים במקרקעין, התשנ״ו-1996 ותקנות המתווכים במקרקעין (פרטי הזמנה בכתב), התשנ״ז-1997." },
      ...partiesBlocks(c),
      { t: "h", text: "העסקה והנכס" },
      {
        t: "kv",
        rows: [
          ["סוג העסקה", dealLabel],
          ["כתובת הנכס", propertyAddress(c.property)],
          ["תיאור הנכס", propertyDesc(c.property)],
          ["מחיר משוער", money(Number(d.price))],
        ],
      },
      { t: "h", text: "דמי תיווך" },
      {
        t: "p",
        text: `הלקוח ישלם למתווך דמי תיווך בשיעור/בסך ${feeText(d)}. דמי התיווך ישולמו במועד חתימת הסכם מחייב בין הצדדים לעסקה (לרבות זיכרון דברים מחייב).`,
      },
      { t: "h", text: "התחייבויות והצהרות" },
      {
        t: "checks",
        items: [
          { label: "המתווך יפעל בנאמנות ובמיומנות ויעביר ללקוח כל מידע מהותי הידוע לו על הנכס ועל העסקה.", on: true },
          {
            label: d.third_party ? `המתווך יקבל תשלום / טובת הנאה מגורם שאינו צד לעסקה: ${d.third_party}` : "המתווך לא יקבל תשלום או טובת הנאה מגורם שאינו צד לעסקה.",
            on: true,
          },
          { label: d.dual_rep ? "המתווך מייצג גם את הצד השני לעסקה, והלקוח מסכים לכך." : "המתווך מייצג בעסקה זו את הלקוח בלבד.", on: true },
          { label: d.exclusive ? "ניתנה למתווך בלעדיות לפי הסכם בלעדיות נפרד." : "ההזמנה אינה בלעדית.", on: true },
          { label: "הלקוח רשאי לקיים קשר ישיר עם הצד השני לעסקה, והמתווך לא ימנע זאת.", on: true },
          {
            label: "הלקוח לא יעביר מידע שקיבל מהמתווך לצד שלישי לצורך עקיפת המתווך. עשה כן – ייחשב כמי שהתקשר בעסקה באמצעות המתווך, ככל שהדין מאפשר.",
            on: true,
          },
        ],
      },
      ...(d.notes ? ([{ t: "h", text: "תנאים נוספים" }, { t: "p", text: String(d.notes) }] as Block[]) : []),
    ];
  },
};

const showingForm: Template = {
  key: "showing_form",
  title: "טופס הצגת נכס",
  short: "ללקוחות בסיור · תומך בכמה חותמים",
  icon: "eye",
  tone: "teal",
  audience: "buyer",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: false,
  fields: [
    {
      key: "deal_type",
      label: "הלקוחות מעוניינים",
      type: "select",
      required: true,
      options: [
        { value: "buy", label: "לקנות" },
        { value: "rent", label: "לשכור" },
      ],
    },
    { key: "price", label: "מחיר מבוקש (₪)", type: "money", required: true },
    ...feeFields,
  ],
  consents: [EXPLAINED_CONSENT, ESIGN_CONSENT],
  defaults: (c) => {
    const rent = c.property?.deal_type === "rent";
    return { deal_type: rent ? "rent" : "buy", price: c.property?.price ?? "", ...feeDefaults(c, rent) };
  },
  buyerSide: () => true,
  build: (c) => {
    const d = c.data;
    const verb = d.deal_type === "rent" ? "לשכירת" : "לרכישת";
    return [
      { t: "note", text: "הזמנת שירותי תיווך לפי חוק המתווכים במקרקעין, התשנ״ו-1996 ותקנות פרטי הזמנה בכתב, התשנ״ז-1997." },
      ...partiesBlocks(c),
      { t: "h", text: "הנכס שהוצג" },
      {
        t: "kv",
        rows: [
          ["כתובת", propertyAddress(c.property)],
          ["תיאור", propertyDesc(c.property)],
          ["מחיר מבוקש", money(Number(d.price))],
          ["תאריך ההצגה", dateHe(c.date)],
        ],
      },
      { t: "h", text: "הצהרת הלקוח" },
      {
        t: "p",
        text: `אני/אנו הח״מ מאשר/ים כי המתווך הציג בפנינו את הנכס שלעיל, והזמנו ממנו שירותי תיווך ${verb} הנכס. היה ונתקשר בהסכם ${verb} הנכס, במישרין או בעקיפין, נשלם למתווך דמי תיווך בשיעור/בסך ${feeText(d)}, במועד חתימת הסכם מחייב.`,
      },
      {
        t: "checks",
        items: [
          { label: "לא נעביר את המידע על הנכס לצד שלישי לצורך עקיפת המתווך.", on: true },
          { label: "אם הנכס הוצג לנו בעבר על ידי מתווך אחר – נודיע על כך למתווך מיד.", on: true },
          { label: "אנו רשאים לקיים קשר ישיר עם בעל הנכס, והמתווך לא ימנע זאת.", on: true },
        ],
      },
    ];
  },
};

const exclusivity: Template = {
  key: "exclusivity",
  title: "הסכם בלעדיות",
  short: "לבעל הנכס · פעולות שיווק ותאריך סיום",
  icon: "key",
  tone: "amber",
  audience: "seller",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: true,
  fields: [
    {
      key: "deal_type",
      label: "סוג העסקה",
      type: "select",
      required: true,
      options: [
        { value: "sale", label: "מכירה" },
        { value: "let", label: "השכרה" },
      ],
    },
    { key: "price", label: "מחיר מבוקש (₪)", type: "money", required: true },
    { key: "from", label: "תחילת הבלעדיות", type: "date", required: true },
    { key: "to", label: "סיום הבלעדיות", type: "date", required: true, help: "בדירה – עד 6 חודשים מיום ההזמנה" },
    { key: "marketing", label: "פעולות שיווק (לפחות 2)", type: "multi", required: true, options: MARKETING_ACTIONS },
    { key: "extra_action", label: "פעולה נוספת שהוסכמה", type: "text" },
    ...feeFields,
    {
      key: "report_every",
      label: "דיווח לבעל הנכס",
      type: "select",
      options: [
        { value: "week", label: "כל שבוע" },
        { value: "2weeks", label: "כל שבועיים" },
        { value: "month", label: "כל חודש" },
      ],
    },
  ],
  consents: [
    "קראתי, המתווך הסביר לי את משמעות הבלעדיות ותקופתה, ואני מאשר/ת אותן בחתימתי על מסמך נפרד זה.",
    ESIGN_CONSENT,
  ],
  defaults: (c) => {
    const from = todayIso();
    const rent = c.property?.deal_type === "rent";
    return {
      deal_type: rent ? "let" : "sale",
      price: c.property?.price ?? "",
      from,
      to: addMonthsIso(from, 6),
      marketing: ["sign", "clients_web"],
      report_every: "2weeks",
      ...feeDefaults(c, rent),
    };
  },
  validate: (d, c) => {
    const actions = Array.isArray(d.marketing) ? d.marketing : [];
    if (actions.length < 2) return "יש לבחור לפחות 2 פעולות שיווק";
    if (!d.from || !d.to || String(d.to) <= String(d.from)) return "תאריך הסיום חייב להיות אחרי תאריך ההתחלה";
    const isApartment = APARTMENT_KINDS.includes(c.property?.kind ?? "דירה");
    if (isApartment && String(d.to) > addMonthsIso(String(d.from), 6)) return "בדירה, תקופת הבלעדיות לא תעלה על 6 חודשים";
    return null;
  },
  buyerSide: () => false,
  build: (c) => {
    const d = c.data;
    const actions = Array.isArray(d.marketing) ? (d.marketing as string[]) : [];
    const days = d.from && d.to ? Math.round((new Date(String(d.to)).getTime() - new Date(String(d.from)).getTime()) / 86_400_000) : 0;
    const third = d.from ? new Date(new Date(String(d.from)).getTime() + (days / 3) * 86_400_000) : null;
    const report = exclusivity.fields.find((f) => f.key === "report_every")!.options!.find((o) => o.value === d.report_every)?.label ?? "כל שבועיים";
    return [
      { t: "note", text: "מסמך נפרד להזמנת שירותי התיווך – לפי סעיף 9 לחוק המתווכים במקרקעין ותקנות המתווכים במקרקעין (פעולות שיווק), התשס״ה-2004." },
      ...partiesBlocks(c),
      { t: "h", text: "הנכס" },
      {
        t: "kv",
        rows: [
          ["כתובת", propertyAddress(c.property)],
          ["תיאור", propertyDesc(c.property)],
          ["סוג העסקה", d.deal_type === "let" ? "השכרה" : "מכירה"],
          ["מחיר מבוקש", money(Number(d.price))],
        ],
      },
      { t: "h", text: "תקופת הבלעדיות" },
      { t: "p", text: `מיום ${dateHe(String(d.from))} עד יום ${dateHe(String(d.to))} (${days} ימים). בדירה – התקופה לא תעלה על 6 חודשים מיום ההזמנה.` },
      { t: "h", text: "פעולות שיווק שהמתווך מתחייב לבצע (לפחות שתיים)" },
      {
        t: "checks",
        items: [
          ...MARKETING_ACTIONS.map((a) => ({ label: a.label, on: actions.includes(a.value) })),
          ...(d.extra_action ? [{ label: `פעולה נוספת: ${d.extra_action}`, on: true }] : []),
        ],
      },
      {
        t: "note",
        text: `חשוב לבעל הנכס: אם המתווך לא ביצע את פעולות השיווק עד תום שליש מתקופת הבלעדיות${third ? ` (${dateHe(third.getTime())})` : ""} – הבלעדיות מסתיימת באותו מועד.`,
      },
      { t: "h", text: "דמי תיווך בבלעדיות" },
      {
        t: "p",
        text: `אם בתקופת הבלעדיות ייחתם הסכם מחייב ${d.deal_type === "let" ? "להשכרת" : "למכירת"} הנכס – באמצעות המתווך, בעל הנכס או מתווך אחר – ישלם בעל הנכס למתווך דמי תיווך בשיעור/בסך ${feeText(d)}. בעל הנכס יפנה למתווך כל פונה שיתעניין בנכס בתקופת הבלעדיות.`,
      },
      { t: "h", text: "דיווח" },
      { t: "p", text: `המתווך יעדכן את בעל הנכס על פעולות השיווק ועל פניות: ${report}.` },
    ];
  },
};

const ISSUE_YES = "yes";

function issue(key: string, label: string): Field {
  return { key, label, type: "issue" };
}

const questionnaireSections: Section[] = [
  {
    title: "בעלות ורישום",
    fields: [
      {
        key: "reg_type",
        label: "הנכס רשום ב",
        type: "select",
        required: true,
        options: ["לשכת רישום מקרקעין (טאבו)", "רשות מקרקעי ישראל", "חברה משכנת", "לא רשום", "לא ידוע"].map((v) => ({ value: v, label: v })),
      },
      { key: "owners", label: "שמות הבעלים הרשומים", type: "text", required: true },
      {
        key: "all_agree",
        label: "כל הבעלים מסכימים לעסקה?",
        type: "select",
        required: true,
        options: ["כן", "לא"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "sale_kind",
        label: "אופן המכירה",
        type: "select",
        options: ["רגיל", "ירושה / עזבון", "ייפוי כוח", "כונס נכסים", "אחר"].map((v) => ({ value: v, label: v })),
      },
      issue("mortgage", "משכנתא על הנכס"),
      issue("liens", "עיקולים, שעבודים או הערות אזהרה לטובת אחרים"),
      issue("legal", "הליכים משפטיים / תביעות הקשורים לנכס או לבניין"),
    ],
  },
  {
    title: "מצב פיזי – גילוי ליקויים",
    fields: [
      issue("dampness", "רטיבות, נזילות או עובש"),
      issue("violations", "חריגות בנייה או שינויים ללא היתר"),
      issue("plumbing", "ליקויים בצנרת מים או ביוב"),
      issue("electric", "ליקויים בחשמל"),
      issue("gas", "ליקויים בגז"),
      issue("cracks", "סדקים, בעיות מבנה או שקיעות"),
      issue("roof", "בעיות איטום בגג או במרפסות"),
      issue("pests", "מזיקים (טרמיטים, מכרסמים)"),
      issue("nuisance", "רעש או מטרד קבוע ידוע"),
      issue("building", "ליקויים בבניין / בשטחים המשותפים"),
      { key: "renovations", label: "שיפוצים שבוצעו (מה, מתי, האם עם היתר)", type: "textarea" },
    ],
  },
  {
    title: "תכנון וסביבה",
    fields: [
      issue("urban_renewal", "תמ״א 38 / פינוי-בינוי / התחדשות עירונית"),
      issue("orders", "צווי הריסה, קנסות או דרישות עירייה"),
      issue("plans", "תכניות בנייה או הפקעות ידועות בסביבה"),
    ],
  },
  {
    title: "תשלומים",
    fields: [
      { key: "arnona", label: "ארנונה לחודשיים (₪)", type: "money" },
      { key: "vaad", label: "ועד בית לחודש (₪)", type: "money" },
      issue("debts", "חובות פתוחים (ארנונה, מים, ועד, היטלים)"),
    ],
  },
  {
    title: "אכלוס ומסירה",
    fields: [
      {
        key: "occupant",
        label: "מי גר בנכס היום",
        type: "select",
        required: true,
        options: ["הבעלים", "שוכר", "ריק"].map((v) => ({ value: v, label: v })),
      },
      { key: "lease_end", label: "חוזה השכירות מסתיים ב", type: "date", showIf: (d) => d.occupant === "שוכר" },
      { key: "handover", label: "מועד מסירה אפשרי", type: "text" },
      { key: "inclusions", label: "מה נשאר בנכס (מזגנים, מטבח, ריהוט…)", type: "textarea" },
    ],
  },
  {
    title: "סירוב למסירת מידע",
    fields: [{ key: "refused", label: "נושאים שאני מסרב/ת למסור עליהם מידע (ריק = אין)", type: "text" }],
  },
];

export const issueFields = questionnaireSections.flatMap((s) => s.fields).filter((f) => f.type === "issue");

function issueText(d: Values | null, key: string): string {
  if (!d) return "—";
  return d[key] === ISSUE_YES ? `כן – ${d[`${key}_details`] || "ללא פירוט"}` : "לא ידוע על כך";
}

const sellerQuestionnaire: Template = {
  key: "seller_questionnaire",
  title: "שאלון מוכר – גילוי נאות",
  short: "למוכר · + דף מידע אוטומטי לקונה",
  icon: "list",
  tone: "gray",
  audience: "seller",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: false,
  fields: [],
  primarySections: questionnaireSections,
  consents: [
    "אני מצהיר/ה שהתשובות נכונות ומלאות למיטב ידיעתי, ושאעדכן את המתווך בכל שינוי.",
    "ידוע לי שהמתווך חייב למסור מידע זה לקונים / שוכרים פוטנציאליים, ואני מסכים/ה שיעביר אותו.",
    "ידוע לי שהסתרת מידע מהותי על הנכס עלולה להטיל עליי אחריות כלפי הקונה.",
    ESIGN_CONSENT,
  ],
  defaults: () => ({}),
  buyerSide: () => false,
  build: (c) => {
    const d = c.data;
    return [
      { t: "note", text: "ממולא על ידי בעל הנכס עם מסירת הנכס לשיווק. התשובות יוצרות את דף המידע שהקונה / השוכר מקבל." },
      ...partiesBlocks(c),
      { t: "h", text: "הנכס" },
      { t: "kv", rows: [["כתובת", propertyAddress(c.property)], ["תיאור", propertyDesc(c.property)]] },
      ...questionnaireSections.flatMap((s): Block[] => [
        { t: "h", text: s.title },
        {
          t: "kv",
          rows: s.fields
            .filter((f) => !f.showIf || f.showIf(d))
            .map((f): [string, string] => {
              if (f.type === "issue") return [f.label, issueText(d, f.key)];
              if (f.type === "money") return [f.label, d[f.key] ? money(Number(d[f.key])) : "—"];
              if (f.type === "date") return [f.label, d[f.key] ? dateHe(String(d[f.key])) : "—"];
              return [f.label, d[f.key] ? String(d[f.key]) : "—"];
            }),
        },
      ]),
    ];
  },
};

const buyerInfoSheet: Template = {
  key: "buyer_info_sheet",
  title: "דף מידע על הנכס לקונה",
  short: "לקונה / שוכר · נוצר משאלון המוכר",
  icon: "info",
  tone: "green",
  audience: "buyer",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: false,
  fields: [
    {
      key: "sources",
      label: "המתווך בדק בעצמו",
      type: "multi",
      options: [
        { value: "tabu", label: "נסח טאבו" },
        { value: "rights", label: "אישור זכויות" },
        { value: "permit", label: "תיק בניין / היתר" },
        { value: "visit", label: "ביקור בנכס" },
      ],
    },
    { key: "extra", label: "מידע מהותי נוסף שידוע למתווך", type: "textarea" },
  ],
  consents: [
    "קיבלתי את המידע שבדף זה והמתווך הסביר לי אותו בשפה פשוטה.",
    "ידוע לי שהמידע נמסר כפי שהוא ידוע למתווך ולבעל הנכס, ושעליי לבצע בדיקות עצמאיות.",
    ESIGN_CONSENT,
  ],
  defaults: () => ({ sources: ["visit"] }),
  validate: (_d, c) => (c.property?.disclosure ? null : "לנכס אין עדיין שאלון מוכר חתום. שלחו קודם שאלון מוכר לבעל הנכס."),
  buyerSide: () => true,
  build: (c) => {
    const q = c.property?.disclosure ?? null;
    const p = c.property;
    const src = (Array.isArray(c.data.sources) ? (c.data.sources as string[]) : [])
      .map((s) => buyerInfoSheet.fields[0].options!.find((o) => o.value === s)?.label)
      .filter(Boolean)
      .join(", ");
    const v = (k: string) => (q && q[k] ? String(q[k]) : "—");
    return [
      { t: "note", text: "נמסר לקונה / לשוכר לפי חובות הגילוי של המתווך (תקנות המתווכים במקרקעין (אתיקה וחובות מקצועיות), התשפ״ד-2024)." },
      ...partiesBlocks(c),
      { t: "h", text: "מקור המידע" },
      {
        t: "p",
        text: `המידע נמסר על ידי בעל הנכס בשאלון מוכר חתום${src ? `, ונבדק על ידי המתווך: ${src}` : ""}. המתווך אינו מהנדס, שמאי או עו״ד – מומלץ לבצע בדיקה הנדסית ומשפטית עצמאית לפני חתימה על הסכם.`,
      },
      { t: "h", text: "מידע על הנכס" },
      {
        t: "kv",
        rows: [
          ["כתובת", propertyAddress(p)],
          ["תיאור ושטח", propertyDesc(p)],
          ["רישום", v("reg_type")],
          ["בעלים רשומים", v("owners")],
          ["משכנתא / שעבוד", issueText(q, "mortgage")],
          ["עיקולים והערות אזהרה", issueText(q, "liens")],
          ["רטיבות", issueText(q, "dampness")],
          ["חריגות בנייה", issueText(q, "violations")],
          ["ליקויים בתשתיות (מים, ביוב)", issueText(q, "plumbing")],
          ["חשמל", issueText(q, "electric")],
          ["גז", issueText(q, "gas")],
          ["סדקים / מבנה", issueText(q, "cracks")],
          ["איטום", issueText(q, "roof")],
          ["תביעות והליכים", issueText(q, "legal")],
          ["התחדשות עירונית", issueText(q, "urban_renewal")],
          ["צווים ודרישות עירייה", issueText(q, "orders")],
          ["מחזיק בנכס היום", v("occupant")],
          ["ארנונה / ועד בית", `${q?.arnona ? money(Number(q.arnona)) : "—"} לחודשיים / ${q?.vaad ? money(Number(q.vaad)) : "—"} לחודש`],
          ["חובות פתוחים", issueText(q, "debts")],
          ["מידע נוסף מהמתווך", c.data.extra ? String(c.data.extra) : "—"],
        ],
      },
      ...(q?.refused ? ([{ t: "note", text: `בעל הנכס סירב למסור מידע בנושאים: ${q.refused}. המתווך עשה מאמץ סביר לקבלו.` }] as Block[]) : []),
    ];
  },
};

const interestAnnex: Template = {
  key: "interest_annex",
  title: "נספח גילוי נאות – עניין אישי",
  short: "לקונה / שוכר · למשל קרבה משפחתית למוכר",
  icon: "shield",
  tone: "green",
  audience: "buyer",
  multiSigner: true,
  needsProperty: true,
  signerAddressRequired: false,
  fields: [
    { key: "type", label: "סוג העניין האישי", type: "select", required: true, options: INTEREST_TYPES },
    { key: "relation", label: "הקשר (למשל: המוכר הוא אחי)", type: "text", required: true },
    { key: "details", label: "פירוט", type: "textarea" },
  ],
  consents: [...ANNEX_CONSENTS, ESIGN_CONSENT],
  defaults: (c) => ({ type: c.property?.interest?.type ?? "family_seller", relation: c.property?.interest?.relation ?? "", details: c.property?.interest?.details ?? "" }),
  // The annex itself is never wrapped in another annex.
  buyerSide: () => false,
  build: (c) => [...partiesBlocks(c), ...annexBlocks({ type: String(c.data.type), relation: String(c.data.relation ?? ""), details: String(c.data.details ?? "") }, c).slice(1)],
};

export const TEMPLATES: Template[] = [showingForm, brokerageOrder, exclusivity, interestAnnex, sellerQuestionnaire, buyerInfoSheet];

export function getTemplate(key: string): Template | undefined {
  return TEMPLATES.find((t) => t.key === key);
}

/** Fields the agent fills that are currently visible and required but empty. */
export function missingFields(fields: Field[], data: Values): Field[] {
  return fields.filter((f) => {
    if (!f.required || (f.showIf && !f.showIf(data))) return false;
    const v = data[f.key];
    if (f.type === "multi") return !Array.isArray(v) || v.length === 0;
    return v === undefined || v === null || v === "";
  });
}
