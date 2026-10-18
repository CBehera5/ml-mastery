const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_DIR;
if (!playwrightRoot) throw new Error("Set PLAYWRIGHT_PACKAGE_DIR to the pinned verification-only Playwright install.");
const { chromium } = require(path.join(playwrightRoot, "index.js"));
const root = path.resolve(__dirname, "..");
const authored = JSON.parse(fs.readFileSync(path.join(root, "apps/web/app/supervised/mlp/authored.json"), "utf8"));
const baseUrl = process.env.MLP_PREVIEW_URL || "http://127.0.0.1:3010";
const evidenceDir = process.env.TASK01511_EVIDENCE || path.join(root, "browser-evidence");
const storageKey = "ml-math-lab:supervised:mlp:full:v1";

async function selectByKeyboard(page, selector, value) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await page.evaluate(() => document.activeElement?.getAttribute("aria-label")) === "NN-E1 configuration") break;
    await page.keyboard.press("Tab");
  }
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "NN-E1 configuration", "Tab order should reach the experiment configuration");
  const values = await page.locator(selector).locator("option").evaluateAll(options => options.map(option => option.value).filter(Boolean));
  const current = await page.locator(selector).inputValue();
  const fromIndex = values.indexOf(current), toIndex = values.indexOf(value);
  assert.ok(fromIndex >= 0 && toIndex >= 0, "keyboard selection values exist");
  const key = toIndex >= fromIndex ? "ArrowDown" : "ArrowUp";
  for (let index = 0; index < Math.abs(toIndex - fromIndex); index++) await page.keyboard.press(key);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(selector).inputValue(), value);
}

async function run() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));

    await page.goto(`${baseUrl}/supervised/mlp`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Introductory Multilayer Perceptrons" }).waitFor();

    await page.keyboard.press("Tab");
    assert.notEqual(await page.evaluate(() => document.activeElement?.tagName), "BODY", "Tab should move focus to a visible control");
    for (let attempt = 0; attempt < 32; attempt++) {
      if (await page.evaluate(href => document.activeElement?.getAttribute("href") === href, "/supervised/mlp/nn01")) break;
      await page.keyboard.press("Tab");
    }
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")), "/supervised/mlp/nn01", "keyboard tab order should reach NN01");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/supervised/mlp/nn01");
    await page.getByRole("heading", { name: /NN01 — Beyond one neuron/ }).waitFor();

    const family = authored.families.find(item => item.id === "NN01.O1.practice.A");
    assert.ok(family && family.atoms.length === family.accepted[0].length, "trusted first practice family exists");
    const practice = page.locator('section[aria-labelledby="practice-0"]');
    for (const [index, atom] of family.atoms.entries()) {
      const answer = family.accepted[0][index];
      assert.equal(atom.kind, "choice", "browser fixture supports only the authored bounded choice in the first practice family");
      const option = atom.options.find(item => item.id === answer.optionId);
      assert.ok(option, "accepted option exists in authored fixture");
      await practice.getByRole("radio", { name: option.label, exact: true }).check();
    }
    await practice.getByRole("button", { name: "Check NN01.O1" }).click();
    await practice.getByRole("status").filter({ hasText: "Answer checked" }).waitFor();
    let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.ok(saved?.practice?.[0]?.proof, "correct practice proof persists locally");

    const select = page.getByLabel("NN-E1 configuration");
    const ids = await select.locator("option").evaluateAll(options => options.map(option => option.value).filter(Boolean));
    assert.ok(ids.length > 1, "bounded experiment exposes multiple reviewed states");
    const current = await select.inputValue();
    const next = ids.find(id => id !== current);
    const response = await page.request.get(`${baseUrl}/api/supervised/mlp/experiment?lab=0&id=${encodeURIComponent(next)}`);
    assert.equal(response.status(), 200, "frozen experiment endpoint responds");
    const payload = await response.json();
    const config = payload.config;
    await selectByKeyboard(page, 'select[aria-label="NN-E1 configuration"]', next);
    await page.getByLabel("Predict before reveal").selectOption(config.correct_prediction_id);
    await page.getByLabel("Predict why").selectOption(config.correct_reason_id);
    await page.getByRole("button", { name: "Reveal reference outcome" }).click();
    await page.getByRole("heading", { name: "Reference outcome" }).waitFor();
    await page.getByRole("button", { name: "Check changed-case explanation" }).click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.ok(saved?.labs?.[0]?.credit, "experiment completion persists after prediction, reveal and explanation");
    await page.reload({ waitUntil: "networkidle" });
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.ok(saved?.practice?.[0]?.proof && saved?.labs?.[0]?.credit, "practice and experiment restore after reload");
    await page.goBack({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Introductory Multilayer Perceptrons" }).waitFor();
    await page.goForward({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /NN01 — Beyond one neuron/ }).waitFor();

    await page.goto(`${baseUrl}/supervised/mlp/mastery`, { waitUntil: "networkidle" });
    await page.getByRole("alert").filter({ hasText: "Module mastery remains unavailable" }).waitFor();
    const disabledAnswers = page.locator("fieldset").filter({ has: page.getByRole("legend", { name: "Independent assessment answers" }) });
    assert.equal(await disabledAnswers.isDisabled(), true, "independent submission remains disabled pending acceptance");
    const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.equal(before.mastery, null, "practice and labs never award mastery");
    await page.reload({ waitUntil: "networkidle" });
    const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.equal(after.mastery, null, "assessment reload preserves disabled mastery state");
    assert.equal(after.scope, "supervised:mlp:full:v1", "saved progress remains version isolated");

    await page.setViewportSize({ width: 320, height: 850 });
    await page.goto(`${baseUrl}/supervised/mlp`, { waitUntil: "networkidle" });
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    assert.equal(widths.viewport, 320);
    assert.ok(widths.content <= widths.viewport, `320px viewport must not overflow horizontally: ${JSON.stringify(widths)}`);
    await page.screenshot({ path: path.join(evidenceDir, "mlp-overview-320.png"), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(evidenceDir, "mlp-overview-desktop.png"), fullPage: true });

    assert.deepEqual(errors, [], "browser console must not report uncaught page errors");
    await context.close();
    console.log(JSON.stringify({ result: "PASS", route: "/supervised/mlp", lesson: "/supervised/mlp/nn01", experiment: "NN-E1", persistence: "practice+lab restored", mastery: "disabled as approved", keyboard: "Tab + Enter navigation and Tab/ArrowDown/Enter configuration selection", viewport: widths, pageErrors: errors.length, screenshots: ["mlp-overview-320.png", "mlp-overview-desktop.png"] }, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
