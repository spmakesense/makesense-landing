// Minimal bidi support (a subset of the Unicode Bidirectional Algorithm) for drawing right-to-left Hebrew
// lines in a PDF: Hebrew with embedded numbers, phone numbers, dates, amounts and Latin words. Paragraph is RTL.

type Dir = "R" | "L" | "E" | "N"; // Hebrew, Latin, European number, neutral

const HEB = /[֐-׿יִ-ﭏ]/;
const LATIN = /[A-Za-zÀ-ɏ]/;
const DIGIT = /[0-9]/;
const SEPARATOR = /[.,:/\-+]/; // a single separator between digits is part of the number
const STICKY = /[%‰₪$€°]/; // symbols that belong to an adjacent number
const MIRROR: Record<string, string> = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<" };

export const hasHebrew = (s: string) => HEB.test(s);

export interface Run {
  rtl: boolean;
  /** Logical (typed) order. RTL runs already have their brackets mirrored. */
  text: string;
}

/** Splits a line into direction runs, ordered left to right as they appear on the page. */
export function visualRuns(line: string): Run[] {
  const chars = Array.from(line);
  const t: Dir[] = chars.map((c) => (HEB.test(c) ? "R" : LATIN.test(c) ? "L" : DIGIT.test(c) ? "E" : "N"));

  for (let i = 1; i < chars.length - 1; i++) {
    if (t[i] === "N" && SEPARATOR.test(chars[i]) && t[i - 1] === "E" && t[i + 1] === "E") t[i] = "E";
  }
  for (let i = 0; i < chars.length; i++) {
    if (STICKY.test(chars[i]) && (t[i - 1] === "E" || t[i + 1] === "E")) t[i] = "E";
  }
  // A number that follows Latin text belongs to it (e.g. "iPhone 15", "a3f9").
  let lastStrong: Dir = "R";
  for (let i = 0; i < chars.length; i++) {
    if (t[i] === "R" || t[i] === "L") lastStrong = t[i];
    else if (t[i] === "E" && lastStrong === "L") t[i] = "L";
  }
  // Neutrals take the direction of their surroundings when both sides agree (numbers count as RTL), else RTL.
  const strong = (d: Dir) => (d === "L" ? "L" : "R");
  for (let i = 0; i < chars.length; ) {
    if (t[i] !== "N") {
      i++;
      continue;
    }
    let j = i;
    while (j < chars.length && t[j] === "N") j++;
    const prev = i > 0 ? strong(t[i - 1]) : "R";
    const next = j < chars.length ? strong(t[j]) : "R";
    const dir: Dir = prev === "L" && next === "L" ? "L" : "R";
    for (let k = i; k < j; k++) t[k] = dir;
    i = j;
  }

  // Group: R runs are right-to-left; L and E runs are left-to-right. A number never merges into Latin text here.
  const runs: (Run & { kind: Dir })[] = [];
  chars.forEach((c, i) => {
    const kind = t[i];
    const rtl = kind === "R";
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.text += rtl ? (MIRROR[c] ?? c) : c;
    else runs.push({ kind, rtl, text: rtl ? (MIRROR[c] ?? c) : c });
  });
  return runs.reverse().map(({ rtl, text }) => ({ rtl, text }));
}

/** The full line in visual (left-to-right) order – used for tests and plain-text output. */
export function visualOrder(line: string): string {
  return visualRuns(line)
    .map((r) => (r.rtl ? Array.from(r.text).reverse().join("") : r.text))
    .join("");
}
