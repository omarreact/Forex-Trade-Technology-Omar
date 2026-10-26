#!/usr/bin/env node
/**
 * Lossless, framework-neutral site export.
 * Run: npm run export:xml
 *
 * Exports every source field, all 13 pages, every FAQ/content block, global
 * navigation, asset URLs, design tokens, ordered CSS and source components.
 * JSON input remains the live Next.js source of truth.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const content={...json('content/metadata.json'),pages:fs.readdirSync(path.join(root,'content/pages')).filter(name=>name.endsWith('.json')).sort().map(name=>json('content/pages/'+name))};
const theme=json('theme/theme.json');
const site=json('content/site.config.json');
if(content.pages.length!==13)throw new Error('Expected exactly 13 pages');
const escapeXml=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
const cdata=value=>'<![CDATA['+String(value).replaceAll(']]>',']]]]><![CDATA[>')+']]>';
const attr=attrs=>Object.entries(attrs).filter(([,v])=>v!==undefined&&v!==null).map(([key,value])=>' '+key+'="'+escapeXml(value)+'"').join('');
const element=(name,attrs,body)=>'<'+name+attr(attrs)+'>'+body+'</'+name+'>';
function entry(name,value){
 const a=attr({name});
 if(value===null)return '<null'+a+'/>';
 if(Array.isArray(value))return '<array'+a+attr({count:value.length})+'>'+value.map((v,i)=>entry(String(i),v)).join('')+'</array>';
 if(typeof value==='object')return '<object'+a+'>'+Object.entries(value).map(([k,v])=>entry(k,v)).join('')+'</object>';
 return '<value'+a+attr({type:typeof value})+'>'+escapeXml(value)+'</value>';
}
const cssOrder=[...read('theme/styles/index.css').matchAll(/@import ["']\.\/([^"']+\.css)["'];/g)].map(m=>'theme/styles/'+m[1]);
const componentDirs=['parts','patterns','blocks','templates'];
function walk(rel){return fs.readdirSync(path.join(root,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(rel+'/'+e.name):e.name.endsWith('.tsx')?[rel+'/'+e.name]:[]);}
const templates=componentDirs.flatMap(walk).sort();
const rules=[
 {name:'Slider',trigger:'home.pageTop.variant=homeSlider',behavior:'Autoplay 6000ms; fade transition; 5 slides; dots only; mobile hero clamp(430px,68svh,570px); no nested scroll'},
 {name:'Trading stack flow',trigger:'home section title=How Your Trading Stack Connects',behavior:'Responsive five-stage icon flow, preserving original narrative from three text blocks'},
 {name:'Technology marquee',trigger:'home.layout=iconRow',behavior:'Edge-to-edge looping motion; stop motion for prefers-reduced-motion'},
 {name:'Accordion',trigger:'section.layout=faqAccordion or supplemental guide',behavior:'Native details summary, one answer open at a time, keyboard focus and reduced-motion support'},
 {name:'Review feedback',trigger:'Global layout',behavior:'Fixed right-middle review panel; page and section captured; POST kind=website-feedback to /api/contact on Vercel when Resend configured; static pages open an unsent mailto draft'},
 {name:'Contact form',trigger:'/contact',behavior:'Vercel POST /api/contact; GitHub Pages mailto draft; never claim delivery if email provider is missing'},
 {name:'Final CTA and footer',trigger:'every route',behavior:'Single shared CTA before a shared footer; home visual variant'}
];
const behaviorXml=rules.map(x=>element('behavior',x,'')).join('');
const sheetXml=cssOrder.map((file,i)=>element('stylesheet',{path:file,order:i+1,format:'css'},cdata(read(file)))).join('');
const components=templates.map(file=>element('component',{path:file,language:'tsx'},cdata(read(file)))).join('');
const pages=content.pages.map(page=>element('page',{id:page.id,slug:page.slug},
 Object.entries(page).filter(([key])=>key!=='id'&&key!=='slug').map(([key,value])=>entry(key,value)).join(''))).join('');
const rootXml='<?xml version="1.0" encoding="UTF-8"?>\n'+
 '<website-spec version="1.0" name="Forex Trade Technology" page-count="13" framework-neutral="true">'+
 '<usage>Portable content and style reference. Rebuild semantics and behavior on any stack. CSS/source snapshots preserve design specificity; browser QA is still required for pixel-level parity.</usage>'+
 element('site-configuration',{source:'content/site.config.json'},entry('root',site))+
 element('theme-configuration',{source:'theme/theme.json'},entry('root',theme))+
 element('content-metadata',{},entry('root',Object.fromEntries(Object.entries(content).filter(([k])=>k!=='pages'))))+
 element('pages',{count:pages.length?content.pages.length:0},pages)+
 element('interactions',{count:rules.length},behaviorXml)+
 element('stylesheets',{count:cssOrder.length},sheetXml)+
 element('component-sources',{count:templates.length},components)+
 '</website-spec>\n';
const file=path.join(root,'website.xml');
fs.writeFileSync(file,rootXml,'utf8');
console.log('Wrote',file,'bytes',Buffer.byteLength(rootXml),'pages',content.pages.length,'stylesheets',cssOrder.length,'components',templates.length);
