const { chromium, devices } = require("playwright");
const fs = require("fs");
// End-to-end test of the main flows on a phone viewport. Needs a running app (npm run build && npm start)
// with an empty DATA_DIR, and Playwright installed (npm i -D playwright). Usage: BASE_URL=http://localhost:3000 npm run e2e
const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.argv[2] || "e2e-output";
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
const shot = async (p, name) => p.screenshot({ path: `${OUT}/${String(++n).padStart(2, "0")}-${name}.png`, fullPage: true });

async function draw(p, sel = ".sigpad canvas", nth = 0) {
  const c = p.locator(sel).nth(nth);
  await c.scrollIntoViewIfNeeded();
  const b = await c.boundingBox();
  await p.mouse.move(b.x + 40, b.y + 100);
  await p.mouse.down();
  for (let i = 0; i < 12; i++) await p.mouse.move(b.x + 40 + i * 22, b.y + 100 + (i % 2 ? -35 : 25), { steps: 3 });
  await p.mouse.up();
}

async function signAt(p, url, { id, address, annex, primary }) {
  await p.goto(url);
  if (annex) {
    for (const cb of await p.locator(".chk input").all()) await cb.check();
    await draw(p);
    await p.getByRole("button", { name: "חתמתי – המשך למסמך" }).click();
    await p.getByText("הפרטים שלך").waitFor();
  }
  if (primary) await primary(p);
  await p.getByLabel("מספר תעודת זהות").fill(id);
  if (address) await p.getByLabel(/כתובת מגורים/).fill(address);
  for (const cb of await p.locator(".chk input").all()) await cb.check();
  await draw(p);
  await p.getByRole("button", { name: "חתימה ואישור בקוד SMS" }).click();
  const code = await p.locator(".demo b").textContent();
  await p.locator("input[autocomplete=one-time-code]").fill(code);
  await p.getByRole("button", { name: "אישור וחתימה" }).click();
  await p.getByText("תודה, החתימה התקבלה").waitFor();
}

