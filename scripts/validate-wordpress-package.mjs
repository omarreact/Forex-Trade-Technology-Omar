import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const base=path.resolve(import.meta.dirname,'..');
const theme=path.join(base,'wordpress/forex-trade-technology');
const expected=new Set([
 '.DS_Store','README.txt','style.css','theme.json','functions.php',
 'assets/css/site.css','assets/css/editor-canvas.css','assets/css/editor-ui.css',
 'assets/js/blocks.js','assets/js/site-enhancements.js','assets/icons.json',
 'parts/header.html','parts/footer.html',
 ...['front-page','page','single','archive','home','search','404','index'].map(x=>`templates/${x}.html`),
 ...['api-connectivity-live.gif','brokerage-operations.webp','brokerage-workflow-live.gif','data-center-infrastructure.webp','data-center-server.png','infrastructure-network-live.gif','office-tech-workspace.png','project-brokerage-launch.webp','project-crm-migration.webp','project-liquidity-routing.webp'].map(x=>`assets/images/${x}`)
]);
function scan(root,rel=''){
 return fs.readdirSync(path.join(root,rel),{withFileTypes:true}).flatMap(e=>{
  const p=path.posix.join(rel,e.name);
  return e.isDirectory()?scan(root,p):[p];
 });
}
const actual=new Set(scan(theme));
assert.equal(actual.size,31,'31 theme files');
assert.deepEqual([...actual].sort(),[...expected].sort(),'No added/missing theme paths');
for(const x of expected)assert(fs.statSync(path.join(theme,x)).isFile(),x);
const php=fs.readFileSync(path.join(theme,'functions.php'),'utf8');
assert(php.includes("register_rest_route('ftt/v1','/contact'"),'Contact must be theme-owned');
assert(php.includes("register_block_type('ftt/'.$name"),'11 granular FTT blocks');
const header=fs.readFileSync(path.join(theme,'parts/header.html'),'utf8');
const footer=fs.readFileSync(path.join(theme,'parts/footer.html'),'utf8');
assert(header.includes('ftt-brand-image')&&footer.includes('ftt-footer-image'),'Source logos');
const xml=fs.readFileSync(path.join(base,'website.xml'),'utf8');
assert(xml.includes('<rss version="2.0"')&&xml.includes('<wp:wxr_version>1.2</wp:wxr_version>'),'Native WXR format');
assert.equal((xml.match(/<item>/g)||[]).length,16,'13 Next.js pages and 3 parents');
assert.equal((xml.match(/<wp:post_type>page<\/wp:post_type>/g)||[]).length,16,'All WXR items are pages');
const js=fs.readFileSync(path.join(theme,'assets/js/blocks.js'),'utf8');
for(const name of ['container','link','inline-text','icon','faq-item','form-field','social-links','image','site-navigation','nav-link','nav-submenu'])assert(js.includes(name),name);
console.log('PASS: 31-file locked theme, built-in contact, 11 custom blocks, 16 WXR page records.');
