/* Browser gate. Runs in CI against a locally served production Next.js build. */
const {chromium}=require('playwright');
const manifest=require('../public/theme-assets/content/page-manifest.json');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:3100';
const widthList=[1440,1280,1024,768,390,360];
const screenshots=path.resolve('artifacts/design-screenshots');
fs.mkdirSync(screenshots,{recursive:true});
const errors=[];
const slugify=s=>s.replace(/^\/|\/$/g,'').replace(/\//g,'-')||'home';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
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
      if(await page.locator('h1').count()===0)throw Error('Missing H1');
      if(await page.locator('footer').count()===0)throw Error('Missing footer');
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
      if(width===1440&&(meta.slug==='home'||['mt5-white-label','forex-crm','about-us'].includes(meta.slug))){
        await page.screenshot({path:path.join(screenshots,key+'.png'),fullPage:true,animations:'disabled',timeout:50000});
      }
     }catch(error){errors.push({key,route,error:String(error)});console.error('FAIL',key,String(error));}
    }
   }
   await ctx.close();
   console.log('Finished viewport',width,'checks',manifest.length*6);
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.resolve('artifacts/visual-checks.json'),JSON.stringify({checks:6*6*manifest.length,errors},null,2));
 console.log('Total checked:',6*6*manifest.length,'failures:',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
