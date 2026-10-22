const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const {chromium} = require(process.env.PLAYWRIGHT_PACKAGE_DIR);
// Test-only fixture loader; production never imports these fixtures or a TS evaluator.
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const originalLoad = Module._load;
Module._load = function(name,...args) { return originalLoad.call(this,name==='@mlmath/runtime'?path.resolve('packages/math-runtime/src/index.ts'):name,...args); };
const model = require(path.resolve('apps/web/app/python/essentials/model.ts'));
const catalog = require(path.resolve('apps/web/app/python/essentials/catalog.ts'));
const draft = model.emptyState('phase21-draft');
draft.draft.answers[0] = structuredClone([...catalog.INDEPENDENT_FORMS[0][0].accepted[0]]);
const validRaw = model.serialize(draft);
const base=process.env.PHASE21_PREVIEW_URL || 'http://127.0.0.1:3041';
const out=process.env.PHASE21_EVIDENCE || '.phase21-evidence';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.tracing.start({screenshots:true,snapshots:true,sources:true});
 const page=await context.newPage();page.setDefaultTimeout(15000); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const results={layouts:[],links:[],storage:[],keyboard:[],source:process.env.GITHUB_SHA || 'local',zoom:'OPEN: actual browser UI zoom checked separately',screenReader:'OPEN: actual speech checked separately'};
 try {
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.match(await page.title(),/ML Mastery/);
  assert.equal(await page.getByRole('list',{name:'Four learning stages'}).locator(':scope > li').count(),4);
  assert.equal(await page.getByRole('link',{name:/Try a Free Lab/}).getAttribute('href'),'/demo');
  assert.equal(await page.getByRole('heading',{name:'Project Studio — Coming Soon'}).count(),1);
  assert.equal(await page.getByRole('heading',{name:'$39 one-time purchase'}).count(),1);
  const roots=['/','/journey','/demo','/beta','/math','/python','/supervised','/supervised/mlp','/supervised/model-selection'];
  for(const route of roots){const response=await page.request.get(base+route);assert.equal(response.status(),200,route);results.links.push({route,status:response.status()});}
  for(const width of [320,390,768,1280,1440])for(const route of ['/','/journey']){
   await page.setViewportSize({width,height:1000});await page.goto(base+route,{waitUntil:'networkidle'});
   if(route==='/journey')await page.getByRole('link',{name:/Start Learning|Continue Learning/}).waitFor();
   const measure=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(measure.scroll<=measure.width,JSON.stringify({route,...measure}));
   results.layouts.push({route,...measure});
   if([320,1440].includes(width))await page.screenshot({path:path.join(out,`${route==='/'?'landing':'journey'}-${width}.png`),fullPage:true});
  }
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.getByText('Menu',{exact:true}).click();
  await page.getByRole('link',{name:'Learning stages',exact:true}).press('Escape');
  assert.equal(await page.locator('summary').evaluate(el=>document.activeElement===el),true);
  assert.equal(await page.locator('details').getAttribute('open'),null);
  results.keyboard.push('Public menu Escape closes and returns focus');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');
  await page.getByRole('link',{name:'Skip to main content'}).focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('main').evaluate(el=>document.activeElement===el),true);
  results.keyboard.push('Skip link moves focus to main');
  for(const id of ['getting-started','resources']){
   await page.goto(base+'/#'+id,{waitUntil:'networkidle'});
   const target=page.locator('#'+id);assert.ok(await target.isVisible());
   await target.getByRole('link').click();await page.waitForURL('**/journey#'+id);
   assert.ok(await page.locator('#'+id).isVisible());
  }
  // Disposable same-origin test context, never the user's actual learning records.
  const fixture={ [model.STORAGE_KEY]:validRaw, 'ml-math-lab:python:numpy:v2':'{corrupt', 'unrelated:phase21':'preserve', 'future:phase21':JSON.stringify({schema:999,retain:true}) };
  await page.evaluate(entries=>{localStorage.clear();for(const [key,value]of Object.entries(entries))localStorage.setItem(key,value);},fixture);
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'My learning journey',exact:true}).first().click();
  await page.getByRole('link',{name:/Continue Learning/}).waitFor();
  assert.equal(await page.getByRole('link',{name:/Continue Learning/}).getAttribute('href'),'/python/essentials/mastery');
  await page.getByRole('button',{name:'Algorithm Lab',exact:true}).click();
  await page.getByRole('link',{name:'Introductory Multilayer Perceptrons',exact:true}).waitFor();
  await page.getByRole('link',{name:'Model Selection & Comparison',exact:true}).waitFor();
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('link',{name:/Continue Learning/}).waitFor();
  await page.getByText('Browse topics',{exact:true}).click();
  await page.getByRole('link',{name:'Public home',exact:true}).click();
  await page.goBack();await page.goForward();
  const after=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
  assert.deepEqual(after,fixture);results.storage.push('Valid Essentials draft, corrupt scope and unrelated/future records preserved byte for byte through public/journey navigation, mode selection, reload and history');
  // Ensure every authored landing destination still responds; no nonexistent commercial/tour routes.
  await page.goto(base+'/',{waitUntil:'networkidle'});
  const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  for(const href of new Set(links)){assert.ok(!/^\/(discover|pricing|checkout|login|projects)/.test(href));const response=await page.request.get(base+href.split('#')[0]);assert.equal(response.status(),200,href);}
  assert.deepEqual(errors,[]);results.status='PASS';
  fs.writeFileSync(path.join(out,'phase21-browser-results.json'),JSON.stringify(results,null,2)+'\n');
 } finally {await context.tracing.stop({path:path.join(out,'phase21-browser-trace.zip')});await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
