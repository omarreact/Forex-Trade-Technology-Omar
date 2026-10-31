import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=(process.env.WP_URL||'http://localhost:8888').replace(/\/$/,'');
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
const report={base,routes:[],editor:[],screenshots:[],api:[],errors:[]};
async function checkContact(label,fields,expected){
 const body=new FormData();
 for(const [key,value] of Object.entries(fields))body.set(key,value);
 const response=await fetch(base+'/wp-json/ftt/v1/contact',{method:'POST',body});
 const result=await response.json();
 report.api.push({label,status:response.status,expected,message:result.message||''});
 if(response.status!==expected)report.errors.push({page:'contact-api',label,expected,actual:response.status,message:result.message});
}
await checkContact('invalid fields',{name:'',email:'invalid',message:'short'},400);
await checkContact('honeypot',{name:'Automated',email:'qa@example.test',message:'Synthetic contact API smoke test',website:'filled'},200);
await checkContact('unconfigured delivery',{name:'Automated QA',email:'qa@example.test',message:'Synthetic staging test, must not send email.'},503);
const browser=await chromium.launch({headless:true});
try{
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:width===320?720:width===768?1024:900},deviceScaleFactor:1});
  const page=await context.newPage();
  let headerMenuBaseline=null;
  page.on('pageerror',error=>report.errors.push({page:'runtime',width,error:error.message}));
  for(const path of paths){
   const rsp=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});
   await page.locator('main').waitFor({timeout:30000});
   const info=await page.evaluate(()=>({
    h1:document.querySelector('main h1')?.textContent?.trim()||'',
    sharedHeaders:document.querySelectorAll('.ftt-native-header').length,
    headerMenuSignature:[...document.querySelectorAll('.ftt-native-header .wp-block-navigation-item__content')].map(el=>[el.textContent.trim(),el.getAttribute('href')||''].join(':')).join('|'),
    headerSocial:[...document.querySelectorAll('.ftt-native-header .ftt-native-header-social .wp-social-link')].map(el=>({
      className:el.className,
      glyphs:el.querySelectorAll('svg').length,
      glyphFill:el.querySelector('svg')?getComputedStyle(el.querySelector('svg')).fill:'',
      color:getComputedStyle(el).color,
      display:getComputedStyle(el).display,
      href:el.querySelector('a')?.getAttribute('href')||''
    })),
    headerContactPills:document.querySelectorAll('.ftt-native-header .ftt-native-header-action .wp-block-button__link').length,
    headerOuterButtonColor:(()=>{const el=document.querySelector('.ftt-native-header .ftt-native-header-action .wp-block-button');return el?getComputedStyle(el).backgroundColor:''})(),
    // WordPress's default site block gap must not create a blank strip below the header.
    headerBodyGapPx:(()=>{
      const header=document.querySelector('.wp-site-blocks > header');
      const main=document.querySelector('.wp-site-blocks > main');
      if(!header||!main)return null;
      return Math.round((main.getBoundingClientRect().top-header.getBoundingClientRect().bottom)*100)/100;
    })(),
    ctas:document.querySelectorAll('.bs-global-cta-panel').length,
    faq:document.querySelectorAll('.bs-faq-questions details').length,
    slides:document.querySelectorAll('.bs-slide').length,
    media:document.querySelectorAll('.bs-v5-media').length,
    form:document.querySelectorAll('form[data-ftt-contact]').length,
    overflowing:document.documentElement.scrollWidth>innerWidth+8,
    scrollWidth:document.documentElement.scrollWidth,
    offenders:[...document.querySelectorAll('body *')].map(e=>({el:e,box:e.getBoundingClientRect()})).filter(o=>o.box.right>innerWidth+6&&o.box.width>0).slice(0,8).map(o=>({tag:o.el.tagName,class:o.el.className?.baseVal||String(o.el.className).slice(0,95),right:Math.round(o.box.right),width:Math.round(o.box.width)}))
   }));
   const status=rsp?.status();
   if(info.overflowing&&path==='/faq'&&(width===768||width===1440))console.log('OVERFLOW DIAGNOSTIC',width,JSON.stringify(info.offenders),'scrollWidth',info.scrollWidth);
   report.routes.push({path,width,status,...info});
   if(status!==200||!info.h1||info.overflowing)report.errors.push({path,width,status,issue:!info.h1?'missing H1':info.overflowing?'horizontal overflow':'HTTP error'});
   if(info.headerBodyGapPx===null||Math.abs(info.headerBodyGapPx)>1.5)
    report.errors.push({path,width,issue:'Unexpected gap between FSE header and main',gapPx:info.headerBodyGapPx});
   if(info.sharedHeaders!==1||info.headerContactPills!==1||!info.headerMenuSignature)
    report.errors.push({path,width,issue:'Expected exactly one canonical native header, navigation and Contact Us pill',sharedHeaders:info.sharedHeaders,headerContactPills:info.headerContactPills});
   if(headerMenuBaseline===null)headerMenuBaseline=info.headerMenuSignature;
   else if(headerMenuBaseline!==info.headerMenuSignature)
    report.errors.push({path,width,issue:'Navigation differs between homepage and inner page',expected:headerMenuBaseline,got:info.headerMenuSignature});
   if(info.headerSocial.length!==2||info.headerSocial.some(x=>x.glyphs!==1||!x.href.startsWith('https://')))
    report.errors.push({path,width,issue:'WhatsApp / Telegram social icons or destinations missing',social:info.headerSocial});
   if(width>=768 && info.headerSocial.some(x=>x.glyphFill==='rgb(255, 255, 255)'||x.glyphFill==='none'))
    report.errors.push({path,width,issue:'Invisible white-on-white social icon',social:info.headerSocial});
   if(info.headerOuterButtonColor && info.headerOuterButtonColor!=='rgba(0, 0, 0, 0)')
    report.errors.push({path,width,issue:'Unexpected second colored Contact Us capsule',color:info.headerOuterButtonColor});

   if(path==='/'&& (info.slides!==5||info.ctas!==1))report.errors.push({path,width,issue:'home slides/CTA regression'});
   if(path==='/faq'&&info.faq!==42)report.errors.push({path,width,issue:'Expected 42 FAQs'});
   if(path==='/'){
    const ui=await page.evaluate(()=>{
     const cta=document.querySelector('.bs-global-cta-panel'),gallery=document.querySelector('.bs-v5-gallery'),viewport=document.querySelector('.bs-audience-viewport'),card=document.querySelector('.bs-audience-slide');
     return {
      ctaDisplay:cta?getComputedStyle(cta).display:'',
      ctaBackground:cta?getComputedStyle(cta).backgroundImage:'',
      ctaScoped:!!document.querySelector('.ftt-cta-style-scope .bs-global-cta-panel'),
      galleryTitle:gallery?.querySelector('h2')?.textContent?.trim()||'',
      audienceWidth:card?.getBoundingClientRect().width||0,
      audienceViewport:viewport?.getBoundingClientRect().width||0
     };
    });
    if(!ui.ctaScoped||ui.ctaDisplay!=='flex'||!ui.ctaBackground.includes('gradient'))
     report.errors.push({path,width,issue:'Final CTA missing two-column panel styles',ui});
    if(ui.galleryTitle!=='Technology Behind the Brokerage')
     report.errors.push({path,width,issue:'Incorrect homepage gallery heading',ui});
    if(ui.audienceViewport&&ui.audienceWidth>ui.audienceViewport*(width>=1024?0.48:width>=641?0.65:1.05))
     report.errors.push({path,width,issue:'Audience carousel card width exceeds responsive layout',ui});
   }
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
    const iframe=page.frameLocator('iframe[name="editor-canvas"]').locator('.editor-styles-wrapper');
    try{await iframe.waitFor({timeout:35000});}
    catch(e){await page.locator('.editor-styles-wrapper').waitFor({timeout:10000});}
    await page.locator('.components-modal__header button').first().click({timeout:2500}).catch(()=>{});
    const target=page.frameLocator('iframe[name="editor-canvas"]').locator('.bs-page-header');
    await target.waitFor({timeout:35000});
    await page.frameLocator('iframe[name="editor-canvas"]').locator('.bs-faq-polished').waitFor({timeout:20000});
    await page.screenshot({path:'artifacts/wordpress/editor-faq-1440.png'});
    report.editor.push({page:'/faq',loaded:true});
    // Validate computed styles, not just DOM presence. The page editor runs
    // inside a dedicated iframe on WordPress 7.1+.
    const homeLookup=await context.request.get(base+'/wp-json/wp/v2/pages?slug=home');
    if(!homeLookup.ok())throw new Error('Home page REST lookup failed');
    const homeData=await homeLookup.json();
    if(!homeData[0]?.id)throw new Error('Imported home page not available');
    await page.goto(base+'/wp-admin/post.php?post='+homeData[0].id+'&action=edit',{waitUntil:'domcontentloaded'});
    const frame=page.frameLocator('iframe[name="editor-canvas"]');
    const trust=frame.locator('.bs-trust-carousel');
    await trust.waitFor({timeout:35000});
    const appearance=await trust.evaluate(el=>{
      const style=getComputedStyle(el);
      const marquee=el.querySelector('.bs-trust-carousel-track');
      const clones=[...el.querySelectorAll('.bs-trust-carousel-group[aria-hidden="true"]')];
      return {background:style.backgroundColor,marqueeDisplay:marquee?getComputedStyle(marquee).display:'',clonesHidden:clones.length>0&&clones.every(c=>getComputedStyle(c).display==='none')};
    });
    if(appearance.background!=='rgb(216, 233, 162)'||appearance.marqueeDisplay!=='flex'||!appearance.clonesHidden)
      report.errors.push({page:'editor-home',issue:'Frontend CSS or editor-only carousel styling missing inside iframe',appearance});
    const slide=frame.locator('.bs-audience-slide').first();
    await slide.waitFor({timeout:30000});
    const audience=await slide.evaluate(el=>({width:el.getBoundingClientRect().width,viewport:el.closest('.bs-audience-viewport')?.getBoundingClientRect().width||0}));
    if(!audience.viewport||audience.width>audience.viewport*.48)
      report.errors.push({page:'editor-home',issue:'Editor audience carousel width is not three-column',audience});
    await page.screenshot({path:'artifacts/wordpress/editor-home-1440.png',fullPage:true,animations:'disabled'});
    report.editor.push({page:'/',loaded:true,appearance,audience});
   }catch(e){await page.screenshot({path:'artifacts/wordpress/editor-failure.png',fullPage:true}).catch(()=>{});report.errors.push({page:'editor',issue:'Gutenberg editor canvas did not appear',url:page.url(),message:String(e),pageText:(await page.locator('body').innerText().catch(()=>'' )).slice(0,900)});}
  }else report.errors.push({page:'editor',issue:'Unable to resolve FAQ page through REST'});
 }else report.errors.push({page:'editor',issue:'REST page lookup failed '+list.status()});
 await context.close();
}finally{await browser.close();}
await fs.writeFile('artifacts/wordpress/report.json',JSON.stringify(report,null,2));
console.log('WordPress runtime smoke checked',report.routes.length,'route/viewport pairs; screenshot evidence',report.screenshots.length,'editor checks',report.editor.length,'errors',report.errors.length);
if(report.errors.length){console.error(report.errors.slice(0,25));process.exitCode=1;}
