import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=(process.env.WP_URL||'http://localhost:8888').replace(/\/$/,'');
const routes=['/','/solutions/brokerage-setup','/solutions/mt5-white-label','/solutions/forex-broker-hosting','/solutions/forex-liquidity-connectivity','/products/forex-crm','/technology/kyc-aml-integration','/products/payment-gateway-integration','/products/prop-firm-crm-api','/how-it-works','/about-us','/faq','/contact'];
const widths=[1440,1280,1024,768,390,360];const capture=['/','/solutions/brokerage-setup','/faq','/contact'];
const report={routes:[],screenshots:[],editors:[],api:[],errors:[]};await fs.mkdir('artifacts/xml-wordpress',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:width<=390?780:width<=768?1024:900},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push({kind:'js-error',width,message:e.message}));
  for(const route of routes){
   try{
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:60000});
    await page.locator('main').waitFor({timeout:30000});
    const found=await page.evaluate(()=>({
     h1:document.querySelector('main h1')?.textContent?.trim()||'',
     scroll:document.documentElement.scrollWidth,
     width:innerWidth,
     chrome:document.querySelectorAll('.bs-site-header').length+document.querySelectorAll('.bs-footer').length,
     cta:document.querySelectorAll('.bs-global-cta-panel').length,
     slides:document.querySelectorAll('.bs-home-slider .bs-slide').length,
     faq:document.querySelectorAll('.bs-faq-questions details').length,
     contact:document.querySelectorAll('.bs-contact-form').length
    }));
    const record={route,width,status:response?.status(),...found};report.routes.push(record);
    if(record.status!==200||!found.h1||found.scroll>found.width+8||found.chrome!==2||found.cta!==1) report.errors.push({kind:'page',...record});
    if(route==='/'&&found.slides!==5)report.errors.push({kind:'hero',width,found:found.slides});
    if(route==='/faq'&&found.faq!==42)report.errors.push({kind:'faq',width,found:found.faq});
    if(route==='/contact'&&found.contact!==1)report.errors.push({kind:'contact',width,found:found.contact});
    if(capture.includes(route)){
      const key=route==='/'?'home':route.replace(/[^a-z0-9]/gi,'-');
      const path='artifacts/xml-wordpress/'+key+'-'+width+'.png';
      await page.screenshot({path,fullPage:true,animations:'disabled',timeout:20000});report.screenshots.push(path);
    }
   }catch(e){report.errors.push({kind:'navigation',route,width,message:String(e)})}
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();
 await page.goto(base+'/wp-login.php',{waitUntil:'domcontentloaded'});
 await page.locator('#user_login').fill('admin');await page.locator('#user_pass').fill('password');
 await Promise.all([page.waitForNavigation(),page.locator('#wp-submit').click()]);
 for(const slug of ['home','faq']){
  try{
   const r=await context.request.get(base+'/wp-json/wp/v2/pages?slug='+slug);if(!r.ok())throw Error('Page lookup status '+r.status());
   const docs=await r.json();const id=docs[0]?.id;if(!id)throw Error('Missing page '+slug);
   await page.goto(base+'/wp-admin/post.php?post='+id+'&action=edit',{waitUntil:'domcontentloaded',timeout:50000});
   const frame=page.frameLocator('iframe[name="editor-canvas"]');
   await frame.locator('.editor-styles-wrapper').waitFor({timeout:40000});
   const key=slug==='home'?'.bs-trust-carousel':'.bs-faq-questions';
   await frame.locator(key).waitFor({timeout:40000});
   const styles=await frame.locator(key).first().evaluate(el=>({color:getComputedStyle(el).backgroundColor,details:el.querySelectorAll('details').length,trustGroups:el.querySelectorAll('.bs-trust-carousel-group').length}));
   if(slug==='home'&&styles.trustGroups!==1)report.errors.push({kind:'editor-duplicate',styles});
   if(slug==='faq'&&styles.details!==42)report.errors.push({kind:'editor-faq',styles});
   const png='artifacts/xml-wordpress/editor-'+slug+'-1440.png';
   await page.screenshot({path:png,fullPage:true,animations:'disabled'});report.editors.push({slug,loaded:true,styles});
  }catch(e){report.errors.push({kind:'editor',slug,message:String(e)})}
 }
 await context.close();
}finally{await browser.close()}
await fs.writeFile('artifacts/xml-wordpress/report.json',JSON.stringify(report,null,2));
console.log('XML-native WordPress smoke:',report.routes.length,'route/width pairs',report.screenshots.length,'screenshots',report.editors.length,'editor canvases',report.errors.length,'errors');
if(report.errors.length){console.error(report.errors.slice(0,20));process.exitCode=1;}
