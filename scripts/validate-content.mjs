import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const site=read('content/site.config.json'),theme=read('theme/theme.json');
const pages=fs.readdirSync(path.join(root,'content/pages')).filter(name=>name.endsWith('.json')).sort().map(file=>read('content/pages/'+file));
const paths=site.routing.paths,images=theme.assets.images;
const allowLayouts=new Set(['iconRow','cardGrid2','cardGrid3','stack','mediaBand','timeline','splitContent','darkBand','gallery3','statsRow','faqAccordion','ctaBand']);
if(site.routing.trailingSlash!==false||paths.faq!=='/faq'||paths.contact!=='/contact')throw Error('Canonical route issue');
if(!site.features.noRepeatSectionDesigns||!site.features.maxOncePerSectionLayout)throw Error('No-repeat policy must be enabled');
if(pages.length!==13||Object.keys(paths).length!==13||Object.keys(images).length!==26)throw Error('Expected 13 pages and 26 images');
let sum=0,faq=0,bands=0,fullBlockWords=0;
for(const p of pages){
 if(p.slug!==paths[p.id]||p.seo.canonicalPath!==p.slug)throw Error('Canonical mismatch '+p.id);
 if(p.id==='home'){
  if(p.pageTop.variant!=='homeSlider'||p.pageTop.slides.length!==5||p.pageTop.intervalMs!==6000||new Set(p.pageTop.slides.map(x=>x.imageKey)).size!==5)throw Error('Home slider mismatch');
  const heroImages=p.pageTop.slides.map(slide=>images[slide.imageKey]);
  if(heroImages.some(img=>!img||!img.url.startsWith('https://images.unsplash.com/photo-')||!img.alt||!img.credit||!img.sourcePage||!img.position))throw Error('Missing curated slider source metadata');
  if(new Set(heroImages.map(img=>new URL(img.url).pathname)).size!==5)throw Error('Repeated hero images');
 }else if(p.pageTop.variant!=='pageHeader'||p.pageTop.height!=='240px')throw Error('Wrong compact header '+p.id);
 if(p.sections.at(-1)?.layout!=='ctaBand')throw Error('Only last section may be closing CTA '+p.id);
 const layouts=new Set();
 for(const section of p.sections){
  sum++;
  if(!allowLayouts.has(section.layout)||layouts.has(section.layout))throw Error('Repeated/invalid layout '+p.id+'/'+section.layout);
  layouts.add(section.layout);
  if(section.layout==='mediaBand'){bands++;if(!images[section.media.imageKey])throw Error('Broken band image '+p.id);}
  if(section.layout==='gallery3'&&(section.media?.imageKeys||[]).some(key=>!images[key]))throw Error('Broken gallery image '+p.id);
  if(section.layout==='faqAccordion')faq+=section.items?.length||0;
 }
 const blocks=p.fullBlocks||[];const count=blocks.reduce((n,b)=>n+(b.text?.trim().split(/\s+/).length||0),0);
 fullBlockWords+=count;
 if(p.id!=='faq'&&count<350)throw Error('Full source blocks missing '+p.id);
 if(p.noRepeatDesigns!==true||p.maxOncePerLayout!==true)throw Error('Variety flag missing '+p.id);
}
if(sum!==87||faq!==42||bands!==11||fullBlockWords<16000)throw Error('Source regression '+JSON.stringify({sum,faq,bands,fullBlockWords}));
console.log('Validated v5:',pages.length,'pages;',sum,'non-repeating sections;',fullBlockWords,'source block words;',faq,'FAQs;',bands,'bands; 26 images; five slides');
