import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const ids=['matchtrade','b2broker','leverate','softfx','uptrader'];
test('the five screenshot-derived home layouts are independently implemented',()=>{
 for(let i=2;i<=6;i++){
  const path='components/designs/design-'+i+'-'+ids[i-2]+'/HomeSpotlight.tsx';
  const source=read(path);
  const container=read('components/designs/design-'+i+'-'+ids[i-2]+'/Page.tsx');
  assert.ok(source.includes('content.title'));
  assert.ok(source.includes('content.description'));
  assert.match(source,/content\.highlights\.map/);
  assert.match(source,/<h1(?:\\s|>)/);
  assert.match(container,/content\.home\?<HomeSpotlight content=\{content\}\/>:<Hero content=\{content\}\/>/);
  assert.match(container,/content\.sections\.map|sections\.map/);
  assert.ok(!container.includes('content.home&&'), 'Home highlights must not be duplicated');
  const css=read('app/reference-'+i+'.css');
  assert.ok(css.length>3000);
  assert.match(css,new RegExp('\\.r'+i+'-'));
  assert.match(css,/@media\(max-width:/);
 }
});
test('design 2 opens with an interactive platform and a swipeable product catalogue',()=>{const a=read('components/designs/design-2-matchtrade/HomeSpotlight.tsx');assert.match(a,/TraderPhone/);assert.match(a,/r2-devices/);assert.match(a,/r2-product-track/);assert.match(read('app/reference-2.css'),/scroll-snap-type:x mandatory/);});
test('design 3 contains cinematic blue hero and overlapping white ecosystem',()=>{
 const a=read('components/designs/design-3-b2broker/HomeSpotlight.tsx');
 assert.match(a,/r3-skyhero/);assert.match(a,/EcosystemPanel/);
 assert.match(read('app/reference-3.css'),/margin:-69px auto/);
});
test('design 4 uses coral product UI and meaningful solutions comparisons',()=>{
 const a=read('components/designs/design-4-leverate/HomeSpotlight.tsx');
 assert.match(a,/PlatformMock/);assert.match(a,/r4-solution-cards/);
 assert.match(read('app/reference-4.css'),/#f16451/);
});
test('design 5 has original trading terminal UI and technical matrix',()=>{
 const a=read('components/designs/design-5-softfx/HomeSpotlight.tsx');
 assert.match(a,/Terminal/);assert.match(a,/r5-topology-map/);
 assert.match(a,/r5-product-matrix/);
});
test('design 6 presents the CRM first without repeating the document process and product sections',()=>{const a=read('components/designs/design-6-uptrader/HomeSpotlight.tsx');assert.match(a,/CrmDashboard/);assert.match(a,/r6-home-rail/);assert.doesNotMatch(a,/r6-components|r6-process-grid/);});
test('Inter and Manrope use supplied Google Fonts assets and all surfaces',()=>{
 const s=read('app/fonts-reference.css');
 assert.match(s,/font-family:"Inter"/);assert.match(s,/font-family:"Manrope"/);
 assert.match(s,/fonts\.gstatic\.com\/s\/inter\/v20/);
 assert.match(s,/fonts\.gstatic\.com\/s\/manrope\/v20/);
 assert.match(s,/font-display:swap/);
 for(const file of ['fonts-reference.css','design-1-compact.css','reference-2.css','reference-3.css','reference-4.css','reference-5.css','reference-6.css'])
  assert.ok(read('app/layout.tsx').includes("import './"+file+"';"));
});
test('design 1 shrinks the original hero, imagery and unused interior page rails',()=>{
 const s=read('app/design-1-compact.css');
 assert.match(s,/min-height:clamp\(440px,61svh,630px\)/);
 assert.match(s,/max-height:235px/);
 assert.match(s,/ftt-rd-section-wrap/);
 assert.match(s,/grid-template-columns:minmax\(0,1fr\)!important/);
 assert.match(read('components/InteriorPageShell.tsx'),/<OriginalCTA meta=\{meta\}\/>/);
});

test('no alternative homepage repeats the long source narrative in a second custom section collection',()=>{
 const forbidden=['r2-about','r2-offer','r3-solutions','r3-solve','r4-comparison','r4-catalogue','r5-product-highlight','r5-services','r6-components','r6-process-grid'];
 for(let i=2;i<=6;i++){
  const name=['','', 'matchtrade','b2broker','leverate','softfx','uptrader'][i];
  const source=read('components/designs/design-'+i+'-'+name+'/HomeSpotlight.tsx');
  for(const className of forbidden)assert.ok(!source.includes('className="'+className+'"'),i+' duplicated block '+className);
 }
});
test('each interior and homepage uses full body width and never reserves an absent media column',()=>{
 const css=read('app/unique-fullwidth-compositions.css');
 assert.match(css,/\.c2 \.c2-chapter>\.c2-chapter-body\{grid-area:copy!important/);
 assert.match(css,/\.c4 \.c4-feature>\.c4-feature-copy\{grid-area:copy!important/);
 assert.match(css,/\.c5 \.c5-unit>\.c5-unit-body\{grid-area:body!important/);
 assert.match(css,/\.c6 \.c6-story>\.c6-story-words\{grid-area:body!important/);
 assert.match(css,/\.c4 \.c4-feature:not\(:has/);
 assert.match(css,/\.c6 \.c6-story:not\(:has/);
 assert.match(read('app/layout.tsx'),/unique-fullwidth-compositions\.css/);
});
