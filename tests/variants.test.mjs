import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('public/theme-assets/content/page-manifest.json'));
const variants=['design-1','design-2','design-3','design-4','design-5','design-6'];
const routes=manifest.map(p=>p.route.replace(/\/$/,''));
test('each of six independently routed sites has exactly 13 approved content pages',()=>{
 assert.equal(manifest.length,13);
 assert.equal(new Set(routes).size,13);
 const src=read('lib/variants/content.ts');
 for(const id of variants)assert.ok(src.includes("'"+id+"'"),id);
 assert.ok(existsSync(new URL('app/[design]/[[...segments]]/page.tsx',root)));
 for(const p of manifest){
  assert.ok(p.source_document_id && p.content_status.startsWith('source-verified'),p.slug);
  const source=read('public/theme-assets/content/pages/'+p.file);
  assert.match(source,/<h1\b/i,p.slug);
  assert.match(source,/<section\b/i,p.slug);
 }
 assert.equal(variants.flatMap(d=>manifest.map(p=>d+p.route)).length,78);
});
test('each of five original implementations has its own page structure',()=>{
 const components=read('components/variants/Variations.tsx');
 const css=read('app/variants.css');
 for(const [i,name] of ['Two','Three','Four','Five','Six'].entries()){
  assert.match(components,new RegExp('export function Variation'+name+'\\b'));
  assert.ok(components.includes('v-'+['two','three','four','five','six'][i]));
  assert.ok(css.includes('.v-'+['two','three','four','five','six'][i]));
 }
 assert.match(components,/SectionBody section=\{section\}/);
 assert.match(css,/@media\(max-width:720px\)/);
 assert.match(css,/@media\(max-width:390px\)/);
});
test('original baseline is preserved and extra comparison toolbar is not mounted',()=>{
 const page=read('app/[design]/[[...segments]]/page.tsx');
 assert.match(page,/<HomePage\/>/);
 assert.match(page,/<InteriorPageShell /);
 assert.match(page,/OriginalLinkBridge/);
 const layout=read('app/layout.tsx');
 assert.ok(!layout.includes('DesignShowroomShell'));
 assert.ok(layout.includes("import './variants.css'"));
});
test('approved form semantics and cross-site internal navigation are retained',()=>{
 const src=read('lib/variants/content.ts');
 const shared=read('components/variants/shared.tsx');
 const contact=read('public/theme-assets/html/contact-form.html');
 assert.match(src,/data-v-honeypot/);
 assert.match(src,/data-v-grid/);
 assert.match(shared,/variationPath\(design,/);
 assert.match(contact,/name="email"/);
});
