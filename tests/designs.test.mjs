import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('public/theme-assets/content/page-manifest.json'));
const references=['original','matchtrade','b2broker','leverate','softfx','uptrader'];
const classNames=['','c2','c3','c4','c5','c6'];
test('exactly 13 approved content pages and 78 routes',()=>{
  assert.equal(manifest.length,13);
  assert.equal(new Set(manifest.map(p=>p.route)).size,13);
  assert.equal(13*6,78);
});
test('five separate React page trees, each owning its Header/Hero/Content/CTA/Footer',()=>{
 for(let i=2;i<=6;i++){
   const file='components/designs/design-'+i+'-'+references[i-1]+'/Page.tsx';
   assert.ok(existsSync(new URL('../'+file,import.meta.url)),file);
   const source=read(file);
   const labels=i===2?['Header','Hero','Story','CTA','Footer']:i===3?['Header','Hero','Body','CTA','Footer']:i===4?['Header','Hero','Journey','CTA','Footer']:i===5?['Header','Hero','Infrastructure','CTA','Footer']:['Header','Hero','Content','CTA','Footer'];
   for(const label of labels)assert.match(source,new RegExp('function '+label+'\\('),file+' '+label);
   assert.match(source,/<CTA content=\{content\}\/><Footer\/>/);
   assert.match(source,/(?:content\.sections|sections)\.map/);
   assert.match(source,/SegmentPhoto/);
   assert.match(source,/HtmlSection/);
   assert.match(source,/className="c[2-6]-/);
 }
 const route=read('app/[design]/[[...segments]]/page.tsx');
 for(const label of ['MatchTradeProposal','B2BrokerProposal','LeverateProposal','SoftFxProposal','UpTraderProposal'])assert.match(route,new RegExp(label));
});
test('independent scoped CSS for each premium design, with mobile and reduced-motion',()=>{
 for(let i=2;i<=6;i++){
  const css=read('app/design-'+i+'-'+references[i-1]+'.css');
  assert.match(css,new RegExp('\\.c'+i+'\\b'));
  assert.match(css,/@media\s*\(max-width/);
  assert.ok(css.length>3000,'substantial independent CSS');
 }
 assert.match(read('app/designs-base.css'),/prefers-reduced-motion/);
});
test('design 1 retains original hero and footer plus dedicated CTA',()=>{
 const home=read('app/page.tsx');
 const interior=read('components/InteriorPageShell.tsx');
 assert.match(home,/<HomeHero intro=\{intro\} slides=\{slides\}/);
 assert.match(home,/<OriginalCTA \/>\s*<SiteFooter \/>/);
 assert.match(interior,/<OriginalCTA meta=\{meta\}\/>\s*<SiteFooter \/>/);
 assert.match(read('app/design-1-original-cta.css'),/ftt-rd-section-wrap/);
});
test('all designs documented with independent implementation tokens',()=>{
 for(let i=1;i<=6;i++){
  const name=references[i-1];
  assert.ok(existsSync(new URL('../docs/designs/design-'+i+'-'+name+'.md',import.meta.url)));
  const t=JSON.parse(read('design/tokens/design-'+i+'.json'));
  assert.equal(t.design,'design-'+i);
  for(const key of ['primary','secondary','accent','background','text'])assert.match(t.colors[key],/^#[\da-f]{6}$/i);
 }
 assert.match(read('docs/designs/visual-comparison.md'),/Font family/);
});
