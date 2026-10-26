import {Fragment} from 'react';
import visualLabels from '@/content/visual-labels.json';
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
function Section({section,index,pageTitle,pageId}:{section:SectionData;index:number;pageTitle:string;pageId:string}){
 if(pageId==='home'&&section.title==='How Your Trading Stack Connects')return <TradingStackFlow section={section} visual={visualLabels.tradingStackFlow}/>;
 if(section.title==='Platform & Infrastructure Under One Roof'||section.title==='Why Brokers Work With Us'){
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
   title={section.title}
   items={items}
   intro={intro}
   variant={section.title==='Why Brokers Work With Us'?'benefits':'infrastructure'}
  />;
 }
 if(section.title==='Who We Work With'&&section.blocks?.some(block=>block.type==='h3')){
  const icons=['building','server','users','settings'];
  const items=regroup(section.blocks).filter(group=>group.heading).map((group,i)=>({
   title:group.heading||'',
   description:group.paragraphs.join(' '),
   icon:icons[i%icons.length]
  }));
  return <AudienceCarousel title={section.title} items={items}/>;
 }
 if(section.layout==='iconRow')return <TrustStrip section={section}/>;
 if(section.layout==='mediaBand')return <MediaBand section={section} title={pageTitle}/>;
 if(section.layout==='gallery3')return <Gallery3 section={section}/>;
 if(section.layout==='faqAccordion')return <FaqAccordion section={section}/>;
 switch(section.layout){
  case 'cardGrid2':return <CardGrid2 section={section} index={index} pageId={pageId}/>;
  case 'cardGrid3':return <CardGrid3 section={section} index={index} pageId={pageId}/>;
  case 'timeline':return <TimelineSteps section={section} index={index} pageId={pageId}/>;
  case 'darkBand':return <DarkBand section={section} index={index} pageId={pageId}/>;
  case 'splitContent':return <SplitContent section={section} index={index} pageId={pageId}/>;
  case 'stack':return <StackProse section={section} index={index} pageId={pageId}/>;
  case 'ctaBand':return null;
  default:return <StackProse section={section} index={index} pageId={pageId}/>;
 }
}
export function renderSections(page:PageData){
 const home=page.slug==='/';
 const title=home?'Forex Trade Technology':page.pageTop?.title||page.hero.title;
 return page.sections.filter(section=>section.layout!=='ctaBand'&&(home||section.layout!=='mediaBand'))
 .map((section,index)=><Fragment key={section.id}><Section section={section} index={index} pageTitle={title} pageId={page.id}/></Fragment>);
}
