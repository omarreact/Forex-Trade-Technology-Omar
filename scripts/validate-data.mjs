import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../site-data');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const site=read('site.config.json'),theme=read('theme.styles.json'),content=read('pages.content.json');
const configured=new Set(site.pages.map(p=>p.slug));
const slugs=content.pages.map(p=>p.slug);
const duplicates=slugs.filter((s,i)=>slugs.indexOf(s)!==i);
if(configured.size!==13||slugs.length!==13||duplicates.length||configured.size!==new Set(slugs).size||slugs.some(s=>!configured.has(s)))throw new Error('13 unique pages must match the navigation configuration.');
if(!theme.assets?.images||!site.navigation?.primary||!site.footer||!site.site?.name)throw new Error('Required theme/site fields missing.');
for(const page of content.pages){
 if(!page.seo?.title||!page.hero?.title)throw new Error(`Incomplete page: ${page.slug}`);
 for(const section of page.sections||[]) if(!['cardGrid','prose','faqAccordion','darkCta','trustStrip','contactForm'].includes(section.type))throw new Error(`Unrecognized section type ${section.type}`);
}
console.log('OK: 13 matching pages, supported section types, theme assets and navigation.');
