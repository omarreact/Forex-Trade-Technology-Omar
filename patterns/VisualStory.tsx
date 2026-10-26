import Image from 'next/image';
import {getImage,type ContentBlock,type SectionData} from '@/lib/site-data';
import {Icon} from '@/blocks/shared/Icon';
import {SectionHeading} from '@/blocks/shared/SectionHeading';

import {stories} from '@/content/story-visuals';
type Props={section:SectionData;pageId:string;index:number;dark?:boolean};
export function VisualStorySection({section,pageId,index,dark=false}:Props){
 const info=stories[pageId]||stories.home;
 const visual=getImage(info.image);
 const blocks=section.blocks||[];
 const groupItems:Array<{title:string;paragraphs:string[]}>= [];
 const leads:string[]=[];
 for(const block of blocks){
  if(block.type==='h3'){groupItems.push({title:block.text,paragraphs:[]});continue;}
  if(block.type==='p'){
   if(groupItems.length)groupItems[groupItems.length-1].paragraphs.push(block.text);
   else leads.push(block.text);
  }
 }
 const listItems=leads.filter(p=>/^\*\s/.test(p.trim()));
 const narrative=leads.filter(p=>!/^\*\s/.test(p.trim()));
 const reverse=index%2===0;
 return <section id={section.id} className={`bs-v5-section bs-story-section ${dark?'bs-story-dark':index%2?'bs-story-tint':'bs-story-light'} ${reverse?'bs-story-reverse':''}`} aria-labelledby={`${section.id}-title`}>
  <div className="bs-shell bs-story-shell">
   <div className="bs-story-copy">
    <SectionHeading id={`${section.id}-title`} title={section.title} className="bs-story-heading"/>
    {narrative.length>0&&<div className="bs-story-prose">{narrative.map((p,i)=><p key={i}>{p}</p>)}</div>}
    {listItems.length>0&&<ul className="bs-story-checklist">{listItems.map((p,i)=><li key={i}><Icon name="check" size={18}/><span>{p.trim().replace(/^\*\s*/, '')}</span></li>)}</ul>}
    {groupItems.length>0&&<div className="bs-story-details">{groupItems.map((g,i)=>
     <article key={g.title}><span className="bs-story-detail-icon"><Icon name={info.icons[i%3]} size={20}/></span>
      <div><h3>{g.title}</h3>{g.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</div>
     </article>
    )}</div>}
   </div>
   <div className="bs-story-visual">
    {visual&&<Image src={visual.url} alt="" fill unoptimized loading="lazy" sizes="(max-width: 820px) 95vw, 48vw" className="bs-story-photo"/>}
    <div className="bs-story-gradient" aria-hidden="true"/>
    <div className="bs-story-diagram">
     <span className="bs-story-diagram-label">{info.eyebrow}</span>
     <div className="bs-story-nodes">
      {info.nodes.map((label,i)=><div className="bs-story-node" key={label}>
       <span className="bs-story-node-icon"><Icon name={info.icons[i]} size={19}/></span>
       <span>{label}</span>
      </div>)}
     </div>
     <div className="bs-story-diagram-bottom"><span className="bs-story-live-dot"/>Integrated technology workflow</div>
    </div>
   </div>
  </div>
 </section>;
}
