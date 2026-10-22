const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE_DIR);
// Test-only answer fixtures stay in this verifier; no answers or stored mastery are
// injected into the page. The disposable context earns evidence through the UI.
const Module = require("node:module");
const ts = require("typescript");
const authoredPath = path.resolve("apps/web/app/supervised/model-selection/authored.ts");
const authoredModule = new Module(authoredPath);
authoredModule._compile(ts.transpileModule(fs.readFileSync(authoredPath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, authoredPath);
const independentForm = letter => authoredModule.exports.AUTHORED_FAMILIES.filter(family => family.id.endsWith(`assessment.${letter}`));

async function main() {
  const browser = await chromium.launch({ headless: true, timeout: 15000 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const evidenceDir = process.env.TASK01512_EVIDENCE || process.cwd();
  fs.mkdirSync(evidenceDir, { recursive: true });
  const tracePath = path.join(evidenceDir, "model-selection-browser-trace.zip");
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(20000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  try {
  await page.goto(`${process.env.MODEL_SELECTION_PREVIEW_URL}/supervised/model-selection`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Model Selection & Comparison" }).waitFor();
  await page.screenshot({ path: path.join(evidenceDir, "model-selection-desktop.png"), fullPage: true });
  await page.getByRole("link", { name: /MS01 — Compare models fairly/i }).click();
  const firstPractice = page.getByRole("radio").first();
  await firstPractice.check();
  await page.getByRole("button", { name: "Check MS01.O1" }).click();
  await page.getByRole("status").filter({ hasText: "Answer checked. Compare your reasoning" }).waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ml-math-lab:supervised:model-selection:full:v1")).practice[0].proof !== null), true);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.getByRole("radio").first().isChecked(), true, "practice answer should restore after reload");
  const configuration = page.getByRole("combobox", { name: "MS-E1 configuration" });
  await configuration.waitFor();
  const initial = await configuration.inputValue();
  const initialResponse = await page.request.get(`${process.env.MODEL_SELECTION_PREVIEW_URL}/api/supervised/model-selection/experiment?lab=0&id=${initial}`);
  assert.equal(initialResponse.status(), 200);
  const initialPayload = await initialResponse.json();
  assert.equal(initialPayload.config.id, initial);
  assert.equal(JSON.stringify(initialPayload).includes("sealedTestTargetRows"), false);
  assert.equal(JSON.stringify(initialPayload).includes("testOutcome"), false);
  const initialPrompt = initialPayload.config.predictionQuestion;

  let focused = false;
  for (let index = 0; index < 80; index += 1) {
    await page.keyboard.press("Tab");
    focused = await configuration.evaluate(element => document.activeElement === element);
    if (focused) break;
  }
  assert.equal(focused, true, "native config selector must be reachable using Tab");
  assert.equal(await configuration.evaluate(element => element.matches(":focus-visible")), true, "keyboard focus should have a visible indicator");
  // Native popup keyboard selection is verified separately in the headed browser.
  // macOS headless Chromium did not commit even a plain HTML select in the probe.
  await configuration.selectOption({ index: 1 });
  await page.waitForFunction(previous => document.querySelector('select[aria-label="MS-E1 configuration"]').value !== previous, initial);
  const selected = await configuration.inputValue();
  assert.notEqual(selected, initial, "functional selection must change the configuration");
  const selectedResponse = await page.request.get(`${process.env.MODEL_SELECTION_PREVIEW_URL}/api/supervised/model-selection/experiment?lab=0&id=${selected}`);
  assert.equal(selectedResponse.status(), 200);
  const selectedPayload = await selectedResponse.json();
  assert.equal(selectedPayload.config.id, selected);
  assert.equal(selectedPayload.config.predictionQuestion, initialPrompt, "the authored prompt is shared across fitted candidate states");
  assert.notEqual(selectedPayload.config.reference.configId, initialPayload.config.reference.configId, "selected fixture should load its distinct authored reference state");
  await page.getByText(selectedPayload.config.predictionQuestion, { exact: true }).waitFor();
  await page.getByText(`Selected state: ${selected}. Prior state: ${initial}.`).waitFor();
  await page.getByRole("combobox", { name: "Predict comparison outcome" }).selectOption("fair");
  await page.getByRole("combobox", { name: "Predict why this result is valid" }).selectOption("mechanism");
  await page.getByRole("button", { name: "Reveal reference outcome" }).click();
  await page.getByRole("heading", { name: "Reference outcome" }).waitFor();
  await page.getByText(/Accessible numerical and textual reference trace/).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await configuration.inputValue(), selected, "experiment selection should restore after reload");
  await page.getByRole("heading", { name: "Reference outcome" }).waitFor();
  await page.getByRole("link", { name: /Independent assessment/ }).first().click();
  await page.getByRole("group", { name: "Independent assessment answers" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Review all 24 objective families" }).isEnabled(), true);
  assert.equal(await page.getByText(/mastery remains unavailable/).count(), 0);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ml-math-lab:supervised:model-selection:full:v1")).mastery), null, "practice and experiment replay must not grant mastery");

  await page.goto(`${process.env.MODEL_SELECTION_PREVIEW_URL}/supervised/model-selection/ms04`, { waitUntil: "networkidle" });
  const e2Configuration = page.getByRole("combobox", { name: "MS-E2 configuration" });
  const e2Initial = await e2Configuration.inputValue();
  await e2Configuration.selectOption({ index: 1 });
  await page.waitForFunction(previous => document.querySelector('select[aria-label="MS-E2 configuration"]').value !== previous, e2Initial);
  const e2Selected = await e2Configuration.inputValue();
  const e2Response = await page.request.get(`${process.env.MODEL_SELECTION_PREVIEW_URL}/api/supervised/model-selection/experiment?lab=1&id=${e2Selected}`);
  assert.equal(e2Response.status(), 200);
  const e2Payload = await e2Response.json();
  assert.equal(e2Payload.id, "TASK-015.12-MS-E2-V3");
  assert.equal(e2Payload.fixture_version, "MS-reference-v3-2");
  assert.equal(e2Payload.dataset.rows.find(row => row.rowId === "E2-00-02").features.monthly_charge, 44.001);
  assert.equal(e2Payload.dataset.rows.find(row => row.rowId === "E2-06-02").features.monthly_charge, 74.001);
  assert.equal(JSON.stringify(e2Payload).includes("E2-09-00"), false, "sealed test row IDs must not reach the browser");
  await page.getByText(e2Payload.config.predictionQuestion, { exact: true }).waitFor();
  await page.getByRole("combobox", { name: "Predict comparison outcome" }).selectOption("fair");
  await page.getByRole("combobox", { name: "Predict why this result is valid" }).selectOption("mechanism");
  await page.getByRole("button", { name: "Reveal reference outcome" }).click();
  await page.getByRole("heading", { name: "Reference outcome" }).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await e2Configuration.inputValue(), e2Selected, "MS-E2 configuration should restore after reload");
  await page.getByRole("heading", { name: "Reference outcome" }).waitFor();

  const notebook = await page.request.get(`${process.env.MODEL_SELECTION_PREVIEW_URL}/notebooks/supervised-model-selection.ipynb`);
  assert.equal(notebook.status(), 200);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ml-math-lab:supervised:model-selection:full:v1")).mastery), null, "practice, labs and notebook availability must not synthesize mastery");
  await page.getByRole("link", { name: /Independent assessment/ }).first().click();
  await page.getByRole("button", { name: "Review all 24 objective families" }).click();
  const submitAttempt = page.getByRole("button", { name: "Submit confirmed attempt" });
  assert.equal(await submitAttempt.isDisabled(), true, "unconfirmed independent submission must be blocked");
  await page.getByRole("checkbox", { name: /I reviewed the whole attempt/ }).check();
  await submitAttempt.click();
  await page.getByRole("heading", { name: "Not yet mastered: 0/24" }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Targeted lesson recall", exact: true }).count(), 24);
  await page.getByRole("button", { name: "Retry next independent form" }).click();
  await page.getByRole("heading", { name: "Form B", exact: true }).waitFor();
  const formB = independentForm("B");
  assert.equal(formB.length, 24);
  for (let index = 0; index < formB.length; index++) {
    if ([0, 4, 8, 12].includes(index)) continue; // exactly 20/24; all six gates included
    const family = formB[index];
    for (let atomIndex = 0; atomIndex < family.atoms.length; atomIndex++) {
      const atom = family.atoms[atomIndex], answer = family.accepted[0][atomIndex];
      assert.equal(atom.kind, "choice"); assert.equal(answer.kind, "choice");
      const optionIndex = atom.options.findIndex(option => option.id === answer.optionId);
      await page.locator(`input[name="assessment-${index}-${atom.id}"]`).nth(optionIndex).check();
    }
  }
  await page.getByRole("button", { name: "Review all 24 objective families" }).click();
  assert.equal(await submitAttempt.isDisabled(), true, "each retry needs its own explicit confirmation");
  await page.getByRole("checkbox", { name: /I reviewed the whole attempt/ }).check();
  await submitAttempt.click();
  await page.getByRole("heading", { name: "Mastery demonstrated: 20/24" }).waitFor();
  const earned = await page.evaluate(() => JSON.parse(localStorage.getItem("ml-math-lab:supervised:model-selection:full:v1")).mastery);
  assert.equal(earned.score, 20); assert.equal(earned.form, 1); assert.deepEqual(earned.critical, []);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Mastery demonstrated: 20/24" }).waitFor();
  await page.screenshot({ path: path.join(evidenceDir, "model-selection-activation-20-of-24.png"), fullPage: true });
  await page.getByRole("button", { name: "Retry next independent form" }).click();
  await page.getByRole("heading", { name: "Form C", exact: true }).waitFor();
  await page.getByRole("button", { name: "Review all 24 objective families" }).click();
  await page.getByRole("checkbox", { name: /I reviewed the whole attempt/ }).check();
  await submitAttempt.click();
  await page.getByRole("heading", { name: "Not yet mastered: 0/24" }).waitFor();
  const retained = await page.evaluate(() => JSON.parse(localStorage.getItem("ml-math-lab:supervised:model-selection:full:v1")).mastery);
  assert.deepEqual(retained, earned, "a later failure must retain previously earned mastery");

  await page.setViewportSize({ width: 320, height: 860 });
  await page.goto(`${process.env.MODEL_SELECTION_PREVIEW_URL}/supervised/model-selection/ms04`, { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  assert.ok(dimensions.content <= dimensions.viewport + 1, `horizontal overflow at 320px: ${JSON.stringify(dimensions)}`);
  await page.screenshot({ path: path.join(evidenceDir, "model-selection-mobile-320.png"), fullPage: true });
  assert.deepEqual(errors, [], "browser console should have no page errors");
  console.log(JSON.stringify({ status: "PASS", keyboardFocus: "Tab reaches the native selector with visible focus", configurationChange: "selectOption functional check; native popup keyboard selection is a separate headed-browser check", initial, selected, e2Initial, e2Selected, e2Fixture: "V3", authoredReferenceChanged: true, persistenceRestoration: true, assessment: "activated: unconfirmed blocked; blank A fails; confirmed B 20/24 passes; blank C preserves B mastery", noSyntheticMasteryFromPracticeLabsNotebook: true, disposableTestContext: true, viewport320: dimensions, browserErrors: errors.length }));
  } catch (error) {
    let state = { url: "unavailable", selectedConfiguration: null, focusedElement: null, viewport: null };
    try {
      state = await page.evaluate(() => ({
        url: location.href,
        selectedConfiguration: document.querySelector('select[aria-label="MS-E1 configuration"]')?.value ?? null,
        focusedElement: document.activeElement ? { tag: document.activeElement.tagName, id: document.activeElement.id, label: document.activeElement.getAttribute("aria-label"), text: document.activeElement.textContent?.slice(0, 120) } : null,
        viewport: { width: document.documentElement.clientWidth, contentWidth: document.documentElement.scrollWidth },
      }));
      await page.screenshot({ path: path.join(evidenceDir, "model-selection-browser-failure.png"), fullPage: true });
    } catch {}
    fs.writeFileSync(path.join(evidenceDir, "model-selection-browser-failure.json"), JSON.stringify({ error: String(error), state, consoleErrors: errors }, null, 2) + "\n");
    throw error;
  } finally {
    try { await context.tracing.stop({ path: tracePath }); } catch {}
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
