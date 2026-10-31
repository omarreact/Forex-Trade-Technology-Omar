/**
 * FSE editing architecture contract.
 * Does not claim WordPress runtime activation or pixel-perfect visual parity.
 * Run: node scripts/validate-fse-editing.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('wordpress/forex-trade-technology');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const theme=JSON.parse(read('theme.json'));
const config=JSON.parse(read('data/site.config.json'));
const header=read('parts/header.html');
const footer=read('parts/footer.html');
const nativeHeader=read('parts/header-native.html');
const nativeFooter=read('parts/footer-native.html');
const editor=read('assets/js/editor.js');
const renderer=read('inc/render.php');
const front=read('assets/js/front.js');
const nativeCss=read('assets/css/fse-native.css');
const meta=JSON.parse(read('blocks/site-header/block.json'));

// Verify current front end hasn't switched to an untested visual implementation.
assert.match(header,/wp:forex-trade-technology\/site-header/);
assert.match(footer,/wp:forex-trade-technology\/site-footer/);
for(const [name,area,source] of [
  ['header-native','header',nativeHeader],
  ['footer-native','footer',nativeFooter]
]){
  assert(theme.templateParts.some(x=>x.name===name&&x.area===area),name+' must be registered');
  assert(source.includes('<!-- wp:'),name+' should contain Gutenberg block markup');
  const stack=[];
  const pattern=/<!--\s*(\/?)wp:([\w/-]+)(?:\s+({.*?}))?\s*(\/?)-->/g;
  let match;
  while((match=pattern.exec(source))){
    const [all,closing,name,attrs,selfClosing]=match;
    if(attrs)JSON.parse(attrs);
    if(closing)assert.equal(stack.pop(),name,name+' closing order mismatch');
    else if(!selfClosing)stack.push(name);
  }
  assert.deepEqual(stack,[],name+' has unclosed blocks');
  assert(!source.includes('ftt/site-navigation'),name+' should use Core blocks');
}
assert.match(nativeHeader,/wp:navigation/);
assert.match(nativeHeader,/wp:navigation-submenu/);
assert.match(nativeHeader,/wp:site-title/);
assert.match(nativeFooter,/wp:columns/);
assert.match(nativeFooter,/wp:social-links/);
assert.equal(meta.attributes.brand.type,'object');
assert.match(editor,/Add menu link/);
assert.match(editor,/Add dropdown/);
assert.match(editor,/Add submenu link/);
assert.match(editor,/Add footer column/);
assert.match(editor,/Copyright and legal notice/);
assert.match(renderer,/\$submenuIds=/);
assert.match(renderer,/esc_html\(\(string\)\$brand\['primary'\]\)/);
assert.match(front,/closeDropdowns/);
// Native prototype should preserve original source link inventory.
const routes=[
 ...config.navigation.primary.flatMap(item=>item.children||[item]),
 ...config.footer.columns.flatMap(column=>column.links||[])
];
for(const {href} of routes){
 if(typeof href!=='string'||!href.startsWith('/'))continue;
 assert(nativeHeader.includes('"url":"'+href+'"')||nativeFooter.includes('"url":"'+href+'"'),
   'missing native template URL: '+href);
}
// Native preview CSS must be limited to scoped selectors, not broad site resets.
for(const chunk of nativeCss.split('}')){
 const rule=chunk.split('{')[0].trim();
 if(!rule||rule.startsWith('/*')||rule.startsWith('@media'))continue;
 // Body is intentionally not modified by any standalone unscoped rule.
 assert(!/(^|,)\s*(?:body|html|\.bs-site-header|\.bs-footer)\b/.test(rule),
   'Unscoped native CSS selector: '+rule);
}
console.log('FSE editing checks passed: active parts preserved, native parts balanced, menus and controls registered.');
