import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
const parse=(name)=>JSON.parse(read(name));
const registry=parse('content/schema/render-map.json');
const attributes=parse('content/schema/block-attributes.json');
const ts=read('content/schema/section.ts');
const renderer=read('lib/render-sections.tsx');
const patterns=Object.keys(registry.layouts);
const match=ts.match(/sectionLayouts\s*=\s*\[([\s\S]*?)\]\s+as const/);
if(!match)throw Error('sectionLayouts typed enum missing');
const typeLayouts=[...match[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
const ordered=x=>[...x].sort().join('|');
if(ordered(typeLayouts)!==ordered(patterns))throw Error('TS layout values and render-map diverged');
if(!renderer.includes("import renderMap from '@/content/schema/render-map.json'")||!renderer.includes('switch(target.runtime)'))throw Error('Renderer no longer uses canonical render registry');
const pathExists=(module)=>fs.existsSync(path.join(root,module+'.tsx'))||fs.existsSync(path.join(root,module,'index.ts'));
for(const [layout,details] of Object.entries(registry.layouts)){
 if(!details.runtime||!details.module||!details.kind||!details.wordpress)throw Error('Invalid '+layout+' metadata');
 if(!pathExists(details.module))throw Error('Missing registered module '+details.module);
 if(details.runtime!=='suppressed'&&!renderer.includes("case '"+details.runtime+"'"))throw Error('Layout '+layout+' cannot reach '+details.runtime);
}
if(registry.layouts.mediaBand.onlyPageId!=='home'||registry.layouts.ctaBand.neverRenderAsSection!==true)throw Error('Required suppression policy changed');
for(const override of registry.overrides){
 if(!override.id||!override.title||!override.module||!pathExists(override.module))throw Error('Invalid override '+override.id);
 if(!renderer.includes("override?.id==='"+override.id+"'")&&!renderer.includes("override?.id==='"+override.id+"'"))throw Error('Override missing from renderer: '+override.id);
}
if(attributes.contractVersion!==registry.contractVersion)throw Error('Schema/manifest version drift');
const blocks=Object.entries(attributes.blocks);
if(blocks.length!==6)throw Error('Expected six registered interactive blocks');
for(const [id,definition] of blocks){
 const dir='blocks/'+id;
 if(!fs.existsSync(path.join(root,dir,'types.ts'))||!fs.existsSync(path.join(root,dir,'index.ts')))throw Error('Block missing exported types '+id);
 if(!fs.existsSync(path.join(root,definition.component)))throw Error('Block missing component '+id);
 if(typeof definition.attributes!=='object')throw Error('Block missing machine-readable attributes '+id);
 const types=read(dir+'/types.ts');
 if(!/export type [A-Za-z]+Attributes/.test(types))throw Error('Block missing Attributes type '+id);
}
const pages=fs.readdirSync(path.join(root,'content/pages')).filter(f=>f.endsWith('.json')).map(file=>parse('content/pages/'+file));
let sections=0;
for(const page of pages){
 for(const section of page.sections){
  sections++;
  if(!registry.layouts[section.layout])throw Error('Unknown layout '+section.layout);
  if(section.layout==='ctaBand'&&page.sections.at(-1)!==section)throw Error('Unexpected inline CTA');
 }
}
console.log('Contract tests passed:',patterns.length,'layout keys;',registry.overrides.length,'overrides;',blocks.length,'blocks;',pages.length,'pages;',sections,'sections');
