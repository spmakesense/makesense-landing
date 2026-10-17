import "server-only";
import fs from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { hasHebrew, visualRuns } from "./bidi";
import type { FullDoc } from "./documents";
import { dateTimeHe, maskId, prettyPhone } from "./format";
import { sha256 } from "./ids";
import { annexBlocks, getTemplate, type Block, type RenderCtx } from "./templates";

const W = 595.28;
const H = 841.89;
const M = 42;
const RIGHT = W - M;
const CONTENT_W = W - 2 * M;

const NAVY = rgb(0x1e / 255, 0x2a / 255, 0x5a / 255);
const TEAL = rgb(0x0f / 255, 0x94 / 255, 0x88 / 255);
const INK = rgb(0.09, 0.1, 0.19);
const MUTE = rgb(0.42, 0.45, 0.56);
const LINE = rgb(0.88, 0.9, 0.94);
const SOFT = rgb(0.96, 0.97, 0.98);

const fontFile = (name: string) => fs.readFileSync(path.join(process.cwd(), "public", "fonts", name));

/**
 * Draws a bidi line right-aligned at `right`, run by run. fontkit's layout already reverses Hebrew glyphs,
 * so RTL runs are passed in logical order and LTR runs (numbers, Latin) as-is.
 */
function drawLine(page: PDFPage, s: string, right: number, y: number, size: number, color: ReturnType<typeof rgb>, font: PDFFont) {
  const runs = visualRuns(s);
  const widths = runs.map((r) => font.widthOfTextAtSize(r.text, size));
  let x = right - widths.reduce((a, b) => a + b, 0);
  runs.forEach((r, i) => {
    // fontkit reverses only runs it detects as Hebrew; RTL runs of bare punctuation are reversed here.
    const text = r.rtl && !hasHebrew(r.text) ? Array.from(r.text).reverse().join("") : r.text;
    if (text.trim()) page.drawText(text, { x, y, size, font, color });
    x += widths[i];
  });
}

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(
    public pdf: PDFDocument,
    public regular: PDFFont,
    public bold: PDFFont,
    public header: string,
  ) {
    this.newPage();
  }

  newPage() {
    this.page = this.pdf.addPage([W, H]);
    this.y = H - M;
    this.page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: TEAL });
    this.text(this.header, RIGHT, H - 24, 8, MUTE);
    this.y = H - 44;
  }

  ensure(space: number) {
    if (this.y - space < M + 24) this.newPage();
  }

  /** Draws one line right-aligned at `right`. */
  text(s: string, right: number, y: number, size: number, color = INK, font = this.regular) {
    drawLine(this.page, s, right, y, size, color, font);
  }

  wrap(s: string, size: number, width: number, font = this.regular): string[] {
    const out: string[] = [];
    for (const para of s.split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const next = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) > width && line) {
          out.push(line);
          line = word;
        } else line = next;
      }
      out.push(line);
    }
    return out;
  }

  para(s: string, size = 10.5, color = INK, font = this.regular, right = RIGHT, width = CONTENT_W) {
    const lh = size * 1.45;
    for (const l of this.wrap(s, size, width, font)) {
      this.ensure(lh);
      this.y -= lh;
      this.text(l, right, this.y, size, color, font);
    }
  }

  gap(n: number) {
    this.y -= n;
  }
}

