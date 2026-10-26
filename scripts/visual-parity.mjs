/**
 * Cross-origin visual parity audit. Compares the PR Next.js server against the
 * existing public production site. No API writes, forms are not submitted.
 * Produces screenshots and artifacts/visual-parity/report.json.
 */
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';

const local = (process.env.PARITY_LOCAL_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const production = (process.env.PARITY_PRODUCTION_URL || 'https://forextrade.pincodeit.com').replace(/\/$/, '');
const limit = Number(process.env.PARITY_MAX_DIFF_RATIO || '0.05');
const routes = [
  '/', '/solutions/brokerage-setup', '/solutions/mt5-white-label',
  '/solutions/forex-broker-hosting', '/solutions/forex-liquidity-connectivity',
  '/products/forex-crm', '/technology/kyc-aml-integration',
  '/products/payment-gateway-integration', '/products/prop-firm-crm-api',
  '/how-it-works', '/about-us', '/faq', '/contact',
];
const viewports = [{width:320,height:700}, {width:768,height:1024}, {width:1440,height:900}];
const dir = 'artifacts/visual-parity';
await mkdir(dir, {recursive:true});
const browser = await chromium.launch({headless:true});
const comparisons = [], errors = [];

function safe(value) {return value.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'home';}
async function open(url, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor:1, reducedMotion:'reduce', colorScheme:'light', locale:'en-US' });
  const page = await context.newPage();
  try {
    const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:45000});
    if(!response || response.status() >= 400) throw new Error('HTTP '+response?.status()+' '+url);
    await page.locator('main').waitFor({timeout:20000});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      await Promise.all([...document.images].filter(img=>img.getBoundingClientRect().top < innerHeight+100)
        .map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
          img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});
          setTimeout(resolve,5500);
        })));
    });
    await page.waitForTimeout(300);
    return {context,page};
  } catch(error) {await context.close();throw error;}
}
async function fingerprint(page) {
  return page.evaluate(()=>({
    h1:(document.querySelector('main h1')?.textContent || '').replace(/\s+/g,' ').trim(),
    sections:[...document.querySelectorAll('main section[id]')].map(e=>e.id),
    finalCta:document.querySelectorAll('.bs-global-cta-panel').length,
    slides:document.querySelectorAll('.bs-slide').length,
    visibleBands:[...document.querySelectorAll('main .bs-v5-media')].length,
    faqQuestions:document.querySelectorAll('.bs-faq-polished details').length,
    links:[...document.querySelectorAll('header nav a[href]')].map(e=>e.getAttribute('href')),
  }));
}
async function compareScreenshot(a,b,label) {
  const name = safe(label);
  const [before,after] = await Promise.all([
    a.screenshot({animations:'disabled',caret:'hide'}),
    b.screenshot({animations:'disabled',caret:'hide'}),
  ]);
  const [prior,current] = [PNG.sync.read(before),PNG.sync.read(after)];
  await Promise.all([writeFile(dir+'/'+name+'-live.png',before),writeFile(dir+'/'+name+'-pr.png',after)]);
  if(prior.width !== current.width || prior.height !== current.height) {
    comparisons.push({label,passed:false,ratio:1,issue:'Screenshot dimension mismatch',live:[prior.width,prior.height],pr:[current.width,current.height]});
    return;
  }
  const diff = new PNG({width:prior.width,height:prior.height});
  const delta = pixelmatch(prior.data,current.data,diff.data,prior.width,prior.height,{threshold:0.12,includeAA:false});
  const ratio = delta/(prior.width*prior.height);
  if(ratio > 0.002) await writeFile(dir+'/'+name+'-diff.png',PNG.sync.write(diff));
  const passed = ratio <= limit;
  comparisons.push({label,passed,diffPixels:delta,totalPixels:prior.width*prior.height,ratio:+ratio.toFixed(6)});
  console.log((passed?'PASS':'VISUAL DELTA'),label,'pixel mismatch', (ratio*100).toFixed(2)+'%');
}
const pick = (page,selector) => page.locator(selector).first();

try {
  for(const viewport of viewports){
    for(const route of routes){
      const label = (route==='/'?'home':route)+'-'+viewport.width;
      let prod,branch;
      try{
        [prod,branch] = await Promise.all([open(production+route,viewport),open(local+route,viewport)]);
        const [before,after] = await Promise.all([fingerprint(prod.page),fingerprint(branch.page)]);
        for(const field of ['h1','sections','finalCta','slides','visibleBands','faqQuestions','links']){
          if(JSON.stringify(before[field])!==JSON.stringify(after[field])) errors.push({label,field,live:before[field],pr:after[field]});
        }
        await compareScreenshot(prod.page,branch.page,label+'-viewport');
        if(route==='/' && [320,1440].includes(viewport.width)){
          for(const [selector,suffix] of [
            ['.bs-stack-flow-section','stack'],['.bs-feature-flex-section','features'],
            ['.bs-global-cta-panel','final-cta']]){
            if(await pick(prod.page,selector).count() && await pick(branch.page,selector).count()){
              await Promise.all([pick(prod.page,selector).scrollIntoViewIfNeeded(),pick(branch.page,selector).scrollIntoViewIfNeeded()]);
              await compareScreenshot(pick(prod.page,selector),pick(branch.page,selector),label+'-'+suffix);
            }
          }
        }
        if(route==='/faq' && [320,1440].includes(viewport.width)){
          for(const p of [prod.page,branch.page]){
            const first=pick(p,'.bs-faq-polished details summary');
            if(await first.count()) await first.click();
          }
          if(await pick(prod.page,'.bs-faq-polished details').count() && await pick(branch.page,'.bs-faq-polished details').count()){
            await compareScreenshot(pick(prod.page,'.bs-faq-polished details'),pick(branch.page,'.bs-faq-polished details'),label+'-expanded');
          }
        }
        if(route==='/contact' && [320,1440].includes(viewport.width)){
          if(await pick(prod.page,'.bs-v5-contact').count() && await pick(branch.page,'.bs-v5-contact').count()){
            await compareScreenshot(pick(prod.page,'.bs-v5-contact'),pick(branch.page,'.bs-v5-contact'),label+'-contact');
          }
        }
      }catch(error){errors.push({label,message:String(error)});console.error('ERROR',label,error);}
      finally{await Promise.allSettled([prod?.context?.close(),branch?.context?.close()]);}
    }
  }
}finally{await browser.close();}
const report = {
  production,local,threshold:limit,viewports,routes,
  totalScreenshots:comparisons.length,
  visualFailures:comparisons.filter(x=>!x.passed).length,
  structuralFailures:errors.length,
  comparisons,errors,
  note:'Pixelmatch is a regression signal, not evidence of exact pixel parity. Human review of images remains required.',
};
await writeFile(dir+'/report.json',JSON.stringify(report,null,2)+'\n');
const total=comparisons.length, passed=comparisons.filter(x=>x.passed).length;
console.log('Visual parity report:',passed,'/',total,'screenshots within threshold; structure errors:',errors.length);
if(errors.length || comparisons.some(x=>!x.passed) || total<39) process.exitCode=1;
