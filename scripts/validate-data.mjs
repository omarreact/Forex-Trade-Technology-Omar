import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../site-data');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const site=read('site.config.json'),theme=read('theme.styles.json'),content=read('pages.content.json');
const routeMap=site.routing?.paths||{};
const ids=Object.keys(routeMap),pages=content.pages;
if(site.routing.trailingSlash!==false)throw new Error('Redirect loop risk: trailingSlash must be false');
if(ids.length!==13||pages.length!==13||new Set(ids).size!==13)throw new Error('Expected 13 unique configured pages');
if(!site.navigation?.primary||!site.footer||!theme.assets?.images||Object.keys(theme.assets.images).length!==26)throw new Error('Missing site navigation, footer, or 26-image library');
if(!site.features?.homeHeroSlider?.enabled||!site.features?.scrollToTop?.enabled)throw new Error('Missing configured slider or scroll-to-top feature');
const visited=new Set(),allowed=new Set(['trustStrip','contentSection','ctaRow','darkCta','faqAccordion','mediaBand']);
const layouts=new Set(['splitLeft','splitRight','cardThumb','fullBleed','gridGallery','backgroundWash']);
let sections=0,fullWords=0,faqs=0,mediaSections=0;
for(const p of pages){
 if(!ids.includes(p.id)||visited.has(p.id))throw new Error(`Unexpected or repeated id ${p.id}`);
 visited.add(p.id);
 if(p.slug!==routeMap[p.id]||p.seo.canonicalPath!==p.slug||p.slug!=='/'&&p.slug.endsWith('/'))throw new Error(`Routing mismatch ${p.id}: ${p.slug}`);
 if(!p.seo.title||!p.seo.description||!p.hero.title)throw new Error(`Missing SEO or hero ${p.id}`);
 fullWords+=p.wordCountApprox||0;
 if(p.id==='home'){
  if(p.pageTop?.variant!=='homeSlider'||p.pageTop.slides?.length!==5||p.pageTop.intervalMs!==6000)throw new Error('Home must have five slides at six-second intervals');
  const keys=p.pageTop.slides.map(s=>s.imageKey);
  if(new Set(keys).size!==5||keys.some(k=>!theme.assets.images[k]))throw new Error('Home slides must have unique library images');
 }else{
  if(p.pageTop?.variant!=='pageHeader'||p.pageTop.height!=='240px')throw new Error(`Wrong interior header ${p.id}`);
  if(!p.pageTop.breadcrumbs?.length||!theme.assets.images[p.pageTop.backgroundImageKey])throw new Error(`Missing breadcrumbs or header image ${p.id}`);
 }
 const headings=new Set((p.fullBlocks||[]).filter(b=>b.type==='h2').map(b=>b.text));
 for(const section of p.sections){
  sections++;
  if(!allowed.has(section.type))throw new Error(`Unknown section type ${section.type}`);
  if(section.type==='contentSection'){
   if(!headings.has(section.title))throw new Error(`Source heading missing ${p.id}: ${section.title}`);
   if(!section.blocks?.length)throw new Error(`Source paragraphs missing ${p.id}: ${section.id}`);
  }
  if(section.type==='faqAccordion')faqs+=section.items?.length||0;
  if(section.media){
   mediaSections++;
   if(!theme.assets.images[section.media.imageKey]||!new Set(['backgroundWash','mediaBand']).has(section.media.layout))throw new Error(`Broken image key/layout at ${p.id}/${section.id}`);
  }
 }
}
const navChildren=site.navigation.primary.find(x=>x.id==='solutions')?.children||[];
if(navChildren.length!==8)throw new Error(`Expected eight solutions, found ${navChildren.length}`);
if(fullWords<19000||sections<140||faqs!==42||mediaSections<18)throw new Error(`Full-content regression: ${fullWords} words, ${sections} sections, ${faqs} FAQ, ${mediaSections} images`);
if(site.routing.paths.faq!=='/faq'||site.routing.paths.contact!=='/contact')throw new Error('FAQ/contact redirects must use exact paths');
console.log(`Validated v4 dense: ${pages.length} pages, ${fullWords} source words, ${sections} sections, ${faqs} FAQs, ${mediaSections} image layouts, ${Object.keys(theme.assets.images).length} images, 5 slides, nested routes`);
