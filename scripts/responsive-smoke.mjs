/**
 * Responsive smoke test for all public Forex Trade Technology routes.
 *
 * Requires a running dev/production server and `playwright` installed.
 * Browser assets/scripts are tested in Chromium on the CI runner; this is
 * not a substitute for testing iOS Safari or physical touch hardware.
 */
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';

const base=(process.env.RESPONSIVE_BASE_URL||'http://127.0.0.1:3000').replace(/\/$/,'');
const routes=[
 '/',
 '/solutions/brokerage-setup',
 '/solutions/mt5-white-label',
 '/solutions/forex-broker-hosting',
 '/solutions/forex-liquidity-connectivity',
 '/products/forex-crm',
 '/technology/kyc-aml-integration',
 '/products/payment-gateway-integration',
 '/products/prop-firm-crm-api',
 '/how-it-works',
 '/about-us',
 '/faq',
 '/contact'
];
const sizes=[
 {width:320,height:568},
 {width:360,height:740},
 {width:390,height:844},
 {width:430,height:932},
 {width:768,height:1024},
 {width:1024,height:768},
 {width:1440,height:900},
 {width:1920,height:1080}
];
const failures=[],passes=[];
await mkdir('artifacts/responsive',{recursive:true});
const browser=await chromium.launch({headless:true});
try {
 for(const viewport of sizes){
  const context=await browser.newContext({viewport,deviceScaleFactor:1});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  for(const route of routes){
   pageErrors.length=0;
   const label=`${viewport.width}x${viewport.height} ${route}`;
   try {
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:45_000});
    await page.locator('main').waitFor({timeout:20_000});
    await page.waitForTimeout(120);
    const metrics=await page.evaluate(()=>{
     const root=document.documentElement;
     const main=document.querySelector('main');
     const pauseButtons=[...document.querySelectorAll('button')].filter(node=>/^(pause|resume)\b/i.test(node.getAttribute('aria-label')||''));
     const numberBoxes=document.querySelectorAll('.bs-icon-card-number,.bs-timeline-number,.bs-band-number,.bs-v5-step-index,.bs-story-node-index,.bs-audience-status');
     const slider=document.querySelector('.bs-home-slider');
     const slideCopy=slider?.querySelector('.bs-slide.is-active .bs-slide-copy');
     const overflowY=slideCopy?getComputedStyle(slideCopy).overflowY:'';
     return {
      width:innerWidth,
      scrollWidth:root.scrollWidth,
      mainScrollWidth:main?.scrollWidth??0,
      h1Count:document.querySelectorAll('main h1').length,
      pauseButtons:pauseButtons.length,
      numberBoxes:numberBoxes.length,
      sliderHeight:slider?.getBoundingClientRect().height??null,
      slideOverflow:overflowY,
      submenuAccessible:!!document.querySelector('.bs-menu-trigger[aria-expanded]'),
      bodyHeight:document.body.scrollHeight
     };
    });
    const problems=[];
    if(!response?.ok())problems.push(`HTTP ${response?.status()??'no response'}`);
    if(metrics.scrollWidth>metrics.width+2)problems.push(`horizontal overflow ${metrics.scrollWidth}px vs ${metrics.width}px`);
    if(metrics.mainScrollWidth>metrics.width+2)problems.push(`main overflow ${metrics.mainScrollWidth}px vs ${metrics.width}px`);
    if(metrics.h1Count!==1)problems.push(`H1 count ${metrics.h1Count}`);
    if(metrics.pauseButtons)problems.push(`${metrics.pauseButtons} pause/resume buttons`);
    if(metrics.numberBoxes)problems.push(`${metrics.numberBoxes} decorative counters`);
    if(metrics.slideOverflow==='auto'||metrics.slideOverflow==='scroll')problems.push('nested slider scrolling');
    if(route==='/'&&metrics.sliderHeight!==null&&Math.abs(metrics.sliderHeight-viewport.height*.85)>3)problems.push(`hero is ${metrics.sliderHeight}px, expected ${viewport.height*.85}px`);
    if(pageErrors.length)problems.push(`JS: ${pageErrors.slice(0,2).join('; ')}`);
    // A generic overflow check missed the original FAQ regression. Inspect
    // the ACTUAL computed typography, geometry and active/answer colors.
    if(route==='/faq'){
     const first=page.locator('.bs-faq-polished .bs-faq-questions > details').first();
     if(await first.count()===0){
      problems.push('FAQ component not rendered');
     }else{
      await first.locator('summary').click();
      const faq=await page.evaluate(()=>{
       const scope=document.querySelector('.bs-faq-polished');
       const heading=scope?.querySelector('.bs-faq-heading h2');
       const count=scope?.querySelector('.bs-faq-count');
       const countNumber=count?.querySelector('strong');
       const countLabel=count?.querySelector('span');
       const first=scope?.querySelector('.bs-faq-questions details');
       const summary=first?.querySelector('summary');
       const answer=first?.querySelector('.bs-faq-answer p');
       if(!heading||!count||!countNumber||!countLabel||!first||!summary||!answer)return null;
       const h=heading.getBoundingClientRect();
       const c=count.getBoundingClientRect();
       const n=countNumber.getBoundingClientRect();
       const l=countLabel.getBoundingClientRect();
       return {
        countText:count.textContent?.replace(/\s+/g,' ').trim(),
        headingToCount:c.top-h.bottom,
        countWordGap:l.left-n.right,
        countFontSize:getComputedStyle(count).fontSize,
        countLetterSpacing:getComputedStyle(count).letterSpacing,
        questionColor:getComputedStyle(summary).color,
        questionBackground:getComputedStyle(summary).backgroundColor,
        answerColor:getComputedStyle(answer).color,
        answerLineHeight:getComputedStyle(answer).lineHeight,
        expanded:first.open
       };
      });
      if(!faq)problems.push('FAQ typography targets missing');
      else{
       if(faq.countText!=='42questions answered'&&faq.countText!=='42 questions answered')problems.push(`FAQ count text: ${faq.countText}`);
       if(faq.headingToCount<7)problems.push(`FAQ heading and subtitle too close: ${faq.headingToCount.toFixed(1)}px`);
       if(faq.countWordGap<6)problems.push(`FAQ number and subtitle collide: ${faq.countWordGap.toFixed(1)}px`);
       if(faq.questionColor!=='rgb(63, 87, 30)')problems.push(`FAQ open question has wrong color: ${faq.questionColor}`);
       if(faq.answerColor!=='rgb(82, 97, 79)')problems.push(`FAQ answer has wrong color: ${faq.answerColor}`);
       if(!faq.expanded)problems.push('FAQ did not expand');
       if(viewport.width===390||viewport.width===1440){
        await page.locator('.bs-faq-polished').scrollIntoViewIfNeeded();
        await page.screenshot({path:`artifacts/responsive/faq-open-${viewport.width}.png`});
       }
      }
     }
    }
    if(problems.length){
     const screenshot=`artifacts/responsive/failure-${viewport.width}-${route.replace(/[^a-z0-9]+/gi,'-')||'home'}.png`;
     await page.screenshot({path:screenshot,fullPage:true}).catch(()=>{});
     failures.push({label,problems,metrics,screenshot});
     console.error('FAIL',label,problems.join(' | '));
    }else{
     passes.push(label);
     console.log('PASS',label);
    }
   }catch(error){
    failures.push({label,problems:[String(error)]});
    console.error('ERROR',label,error);
   }
  }
  await context.close();
 }
}finally{
 await browser.close();
}
const report={tested:passes.length+failures.length,passed:passes.length,failed:failures.length,sizes,routes,failures};
await writeFile('artifacts/responsive/report.json',JSON.stringify(report,null,2));
console.log(`Checked ${report.tested} route/viewport pairs: ${report.passed} passed; ${report.failed} failed`);
if(failures.length)process.exitCode=1;