function drawBlocks(w: Writer, blocks: Block[], c: RenderCtx) {
  for (const b of blocks) {
    switch (b.t) {
      case "h":
        // Keep a heading together with the start of its section.
        w.ensure(90);
        w.gap(14);
        w.para(b.text, 12.5, NAVY, w.bold);
        w.page.drawLine({ start: { x: M, y: w.y - 5 }, end: { x: RIGHT, y: w.y - 5 }, thickness: 0.6, color: LINE });
        w.gap(6);
        break;
      case "p":
        w.gap(4);
        w.para(b.text);
        break;
      case "note":
        w.gap(4);
        w.para(b.text, 9, MUTE);
        break;
      case "kv":
        for (const [k, v] of b.rows) kvRow(w, k, v);
        break;
      case "checks":
        w.gap(2);
        for (const it of b.items) {
          const lines = w.wrap(it.label, 10, CONTENT_W - 22);
          w.ensure(lines.length * 14.5 + 4);
          w.gap(15);
          const box = { x: RIGHT - 10, y: w.y - 1.5, width: 10, height: 10 };
          w.page.drawRectangle({ ...box, borderColor: it.on ? TEAL : MUTE, borderWidth: 1, color: it.on ? TEAL : undefined });
          if (it.on) {
            w.page.drawLine({ start: { x: box.x + 2, y: box.y + 5 }, end: { x: box.x + 4.3, y: box.y + 2.5 }, thickness: 1.4, color: rgb(1, 1, 1) });
            w.page.drawLine({ start: { x: box.x + 4.3, y: box.y + 2.5 }, end: { x: box.x + 8.2, y: box.y + 7.8 }, thickness: 1.4, color: rgb(1, 1, 1) });
          }
          lines.forEach((l, i) => {
            if (i > 0) w.gap(14.5);
            w.text(l, RIGHT - 18, w.y, 10);
          });
          w.gap(2);
        }
        break;
      case "signers":
        c.signers.forEach((s, i) => {
          if (c.signers.length > 1) {
            w.gap(4);
            w.para(`לקוח/ה ${i + 1}`, 9.5, TEAL, w.bold);
          }
          kvRow(w, "שם מלא", s.name || "—");
          kvRow(w, "ת״ז", s.id_number || "—");
          kvRow(w, "טלפון", prettyPhone(s.phone) || "—");
          if (s.address) kvRow(w, "כתובת", s.address);
        });
        break;
    }
  }
}

function kvRow(w: Writer, k: string, v: string) {
  const labelW = 150;
  const lines = w.wrap(v || "—", 10, CONTENT_W - labelW - 12);
  const h = lines.length * 14 + 8;
  w.ensure(h);
  const top = w.y;
  w.page.drawRectangle({ x: RIGHT - labelW, y: top - h, width: labelW, height: h, color: SOFT });
  w.page.drawLine({ start: { x: M, y: top - h }, end: { x: RIGHT, y: top - h }, thickness: 0.5, color: LINE });
  w.text(k, RIGHT - 8, top - 15, 9.5, MUTE);
  lines.forEach((l, i) => w.text(l, RIGHT - labelW - 10, top - 15 - i * 14, 10));
  w.y = top - h;
}

async function embedSig(pdf: PDFDocument, dataUrl: string | null): Promise<PDFImage | null> {
  if (!dataUrl?.startsWith("data:image/png;base64,")) return null;
  return pdf.embedPng(Buffer.from(dataUrl.split(",")[1], "base64"));
}

async function signatureGrid(w: Writer, items: { label: string; sub: string; sig: string | null }[]) {
  const cols = 2;
  const cellW = (CONTENT_W - 20) / cols;
  for (let i = 0; i < items.length; i += cols) {
    w.ensure(110);
    w.gap(14);
    const top = w.y;
    for (let j = 0; j < cols && i + j < items.length; j++) {
      const it = items[i + j];
      const right = RIGHT - j * (cellW + 20);
      const img = await embedSig(w.pdf, it.sig);
      if (img) {
        const s = Math.min(150 / img.width, 54 / img.height);
        w.page.drawImage(img, { x: right - img.width * s, y: top - 58, width: img.width * s, height: img.height * s });
      }
      w.page.drawLine({ start: { x: right - cellW, y: top - 62 }, end: { x: right, y: top - 62 }, thickness: 0.7, color: MUTE });
      w.text(it.label, right, top - 76, 10, INK, w.bold);
      w.text(it.sub, right, top - 90, 8.5, MUTE);
    }
    w.y = top - 96;
  }
}

