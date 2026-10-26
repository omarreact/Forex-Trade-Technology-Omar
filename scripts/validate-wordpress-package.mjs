import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const project=path.resolve(import.meta.dirname,'..');
const theme=path.join(project,'wordpress/forex-trade-technology');
const plugin=path.join(project,'wordpress/forex-trade-technology-contact');
const read=name=>JSON.parse(fs.readFileSync(path.join(theme,name),'utf8'));
const source=read('data/source-theme.json'),site=read('data/site.config.json'),registry=read('data/render-map.json');
const pages=fs.readdirSync(path.join(theme,'data/pages')).filter(x=>x.endsWith('.json')).map(x=>read('data/pages/'+x));
const blocks=fs.readdirSync(path.join(theme,'blocks')).filter(x=>fs.existsSync(path.join(theme,'blocks',x,'block.json'))).map(x=>read('blocks/'+x+'/block.json'));
const names=new Set(blocks.map(x=>x.name));
const required=['home-slider','page-hero','site-header','site-footer','final-cta','section','guide','contact-form','trust-carousel','trading-stack-flow','audience-carousel','document-notes','icon-card'];
assert.equal(pages.length,13,'13 source pages');
assert.equal(blocks.length,required.length,'13 dynamic blocks');
required.forEach(name=>assert(names.has('forex-trade-technology/'+name),'missing '+name));
for(const b of blocks){assert.equal(b.apiVersion,3);assert(b.attributes&&typeof b.attributes==='object');}
assert.equal(Object.keys(site.routing.paths).length,13);
const allIds=new Set(),allPaths=new Set();let total=0,faq=0,band=0,slides=0;
for(const p of pages){
 assert(!allIds.has(p.id),'duplicate ID');assert(!allPaths.has(p.slug),'duplicate slug');allIds.add(p.id);allPaths.add(p.slug);
 assert.equal(p.slug,site.routing.paths[p.id]);assert.equal(p.seo.canonicalPath,p.slug);
 assert(p.pageTop&&p.hero,'hero contract');
 assert.equal(p.sections.at(-1)?.layout,'ctaBand','closing CTA suppression contract');
 for(const section of p.sections){total++;assert(registry.layouts[section.layout],'layout '+section.layout);if(section.layout==='faqAccordion')faq+=section.items.length;if(section.layout==='mediaBand')band++;}
 if(p.id==='home'){slides=p.pageTop.slides.length;assert.equal(p.pageTop.autoplay,true);}
}
assert.equal(total,87);assert.equal(faq,42);assert.equal(band,11);assert.equal(slides,5);
assert.equal(Object.keys(source.assets.images).length,26);
assert.equal(registry.layouts.mediaBand.onlyPageId,'home');assert.equal(registry.layouts.ctaBand.neverRenderAsSection,true);
const files=fs.readdirSync(path.join(project,'theme/styles')).filter(f=>f.endsWith('.css'));
const cssPath=path.join(theme,'assets/css');
for(const css of files)assert(fs.existsSync(path.join(cssPath,css)),'Missing mirrored CSS '+css);
for(const css of ['trust-carousel.css','icon-box-carousel.css','trading-stack-flow.css'])assert(fs.existsSync(path.join(cssPath,'blocks',css)));
assert(fs.existsSync(path.join(plugin,'forex-trade-technology-contact.php')));
const importer=fs.readFileSync(path.join(theme,'inc/import.php'),'utf8');
assert(importer.includes('wp_insert_post')&&importer.includes('get_page_by_path')&&importer.includes('wp_slash'));
assert(importer.includes("if($layout==='ctaBand'||($layout==='mediaBand'&&$id!=='home'))continue"),'CTA / interior media suppression');
assert(importer.includes("ftt_block_comment('guide'"),'technical guide retention');
const templates=['front-page.html','page.html','index.html','404.html'];
templates.forEach(f=>assert(fs.existsSync(path.join(theme,'templates',f))));
const front=fs.readFileSync(path.join(theme,'templates/front-page.html'),'utf8');
const interior=fs.readFileSync(path.join(theme,'templates/page.html'),'utf8');
assert(front.includes('final-cta-home')&&interior.includes('"slug":"final-cta"'),'shared CTA variants');
const sourceCss=fs.readFileSync(path.join(project,'theme/styles/index.css'),'utf8').replaceAll('"./','"./').replace('index.css','front.css');
const packagedCss=fs.readFileSync(path.join(theme,'assets/css/front.css'),'utf8');
assert.equal(packagedCss,fs.readFileSync(path.join(project,'theme/styles/index.css'),'utf8'),'exact CSS cascade copy');
console.log('PASS: WordPress artifact contracts —',pages.length,'pages,',total,'sections,',faq,'FAQs,',band,'media bands,',slides,'slides,',blocks.length,'registered blocks, 26 image records');
