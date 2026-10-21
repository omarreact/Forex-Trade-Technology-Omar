import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('public/theme-assets/content/page-manifest.json'));
const approved=['home','brokerage-setup','mt5-white-label','forex-broker-hosting','forex-liquidity-connectivity','forex-crm','kyc-aml-integration','payment-gateway-integration','prop-firm-crm-api','how-it-works','about-us','faq','contact'];
test('13 unique source-verified routes and approved files',()=>{
 assert.equal(manifest.length,13);
 assert.deepEqual(new Set(manifest.map(p=>p.slug)),new Set(approved));
 assert.equal(new Set(manifest.map(p=>p.route)).size,13);
 for(const p of manifest){
  assert.ok(p.source_document_id);
  assert.match(p.content_status,/source-verified/);
  assert.ok(existsSync(new URL('public/theme-assets/content/pages/'+p.file,root)));
  assert.match(read('public/theme-assets/content/pages/'+p.file),/<h1\b/i);
 }
});
test('six design tokens and docs with scoped selectors',()=>{
 const registry=read('lib/showroom/designs.ts'),css=read('app/showroom.css');
 for(const id of ['original','match-trader','b2broker','leverate','soft-fx','uptrader']){
  assert.ok(registry.includes("id:'"+id+"'"));
  assert.ok(existsSync(new URL('design/'+id+'.tokens.json',root)));
  assert.ok(existsSync(new URL('docs/design-systems/'+id+'.md',root)));
  if(id!=='original') assert.ok(css.includes('[data-design="'+id+'"]'));
 }
});
test('comparison and noindex routes exist',()=>{
 assert.match(read('app/showroom/page.tsx'),/FramePreview/);
 assert.match(read('app/showroom/layout.tsx'),/index:false/);
 assert.match(read('middleware.ts'),/X-Robots-Tag/);
});
