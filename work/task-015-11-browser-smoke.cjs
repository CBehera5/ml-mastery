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
const diagnostics = { functionalSelection: [], consoleErrors: [], pageErrors: [], requestFailures: [], failure: null };
let activePage = null;
let activeContext = null;
let tracing = false;

function writeDiagnostics() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, "mlp-browser-diagnostics.json"), `${JSON.stringify(diagnostics, null, 2)}\n`);
}

async function captureSelection(page, selector, phase) {
  const state = await page.evaluate(({ selector, phase }) => {
    const select = document.querySelector(selector);
    const active = document.activeElement;
    const section = select?.closest("section");
    return {
      phase,
      url: location.href,
      selectedValue: select?.value ?? null,
      selectedIndex: select?.selectedIndex ?? null,
      disabled: select?.disabled ?? null,
      options: select ? [...select.options].map(option => ({ value: option.value, label: option.label, selected: option.selected })) : [],
      selectOuterHTML: select?.outerHTML ?? null,
      configurationSummary: section ? [...section.querySelectorAll("p")].map(node => node.innerText).filter(value => value.startsWith("Configuration ")) : [],
      activeElement: active ? { tag: active.tagName, id: active.id, ariaLabel: active.getAttribute("aria-label"), role: active.getAttribute("role"), value: "value" in active ? active.value : null, outerHTML: active.outerHTML } : null,
      eventTrace: window.__mlpSelectionEvents ?? []
    };
  }, { selector, phase });
  diagnostics.functionalSelection.push(state);
  writeDiagnostics();
  return state;
}

async function selectConfigurationForFunctionalTest(page, selector, value) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await page.evaluate(() => document.activeElement?.getAttribute("aria-label")) === "NN-E1 configuration") break;
    await page.keyboard.press("Tab");
  }
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "NN-E1 configuration", "Tab order should reach the experiment configuration");
  const select = page.locator(selector);
  await select.evaluate(element => {
    window.__mlpSelectionEvents = [];
    for (const type of ["focus", "blur", "keydown", "keyup", "input", "change"]) {
      element.addEventListener(type, event => window.__mlpSelectionEvents.push({ type, key: "key" in event ? event.key : null, value: element.value, selectedIndex: element.selectedIndex, activeLabel: document.activeElement?.getAttribute("aria-label") ?? null }), true);
    }
  });
  const values = await select.locator("option").evaluateAll(options => options.map(option => option.value).filter(Boolean));
  assert.ok(values.includes(value), "functional selection value exists in the authored option list");
  await captureSelection(page, selector, "before-functional-selection");
  await select.selectOption(value);
  await page.waitForFunction(({ selector, value }) => {
    const element = document.querySelector(selector);
    return element?.value === value && element.closest("section")?.innerText.includes(`Configuration ${value};`);
  }, { selector, value });
  const committed = await captureSelection(page, selector, "functional-selection-committed");
  assert.equal(committed.selectedValue, value, "programmatic functional selection updates the controlled experiment configuration");
  assert.ok(committed.configurationSummary[0]?.includes(value), "selected configuration updates its visible explanation");
}

async function run() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    activeContext = context;
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true, title: "MLP NN-E1 functional configuration selection; manual keyboard verification separate" });
    tracing = true;
    const page = await context.newPage();
    activePage = page;
    const errors = diagnostics.pageErrors;
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") diagnostics.consoleErrors.push(message.text()); });
    page.on("requestfailed", request => diagnostics.requestFailures.push({ url: request.url(), error: request.failure()?.errorText ?? "unknown" }));

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
    await selectConfigurationForFunctionalTest(page, 'select[aria-label="NN-E1 configuration"]', next);
    const comboboxes = page.getByRole("combobox");
    await comboboxes.nth(1).selectOption(config.correct_prediction_id);
    await comboboxes.nth(2).selectOption(config.correct_reason_id);
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
    await page.getByRole("heading", { name: "Independent MLP assessment" }).waitFor();
    const unavailableAlert = page.getByRole("alert").filter({ hasText: "Module mastery remains unavailable" });
    assert.equal(await unavailableAlert.count(), 0, "approved MLP mastery assessment is available");
    const disabledAnswers = page.locator("fieldset").filter({ hasText: "Independent assessment answers" });
    assert.equal(await disabledAnswers.getAttribute("disabled"), null, "independent assessment answers are enabled after activation");
    const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.equal(before.mastery, null, "practice and labs never award mastery");
    await page.reload({ waitUntil: "networkidle" });
    const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.equal(after.mastery, null, "opening an available assessment does not award mastery");
    assert.equal(after.scope, "supervised:mlp:full:v1", "saved progress remains version isolated");

    await page.setViewportSize({ width: 320, height: 850 });
    await page.goto(`${baseUrl}/supervised/mlp`, { waitUntil: "networkidle" });
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    assert.equal(widths.viewport, 320);
    assert.ok(widths.content <= widths.viewport, `320px viewport must not overflow horizontally: ${JSON.stringify(widths)}`);
    await page.screenshot({ path: path.join(evidenceDir, "mlp-overview-320.png"), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(evidenceDir, "mlp-overview-desktop.png"), fullPage: true });

    assert.deepEqual(diagnostics.consoleErrors, [], "browser console must not report console errors");
    assert.deepEqual(errors, [], "browser console must not report uncaught page errors");
    console.log(JSON.stringify({ result: "PASS", route: "/supervised/mlp", lesson: "/supervised/mlp/nn01", experiment: "NN-E1", persistence: "practice+lab restored", mastery: "available at approved policy; no synthetic award", keyboard: "Tab navigation reaches the selector; config state-change verified separately with Playwright selectOption; native keyboard behavior manually verified in the interactive preview", viewport: widths, pageErrors: errors.length, screenshots: ["mlp-overview-320.png", "mlp-overview-desktop.png"] }, null, 2));
  } catch (error) {
    diagnostics.failure = { message: error.message, stack: error.stack };
    if (activePage) await activePage.screenshot({ path: path.join(evidenceDir, "mlp-browser-failure.png"), fullPage: true }).catch(() => {});
    throw error;
  } finally {
    if (tracing && activeContext) {
      await activeContext.tracing.stop({ path: path.join(evidenceDir, "mlp-browser-trace.zip") });
      tracing = false;
    }
    writeDiagnostics();
    if (activeContext) {
      await activeContext.close();
      activeContext = null;
    }
    await browser.close();
  }
}

run().catch(error => {
  diagnostics.failure = { message: error.message, stack: error.stack };
  writeDiagnostics();
  if (activePage) activePage.screenshot({ path: path.join(evidenceDir, "mlp-browser-failure.png"), fullPage: true }).catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