async function wizard(p, { t, property, signers, fill }) {
  await p.goto(`${BASE}/documents/new?t=${t}&property=${property}`);
  for (const s of signers) {
    if (s.existing) {
      await p.locator("select").first().selectOption({ label: s.existing });
    } else {
      await p.getByPlaceholder("שם מלא").fill(s.name);
      await p.getByPlaceholder("טלפון").fill(s.phone);
      await p.getByRole("button", { name: "הוספה" }).click();
    }
  }
  await p.getByRole("button", { name: "המשך לפרטי המסמך" }).click();
  if (fill) await fill(p);
  await p.getByRole("button", { name: "יצירת המסמך" }).click();
  await p.waitForURL(/\/documents\/[^/]+\?new=1/);
  return p.url().split("/documents/")[1].split("?")[0];
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "he-IL", geolocation: { latitude: 32.0823, longitude: 34.8106 }, permissions: ["geolocation"] });
  const p = await ctx.newPage();
  globalThis.__page = p;
  p.on("pageerror", (e) => console.log("PAGE ERROR", e.message));

  // Login + onboarding
  await p.goto(`${BASE}/`);
  await p.waitForURL(/login/);
  await shot(p, "login");
  await p.getByLabel("מספר טלפון נייד").fill("052-123-4567");
  await p.getByRole("button", { name: "שליחת קוד ב-SMS" }).click();
  const code = await p.locator(".demo b").textContent();
  await p.locator("input[autocomplete=one-time-code]").fill(code);
  await p.getByRole("button", { name: "כניסה" }).click();
  await p.waitForURL(/onboarding/);
  await p.getByLabel("שם מלא").fill("אבי כהן");
  await p.getByLabel("מספר רישיון תיווך").fill("3127845");
  await p.getByLabel("שם המשרד / העסק").fill("אבי כהן נדל״ן");
  await p.getByLabel(/ח.פ./).fill("515123456");
  await draw(p);
  await shot(p, "onboarding");
  await p.getByRole("button", { name: "סיום והתחלה" }).click();
  await p.waitForURL(`${BASE}/`);

  // Google Drive (only with the local Google stand-in: TEST_DRIVE=1, see tests/google-mock.cjs)
  if (process.env.TEST_DRIVE) {
    await p.goto(`${BASE}/settings`);
    await p.getByText("חיבור Google Drive").click();
    await p.getByText("Google Drive חובר").waitFor();
    await shot(p, "drive-connected");
  }

  // Seller client + property
  await p.goto(`${BASE}/clients/new`);
  await p.getByLabel("שם מלא").fill("משה פרץ");
  await p.getByLabel("טלפון נייד").fill("0547778899");
  await p.locator("select[name=kind]").selectOption("seller");
  await p.getByRole("button", { name: "שמירה" }).click();
  await p.waitForURL((u) => /\/clients\/[^/]+$/.test(u.pathname) && !u.pathname.endsWith("/new"));

  await p.goto(`${BASE}/properties/new`);
  await p.getByLabel("רחוב ומספר").fill("ז׳בוטינסקי 112");
  await p.getByLabel("עיר").fill("רמת גן");
  await p.getByLabel("מחיר מבוקש (₪)").fill("2850000");
  await p.getByLabel("חדרים").fill("4");
  await p.getByLabel("מ״ר").fill("110");
  await p.getByLabel("קומה").fill("3/8");
  await p.locator("select[name=owner_client_id]").selectOption({ label: "משה פרץ" });
  await p.getByRole("button", { name: "שמירה" }).click();
  await p.waitForURL((u) => /\/properties\/[^/]+$/.test(u.pathname) && !u.pathname.endsWith("/new"));
  const propertyId = p.url().split("/").pop();

  // Personal interest
  await p.getByText("יש לי קשר למוכר / לנכס").click();
  await p.getByLabel("הקשר").fill("המוכר, משה פרץ, הוא אחי");
  await p.getByRole("button", { name: "שמירה" }).click();
  await p.getByText("נספח גילוי נאות יצורף אוטומטית").waitFor();

  // Exclusivity – seller signs remotely
  const exclId = await wizard(p, { t: "exclusivity", property: propertyId, signers: [] });
  const exclLinks = await p.locator('a[href*="/s/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  const seller = await ctx.browser().newContext({ ...devices["iPhone 13"], locale: "he-IL" });
  const sp = await seller.newPage();
  await signAt(sp, BASE + exclLinks[0].replace("?inperson=1", "").replace(/&back=.*/, ""), { id: "000000018", address: "הרצל 5, רמת גן" });
  await p.goto(`${BASE}/properties/${propertyId}`);
  await shot(p, "property-after-exclusivity");

  // Seller questionnaire (primary signer fills it)
  await wizard(p, { t: "seller_questionnaire", property: propertyId, signers: [] });
  const qLink = (await p.locator('a[href*="/s/"]').first().getAttribute("href")).split("?")[0];
  await signAt(sp, BASE + qLink, {
    id: "000000018",
    primary: async (pg) => {
      await pg.getByLabel("הנכס רשום ב").selectOption("לשכת רישום מקרקעין (טאבו)");
      await pg.getByLabel("שמות הבעלים הרשומים").fill("משה פרץ");
      await pg.getByLabel("כל הבעלים מסכימים לעסקה?").selectOption("כן");
      await pg.getByLabel("מי גר בנכס היום").selectOption("הבעלים");
      const damp = pg.locator(".f", { hasText: "רטיבות, נזילות או עובש" });
      await damp.getByRole("button", { name: "כן" }).click();
      await damp.locator("input").fill("כתם רטיבות בתקרת האמבטיה, טופל ב-2024");
      await pg.getByLabel("ארנונה לחודשיים (₪)").fill("890");
      await shot(pg, "seller-questionnaire");
    },
  });

  // Showing form for two buyers, signed in person (annex first)
  const showId = await wizard(p, {
    t: "showing_form",
    property: propertyId,
    signers: [
      { name: "שירה לוי", phone: "054-712-3388" },
      { name: "יוסי ברק", phone: "052-430-9912" },
    ],
  });
  await shot(p, "doc-ready");
  const links = await p.locator('a[href*="inperson=1"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  await p.goto(BASE + links[0]);
  await shot(p, "annex");
  await signAt(p, BASE + links[0], { id: "000000026", annex: true });
  await shot(p, "signed-thanks");
  await p.goto(`${BASE}/documents/${showId}`);
  await shot(p, "doc-partial");
  await signAt(p, BASE + links[1], { id: "123456782", annex: true });
  await p.goto(`${BASE}/documents/${showId}`);
  await shot(p, "doc-signed");
  await p.getByRole("button", { name: "שליחת העתק" }).click();
  await shot(p, "share-sheet");
  await p.getByRole("button", { name: "SMS" }).click();
  await p.getByText(/נשלח ב-SMS ל-2 נמענים/).waitFor();
  const pdf = await p.request.get(`${BASE}/api/documents/${showId}/pdf`);
  fs.writeFileSync(`${OUT}/showing.pdf`, await pdf.body());

  if (process.env.TEST_DRIVE) {
    await p.getByText("נשמר ב-Google Drive · פתיחה").waitFor();
    const res = await p.request.get(`${process.env.GOOGLE_API_URL}/_files`, { headers: { authorization: "Bearer access-1" } });
    const tree = await res.json();
    const pdfs = tree.filter((f) => f.isPdf);
    const root = tree.find((f) => f.name === "חותמים – הסכמים חתומים");
    const propFolder = tree.find((f) => f.parents.includes(root.id) && f.name.includes("ז׳בוטינסקי 112"));
    if (pdfs.length < 3 || !pdfs.every((f) => f.parents.includes(propFolder.id))) throw new Error("Drive upload check failed: " + JSON.stringify(tree));
    console.log("Drive OK:", pdfs.map((f) => f.name));
  }

  // Buyer info sheet (from questionnaire)
  const infoId = await wizard(p, { t: "buyer_info_sheet", property: propertyId, signers: [{ existing: "שירה לוי · קונה" }] });
  const infoLink = (await p.locator('a[href*="/s/"]').first().getAttribute("href")).split("?")[0];
  await signAt(sp, BASE + infoLink, { id: "000000026", annex: true });
  fs.writeFileSync(`${OUT}/info.pdf`, await (await p.request.get(`${BASE}/api/documents/${infoId}/pdf`)).body());
  fs.writeFileSync(`${OUT}/excl.pdf`, await (await p.request.get(`${BASE}/api/documents/${exclId}/pdf`)).body());

  // Deal
  await p.goto(`${BASE}/deals/new`);
  await p.locator("select[name=property_id]").selectOption({ index: 1 });
  await p.locator("select[name=client_id]").selectOption({ label: "שירה לוי" });
  await p.getByRole("button", { name: "שמירה" }).click();
  await p.waitForURL(/\/deals$/);
  await shot(p, "deals");
  await p.goto(`${BASE}/`);
  await shot(p, "home");
  await p.goto(`${BASE}/clients`);
  await shot(p, "clients");
  await p.goto(`${BASE}/team`);
  await shot(p, "team");
  await p.goto(`${BASE}/verify`);
  await p.locator("input[type=file]").setInputFiles(`${OUT}/showing.pdf`);
  await p.getByRole("button", { name: "בדיקה" }).click();
  await p.getByText("המסמך מקורי ולא שונה").waitFor();
  await shot(p, "verify");
  console.log("E2E OK – screenshots and PDFs in", OUT);
  await browser.close();
})().catch(async (e) => {
  console.error("E2E FAILED", e.message.split("\n")[0]);
  const p = globalThis.__page;
  if (p) {
    console.log("URL", p.url(), "errors on page:", await p.locator(".err").allTextContents());
    await p.screenshot({ path: `${OUT}/fail.png`, fullPage: true });
  }
  process.exit(1);
});
