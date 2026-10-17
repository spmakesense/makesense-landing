import { test } from "node:test";
import assert from "node:assert/strict";
import { visualOrder, visualRuns } from "../src/lib/bidi.ts";

test("pure Hebrew is reversed", () => {
  assert.equal(visualOrder("שלום עולם"), "םלוע םולש");
});

test("numbers keep their order inside Hebrew", () => {
  assert.equal(visualOrder("טלפון 054-712-3388"), "054-712-3388 ןופלט");
  assert.equal(visualOrder("בתאריך 17.10.2026 נחתם"), "םתחנ 17.10.2026 ךיראתב");
});

test("currency and percent stick to the number", () => {
  assert.equal(visualOrder("מחיר ₪2,850,000"), "₪2,850,000 ריחמ");
  assert.equal(visualOrder("עמלה 2% בלבד"), "דבלב 2% הלמע");
});

test("brackets are mirrored in RTL runs", () => {
  assert.equal(visualOrder("שלום (עולם)"), "(םלוע) םולש");
});

test("Latin words stay readable", () => {
  assert.equal(visualOrder("שליחה ב WhatsApp עכשיו"), "וישכע WhatsApp ב החילש");
});

test("runs are returned left to right with RTL text in logical order", () => {
  assert.deepEqual(visualRuns("טלפון 054-712-3388"), [
    { rtl: false, text: "054-712-3388" },
    { rtl: true, text: "טלפון " },
  ]);
});

test("brackets around a number inside Hebrew", () => {
  assert.equal(visualOrder("מיום 17.10.2026 עד יום 17.04.2027 (182 ימים)."), ".(םימי 182) 17.04.2027 םוי דע 17.10.2026 םוימ");
});

test("Latin text with numbers stays together", () => {
  assert.equal(visualOrder("מכשיר iPhone 15 חדש"), "שדח iPhone 15 רישכמ");
});
