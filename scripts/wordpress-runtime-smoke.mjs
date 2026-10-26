import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=(process.env.WP_URL||'http://127.0.0.1:8888').replace(/\/$/,'');
const paths=[
 '/','/solutions/brokerage-setup','/solutions/mt5-white-label',
 '/solutions/forex-broker-hosting','/solutions/forex-liquidity-connectivity',
 '/products/forex-crm','/technology/kyc-aml-integration',
 '/products/payment-gateway-integration','/products/prop-firm-crm-api',
 '/how-it-works','/about-us','/faq','/contact'
];
const inspect=['/','/solutions/brokerage-setup','/faq','/contact'];
const sizes=[320,768,1440];
await fs.mkdir('artifacts/wordpress',{recursive:true});
const report={base,routes:[],editor:[],screenshots:[],errors:[]};
const browser=await chromium.launch({headless:true});
try{
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:width===320?720:width===768?1024:900},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',error=>report.errors.push({page:'runtime',width,error:error.message}));
  for(const path of paths){
   const rsp=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});
   await page.locator('main').waitFor({timeout:30000});
   const info=await page.evaluate(()=>({
    h1:document.querySelector('main h1')?.textContent?.trim()||'',
    ctas:document.querySelectorAll('.bs-global-cta-panel').length,
    faq:document.querySelectorAll('.bs-faq-questions details').length,
    slides:document.querySelectorAll('.bs-slide').length,
    media:document.querySelectorAll('.bs-v5-media').length,
    form:document.querySelectorAll('form[data-ftt-contact]').length,
    overflowing:document.documentElement.scrollWidth>innerWidth+8
   }));
   const status=rsp?.status();
   report.routes.push({path,width,status,...info});
   if(status!==200||!info.h1||info.overflowing)report.errors.push({path,width,status,issue:!info.h1?'missing H1':info.overflowing?'horizontal overflow':'HTTP error'});
   if(path==='/'&& (info.slides!==5||info.ctas!==1))report.errors.push({path,width,issue:'home slides/CTA regression'});
   if(path==='/faq'&&info.faq!==42)report.errors.push({path,width,issue:'Expected 42 FAQs'});
   if(path!=='/'&&(info.media!==0||info.ctas!==1))report.errors.push({path,width,issue:'Interior mediaBand or Final CTA regression'});
   if(path==='/contact'&&info.form!==1)report.errors.push({path,width,issue:'Missing contact form'});
   if(inspect.includes(path)){
    const name=path==='/'?'home':path.replace(/[^a-z0-9]/gi,'-');
    const file='artifacts/wordpress/'+name+'-'+width+'.png';
    await page.screenshot({path:file,fullPage:true,animations:'disabled'});
    report.screenshots.push(file);
   }
  }
  await context.close();
 }
 // Verify editor boot and SSR renderer. wp-env test credentials are admin/password.
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();
 await page.goto(base+'/wp-login.php',{waitUntil:'domcontentloaded'});
 await page.locator('#user_login').fill('admin');
 await page.locator('#user_pass').fill('password');
 await Promise.all([page.waitForNavigation(),page.locator('#wp-submit').click()]);
 const list=await context.request.get(base+'/wp-json/wp/v2/pages?slug=faq');
 if(list.ok()){
  const doc=await list.json();
  if(Array.isArray(doc)&&doc[0]?.id){
   await page.goto(base+'/wp-admin/post.php?post='+doc[0].id+'&action=edit',{waitUntil:'domcontentloaded'});
   try {
    await page.locator('.editor-styles-wrapper').waitFor({timeout:45000});
    await page.screenshot({path:'artifacts/wordpress/editor-faq-1440.png'});
    report.editor.push({page:'/faq',loaded:true});
   }catch(e){report.errors.push({page:'editor',issue:'Gutenberg editor canvas did not appear',message:String(e)});}
  }else report.errors.push({page:'editor',issue:'Unable to resolve FAQ page through REST'});
 }else report.errors.push({page:'editor',issue:'REST page lookup failed '+list.status()});
 await context.close();
}finally{await browser.close();}
await fs.writeFile('artifacts/wordpress/report.json',JSON.stringify(report,null,2));
console.log('WordPress runtime smoke checked',report.routes.length,'route/viewport pairs; screenshot evidence',report.screenshots.length,'editor checks',report.editor.length,'errors',report.errors.length);
if(report.errors.length){console.error(report.errors.slice(0,25));process.exitCode=1;}
