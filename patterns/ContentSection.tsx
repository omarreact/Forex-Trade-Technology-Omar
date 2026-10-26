import type {SectionData} from '@/content/schema/page';
import {regroup,TextParagraphs} from './section-helpers';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
import {IconCard} from '@/blocks/icon-card';
import {ContactForm} from '@/blocks/contact-form';
import {VisualStorySection} from './VisualStory';
export type ContentPatternKind='cardGrid2'|'cardGrid3'|'timeline'|'stack'|'darkBand'|'splitContent';
export function V5SectionContent({section,index,pageId,mode}:{section:SectionData;index:number;pageId:string;mode:ContentPatternKind}){
 const groups=regroup(section.blocks||[]);
 const leads=groups.filter(x=>!x.heading).flatMap(x=>x.paragraphs);
 const topics=groups.filter(x=>x.heading);
 const layout:string=mode;
 const dark=layout==='darkBand';
 if(layout==='splitContent'&&section.title==='Request a Consultation')
  return <section className="bs-v5-section bs-v5-contact" id={section.id}><div className="bs-shell"><h2>{section.title}</h2><ContactForm/></div></section>;
 // Prose-only and text-only bands should never leave half the desktop canvas empty.
 // Use alternating editorial content and relevant, content-derived visual diagrams.
 if(layout==='stack'||(layout==='darkBand'&&topics.length===0)||(layout==='timeline'&&topics.length===0)){
  return <VisualStorySection section={section} pageId={pageId} index={index} dark={layout==='darkBand'}/>;
 }
 let cards=topics.map((g,i)=>({title:g.heading||'',paragraphs:g.paragraphs,order:i}));
 if(layout.startsWith('cardGrid')&&cards.length===0&&leads.length>1){
   cards=leads.map((para,i)=>({title:'',paragraphs:[para],order:i}));
 }
 const leadContent=(layout.startsWith('cardGrid')||layout==='timeline')&&topics.length===0&&leads.length>1?[]:leads;
 const headerSubtitle=leadContent[0];
 return <section id={section.id} className={'bs-v5-section bs-v5-layout-'+layout+(dark?' bs-v5-dark':'')+(index%2&&!dark?' bs-v5-soft':'')} data-view-transition={section.viewTransition||'section'}>
  <div className="bs-shell">
   <SectionHeading className="bs-v5-section-heading" title={section.title} subtitle={headerSubtitle}/>
   {leadContent.length>1&&<div className="bs-v5-intro">{leadContent.slice(1).map((p,i)=><p key={i}>{p}</p>)}</div>}
   {layout.startsWith('cardGrid')&&cards.length>0&&<div className={'bs-v5-grid '+(layout==='cardGrid2'?'bs-v5-grid-two':'bs-v5-grid-three')}>{cards.map((c,i)=>
    <IconCard className="bs-v5-card" key={i} title={c.title} icon={['layers','server','shield','link','users','payments'][i%6]} paragraphs={c.paragraphs}/>)}</div>}
   {layout==='timeline'&&<div className="bs-v5-steps">{(topics.length?topics:leads.length>=2?leads.map((p,i)=>({heading:'Step '+(i+1),paragraphs:[p]})):[]).map((g,i)=>
    <IconCard key={i} className="bs-v5-card bs-step-card" title={g.heading||''} icon={['check','settings','server','link','shield'][i%5]} paragraphs={g.paragraphs}/>)}</div>}
   {layout==='stack'&&topics.length>0&&<div className="bs-v5-prose-list">{topics.map((g,i)=><article key={i}><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></article>)}</div>}
   {dark&&topics.length>0&&<div className="bs-v5-dark-list">{topics.map((g,i)=><IconCard key={i} className="bs-v5-card bs-dark-feature-card" title={g.heading||''} icon={['server','layers','link','shield','support'][i%5]} paragraphs={g.paragraphs}/>)}</div>}
  </div>
 </section>;
}
