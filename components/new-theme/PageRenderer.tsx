import Link from 'next/link';
import Image from 'next/image';
import {canonicalHref,getImage,type ButtonData,type ContentBlock,type FaqItem,type PageData,type SectionData} from '@/lib/site-data';
import {Icon} from './Icon';
import {ContactForm} from './ContactForm';

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
function Media({imageKey,priority=false,className=''}:{imageKey?:string;priority?:boolean;className?:string}){
 const image=getImage(imageKey);
 if(!image)return <div className={`bs-fallback-art ${className}`} aria-hidden="true"><span>FTT</span></div>;
 return <div className={`bs-media ${className}`}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 50vw, 580px" priority={priority} unoptimized className="bs-media-img"/></div>;
}
function Hero({page}:{page:PageData}){
 const home=page.slug==='/';const hero=page.hero;
 const leads=(hero.leadParagraphs||[]).filter(text=>!/^\s*(Breadcrumb|Label):/i.test(text));
 const summary=leads.length?leads:[hero.subtitle||''];
 const breadcrumbs=home?[]:page.slug.split('/').filter(Boolean);
 return <section className={`bs-hero ${home?'is-home':'is-interior'}`} data-view-transition={hero.viewTransition||'hero'}>
  <div className="bs-hero-background"/><div className="bs-shell bs-hero-grid">
   <div className="bs-hero-copy">
    {!!breadcrumbs.length&&<nav className="bs-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{breadcrumbs.slice(0,-1).map((s,i)=><span key={s}>{s.replace(/-/g,' ')} / </span>)}<span aria-current="page">{hero.title}</span></nav>}
    <span className="bs-hero-kicker"><span/>{hero.kicker||'FOREX TRADE TECHNOLOGY'}</span>
    <h1 className="bs-hero-title">{hero.title}</h1>
    <div className="bs-hero-lead">{summary.map((paragraph,i)=><p className="bs-hero-subtitle" key={i}>{paragraph}</p>)}</div>
    {!!hero.ctas?.length&&<div className="bs-hero-actions">{hero.ctas.map((c,i)=><Button key={i} item={c}/>)}</div>}
    <div className="bs-hero-bottom"><span className="bs-line"/><span>Brokerage platforms · Infrastructure · Connectivity</span></div>
   </div>
   <div className="bs-hero-visual"><Media imageKey={hero.imageKey} priority className="bs-hero-image"/>
    <div className="bs-hero-floating"><span className="bs-mini-icon"><Icon name="shield" size={20}/></span><div><strong>Connected infrastructure</strong><small>From platform to payment operations</small></div><span className="bs-float-check"><Icon name="check" size={17}/></span></div>
    <div className="bs-hero-image-label"><span className="bs-status-dot"/> ENGINEERED FOR BROKERS</div>
   </div>
  </div>
 </section>;
}
function Trust({section}:{section:SectionData}){
 return <section className="bs-trust"><div className="bs-shell bs-trust-inner"><span className="bs-trust-heading">TECHNOLOGY THAT CONNECTS</span><div className="bs-trust-items">{section.items?.map((item,index)=><span key={index}><Icon name="check" size={17}/>{typeof item==='string'?item:''}</span>)}</div></div></section>;
}
function TextParagraphs({paragraphs}:{paragraphs:string[]}){return <>{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</>}
function GroupCard({group,index}:{group:Group;index:number}){return <article className="bs-editorial-card"><span className="bs-editorial-card-num">{String(index+1).padStart(2,'0')}</span><h3>{group.heading}</h3><TextParagraphs paragraphs={group.paragraphs}/></article>}
function EditorialSection({section,index}:{section:SectionData;index:number}){
 const grouped=regroup(section.blocks||[]),intro=grouped.filter(g=>!g.heading),topics=grouped.filter(g=>g.heading);
 const isFaq=/frequently asked|^faq|questions/i.test(section.title||'')||topics.filter(g=>g.heading?.includes('?')).length>=2;
 const isTimeline=topics.length>2&&topics.every(g=>/^(?:stage\s*)?\d{1,2}[\s.:/-]|^step\s*\d/i.test(g.heading||''));
 const variant=isFaq?'faq':isTimeline?'timeline':topics.length>=3?['cards','feature','bands','panel'][index%4]:topics.length?'split':'essay';
 // Contact form is created as a real form, not displayed as inert paragraph fields.
 if(section.title==='Request a Consultation'&&section.blocks?.some(b=>/Business Email\*/.test(b.text)))
  return <section className="bs-section bs-contact-section" id={section.id}><div className="bs-shell"><header className="bs-content-heading"><span className="bs-eyebrow">START A CONVERSATION</span><h2>{section.title}</h2></header><ContactForm/></div></section>;
 return <section className={`bs-section bs-full-section bs-layout-${variant} ${index%2?'bs-section-tint':''}`} id={section.id} data-view-transition={section.viewTransition||'section'}>
  <div className="bs-shell">
   <header className="bs-content-heading"><span className="bs-eyebrow">{['BROKERAGE SOLUTIONS','WHAT WE DELIVER','TECHNOLOGY EXPLAINED','OUR APPROACH','PRACTICAL DETAILS'][index%5]}</span><h2>{section.title}</h2></header>
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
function DarkCta({section}:{section:SectionData}){return <section className="bs-cta-wrap" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell"><div className="bs-dark-cta"><div className="bs-cta-decoration"/><div><span className="bs-eyebrow">YOUR NEXT MOVE</span><h2>{section.title}</h2><p>{section.subtitle}</p></div>{section.cta&&<Button item={section.cta}/>}</div></div></section>}
function CtaRow({section}:{section:SectionData}){return <section className="bs-cta-row" id={section.id} aria-label="Next actions"><div className="bs-shell bs-cta-row-content"><span>Ready to connect your technology?</span><div>{(section.ctas||[]).map((item,i)=><Button item={item} key={i}/>)}</div></div></section>}
function Faq({section}:{section:SectionData}){const items=(section.items||[]).filter((x):x is FaqItem=>typeof x!=='string'&&'q'in x);
 return <section className="bs-section bs-faq-section" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell bs-faq-grid"><div className="bs-faq-aside"><span className="bs-eyebrow">HAVE QUESTIONS?</span><h2>Clear answers.<br/><em>Better decisions.</em></h2><p>Browse the complete set of common questions about trading technology infrastructure.</p><span className="bs-question-count">{items.length} questions answered</span></div><div className="bs-faq-list">{items.map((item,i)=><details key={`${item.q}-${i}`}><summary><span>{item.q}</span><span className="bs-faq-plus" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>;
}
function Section({section,index}:{section:SectionData;index:number}){
 switch(section.type){
  case 'trustStrip':return <Trust section={section}/>;
  case 'contentSection':return <EditorialSection section={section} index={index}/>;
  case 'ctaRow':return <CtaRow section={section}/>;
  case 'darkCta':return <DarkCta section={section}/>;
  case 'faqAccordion':return <Faq section={section}/>;
  default:return null;
 }
}
function Notes({notes}:{notes?:string[]}){if(!notes?.length)return null;return <aside className="bs-notes"><div className="bs-shell"><details><summary>Additional information and risk disclosure</summary>{notes.map((note,i)=><p key={i}>{note}</p>)}</details></div></aside>}
export function PageRenderer({page}:{page:PageData}){return <main id="main-content" className="bs-main"><Hero page={page}/>{page.sections.map((section,index)=><Section key={section.id} section={section} index={index}/>)}<Notes notes={page.documentFooterNotes}/></main>}
