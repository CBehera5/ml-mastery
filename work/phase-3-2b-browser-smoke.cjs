const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE_DIR);
const out=process.env.PHASE21_EVIDENCE||'.phase32b-evidence',base=process.env.PHASE21_PREVIEW_URL||'http://127.0.0.1:3046';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(()=>{window.__writes=[];for(const method of ['setItem','removeItem','clear']){const fn=Storage.prototype[method];Storage.prototype[method]=function(...args){window.__writes.push({method,args});return fn.apply(this,args);};}window.__events=[];const dispatch=window.dispatchEvent;window.dispatchEvent=function(event){window.__events.push(event.type);return dispatch.call(this,event);};});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const button=name=>page.getByRole('button',{name,exact:true});const click=name=>button(name).click();
 const reach=async()=>{await page.getByRole('radio',{name:'More time',exact:true}).check();for(const n of ['Compare my reasoning','See how 9 was calculated','Add the distance contribution','Add the baseline'])await click(n);};
 const snapshot=()=>page.evaluate(()=>({values:[...document.querySelectorAll('input:not([type=radio])')].map(n=>n.value),prediction:document.querySelector('[data-testid=prediction]')?.textContent,loss:document.querySelector('[data-testid=loss]')?.textContent,history:document.querySelector('.history-list')?.textContent,guide:document.querySelector('.lesson-nav')?.textContent,inspector:document.querySelector('.inspector')?.textContent}));
 const result={source:process.env.GITHUB_SHA||'local',layouts:[],branches:[],preservation:[],screenReader:'OPEN: actual speech required',nativeZoom:'Recorded separately'};
 const measure=async(state,width)=>{const m=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(m.scroll<=m.width,JSON.stringify({state,...m}));result.layouts.push({state,...m});await page.screenshot({path:path.join(out,`experiment-${state}-${width}.png`),fullPage:true});};
 try{
 await page.goto(base+'/demo',{waitUntil:'networkidle'});await reach();
 for(const width of [320,390,720,1440]){
  await page.setViewportSize({width,height:1000});await measure('predict',width);
  for(const [choice,feedback]of [['Increase','makes the estimate larger'],['Decrease','adds time rather than removing'],['Not sure','compare before with after']]){
   await page.getByRole('radio',{name:choice,exact:true}).check();await button('Check my prediction').focus();await page.keyboard.press('Enter');
   assert.equal(await page.getByTestId('parameter-result').count(),0);assert.ok((await page.getByTestId('parameter-announcement').textContent()).includes(feedback));
   assert.ok(await button('Try 3 min/km').evaluate(n=>n===document.activeElement));await measure('ready-'+choice.replaceAll(' ','-'),width);
   await page.keyboard.press('Enter');const body=await page.getByTestId('parameter-result').innerText();assert.ok(body.includes('12 minutes'));assert.ok(body.includes('3 minutes before; 0 minutes after'));assert.ok(body.includes('extra 1 min/km adds 3 minutes'));
   await measure('result',width);await click('Try 3 min/km again');assert.equal(await page.getByText('Example restored:',{exact:true}).count(),0);
   await button('Restore example to 2 min/km').focus();await page.keyboard.press('Enter');assert.ok(await button('Restore example to 2 min/km').evaluate(n=>n===document.activeElement));await measure('restored',width);
   assert.ok((await page.getByTestId('parameter-announcement').textContent()).includes('from 0 to 3 minutes'));
   await click('Replay experiment');assert.equal(await page.getByTestId('parameter-result').count(),0);assert.ok(await page.getByRole('heading',{name:'Change the rule, not the trip',exact:true}).evaluate(n=>n===document.activeElement));result.branches.push({width,choice,status:'PASS'});
  }
 }
 await click('Skip introduction — open full lab');await page.getByLabel('Weight w1',{exact:true}).fill('2');await page.getByRole('button',{name:/Run forward pass/}).click();await click('Apply one update');
 for(const invalid of [false,true]){
  if(invalid)await page.locator('#learning-rate').fill('0');const before=await snapshot();await page.evaluate(()=>{localStorage.setItem('phase32b-sentinel','unknown-raw');window.__writes=[];window.__events=[];});
  await click('Replay introduction without resetting the model');await reach();await page.getByRole('radio',{name:'Increase',exact:true}).check();await click('Check my prediction');await click('Try 3 min/km');await click('Restore example to 2 min/km');await click('Try 3 min/km again');await click('Replay experiment');await click('Skip introduction — open full lab');
  assert.deepEqual(await snapshot(),before);assert.deepEqual(await page.evaluate(()=>window.__writes),[]);assert.deepEqual(await page.evaluate(()=>window.__events),[]);assert.equal(await page.evaluate(()=>localStorage.getItem('phase32b-sentinel')),'unknown-raw');result.preservation.push({invalid,status:'PASS'});
 }
 assert.deepEqual(errors,[]);result.status='PASS';fs.writeFileSync(path.join(out,'phase32b-browser-result.json'),JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
