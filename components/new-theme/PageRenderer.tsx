import Link from 'next/link';
import {canonicalHref,type ButtonData,type ContentBlock,type FaqItem,type PageData,type SectionData} from '@/lib/site-data';
import {Icon} from './Icon';
import {ContactForm} from './ContactForm';
import {HomeSlider} from './HomeSlider';
import {PageHeader} from './PageHeader';
import {SectionMedia} from './SectionMedia';

type Group={heading:string|null;paragraphs:string[]};
function regroup(blocks:ContentBlock[]):Group[]{
 const groups:Group[]=[];
 for(const block of blocks){
  if(block.type==='h3'){groups.push({heading:block.text,paragraphs:[]});continue;}
  if(block.type==='h2')continue; // H2 already rendered by the containing section.
  if(block.type==='p'){
   if(!groups.length||groups[groups.length-1].heading===null&&groups[groups.length-1].paragraphs.length===0){
    if(!groups.length)groups.push({heading:null,paragraphs:[]});
   }
   groups[groups.length-1].paragraphs.push(block.text);
  }
 }
 return groups;
}
function Button({item}:{item:ButtonData}){
 return <Link href={canonicalHref(item.href)} className={`bs-btn ${item.variant==='dark'?'bs-btn-outline':'bs-btn-primary'}`}>{item.label}<Icon name={item.icon||'arrowUpRight'} size={17}/></Link>;
}
function Trust({section}:{section:SectionData}){
 return <section className="bs-trust"><div className="bs-shell bs-trust-inner"><span className="bs-trust-heading">TECHNOLOGY THAT CONNECTS</span><div className="bs-trust-items">{section.items?.map((item,index)=><span key={index}><Icon name="check" size={17}/>{typeof item==='string'?item:''}</span>)}</div></div></section>;
}
function TextParagraphs({paragraphs}:{paragraphs:string[]}){return <>{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</>}
function GroupCard({group,index}:{group:Group;index:number}){return <article className="bs-editorial-card"><span className="bs-editorial-card-num">{String(index+1).padStart(2,'0')}</span><h3>{group.heading}</h3><TextParagraphs paragraphs={group.paragraphs}/></article>}
function EditorialSection({section,index,pageImages}:{section:SectionData;index:number;pageImages?:string[]}){
 const grouped=regroup(section.blocks||[]),intro=grouped.filter(g=>!g.heading),topics=grouped.filter(g=>g.heading);
 const isFaq=/frequently asked|^faq|questions/i.test(section.title||'')||topics.filter(g=>g.heading?.includes('?')).length>=2;
 const isTimeline=topics.length>2&&topics.every(g=>/^(?:stage\s*)?\d{1,2}[\s.:/-]|^step\s*\d/i.test(g.heading||''));
 const variant=isFaq?'faq':isTimeline?'timeline':topics.length>=3?['cards','feature','bands','panel'][index%4]:topics.length?'split':'essay';
 // Contact form is created as a real form, not displayed as inert paragraph fields.
 if(section.title==='Request a Consultation'&&section.blocks?.some(b=>/Business Email\*/.test(b.text)))
  return <section className="bs-section bs-contact-section" id={section.id}><div className="bs-shell"><header className="bs-content-heading"><span className="bs-eyebrow">START A CONVERSATION</span><h2>{section.title}</h2></header><ContactForm/></div></section>;
 return <section className={`bs-section bs-full-section bs-layout-${variant} bs-media-${section.media?.layout||'none'} ${index%2?'bs-section-tint':''}`} id={section.id} data-view-transition={section.viewTransition||'section'}>
  <div className="bs-shell">
   <header className="bs-content-heading"><span className="bs-eyebrow">{['BROKERAGE SOLUTIONS','WHAT WE DELIVER','TECHNOLOGY EXPLAINED','OUR APPROACH','PRACTICAL DETAILS'][index%5]}</span><h2>{section.title}</h2></header>
   <SectionMedia media={section.media} pageImages={pageImages}/>
   {intro.length>0&&<div className="bs-content-intro">{intro.map((g,i)=><TextParagraphs key={i} paragraphs={g.paragraphs}/>)}</div>}
   {variant==='faq'&&<div className="bs-editorial-faq">{topics.map((g,i)=><details key={i}><summary>{g.heading}<span aria-hidden="true">+</span></summary><div className="bs-faq-answer"><TextParagraphs paragraphs={g.paragraphs}/></div></details>)}</div>}
   {variant==='timeline'&&<div className="bs-timeline-list">{topics.map((g,i)=><div className="bs-timeline-step" key={i}><span className="bs-timeline-number">{String(i+1).padStart(2,'0')}</span><div><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></div></div>)}</div>}
   {variant==='cards'&&<div className="bs-editorial-grid">{topics.map((g,i)=><GroupCard group={g} index={i} key={i}/>)}</div>}
   {variant==='feature'&&<div className="bs-feature-list">{topics.map((g,i)=><article className="bs-feature-row" key={i}><span className="bs-feature-marker"><Icon name={['shield','server','layers','settings','globe','check'][i%6]} size={23}/></span><div><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></div></article>)}</div>}
   {variant==='bands'&&<div className="bs-editorial-bands">{topics.map((g,i)=><article className="bs-band" key={i}><div><span className="bs-band-number">{String(i+1).padStart(2,'0')}</span><h3>{g.heading}</h3></div><div><TextParagraphs paragraphs={g.paragraphs}/></div></article>)}</div>}
   {variant==='panel'&&<div className="bs-editorial-panel"><div className="bs-panel-heading"><Icon name="layers" size={35}/><span>Connected operations</span></div><div className="bs-panel-grid">{topics.map((g,i)=><article key={i}><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></article>)}</div></div>}
   {variant==='split'&&<div className="bs-feature-list">{topics.map((g,i)=><article className="bs-feature-row" key={i}><span className="bs-feature-marker"><Icon name="check" size={23}/></span><div><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></div></article>)}</div>}
  </div>
 </section>;
}
function DarkCta({section}:{section:SectionData}){return <section className="bs-cta-wrap" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell"><div className="bs-dark-cta"><div className="bs-cta-decoration"/><SectionMedia media={section.media}/><div><span className="bs-eyebrow">YOUR NEXT MOVE</span><h2>{section.title}</h2><p>{section.subtitle}</p></div>{section.cta&&<Button item={section.cta}/>}</div></div></section>}
function CtaRow({section}:{section:SectionData}){return <section className="bs-cta-row" id={section.id} aria-label="Next actions"><div className="bs-shell bs-cta-row-content"><span>Ready to connect your technology?</span><div>{(section.ctas||[]).map((item,i)=><Button item={item} key={i}/>)}</div></div></section>}
function Faq({section}:{section:SectionData}){const items=(section.items||[]).filter((x):x is FaqItem=>typeof x!=='string'&&'q'in x);
 return <section className="bs-section bs-faq-section" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell bs-faq-grid"><div className="bs-faq-aside"><span className="bs-eyebrow">HAVE QUESTIONS?</span><h2>Clear answers.<br/><em>Better decisions.</em></h2><p>Browse the complete set of common questions about trading technology infrastructure.</p><span className="bs-question-count">{items.length} questions answered</span><SectionMedia media={section.media}/></div><div className="bs-faq-list">{items.map((item,i)=><details key={`${item.q}-${i}`}><summary><span>{item.q}</span><span className="bs-faq-plus" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>;
}
function Section({section,index,pageImages}:{section:SectionData;index:number;pageImages?:string[]}){
 switch(section.type){
  case 'trustStrip':return <Trust section={section}/>;
  case 'contentSection':return <EditorialSection section={section} index={index} pageImages={pageImages}/>;
  case 'ctaRow':return <CtaRow section={section}/>;
  case 'darkCta':return <DarkCta section={section}/>;
  case 'faqAccordion':return <Faq section={section}/>;
  default:return null;
 }
}
function Notes({notes}:{notes?:string[]}){if(!notes?.length)return null;return <aside className="bs-notes"><div className="bs-shell"><details><summary>Additional information and risk disclosure</summary>{notes.map((note,i)=><p key={i}>{note}</p>)}</details></div></aside>}
export function PageRenderer({page}:{page:PageData}){
 const top=page.pageTop;
 return <main id="main-content" className="bs-main">
  {top?.variant==='homeSlider'&&top.slides?.length ? <HomeSlider slides={top.slides} intervalMs={top.intervalMs} autoplay={top.autoplay}/> : <PageHeader page={page}/>}
  {page.sections.map((section,index)=><Section key={section.id} section={section} index={index} pageImages={page.pageImages}/>)}
  <Notes notes={page.documentFooterNotes}/>
 </main>;
}
