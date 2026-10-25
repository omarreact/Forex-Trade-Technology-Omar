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
     const ticker=document.querySelector('.bs-trust-carousel');
     const tickerWindow=ticker?.querySelector('.bs-trust-carousel-window');
     const tickerBox=tickerWindow?.getBoundingClientRect();
     return {
      width:innerWidth,
      scrollWidth:root.scrollWidth,
      mainScrollWidth:main?.scrollWidth??0,
      h1Count:document.querySelectorAll('main h1').length,
      reviewButton:(()=>{
       const el=document.querySelector('.bs-review-trigger');
       if(!el)return null;
       const b=el.getBoundingClientRect();
       return {position:getComputedStyle(el).position,visible:b.width>0&&b.height>0,right:innerWidth-b.right,centerGap:Math.abs(b.top+b.height/2-innerHeight/2),height:b.height};
      })(),
      tradingStackNodes:document.querySelectorAll('.bs-stack-flow-section .bs-stack-flow-node').length,
      tradingStackSections:document.querySelectorAll('.bs-stack-flow-section').length,
      legacyEmptyTradingCards:document.querySelectorAll('#section-5 .bs-ui-card').length,
      pauseButtons:pauseButtons.length,
      numberBoxes:numberBoxes.length,
      sliderHeight:slider?.getBoundingClientRect().height??null,
      slideOverflow:overflowY,
      sliderArrowButtons:slider?.querySelectorAll('.bs-slide-arrow').length??0,
      sliderDotCount:slider?.querySelectorAll('.bs-slide-dots button').length??0,
      sliderDotMinHeight:slider?.querySelector('.bs-slide-dots button')?.getBoundingClientRect().height??null,
      sliderDotsTop:slider?.querySelector('.bs-slide-dots')?.getBoundingClientRect().top??null,
      activeSlideButtonBottom:slider?.querySelector('.bs-slide.is-active .bs-slide-copy .bs-btn')?.getBoundingClientRect().bottom??null,
      tickerCount:document.querySelectorAll('.bs-trust-carousel').length,
      tickerFixedLabels:document.querySelectorAll('.bs-trust-carousel-label').length,
      tickerLeft:tickerBox?.left??null,
      tickerRight:tickerBox?.right??null,
      tickerGroups:ticker?.querySelectorAll('.bs-trust-carousel-group').length??0,
      tickerHiddenGroups:ticker?.querySelectorAll('.bs-trust-carousel-group[aria-hidden="true"]').length??0,
      tickerAnimation:ticker?.querySelector('.bs-trust-carousel-track')?getComputedStyle(ticker.querySelector('.bs-trust-carousel-track')).animationName:'',
      sharedHeadings:document.querySelectorAll('.bs-ui-heading').length,
      sharedCards:document.querySelectorAll('.bs-ui-card').length,
      sectionHeadingMetrics:(()=>{
       const element=document.querySelector('.bs-v5-section-heading .bs-ui-title,.bs-feature-flex-heading .bs-ui-title,.bs-audience-title-block .bs-ui-title');
       const lead=document.querySelector('.bs-v5-section-heading .bs-ui-lead,.bs-feature-flex-heading .bs-ui-lead');
       const kicker=document.querySelector('.bs-v5-section-heading .bs-ui-kicker,.bs-feature-flex-heading .bs-ui-kicker');
       if(!element)return null;
       return {font:getComputedStyle(element).fontSize,color:getComputedStyle(element).color,
        leadFont:lead?getComputedStyle(lead).fontSize:null,leadColor:lead?getComputedStyle(lead).color:null,
        kickerFont:kicker?getComputedStyle(kicker).fontSize:null,kickerColor:kicker?getComputedStyle(kicker).color:null};
      })(),
      cardMetrics:(()=>{
       const card=document.querySelector('.bs-ui-card');
       if(!card)return null;
       const badge=card.querySelector('.bs-icon-card-badge');
       const title=card.querySelector('.bs-ui-card-title');
       const body=card.querySelector('.bs-ui-card-copy p');
       return {badgeWidth:badge?.getBoundingClientRect().width??null,badgeBackground:badge?getComputedStyle(badge).backgroundColor:null,
         titleFont:title?getComputedStyle(title).fontSize:null,bodyFont:body?getComputedStyle(body).fontSize:null};
      })(),
      heroComposition:(()=>{
       const inner=document.querySelector('.bs-slide.is-active .bs-slide-content');
       const shell=inner?.closest('.bs-slide-copy');
       const slider=document.querySelector('.bs-home-slider');
       if(!inner||!shell||!slider)return null;
       const a=inner.getBoundingClientRect();
       const b=shell.getBoundingClientRect();
       const c=slider.getBoundingClientRect();
       const elements=[...inner.children].map(x=>x.getBoundingClientRect());
       const contentTop=Math.min(...elements.map(x=>x.top));
       const contentBottom=Math.max(...elements.map(x=>x.bottom));
       return {
        widthRatio:a.width/b.width,
        heightRatio:a.height/c.height,
        topRatio:(a.top-c.top)/c.height,
        bottomRatio:(c.bottom-a.bottom)/c.height,
        contentOverflow:contentTop<a.top-3||contentBottom>a.bottom+3,
        centered:Math.abs((a.top-c.top)-(c.bottom-a.bottom))<4,
        leftAligned:Math.abs(a.left-b.left)<4
       };
      })(),
      submenuAccessible:!!document.querySelector('.bs-menu-trigger[aria-expanded]'),
      promotionalImageBands:document.querySelectorAll('.bs-v5-media-title-band').length,
      finalCTAs:document.querySelectorAll('main .bs-global-cta').length,
      footerCount:document.querySelectorAll('body > footer.bs-footer').length,
      ctaHeading:document.querySelector('.bs-global-cta h2')?.textContent?.trim(),
      ctaAction:document.querySelector('.bs-global-cta-button')?.textContent?.trim(),
      ctaBackground:document.querySelector('.bs-global-cta-panel')?getComputedStyle(document.querySelector('.bs-global-cta-panel')).backgroundImage:'',
      ctaIsHome:!!document.querySelector('.bs-global-cta-home'),
      ctaHomeVisual:!!document.querySelector('.bs-global-cta-home .bs-global-cta-visual'),
      ctaAfterNotes:!!document.querySelector('main > .bs-global-cta:last-child'),
      bodyHeight:document.body.scrollHeight
     };
    });
    const problems=[];
    if(!response?.ok())problems.push(`HTTP ${response?.status()??'no response'}`);
    if(metrics.scrollWidth>metrics.width+2)problems.push(`horizontal overflow ${metrics.scrollWidth}px vs ${metrics.width}px`);
    if(metrics.mainScrollWidth>metrics.width+2)problems.push(`main overflow ${metrics.mainScrollWidth}px vs ${metrics.width}px`);
    if(metrics.h1Count!==1)problems.push(`H1 count ${metrics.h1Count}`);
    if(!metrics.reviewButton?.visible)problems.push('floating change-request button missing');
    else{
     if(metrics.reviewButton.position!=='fixed')problems.push('review button is not viewport-fixed');
     if(metrics.reviewButton.centerGap>4)problems.push(`review button not at screen midpoint: ${metrics.reviewButton.centerGap}px`);
     if(metrics.reviewButton.right<-2||metrics.reviewButton.right>22)problems.push(`review button is not right-aligned: ${metrics.reviewButton.right}px`);
     if(metrics.reviewButton.height<44)problems.push('review button hit area under 44px');
    }
    if(route==='/'){
     if(metrics.tradingStackSections!==1||metrics.tradingStackNodes!==5)problems.push(`expected 5 stage connected trading stack, found ${metrics.tradingStackNodes} in ${metrics.tradingStackSections} sections`);
     if(metrics.legacyEmptyTradingCards>0)problems.push('old empty trading-stack cards still rendered');
    }else if(metrics.tradingStackSections>0)problems.push('homepage trading-stack flow rendered on internal route');
    if(metrics.sharedHeadings===0)problems.push('no shared heading component rendered');
    if(metrics.cardMetrics){
     if(metrics.cardMetrics.badgeWidth!==null&&Math.abs(metrics.cardMetrics.badgeWidth-46)>1)problems.push(`badge width ${metrics.cardMetrics.badgeWidth} instead of 46px`);
     if(metrics.cardMetrics.badgeBackground!=='rgb(216, 233, 162)')problems.push(`badge background ${metrics.cardMetrics.badgeBackground} instead of lime`);
     if(metrics.cardMetrics.bodyFont&&Math.abs(parseFloat(metrics.cardMetrics.bodyFont)-14)>.2)problems.push(`card body ${metrics.cardMetrics.bodyFont} instead of 14px`);
     if(metrics.cardMetrics.titleFont&&viewport.width>=1280&&Math.abs(parseFloat(metrics.cardMetrics.titleFont)-23)>.2)problems.push(`card title ${metrics.cardMetrics.titleFont} instead of 23px`);
    }
    if(metrics.sectionHeadingMetrics&&viewport.width>=1280){
     if(Math.abs(parseFloat(metrics.sectionHeadingMetrics.font)-46)>.2)problems.push(`section H2 ${metrics.sectionHeadingMetrics.font} instead of 46px`);
     if(metrics.sectionHeadingMetrics.color!=='rgb(22, 24, 22)'&&route!=='/')problems.push(`section H2 color ${metrics.sectionHeadingMetrics.color}`);
     if(metrics.sectionHeadingMetrics.leadFont&&Math.abs(parseFloat(metrics.sectionHeadingMetrics.leadFont)-15)>.2)problems.push(`section subtitle ${metrics.sectionHeadingMetrics.leadFont} instead of 15px`);
     if(metrics.sectionHeadingMetrics.kickerFont&&Math.abs(parseFloat(metrics.sectionHeadingMetrics.kickerFont)-11)>.2)problems.push(`section kicker ${metrics.sectionHeadingMetrics.kickerFont} instead of 11px`);
    }
    if(route==='/'){
     const hero=metrics.heroComposition;
     if(!hero)problems.push('slide composition missing');
     else {
      const expected=viewport.width>=1024?.70:viewport.width>=768?.78:1;
      if(Math.abs(hero.widthRatio-expected)>.025)problems.push(`hero copy uses ${Math.round(hero.widthRatio*100)}% instead of ${Math.round(expected*100)}%`);
      if(viewport.width>=1024){
       if(Math.abs(hero.heightRatio-.70)>.025)problems.push(`hero content height is ${Math.round(hero.heightRatio*100)}% instead of 70%`);
       if(!hero.centered)problems.push(`hero content vertical alignment not centered: top ${Math.round(hero.topRatio*100)}%, bottom ${Math.round(hero.bottomRatio*100)}%`);
       if(!hero.leftAligned)problems.push('hero 70% content not aligned to the left side of the container');
       if(hero.contentOverflow)problems.push('hero content overflows the 70% layout area');
      }
     }
    }
    if(metrics.pauseButtons)problems.push(`${metrics.pauseButtons} pause/resume buttons`);
    if(metrics.numberBoxes)problems.push(`${metrics.numberBoxes} decorative counters`);
    if(route==='/'){
     if(metrics.tickerCount!==1)problems.push(`expected 1 technology marquee, found ${metrics.tickerCount}`);
     if(metrics.tickerFixedLabels!==0)problems.push('fixed Technology That Connects label still exists');
     if(metrics.tickerLeft===null||Math.abs(metrics.tickerLeft)>2)problems.push(`marquee not at left viewport edge: ${metrics.tickerLeft}`);
     if(metrics.tickerRight===null||Math.abs(metrics.tickerRight-viewport.width)>2)problems.push(`marquee not at right viewport edge: ${metrics.tickerRight}`);
     if(metrics.tickerGroups!==6||metrics.tickerHiddenGroups!==5)problems.push(`loop group copies invalid: ${metrics.tickerGroups} groups, ${metrics.tickerHiddenGroups} hidden`);
     if(metrics.tickerAnimation!=='bs-trust-marquee')problems.push(`ticker animation missing: ${metrics.tickerAnimation}`);
    }else if(metrics.tickerCount!==0)problems.push('home technology ticker appears on internal page');

    if(metrics.finalCTAs!==1)problems.push(`expected 1 shared CTA, found ${metrics.finalCTAs}`);
    if(metrics.footerCount!==1)problems.push(`expected 1 shared footer, found ${metrics.footerCount}`);
    if(metrics.ctaHeading!=='Build Your Trading Infrastructure')problems.push(`unexpected global CTA headline: ${metrics.ctaHeading}`);
    if(metrics.ctaAction!=='Discuss Your Setup')problems.push(`unexpected CTA label: ${metrics.ctaAction}`);
    if(!metrics.ctaBackground.includes('gradient'))problems.push('CTA gradient missing');
    if(metrics.ctaIsHome!==(route==='/'))problems.push('Home CTA variant on incorrect route');
    if(metrics.ctaHomeVisual!==(route==='/'))problems.push('Connected-stack visual on incorrect route');
    if(!metrics.ctaAfterNotes)problems.push('Global CTA is not final main element before footer');
    if(route!=='/'&&metrics.promotionalImageBands!==0)problems.push(`unexpected promotional title image bands: ${metrics.promotionalImageBands}`);
    if(route==='/'&&metrics.promotionalImageBands<1)problems.push('homepage promotional image band missing');
    if(metrics.slideOverflow==='auto'||metrics.slideOverflow==='scroll')problems.push('nested slider scrolling');
    if(route==='/'){
     const expected=viewport.width<=767
      ? viewport.height<=560
       ? Math.min(450,Math.max(405,viewport.height*.73))
       : Math.min(570,Math.max(430,viewport.height*.68))
      : viewport.height*.85;
     if(metrics.sliderHeight===null||Math.abs(metrics.sliderHeight-expected)>3)problems.push(`hero is ${metrics.sliderHeight}px, expected ${expected}px`);
     if(metrics.sliderArrowButtons!==0)problems.push(`${metrics.sliderArrowButtons} oversized slider arrows remain`);
     if(metrics.sliderDotCount!==5)problems.push(`expected 5 indicator buttons, found ${metrics.sliderDotCount}`);
     if(metrics.sliderDotMinHeight!==null&&metrics.sliderDotMinHeight<43)problems.push(`slide dot touch target is ${metrics.sliderDotMinHeight}px`);
     if(metrics.activeSlideButtonBottom!==null&&metrics.sliderDotsTop!==null&&metrics.activeSlideButtonBottom>metrics.sliderDotsTop-3)problems.push(`hero CTA overlaps slide controls by ${(metrics.activeSlideButtonBottom-metrics.sliderDotsTop).toFixed(1)}px`);
    }
    if(pageErrors.length)problems.push(`JS: ${pageErrors.slice(0,2).join('; ')}`);
    // A generic overflow check missed the original FAQ regression. Inspect
    // the ACTUAL computed typography, geometry and active/answer colors.
    if(route==='/faq'){
     const first=page.locator('.bs-faq-polished .bs-faq-questions > details').first();
     if(await first.count()===0){
      problems.push('FAQ component not rendered');
     }else{
      await first.locator('summary').click();
      // Open-state colors have a 180ms CSS transition; inspect the settled color.
      await page.waitForTimeout(250);
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
    if((route==='/'||route==='/faq')&&(viewport.width===390||viewport.width===1440)){
     const final=page.locator('.bs-global-cta-panel');
     if(await final.count()) {
      await final.scrollIntoViewIfNeeded();
      await final.screenshot({path:`artifacts/responsive/cta-${route==='/'?'home':'faq'}-${viewport.width}.png`}).catch(()=>{});
     }
    }
    if(route==='/'&&(viewport.width===1024||viewport.width===1440||viewport.width===390)){
     await page.screenshot({path:`artifacts/responsive/home-hero-${viewport.width}.png`}).catch(()=>{});
    }
    if(route==='/'&&(viewport.width===390||viewport.width===1440)){
     const toggle=page.getByRole('button',{name:'Suggest a website change'});
     await toggle.click();
     if(await page.getByRole('dialog',{name:'Suggest a change'}).count()!==1)problems.push('review dialog failed to open');
     if(await page.locator('.bs-review-form select').count()!==2)problems.push('review dialog missing section and category fields');
     await page.screenshot({path:`artifacts/responsive/review-dialog-${viewport.width}.png`}).catch(()=>{});
     await page.keyboard.press('Escape');
     if(await page.getByRole('dialog',{name:'Suggest a change'}).count()!==0)problems.push('review dialog did not close with Escape');
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
