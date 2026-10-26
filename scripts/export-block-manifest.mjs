#!/usr/bin/env node
/** Machine-readable, versioned WP-handoff contract, not a WordPress runtime. */
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const registry=read('content/schema/render-map.json');
const attr=read('content/schema/block-attributes.json');
if(attr.contractVersion!==registry.contractVersion)throw Error('Block and render contracts disagree');
const blocks=Object.entries(attr.blocks).map(([slug,spec])=>({
 name:registry.namespace+'/'+slug,
 component:spec.component,
 typeFile:'blocks/'+slug+'/types.ts',
 attributes:spec.attributes,
 ...(spec.notes?{notes:spec.notes}:{})
}));
const manifest={
 contractVersion:registry.contractVersion,
 runtime:'Next.js (no WordPress runtime)',
 namespace:registry.namespace,
 layouts:Object.fromEntries(Object.entries(registry.layouts).map(([key,value])=>[key,{...value}])),
 overrides:registry.overrides,
 sharedFinalCta:registry.sharedFinalCta,
 blocks,
 paths:{theme:'theme/theme.json',pages:'content/pages/*.json',site:'content/site.config.json'},
 contactTransport:{current:'app/api/contact/route.ts',future:'standalone WordPress plugin',credentialPolicy:'server-only'}
};
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
const out=path.join(root,'artifacts/block-manifest.json');
fs.writeFileSync(out,JSON.stringify(manifest,null,2)+'\n','utf8');
console.log('Generated contract v'+manifest.contractVersion+' at',out,'with',blocks.length,'typed blocks and',Object.keys(manifest.layouts).length,'layouts');
