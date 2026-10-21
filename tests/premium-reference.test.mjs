import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const file=p=>new URL('../'+p,import.meta.url);
const text=p=>readFileSync(file(p),'utf8');
const names=['matchtrade','b2broker','leverate','softfx','uptrader'];
const arts=['TradingDesk','EcosystemView','BrokerageWorkbench','InfrastructureTerminal','CRMWorkflow'];
test('every alternative design has an independent interactive technology interface',()=>{
 for(let i=0;i<5;i++){
  const base='components/designs/design-'+(i+2)+'-'+names[i]+'/';
  assert.ok(existsSync(file(base+arts[i]+'.tsx')));
  assert.match(text(base+arts[i]+'.tsx'),/useState/);
  assert.match(text(base+arts[i]+'.tsx'),/role="tablist"/);
  assert.match(text(base+arts[i]+'.tsx'),/aria-selected/);
  assert.match(text(base+'Page.tsx'),new RegExp('<'+arts[i]+'\\s*\\/>'));
  assert.match(text(base+'Page.tsx'),/content\.sections\.map|sections\.map/);
  assert.match(text(base+'Page.tsx'),/<CTA content=\{content\}\/\><Footer\/>/);
 }
});
test('required approved source pages stay centralized and complete',()=>{
 const manifest=JSON.parse(text('public/theme-assets/content/page-manifest.json'));
 assert.equal(manifest.length,13);
 assert.equal(new Set(manifest.map(p=>p.route)).size,13);
 assert.equal(manifest.length*6,78);
});
test('Design 1 actual slider selector receives professional compact mobile/desktop dimensions',()=>{
 const css=text('app/premium-studio.css');
 assert.match(css,/ftt-home main\.ftt-home-main \.ftt-full-slide-hero/);
 assert.match(css,/height:clamp\(460px,68svh,620px\)!important/);
 assert.match(css,/height:clamp\(535px,85svh,670px\)!important/);
 assert.match(css,/ftt-rd-section-wrap/);
 assert.match(css,/ftt-home-inline-media img/);
});
test('independent style systems loaded without competitor trademarks or source image hotlinks',()=>{
 assert.match(text('app/layout.tsx'),/import '\.\/premium-studio\.css';/);
 const css=text('app/premium-studio.css');
 for(let i=2;i<=6;i++)assert.match(css,new RegExp('\\.rp'+i+'-'));
 assert.doesNotMatch(css,/url\(["']?https?:\/\/(?:match-trade|b2broker|leverate|soft-fx|uptrader)/i);
 for(let i=0;i<5;i++)assert.doesNotMatch(text('components/designs/design-'+(i+2)+'-'+names[i]+'/'+arts[i]+'.tsx'),/<img\b/);
});
test('content rendering retains semantic sections and distinct footers',()=>{
 const source=text('lib/variants/content.ts');
 assert.match(source,/function sectionsOf/);assert.match(source,/function cleanMarkup/);
 for(let i=0;i<5;i++){const p=text('components/designs/design-'+(i+2)+'-'+names[i]+'/Page.tsx');assert.match(p,/function Footer\(/);assert.match(p,/function CTA\(/);}
});
