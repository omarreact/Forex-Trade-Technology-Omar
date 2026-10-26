import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const site=read('content/site.config.json');
const theme=read('theme/theme.json');
const registry=read('content/schema/render-map.json');
const pages=fs.readdirSync(path.join(root,'content/pages')).filter(name=>name.endsWith('.json')).sort()
 .map(file=>({file,page:read('content/pages/'+file)}));
const paths=site.routing.paths, images=theme.assets.images;
const allowedLayouts=new Set(Object.keys(registry.layouts));
const fail=(where,message)=>{throw Error(where+': '+message);};
const str=(value,where)=>{if(typeof value!=='string'||!value.trim())fail(where,'required non-empty string');};
const list=(value,where)=>{if(!Array.isArray(value))fail(where,'expected array');};
const checkBlocks=(blocks,where)=>{
 list(blocks,where);
 for(const [i,b] of blocks.entries()){
  if(!b||!['h2','h3','p'].includes(b.type))fail(where+'['+i+']','invalid content block type');
  str(b.text,where+'['+i+'].text');
 }
};
const checkButton=(button,where)=>{if(!button||typeof button!=='object')fail(where,'expected button');str(button.label,where+'.label');str(button.href,where+'.href');};
if(registry.contractVersion!==1)fail('render-map','unexpected contractVersion');
if(site.routing.trailingSlash!==false||paths.faq!=='/faq'||paths.contact!=='/contact')fail('routes','canonical route issue');
if(!site.features.noRepeatSectionDesigns||!site.features.maxOncePerSectionLayout)fail('site','no-repeat policy must remain enabled');
if(pages.length!==13||Object.keys(paths).length!==13||Object.keys(images).length!==26)fail('inventory','expected 13 pages, 13 routes and 26 images');
for(const [layout,target] of Object.entries(registry.layouts)){
 if(!target.module||!target.runtime||!target.kind)fail('render-map.'+layout,'incomplete target');
}
let sum=0,faq=0,bands=0,fullBlockWords=0;
const allIds=new Set(), allSlugs=new Set();
for(const {file,page:p} of pages){
 const prefix='content/pages/'+file;
 str(p.id,prefix+'.id');str(p.slug,prefix+'.slug');str(p.hero?.title,prefix+'.hero.title');
 str(p.seo?.title,prefix+'.seo.title');str(p.seo?.description,prefix+'.seo.description');
 if(allIds.has(p.id)||allSlugs.has(p.slug))fail(prefix,'duplicate page ID or slug');
 allIds.add(p.id);allSlugs.add(p.slug);
 if(p.slug!==paths[p.id]||p.seo.canonicalPath!==p.slug)fail(prefix,'canonical mismatch');
 if(!p.pageTop||!['homeSlider','pageHeader'].includes(p.pageTop.variant))fail(prefix,'invalid pageTop');
 if(p.id==='home'){
  const slides=p.pageTop.slides;
  if(p.pageTop.variant!=='homeSlider'||!Array.isArray(slides)||slides.length!==5||p.pageTop.intervalMs!==6000||new Set(slides.map(x=>x.imageKey)).size!==5)fail(prefix,'home slider contract mismatch');
  const slideImages=slides.map(s=>{str(s.title,prefix+'.pageTop.slides.title');if(s.cta)checkButton(s.cta,prefix+'.pageTop.slides.cta');return images[s.imageKey];});
  if(slideImages.some(img=>!img||!img.url.startsWith('https://images.unsplash.com/photo-')||!img.alt||!img.credit||!img.sourcePage||!img.position))fail(prefix,'curated slide asset metadata incomplete');
  if(new Set(slideImages.map(img=>new URL(img.url).pathname)).size!==5)fail(prefix,'repeated hero images');
 }else if(p.pageTop.variant!=='pageHeader'||p.pageTop.height!=='240px')fail(prefix,'interior pageTop contract mismatch');
 list(p.sections,prefix+'.sections');
 if(p.sections.at(-1)?.layout!=='ctaBand')fail(prefix,'last section must be closing CTA');
 const seenLayouts=new Set(),seenSections=new Set();
 for(const [i,s] of p.sections.entries()){
  const at=prefix+'.sections['+i+']';sum++;
  str(s.id,at+'.id');
  if(seenSections.has(s.id))fail(at,'duplicate section ID');
  seenSections.add(s.id);
  if(!allowedLayouts.has(s.layout)||seenLayouts.has(s.layout))fail(at,'unknown or duplicated layout '+s.layout);
  seenLayouts.add(s.layout);
  if(s.title!==undefined)str(s.title,at+'.title');
  if(s.blocks!==undefined)checkBlocks(s.blocks,at+'.blocks');
  if(s.cta!==undefined)checkButton(s.cta,at+'.cta');
  if(s.ctas!==undefined){list(s.ctas,at+'.ctas');s.ctas.forEach((cta,k)=>checkButton(cta,at+'.ctas['+k+']'));}
  if(s.layout==='iconRow'){list(s.items,at+'.items');if(s.items.some(x=>typeof x!=='string'||!x.trim()))fail(at,'trust labels must be strings');}
  if(s.layout==='faqAccordion'){
   list(s.items,at+'.items');
   for(const [k,item] of s.items.entries()){str(item?.q,at+'.items['+k+'].q');str(item?.a,at+'.items['+k+'].a');}
   faq+=s.items.length;
  }
  if(s.layout==='mediaBand'){
   bands++;
   if(!images[s.media?.imageKey])fail(at,'invalid band image asset');
  }
  if(s.layout==='gallery3'&&(s.media?.imageKeys||[]).some(key=>!images[key]))fail(at,'invalid gallery image asset');
 }
 if(p.fullBlocks!==undefined){
  checkBlocks(p.fullBlocks,prefix+'.fullBlocks');
  fullBlockWords+=p.fullBlocks.reduce((n,b)=>n+(b.text.trim().split(/\s+/).length||0),0);
 }
 if(p.id!=='faq'&&(!p.fullBlocks||p.fullBlocks.reduce((n,b)=>n+b.text.trim().split(/\s+/).length,0)<350))fail(prefix,'full source blocks missing');
 if(p.documentFooterNotes!==undefined){list(p.documentFooterNotes,prefix+'.documentFooterNotes');if(p.documentFooterNotes.some(x=>typeof x!=='string'))fail(prefix,'invalid footer note');}
 if(p.noRepeatDesigns!==true||p.maxOncePerLayout!==true)fail(prefix,'variety flag missing');
}
if(sum!==87||faq!==42||bands!==11||fullBlockWords<16000)fail('inventory','regression '+JSON.stringify({sum,faq,bands,fullBlockWords}));
for(const layout of allowedLayouts){if(layout==='mediaBand'&&registry.layouts[layout].onlyPageId!=='home')fail('render-map','interior media bands not suppressed');if(layout==='ctaBand'&&registry.layouts[layout].neverRenderAsSection!==true)fail('render-map','duplicate CTAs possible');}
console.log('Validated contract v'+registry.contractVersion+':',pages.length,'pages;',sum,'non-repeating sections;',fullBlockWords,'source block words;',faq,'FAQs;',bands,'bands; 26 images; five slides');
