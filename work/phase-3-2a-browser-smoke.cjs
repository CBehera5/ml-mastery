const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE_DIR);
const base = process.env.PHASE21_PREVIEW_URL || 'http://127.0.0.1:3043';
const out = process.env.PHASE21_EVIDENCE || '.phase32-evidence';
fs.mkdirSync(out, { recursive: true });
(async () => {
 const browser = await chromium.launch({headless: true});
 const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
 // Observe welcome actions separately from the retained demo_started event.
 await context.addInitScript(() => {
  window.__welcomeWrites = [];
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) { window.__welcomeWrites.push({key, value}); return original.call(this, key, value); };
 });
 const page = await context.newPage(); const errors = [];
 page.on('pageerror', e => errors.push(e.message));
 const result = {source: process.env.GITHUB_SHA || 'local', layouts: [], states: [], keyboard: [], persistence: [], screenReader: 'OPEN: real speech verification separate', zoom: 'Actual native browser zoom recorded separately'};
 const button = name => page.getByRole('button', {name, exact: true});
 const skip = () => button('Skip introduction — open full lab').click();
 const replay = () => button('Replay introduction without resetting the model').click();
 const measure = async state => {
  const dimensions = await page.evaluate(() => ({width: innerWidth, scroll: document.documentElement.scrollWidth}));
  assert.ok(dimensions.scroll <= dimensions.width, JSON.stringify({state,...dimensions}));
  result.layouts.push({state,...dimensions});
 };
 const model = () => page.evaluate(() => ({prediction: document.querySelector('[data-testid=prediction]')?.textContent, loss: document.querySelector('[data-testid=loss]')?.textContent, weights: [...document.querySelectorAll('#weight-0,#weight-1,#bias')].map(n => n.value), history: document.querySelector('.history-list')?.textContent, guide: document.querySelector('.lesson-nav')?.textContent, dirty: document.querySelector('.stale')?.textContent}));
 try {
  await page.goto(base+'/demo', {waitUntil: 'networkidle'});
  const welcome = page.getByRole('heading', {name: 'This delivery took 12 minutes.'}); await welcome.waitFor();
  assert.equal(await page.getByRole('spinbutton').count(),0);
  // Keep arbitrary existing raw records; welcome must neither import nor rewrite them.
  await page.evaluate(() => { localStorage.setItem('phase32-preservation-sentinel','unknown-version-raw'); window.__welcomeWrites = []; });
  const snapshot = await model();
  for (const [reason, message] of [['More time','3 minutes shorter'],['Less time','farther from what happened'],['Not sure','without knowing any ML terminology']]) {
   await page.getByRole('radio',{name: reason, exact: true}).check();
   const action = button('Compare my reasoning'); await action.focus(); await page.keyboard.press('Enter');
   assert.ok((await page.getByRole('status').innerText()).includes(message));
   assert.equal(await button('See how 9 was calculated').evaluate(n=>n===document.activeElement),true);
   await button('Review my reasoning').click();
   assert.equal(await page.getByRole('radio',{name:'More time',exact:true}).evaluate(n=>n===document.activeElement),true);
   result.keyboard.push({reason,primaryFocusRetained:true,reviewFocusRestored:true});
  }
  for (const width of [320,390,720,1440]) {
   await page.setViewportSize({width,height:1000}); await measure('reason');
   await page.getByRole('radio',{name:'Not sure',exact:true}).check(); await button('Compare my reasoning').click(); await measure('feedback');
   await button('See how 9 was calculated').click(); await measure('items');
   assert.ok(!(await page.getByRole('status').innerText()).includes('3 km ×'));
   await button('Add the distance contribution').click(); await measure('distance');
   await button('Add the baseline').click(); await measure('baseline');
   assert.ok((await page.getByRole('status').innerText()).includes('2 + 6 + 1 = 9 minutes'));
   await page.screenshot({path:path.join(out,`welcome-${width}.png`),fullPage:true});
   await button('Review my reasoning').click();
  }
  assert.deepEqual(await model(),snapshot);
  assert.deepEqual(await page.evaluate(()=>window.__welcomeWrites),[]);
  await skip(); assert.equal(await page.getByRole('heading',{level:1}).evaluate(n=>n===document.activeElement),true);
  assert.equal(await button('Next').isDisabled(),true);
  await page.getByLabel('Weight w1',{exact:true}).fill('2');
  await page.getByRole('button',{name:/Run forward pass/}).click(); await button('Apply one update').click();
  const changed = await model();
  await page.evaluate(()=>window.__welcomeWrites=[]); await replay();
  assert.equal(await welcome.evaluate(n=>n===document.activeElement),true);
  await skip(); assert.deepEqual(await model(),changed);
  assert.deepEqual(await page.evaluate(()=>window.__welcomeWrites),[]);
  assert.equal(await page.evaluate(()=>localStorage.getItem('phase32-preservation-sentinel')),'unknown-version-raw');
  result.persistence.push('No welcome writes; arbitrary raw record intact; model/history/guide survive replay/skip');
  await replay(); await skip();
  await page.locator('#learning-rate').fill('0'); await page.getByRole('alert').waitFor();
  await replay(); await skip(); assert.equal(await page.locator('#learning-rate').inputValue(),'0');
  assert.equal(await page.getByRole('alert').count(),1); result.states.push('Invalid draft retained');
  assert.deepEqual(errors,[]); result.states.push('All reasoning branches, progressive reference, fresh/modified skip/replay and no new guide awards');
  fs.writeFileSync(path.join(out,'phase32-browser-result.json'),JSON.stringify(result,null,2));
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
