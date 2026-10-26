import {Fragment} from 'react';
import visualLabels from '@/content/visual-labels.json';
import renderMap from '@/content/schema/render-map.json';
import type {SectionLayout} from '@/content/schema/section';
const layoutContract=renderMap.layouts as Record<SectionLayout,{runtime:string;neverRenderAsSection?:boolean;onlyPageId?:string}>;
import type {ContentBlock,SectionData,PageData} from '@/content/schema/page';
import {regroup} from '@/patterns/section-helpers';
import {FeatureFlexSection} from '@/patterns/FeatureFlex';
import {TradingStackFlow} from '@/blocks/trading-stack-flow';
import {AudienceCarousel} from '@/blocks/audience-carousel';
import {TrustStrip} from '@/patterns/TrustStrip';
import {MediaBand} from '@/patterns/MediaBand';
import {Gallery3} from '@/patterns/Gallery3';
import {FaqAccordion} from '@/patterns/FaqAccordion';
import {CardGrid2} from '@/patterns/CardGrid2';
import {CardGrid3} from '@/patterns/CardGrid3';
import {TimelineSteps} from '@/patterns/TimelineSteps';
import {StackProse} from '@/patterns/StackProse';
import {DarkBand} from '@/patterns/DarkBand';
import {SplitContent} from '@/patterns/SplitContent';
import {ContactSection} from '@/patterns/ContactSection';
function Section({section,index,pageTitle,pageId}:{section:SectionData;index:number;pageTitle:string;pageId:string}){
 const override=renderMap.overrides.find(rule=>
  rule.title===section.title
  &&(!('pageId' in rule)||rule.pageId===pageId)
  &&(!('layout' in rule)||rule.layout===section.layout)
  &&(!('requiresH3' in rule)||!rule.requiresH3||section.blocks?.some(block=>block.type==='h3'))
 );
 if(override?.id==='trading-stack')return <TradingStackFlow section={section} visual={visualLabels.tradingStackFlow}/>;
 if(override?.id==='infrastructure-feature'||override?.id==='benefits-feature'){
  const topics=regroup(section.blocks||[]);
  const icons=section.title==='Why Brokers Work With Us'
   ? ['server','layers','link','shield','support']
   : ['settings','server','database','link','users'];
  const items=topics.filter(group=>group.heading).map((group,i)=>({
   title:group.heading||'',
   description:group.paragraphs.join(' '),
   icon:icons[i%icons.length]
  }));
  const intro=topics.filter(group=>!group.heading).flatMap(group=>group.paragraphs);
  return <FeatureFlexSection
   id={section.id}
   title={section.title||''}
   items={items}
   intro={intro}
   variant={section.title==='Why Brokers Work With Us'?'benefits':'infrastructure'}
  />;
 }
 if(override?.id==='audience-carousel'){
  const icons=['building','server','users','settings'];
  const items=regroup(section.blocks||[]).filter(group=>group.heading).map((group,i)=>({
   title:group.heading||'',
   description:group.paragraphs.join(' '),
   icon:icons[i%icons.length]
  }));
  return <AudienceCarousel title={section.title||''} items={items}/>;
 }
 if(override?.id==='contact')return <ContactSection section={section}/>;
 const target=layoutContract[section.layout];
 if(!target)throw new Error('Unregistered section layout: '+section.layout);
 switch(target.runtime){
  case 'TrustStrip':return <TrustStrip section={section}/>;
  case 'MediaBand':return <MediaBand section={section} title={pageTitle}/>;
  case 'Gallery3':return <Gallery3 section={section}/>;
  case 'FaqAccordion':return <FaqAccordion section={section}/>;
  case 'CardGrid2':return <CardGrid2 section={section} index={index} pageId={pageId}/>;
  case 'CardGrid3':return <CardGrid3 section={section} index={index} pageId={pageId}/>;
  case 'TimelineSteps':return <TimelineSteps section={section} index={index} pageId={pageId}/>;
  case 'DarkBand':return <DarkBand section={section} index={index} pageId={pageId}/>;
  case 'SplitContent':return <SplitContent section={section} index={index} pageId={pageId}/>;
  case 'StackProse':return <StackProse section={section} index={index} pageId={pageId}/>;
  case 'suppressed':return null;
  default:throw new Error('Unregistered render target: '+target.runtime);
 }
}
export function renderSections(page:PageData){
 const home=page.slug==='/';
 const title=home?'Forex Trade Technology':page.pageTop?.title||page.hero.title;
 return page.sections.filter(section=>!layoutContract[section.layout].neverRenderAsSection&&(home||layoutContract[section.layout].onlyPageId!=='home'))
 .map((section,index)=><Fragment key={section.id}><Section section={section} index={index} pageTitle={title} pageId={page.id}/></Fragment>);
}
