// Formatting helpers shared by server and client code (no Node imports here).

export const KIND_LABEL: Record<string, string> = {
  buyer: "קונה",
  seller: "מוכר",
  tenant: "שוכר",
  landlord: "משכיר",
};

export const TEMP_LABEL: Record<string, string> = { hot: "חם", warm: "פושר", cold: "קר" };

export function money(n: number | null | undefined, compact = false): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (compact && Math.abs(n) >= 1_000_000) return `₪${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (compact && Math.abs(n) >= 10_000) return `₪${Math.round(n / 1000)}K`;
  return `₪${Math.round(n).toLocaleString("en-US")}`;
}

const TZ = "Asia/Jerusalem";

export function dateHe(ts: number | string | null | undefined): string {
  if (!ts) return "—";
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleDateString("he-IL", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
}

export function timeHe(ts: number | null | undefined): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString("he-IL", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
}

export function dateTimeHe(ts: number | null | undefined): string {
  if (!ts) return "—";
  return `${dateHe(ts)} · ${timeHe(ts)}`;
}

export function longDateHe(ts: number): string {
  return new Date(ts).toLocaleDateString("he-IL", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
}

export function ago(ts: number | null | undefined): string {
  if (!ts) return "";
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "עכשיו";
  if (m < 60) return `לפני ${m} דק׳`;
  const h = Math.round(m / 60);
  if (h < 24) return `לפני ${h} ש׳`;
  const d = Math.round(h / 24);
  return d === 1 ? "אתמול" : `לפני ${d} ימים`;
}

/** Normalizes an Israeli phone number to 05XXXXXXXX, or returns null when invalid. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let p = raw.replace(/[^\d+]/g, "");
  if (p.startsWith("+972")) p = "0" + p.slice(4);
  else if (p.startsWith("972")) p = "0" + p.slice(3);
  return /^0\d{8,9}$/.test(p) ? p : null;
}

export function prettyPhone(p: string | null | undefined): string {
  if (!p) return "";
  return p.length === 10 ? `${p.slice(0, 3)}-${p.slice(3, 6)}-${p.slice(6)}` : p;
}

export function intlPhone(p: string): string {
  return "972" + p.replace(/^0/, "");
}

export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Validates an Israeli ID number (9 digits, Luhn-style checksum). */
export function validIsraeliId(raw: string): boolean {
  const id = raw.replace(/\D/g, "");
  if (id.length < 5 || id.length > 9) return false;
  const padded = id.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = Number(padded[i]) * ((i % 2) + 1);
    if (n > 9) n -= 9;
    sum += n;
  }
  return sum % 10 === 0;
}

export function maskId(id: string | null | undefined): string {
  if (!id) return "—";
  return id.length > 4 ? `${id.slice(0, 2)}•••••${id.slice(-2)}` : id;
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 86_400_000);
}

export function todayIso(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function addMonthsIso(iso: string, months: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}
