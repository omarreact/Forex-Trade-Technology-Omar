import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../site-data');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const site=read('site.config.json'),theme=read('theme.styles.json'),content=read('pages.content.json');
const configured=new Set(site.pages.map(p=>p.id));
const pageIds=content.pages.map(p=>p.id), slugs=content.pages.map(p=>p.slug);
if(configured.size!==13||pageIds.length!==13||new Set(pageIds).size!==13||new Set(slugs).size!==13||configured.size!==new Set(pageIds).size||pageIds.some(id=>!configured.has(id)))
 throw new Error('Expected 13 unique pages matching the site configuration by id.');
if(!theme.assets?.images||!site.navigation?.primary||!site.footer||!site.site?.name)throw new Error('Missing site or theme configuration.');
const types=new Set(['contentSection','ctaRow','faqAccordion','darkCta','trustStrip']);
let totalWords=0,sectionCount=0,renderableBlocks=0,faqCount=0;
for(const page of content.pages){
 if(!page.seo?.title||!page.seo?.description||!page.hero?.title||!page.slug)throw new Error(`Missing page fields: ${page.id}`);
 if(!page.slug.startsWith('/')||page.seo.canonicalPath!==page.slug)throw new Error(`Invalid canonical path ${page.slug}`);
 const h3=(page.fullBlocks||[]).filter(b=>b.type==='h3').map(b=>b.text);
 const h2=(page.fullBlocks||[]).filter(b=>b.type==='h2').map(b=>b.text);
 const rendered=[];
 for(const section of page.sections){
  sectionCount++;
  if(!types.has(section.type))throw new Error(`Unrendered section type ${page.id}: ${section.type}`);
  if(section.type==='contentSection'){
   if(!section.title)throw new Error(`Untitled content section ${page.id}`);
   if(!h2.includes(section.title))throw new Error(`Full-content H2 missing in original blocks: ${page.id}: ${section.title}`);
   for(const block of section.blocks||[]){if(!['h3','p'].includes(block.type))throw new Error(`Unsupported editorial block ${block.type}`);rendered.push(block);}
  }
  if(section.type==='faqAccordion'){faqCount+=(section.items||[]).length;if(page.id==='faq'&&section.items.length<40)throw new Error('Full FAQ must contain all 42 questions.');}
 }
 if(page.id!=='faq'){
  if(rendered.length===0)throw new Error(`Page has no renderable blocks ${page.id}`);
  for(const heading of h3) if(!rendered.some(b=>b.type==='h3'&&b.text===heading))throw new Error(`Missing original H3: ${page.id}: ${heading}`);
 }
 renderableBlocks+=rendered.length;
 totalWords+=(page.wordCountApprox||0);
}
if(totalWords<18000||sectionCount<125||faqCount<40)throw new Error(`Full-content regression detected: ${totalWords} words, ${sectionCount} sections, ${faqCount} FAQ items.`);
console.log(`OK: ${pageIds.length} full pages, ${totalWords} approx source words, ${sectionCount} sections, ${renderableBlocks} content blocks, ${faqCount} FAQ answers. All nested routes/SEO slugs validated.`);
