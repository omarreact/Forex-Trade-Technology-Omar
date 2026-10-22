/* Browser gate. Runs in CI against a locally served production Next.js build. */
const {chromium}=require('playwright');
const manifest=require('../public/theme-assets/content/page-manifest.json');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:3100';
const productionOrigin='https://forextrade.pincodeit.com';
const widthList=[1440,1280,1024,768,390,360];
const screenshots=path.resolve(process.env.SCREENSHOT_DIR||'artifacts/design-screenshots');
const resultPath=path.resolve(process.env.VISUAL_CHECKS_PATH||'artifacts/visual-checks.json');
fs.mkdirSync(screenshots,{recursive:true});
fs.mkdirSync(path.dirname(resultPath),{recursive:true});
const errors=[];
const slugify=s=>s.replace(/^\/|\/$/g,'').replace(/\//g,'-')||'home';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const seoContext=await browser.newContext();
  try{
   const robotsResponse=await seoContext.request.get(base+'/robots.txt');
   if(robotsResponse.status()!==200)throw Error('robots.txt HTTP '+robotsResponse.status());
   const robotsText=await robotsResponse.text();
   const sitemapUrl=robotsText.match(/^Sitemap:\s*(\S+)/im)?.[1];
   if(!sitemapUrl)throw Error('robots.txt is missing its sitemap reference');
   const sitemapTarget=new URL(sitemapUrl,base);
   // In local QA the generated robots file intentionally retains the canonical
   // production origin. Fetch that sitemap route from the server under test.
   const localSitemapTarget=new URL(sitemapTarget.pathname+sitemapTarget.search,new URL(base).origin);
   const sitemapResponse=await seoContext.request.get(localSitemapTarget.toString());
   if(sitemapResponse.status()!==200)throw Error('sitemap.xml HTTP '+sitemapResponse.status()+' at '+sitemapTarget);
   const sitemapText=await sitemapResponse.text();
   const sitemapRoutes=[...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1].replaceAll('&amp;','&')).pathname.replace(/\/$/,'')||'/');
   const approvedRoutes=manifest.map(({route})=>route.replace(/\/$/,'')||'/').sort();
   if(sitemapRoutes.length!==13||new Set(sitemapRoutes).size!==13)throw Error('Sitemap must contain 13 unique canonical routes, got '+sitemapRoutes.length);
   if(JSON.stringify([...sitemapRoutes].sort())!==JSON.stringify(approvedRoutes))throw Error('Sitemap routes differ from the approved 13-page manifest');
   if(sitemapRoutes.some(route=>/^\/design-[1-6](\/|$)/.test(route)))throw Error('Design previews must not appear in the canonical sitemap');
   for(const route of approvedRoutes){
    const pageResponse=await seoContext.request.get(base+route);
    if(pageResponse.status()!==200)throw Error('Canonical route '+route+' returned HTTP '+pageResponse.status());
    const html=await pageResponse.text();
    const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if(!canonical||new URL(canonical).pathname!==route||new URL(canonical).origin!==productionOrigin)throw Error('Canonical source route '+route+' has incorrect canonical '+canonical);
    if(/<meta name="robots" content="[^"]*noindex/i.test(html))throw Error('Canonical source route '+route+' is marked noindex');
   }
  }finally{await seoContext.close()}
  for(const width of widthList){
   const ctx=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await ctx.newPage();
   for(let d=1;d<=6;d++){
    for(const meta of manifest){
     const route='/design-'+d+(meta.route==='/'?'':meta.route);
     const key=width+'-'+d+'-'+slugify(meta.route);
     try{
      const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:35000});
      if(!response||response.status()!==200)throw Error('HTTP '+response?.status());
      const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
      const expectedCanonical=meta.route.replace(/\/$/,'')||'/';
      if(!canonical||new URL(canonical).pathname!==expectedCanonical||new URL(canonical).origin!==productionOrigin)throw Error('Missing or incorrect canonical '+canonical+' expected '+productionOrigin+expectedCanonical);
      const robots=await page.locator('meta[name="robots"]').getAttribute('content');
      if(!robots?.includes('noindex'))throw Error('Design preview is missing noindex metadata');
      if(!response.headers()['x-robots-tag']?.includes('noindex'))throw Error('Design preview is missing its noindex response header');
      if(width===1440&&meta.slug!=='home'){
       const imageCount=await page.locator('img').count();
       if(imageCount<7||imageCount>9)throw Error('Interior page must place 7–9 images section-to-section, got '+imageCount);
      }
      if(await page.locator('h1').count()!==1)throw Error('Every page must have exactly one H1');
      if(await page.locator('footer').count()===0)throw Error('Missing footer');
      if(await page.locator('img:not([alt])').count()>0)throw Error('An image is missing an alternative-text attribute');
      const cta=d===1?'.ftt-original-cta':'.c'+d+'-cta';
      if(await page.locator(cta).count()!==1)throw Error('Missing theme-specific CTA '+cta);
      const contactPaths=await page.locator(cta+' a').evaluateAll(links=>links.map(a=>new URL(a.href).pathname.replace(/\/$/,'')));
      if(!contactPaths.some(p=>p.endsWith('/contact')))throw Error('CTA contact link missing: '+contactPaths.join(','));
      const result=await page.evaluate(()=>{
       const b=document.body,doc=document.documentElement;
       const w=Math.max(b.scrollWidth,doc.scrollWidth);
       const footer=document.querySelector('footer');
       const cta=[...document.querySelectorAll('section')].find(e=>e.classList.contains('ftt-original-cta')||/\bc[2-6]-cta\b/.test(e.className));
       return {w,ctaBeforeFooter:!!cta&&!!footer&&!!(cta.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING)};
      });
      if(result.w>width+2)throw Error('Horizontal overflow '+result.w+'>'+width);
      if(!result.ctaBeforeFooter)throw Error('CTA is not before footer');
      const selected=page.locator('.ftt-design-switcher__link[aria-current="page"]');
      if(await selected.count()!==1)throw Error('Design switcher selection missing');
      const links=await page.locator('.ftt-design-switcher__link').count();
      if(links!==6)throw Error('Design switcher needs six links, got '+links);
      const switchPaths=await page.locator('.ftt-design-switcher__link').evaluateAll(anchors=>anchors.map(anchor=>new URL(anchor.href).pathname));
      for(let index=1;index<=6;index++){
       const target='/design-'+index+(expectedCanonical==='/'?'':expectedCanonical);
       if(!switchPaths.includes(target))throw Error('Design switcher does not preserve '+meta.route+' for Design '+index);
      }
      // Inspect the *actual* original homepage slider dimensions (the previous selector missed them).
      if(d===1 && meta.slug==='home' && (width===1440||width===390)){
        const h=await page.locator('.ftt-full-slide-hero').evaluate(el=>Math.round(el.getBoundingClientRect().height));
        const limit=width===1440?625:675;
        if(h>limit)throw Error('Original hero still oversized '+h+'px (limit '+limit+')');
      }
      // Exercise each design's independent, keyboard-usable software preview.
      if(d>=2 && meta.slug==='mt5-white-label' && (width===1440||width===390)){
        const selector='.rp'+d+'-'+({2:'desk',3:'eco',4:'workbench',5:'terminal',6:'crm'}[d]);
        const root=page.locator(selector);
        if(await root.count()!==1)throw Error('Missing independent interactive design preview '+selector);
        const tabs=root.getByRole('tab');
        if(await tabs.count()<2)throw Error('Interactive preview lacks tabs');
        // A successful click waits for Next hydration before the keyboard test.
        await tabs.nth(0).click({timeout:6000});
        await tabs.nth(0).focus();
        await page.keyboard.press('ArrowRight');
        if(await tabs.nth(1).getAttribute('aria-selected')!=='true')throw Error('Arrow-key tab navigation failed');
        await tabs.nth(1).click({timeout:6000});
        if(await tabs.nth(1).getAttribute('aria-selected')!=='true')throw Error('Tab selection failed');
        await tabs.nth(0).click({timeout:6000});
        if(await tabs.nth(0).getAttribute('aria-selected')!=='true')throw Error('Tab restore failed');
      }

      // The final full-width test protects against the screenshot defect:
      // only a narrow left column contains approved text while the right stays vacant.
      if(width===1440&&d>=2&&meta.slug==='home'){
        const detail=await page.evaluate((design)=>{
          const pair={
            2:['.c2-chapter','.c2-chapter-body'],
            3:['.c3-section','.c3-text'],
            4:['.c4-feature','.c4-feature-copy'],
            5:['.c5-unit','.c5-unit-body'],
            6:['.c6-story','.c6-story-words'],
          }[design];
          const rows=[...document.querySelectorAll(pair[0])];
          const ratios=rows.map(section=>{
            const body=section.querySelector(pair[1]);
            return body?body.getBoundingClientRect().width/Math.max(1,section.getBoundingClientRect().width):0;
          });
          const headings=[...document.querySelectorAll('h2')].map(h=>h.textContent.trim().replace(/\\s+/g,' '));
          const repeated=headings.filter((h,i)=>h.length>15&&headings.indexOf(h)!==i);
          return {ratios,repeated,sections:rows.length};
        },d);
        if(detail.sections<7)throw Error('Missing source homepage sections: '+detail.sections);
        if(await page.locator('.concept-copy img[alt="Real-world financial technology environment"]').count()>0)throw Error('Legacy decorative image still taking space in theme content');
        const threshold=d===3?.55:.75;
        if(detail.ratios.some(ratio=>ratio<threshold))throw Error('Source content left in narrow partial grid: '+JSON.stringify(detail.ratios));
        if(detail.repeated.length)throw Error('Repeated homepage section headings: '+detail.repeated.join(' | '));
      }
      if(width===1440&&(meta.slug==='home'||['mt5-white-label','forex-crm','about-us'].includes(meta.slug))){
        // Full-page screenshots do not scroll through lazy media. Eagerly load
        // the page's existing photos before capture so visual review sees the
        // actual section compositions (and any deliberate fallbacks).
        await page.evaluate(async()=>{
         const images=[...document.images];
         images.forEach(image=>{image.loading='eager'});
         await Promise.race([
          Promise.all(images.map(image=>image.decode().catch(()=>undefined))),
          new Promise(resolve=>setTimeout(resolve,10000)),
         ]);
        });
        await page.waitForTimeout(100);
        await page.screenshot({path:path.join(screenshots,key+'.png'),fullPage:true,animations:'disabled',timeout:50000});
      }
     }catch(error){errors.push({key,route,error:String(error)});console.error('FAIL',key,String(error));}
    }
   }
   await ctx.close();
   console.log('Finished viewport',width,'checks',manifest.length*6);
  }
  // Force the original source photos to fail and verify all four fallbacks
  // render as distinct, useful compositions instead of identical blank tiles.
  const fallbackPage=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  try{
   await fallbackPage.goto(base+'/',{waitUntil:'domcontentloaded',timeout:35000});
   await fallbackPage.waitForFunction(()=>document.querySelector('.ftt-home-editorial figure img')?.closest('figure')?.className.includes('ftt-photo-fallback--'),{timeout:10000});
   const fallbackKinds=await fallbackPage.evaluate(()=>{
    const home=document.querySelector('.ftt-home-editorial');
    // The real homepage has fewer than four photos. Add disposable figures so
    // this check exercises every supported fallback without changing page copy.
    const fixture=document.createElement('div');
    fixture.dataset.fallbackFixture='true';
    fixture.style.cssText='position:absolute;left:-10000px;top:0;width:1px;height:1px;overflow:hidden';
    for(let index=0;index<4;index++){
     const figure=document.createElement('figure');
     const image=document.createElement('img');
     image.src='data:image/png;base64,not-an-image';
     image.alt='fallback test fixture';
     figure.append(image);fixture.append(figure);
    }
    home.append(fixture);
    const images=[...document.querySelectorAll('.ftt-home-editorial figure img')];
    images.forEach(img=>img.dispatchEvent(new Event('error',{bubbles:true})));
    const figures=[...document.querySelectorAll('figure.ftt-photo-missing')];
    return figures.map(figure=>({kind:[...figure.classList].find(name=>name.startsWith('ftt-photo-fallback--')),background:getComputedStyle(figure,':before').backgroundImage,hidden:getComputedStyle(figure.querySelector('img')).display==='none'}));
   });
   const uniqueKinds=new Set(fallbackKinds.map(item=>item.kind));
   const uniqueBackgrounds=new Set(fallbackKinds.map(item=>item.background));
   if(uniqueKinds.size<4||uniqueBackgrounds.size<4||fallbackKinds.some(item=>!item.hidden))throw Error('Four distinct source-photo fallbacks were not rendered: '+JSON.stringify(fallbackKinds));
   await fallbackPage.screenshot({path:path.join(screenshots,'original-photo-fallbacks.png'),fullPage:true,animations:'disabled',timeout:50000});
   console.log('Verified four distinct original-photo fallbacks');
  }catch(error){errors.push({key:'photo-fallbacks',route:'/',error:String(error)});console.error('FAIL photo-fallbacks',String(error));}
  finally{await fallbackPage.close();}
 }finally{await browser.close()}
 fs.writeFileSync(resultPath,JSON.stringify({base,checks:6*6*manifest.length,errors},null,2));
 console.log('Total checked:',6*6*manifest.length,'failures:',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