export async function renderPdf(f: FullDoc, c: RenderCtx): Promise<Uint8Array> {
  const t = getTemplate(f.doc.template)!;
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(f.doc.title);
  pdf.setAuthor(`${f.office.name} – ${f.agent.name ?? ""}`);
  pdf.setProducer("חותמים");
  const regular = await pdf.embedFont(fontFile("Heebo-Regular.ttf"), { subset: true });
  const bold = await pdf.embedFont(fontFile("Heebo-Bold.ttf"), { subset: true });
  const w = new Writer(pdf, regular, bold, `${f.office.name} · ${f.agent.name ?? ""}, רישיון ${f.agent.license ?? ""}`);

  const titleBlock = (title: string) => {
    w.gap(8);
    w.para(title, 19, NAVY, bold);
    w.para(`מסמך ${f.doc.id.slice(0, 8).toUpperCase()} · נוצר ${dateTimeHe(f.doc.created_at)}`, 8.5, MUTE);
    w.gap(4);
  };

  // The personal-interest annex comes first: buyers sign it before the main document.
  if (f.annex) {
    const blocks = annexBlocks(f.annex, c);
    titleBlock((blocks[0] as { text: string }).text);
    drawBlocks(w, [{ t: "h", text: "פרטי הלקוח/ות" }, { t: "signers" }, { t: "h", text: "פרטי הגילוי" }, ...blocks.slice(1)], c);
    await signatureGrid(
      w,
      f.signers.map((s) => ({ label: s.name, sub: `חתם/ה על הנספח ${dateTimeHe(s.annex_signed_at)}`, sig: s.annex_signature })),
    );
    w.newPage();
  }

  titleBlock(t.title);
  drawBlocks(w, t.build(c), c);

  w.ensure(60);
  w.gap(12);
  w.para("הצהרות שאושרו על ידי כל חותם", 12.5, NAVY, bold);
  drawBlocks(w, [{ t: "checks", items: t.consents.map((label) => ({ label, on: true })) }], c);

  w.gap(6);
  await signatureGrid(w, [
    ...f.signers.map((s) => ({ label: s.name, sub: `נחתם ${dateTimeHe(s.signed_at)}`, sig: s.signature })),
    { label: `${f.agent.name ?? ""} (המתווך)`, sub: `רישיון ${f.agent.license ?? ""}`, sig: f.doc.agent_signature },
  ]);

  // Signature certificate.
  w.newPage();
  w.gap(8);
  w.para("תעודת חתימה אלקטרונית", 19, NAVY, bold);
  w.para("תיעוד ראייתי של תהליך החתימה. כל חותם זוהה בקוד חד-פעמי שנשלח לטלפון שלו.", 9.5, MUTE);
  w.gap(6);
  const dataHash = sha256(JSON.stringify({ data: f.data, annex: f.annex, signers: c.signers }));
  drawBlocks(
    w,
    [
      {
        t: "kv",
        rows: [
          ["מסמך", f.doc.title],
          ["מזהה", f.doc.id],
          ["נוצר", `${dateTimeHe(f.doc.created_at)} על ידי ${f.agent.name ?? ""}`],
          ["הושלם", dateTimeHe(f.doc.completed_at)],
          ["טביעת תוכן (SHA-256)", dataHash],
        ],
      },
    ],
    c,
  );
  for (const s of f.signers) {
    const v = JSON.parse(s.values_json);
    let geo = "לא נמסר";
    if (s.geo) {
      const g = JSON.parse(s.geo);
      geo = `${Number(g.lat).toFixed(5)}, ${Number(g.lng).toFixed(5)} · דיוק ${Math.round(g.acc)} מ׳`;
    }
    drawBlocks(
      w,
      [
        { t: "h", text: s.name },
        {
          t: "kv",
          rows: [
            ["ת״ז", maskId(v.id_number)],
            ["טלפון מאומת", `${prettyPhone(s.phone)} · אומת ${dateTimeHe(s.otp_verified_at)}`],
            ["נצפה לראשונה", dateTimeHe(s.viewed_at)],
            ...(f.annex ? ([["חתם על נספח גילוי", dateTimeHe(s.annex_signed_at)]] as [string, string][]) : []),
            ["חתם", dateTimeHe(s.signed_at)],
            ["כתובת IP", s.ip ?? "—"],
            ["מכשיר", (s.user_agent ?? "—").replace(/[()]/g, "").slice(0, 90)],
            ["מיקום", geo],
          ],
        },
      ],
      c,
    );
  }
  w.gap(10);
  w.para("לבדיקה שהקובץ לא שונה מאז החתימה: העלו אותו בעמוד \"אימות מסמך\" באפליקציה.", 9, MUTE);

  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const s = `עמוד ${i + 1} מתוך ${pages.length} · מסמך ${f.doc.id.slice(0, 8).toUpperCase()}`;
    drawLine(p, s, (W + regular.widthOfTextAtSize(s, 8)) / 2, 20, 8, MUTE, regular);
  });

  return pdf.save();
}
