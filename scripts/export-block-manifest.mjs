#!/usr/bin/env node
/** Export portable block and pattern contracts without introducing a WP runtime. */
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const mapping={
 iconRow:'block/trust-carousel',cardGrid2:'pattern/CardGrid2',cardGrid3:'pattern/CardGrid3',
 timeline:'pattern/TimelineSteps',stack:'pattern/StackProse',darkBand:'pattern/DarkBand',
 mediaBand:'pattern/MediaBand',gallery3:'pattern/Gallery3',faqAccordion:'pattern/FaqAccordion',
 splitContent:'pattern/SplitContent (contact → block/contact-form)',ctaBand:'part/FinalCta (suppressed in JSON sections)',
 'title:How Your Trading Stack Connects':'block/trading-stack-flow',
 'title:Platform & Infrastructure Under One Roof':'pattern/FeatureFlex',
 'title:Why Brokers Work With Us':'pattern/FeatureFlex',
 'title:Who We Work With + H3':'block/audience-carousel'
};
const blocks=['home-slider','trading-stack-flow','trust-carousel','audience-carousel','icon-card','contact-form'];
const manifest={version:1,runtime:'Next.js only',generatedAt:new Date().toISOString(),layouts:mapping,blocks:blocks.map(name=>({
 name:'forex-trade-technology/'+name,
 typeFile:'blocks/'+name+'/types.ts',
 typeSource:fs.readFileSync(path.join(root,'blocks',name,'types.ts'),'utf8')
})),theme:'theme/theme.json',pages:'content/pages/*.json',contactTransport:'plugin boundary: app/api/contact/route.ts'};
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
const out=path.join(root,'artifacts/block-manifest.json');
fs.writeFileSync(out,JSON.stringify(manifest,null,2)+'\n','utf8');
console.log('Generated',out,'with',blocks.length,'blocks and',Object.keys(mapping).length,'layout/override contracts');
