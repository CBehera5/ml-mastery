const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE_DIR);

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${process.env.MODEL_SELECTION_PREVIEW_URL}/supervised/model-selection`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Model Selection & Comparison" }).waitFor();
  if (process.env.TASK01512_EVIDENCE) {
    fs.mkdirSync(process.env.TASK01512_EVIDENCE, { recursive: true });
    await page.screenshot({ path: path.join(process.env.TASK01512_EVIDENCE, "model-selection-desktop.png"), fullPage: true });
  }
  await page.getByRole("link", { name: /MS01 — Compare models fairly/i }).click();
  const firstPractice = page.getByRole("radio").first();
  await firstPractice.check();
  await page.getByRole("button", { name: "Check MS01.O1" }).click();
  await page.getByRole("status").filter({ hasText: "Correct for practice" }).waitFor();
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
  const initialQuestion = initialPayload.config.predictionQuestion;

  let focused = false;
  for (let index = 0; index < 80; index += 1) {
    await page.keyboard.press("Tab");
    focused = await configuration.evaluate(element => document.activeElement === element);
    if (focused) break;
  }
  assert.equal(focused, true, "native config selector must be reachable using Tab");
  await page.keyboard.press("ArrowDown");
  await page.waitForFunction(previous => document.querySelector('select[aria-label="MS-E1 configuration"]').value !== previous, initial);
  const selected = await configuration.inputValue();
  assert.notEqual(selected, initial, "ArrowDown must change the native selected configuration");
  const selectedResponse = await page.request.get(`${process.env.MODEL_SELECTION_PREVIEW_URL}/api/supervised/model-selection/experiment?lab=0&id=${selected}`);
  assert.equal(selectedResponse.status(), 200);
  const selectedPayload = await selectedResponse.json();
  assert.equal(selectedPayload.config.id, selected);
  assert.notEqual(selectedPayload.config.predictionQuestion, initialQuestion, "selected fixture should present its authored prompt");
  await page.getByText(selectedPayload.config.predictionQuestion, { exact: true }).waitFor();
  await page.getByText(`Selected state: ${selected}. Prior state: ${initial}.`).waitFor();
  await page.getByRole("combobox", { name: "Predict comparison outcome" }).selectOption("fair");
  await page.getByRole("combobox", { name: "Predict why this result is valid" }).selectOption("mechanism");
  await page.getByRole("button", { name: "Reveal reference outcome" }).click();
  await page.getByRole("heading", { name: "Reference outcome" }).waitFor();
  await page.getByText(/Accessible numerical and textual reference trace/).waitFor();
  await page.getByRole("link", { name: /Independent assessment/ }).first().click();
  await page.getByRole("alert").getByText(/mastery remains unavailable/).waitFor();
  assert.equal(await page.getByRole("button", { name: "Review all 24 objective families" }).isDisabled(), true);

  await page.setViewportSize({ width: 320, height: 860 });
  await page.goto(`${process.env.MODEL_SELECTION_PREVIEW_URL}/supervised/model-selection/ms04`, { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  assert.ok(dimensions.content <= dimensions.viewport + 1, `horizontal overflow at 320px: ${JSON.stringify(dimensions)}`);
  if (process.env.TASK01512_EVIDENCE) {
    fs.mkdirSync(process.env.TASK01512_EVIDENCE, { recursive: true });
    await page.screenshot({ path: path.join(process.env.TASK01512_EVIDENCE, "model-selection-mobile-320.png"), fullPage: true });
  }
  assert.deepEqual(errors, [], "browser console should have no page errors");
  console.log(JSON.stringify({ status: "PASS", keyboard: "Tab then native ArrowDown changed experiment configuration", initial, selected, selectedPromptChanged: true, assessment: "mastery remains disabled", viewport320: dimensions, browserErrors: errors.length }));
  await browser.close();
}

main().catch(error => { console.error(error); process.exitCode = 1; });
