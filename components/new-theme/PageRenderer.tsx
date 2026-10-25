import Link from 'next/link';
import Image from 'next/image';
import {Fragment} from 'react';
import {canonicalHref,getImage,type ButtonData,type ContentBlock,type FaqItem,type PageData,type SectionData} from '@/lib/site-data';
import {Icon} from './Icon';
import {ContactForm} from './ContactForm';
import {HomeSlider} from './HomeSlider';
import {TrustCarousel} from './TrustCarousel';
import {AudienceCarousel} from './AudienceCarousel';
import {IconCard} from './IconCard';
import {FeatureFlexSection} from './FeatureFlexSection';
import {VisualStorySection} from './VisualStorySection';
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
 const items=(section.items||[]).filter((item):item is string=>typeof item==='string');
 return <TrustCarousel items={items}/>;
}
function TextParagraphs({paragraphs}:{paragraphs:string[]}){return <>{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</>}
function GroupCard({group,index}:{group:Group;index:number}){return <IconCard className="bs-editorial-card" title={group.heading||''} icon={['layers','server','shield','link','users','payments'][index%6]} index={index}><TextParagraphs paragraphs={group.paragraphs}/></IconCard>}
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

function DenseEditorialSection({section,index}:{section:SectionData;index:number}){
 const grouped=regroup(section.blocks||[]),intro=grouped.filter(g=>!g.heading),topics=grouped.filter(g=>g.heading);
 const faq=/(frequently asked|FAQ)/i.test(section.title||'')&&topics.some(g=>(g.heading||'').includes('?'));
 const card=topics.length>=2&&!!section.layout?.startsWith('cardGrid')&&!faq;
 const col=section.layout==='cardGrid2'?'bs-dense-cols-2':section.layout==='cardGrid4'?'bs-dense-cols-4':'bs-dense-cols-3';
 if(section.title==='Request a Consultation'&&section.blocks?.some(b=>/Business Email\*/.test(b.text)))
  return <section id={section.id} className="bs-section bs-dense-section bs-dense-contact"><div className="bs-shell"><h2>{section.title}</h2><ContactForm/></div></section>;
 return <section id={section.id} className={'bs-section bs-dense-section '+(index%2?'bs-dense-tint':'')} data-view-transition={section.viewTransition||'section'}>
  <div className="bs-shell">
   <header className="bs-dense-heading"><span className="bs-dense-kicker">FOREX TRADE TECHNOLOGY</span><h2>{section.title}</h2></header>
   {intro.length>0&&<div className="bs-dense-intro">{intro.map((g,i)=><TextParagraphs key={i} paragraphs={g.paragraphs}/>)}</div>}
   {faq?<div className="bs-dense-accordion">{topics.map((g,i)=><details key={i}><summary><span>{g.heading}</span><Icon name="chevronDown" size={19}/></summary><div className="bs-dense-answer"><TextParagraphs paragraphs={g.paragraphs}/></div></details>)}</div>
    :card?<div className={'bs-dense-cards '+col}>{topics.map((g,i)=><IconCard className="bs-dense-card" title={g.heading||''} icon={['server','shield','link','users','layers','payments'][i%6]} index={i} key={i}><TextParagraphs paragraphs={g.paragraphs}/></IconCard>)}</div>
    :topics.length>0?<div className="bs-dense-prose">{topics.map((g,i)=><div key={i} className="bs-dense-prose-group"><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></div>)}</div>:null}
  </div>
 </section>;
}
function DenseMediaBand({section}:{section:SectionData}){
 const photo=getImage(section.media?.imageKey);if(!photo)return null;
 return <section className="bs-media-band" id={section.id} aria-label={section.media?.caption||'Technology imagery'}>
   <Image src={photo.url} alt={photo.alt} fill unoptimized loading="lazy" sizes="100vw"/>
   <div className="bs-media-band-overlay"/>
   {section.media?.caption&&<div className="bs-shell bs-media-band-caption"><p>{section.media.caption}</p></div>}
 </section>;
}
function DenseFaq({section}:{section:SectionData}){
 const items=(section.items||[]).filter((x):x is FaqItem=>typeof x!=='string'&&'q'in x);
 return <section className="bs-section bs-dense-section bs-dense-faq-page" id={section.id}><div className="bs-shell">
  <header className="bs-dense-heading"><span className="bs-dense-kicker">SUPPORT & GUIDANCE</span><h2>Frequently Asked Questions</h2><p>{items.length} questions answered</p></header>
  <div className="bs-dense-accordion">{items.map((item,i)=><details key={i}><summary><span>{item.q}</span><Icon name="chevronDown" size={19}/></summary><div className="bs-dense-answer"><p>{item.a}</p></div></details>)}</div>
 </div></section>;
}

function DarkCta({section}:{section:SectionData}){return <section className="bs-cta-wrap" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell"><div className="bs-dark-cta"><div className="bs-cta-decoration"/><SectionMedia media={section.media}/><div><span className="bs-eyebrow">YOUR NEXT MOVE</span><h2>{section.title}</h2><p>{section.subtitle}</p></div>{section.cta&&<Button item={section.cta}/>}</div></div></section>}
function CtaRow({section}:{section:SectionData}){return <section className="bs-cta-row" id={section.id} aria-label="Next actions"><div className="bs-shell bs-cta-row-content"><span>Ready to connect your technology?</span><div>{(section.ctas||[]).map((item,i)=><Button item={item} key={i}/>)}</div></div></section>}
function Faq({section}:{section:SectionData}){const items=(section.items||[]).filter((x):x is FaqItem=>typeof x!=='string'&&'q'in x);
 return <section className="bs-section bs-faq-section" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell bs-faq-grid"><div className="bs-faq-aside"><span className="bs-eyebrow">HAVE QUESTIONS?</span><h2>Clear answers.<br/><em>Better decisions.</em></h2><p>Browse the complete set of common questions about trading technology infrastructure.</p><span className="bs-question-count">{items.length} questions answered</span><SectionMedia media={section.media}/></div><div className="bs-faq-list">{items.map((item,i)=><details key={`${item.q}-${i}`}><summary><span>{item.q}</span><span className="bs-faq-plus" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>;
}

/** The layout key is authoritative in v5; section.type only describes source semantics. */
function V5EditableBlocks({blocks}:{blocks:ContentBlock[]}){
 return <div className="bs-v5-copy">{blocks.map((block,i)=>block.type==='h3'?<h3 key={i}>{block.text}</h3>:block.type==='h2'?<h3 key={i}>{block.text}</h3>:<p key={i}>{block.text}</p>)}</div>;
}
function V5SectionContent({section,index,pageId}:{section:SectionData;index:number;pageId:string}){
 const groups=regroup(section.blocks||[]);
 const leads=groups.filter(x=>!x.heading).flatMap(x=>x.paragraphs);
 const topics=groups.filter(x=>x.heading);
 const layout=section.layout||'stack';
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
 return <section id={section.id} className={'bs-v5-section bs-v5-layout-'+layout+(dark?' bs-v5-dark':'')+(index%2&&!dark?' bs-v5-soft':'')} data-view-transition={section.viewTransition||'section'}>
  <div className="bs-shell">
   <header className="bs-v5-section-heading"><span>FOREX TRADE TECHNOLOGY</span><h2>{section.title}</h2></header>
   {leadContent.length>0&&<div className="bs-v5-intro">{leadContent.map((p,i)=><p key={i}>{p}</p>)}</div>}
   {layout.startsWith('cardGrid')&&cards.length>0&&<div className={'bs-v5-grid '+(layout==='cardGrid2'?'bs-v5-grid-two':'bs-v5-grid-three')}>{cards.map((c,i)=>
    <IconCard className="bs-v5-card" key={i} title={c.title} icon={['layers','server','shield','link','users','payments'][i%6]} index={i}><TextParagraphs paragraphs={c.paragraphs}/></IconCard>)}</div>}
   {layout==='timeline'&&<div className="bs-v5-steps">{(topics.length?topics:leads.length>=2?leads.map((p,i)=>({heading:'Step '+(i+1),paragraphs:[p]})):[]).map((g,i)=>
    <article key={i}><span className="bs-v5-step-index">{String(i+1).padStart(2,'0')}</span><div><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></div></article>)}</div>}
   {layout==='stack'&&topics.length>0&&<div className="bs-v5-prose-list">{topics.map((g,i)=><article key={i}><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></article>)}</div>}
   {dark&&topics.length>0&&<div className="bs-v5-dark-list">{topics.map((g,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{g.heading}</h3><TextParagraphs paragraphs={g.paragraphs}/></article>)}</div>}
  </div>
 </section>;
}
/** Split page titles into a white lead and mild lime emphasis without changing their text. */
function mediaTitleParts(title:string):[string,string]{
 const clean=title.trim();
 if(clean==='Forex Trade Technology')return ['Forex Trade','Technology'];
 const ampersand=clean.indexOf(' & ');
 const forClause=clean.toLowerCase().indexOf(' for ');
 const boundary=ampersand>=0?ampersand:forClause;
 if(boundary>7)return [clean.slice(0,boundary),clean.slice(boundary+1)];
 const words=clean.split(' ').filter(Boolean);
 const pivot=Math.max(1,Math.ceil(words.length*.56));
 return [words.slice(0,pivot).join(' '),words.slice(pivot).join(' ')];
}
function V5MediaBand({section,title}:{section:SectionData;title:string}){
 const img=getImage(section.media?.imageKey);if(!img)return null;
 const [primary,accent]=mediaTitleParts(title);
 const headingId=`${section.id}-heading`;
 return <section id={section.id} className="bs-v5-media bs-v5-media-title-band" aria-labelledby={headingId}>
  <Image src={img.url} alt="" fill unoptimized loading="lazy" sizes="100vw" className="bs-v5-media-photo"/>
  <div className="bs-v5-media-shade" aria-hidden="true"/>
  <div className="bs-shell bs-v5-media-caption">
   <div className="bs-v5-media-title-content">
    <span className="bs-v5-media-eyebrow">FOREX TRADE TECHNOLOGY</span>
    <h2 id={headingId} className="bs-v5-media-title">{primary}{accent&&<> <span>{accent}</span></>}</h2>
   </div>
  </div>
 </section>;
}
function V5Gallery({section}:{section:SectionData}){
 const keys=section.media?.imageKeys||[];
 return <section id={section.id} className="bs-v5-section bs-v5-gallery"><div className="bs-shell">
  <header className="bs-v5-section-heading"><span>TECHNOLOGY IN PRACTICE</span><h2>{section.title==='Who We Work With'?'Technology Behind the Brokerage':section.title}</h2></header>
  <div className="bs-v5-gallery-grid">{keys.map(key=>{const img=getImage(key);return img?<figure key={key}><div className="bs-v5-gallery-photo"><Image src={img.url} alt={img.alt} fill unoptimized loading="lazy" sizes="(max-width:700px) 95vw, 33vw"/></div><figcaption>{img.alt}</figcaption></figure>:null})}</div>
 </div></section>;
}
/** All fullBlocks are retained in source JSON; this includes material omitted by the v5 layout shortlist. */
function getSupplementalContent(page:PageData){
 const used=new Map<string,number>();
 for(const sec of page.sections)for(const b of sec.blocks||[]){const key=b.type+'\u0000'+b.text;used.set(key,(used.get(key)||0)+1);}
 const result:Array<{title:string;blocks:ContentBlock[]}>=[];
 let active:{title:string;blocks:ContentBlock[]}={title:'Introduction and overview',blocks:[]};
 const push=()=>{if(active.blocks.length)result.push(active);};
 for(const b of page.fullBlocks||[]){
  // Source document outline labels belong in the actual header, not the visible guide.
  if(/^(?:breadcrumb|label):\\s/i.test(b.text.trim()))continue;
  if(b.type==='h2'){push();active={title:b.text,blocks:[]};continue;}
  const key=b.type+'\u0000'+b.text,remaining=used.get(key)||0;
  if(remaining>0){used.set(key,remaining-1);continue;}
  active.blocks.push(b);
 }
 push();return result;
}
function V5Guide({page}:{page:PageData}){
 const groups=getSupplementalContent(page);if(!groups.length)return null;
 return <section className="bs-v5-guide bs-v5-section" id="complete-technical-guide" aria-labelledby="complete-guide-title"><div className="bs-shell">
  <div className="bs-v5-guide-head"><span className="bs-v5-guide-kicker">IN-DEPTH TECHNICAL GUIDE</span><h2 id="complete-guide-title">Further details and frequently asked questions</h2><p>Complete supporting explanations, implementation considerations and FAQs from our original service guide.</p></div>
  <div className="bs-v5-guide-grid">{groups.map((group,i)=><details key={i} className="bs-v5-guide-item"><summary><span>{group.title}</span><Icon name="chevronDown" size={20}/></summary><V5EditableBlocks blocks={group.blocks}/></details>)}</div>
 </div></section>;
}

function Section({section,index,pageTitle,pageId}:{section:SectionData;index:number;pageTitle:string;pageId:string}){
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
 if(section.layout==='iconRow')return <Trust section={section}/>;
 if(section.layout==='mediaBand')return <V5MediaBand section={section} title={pageTitle}/>;
 if(section.layout==='gallery3')return <V5Gallery section={section}/>;
 if(section.layout==='faqAccordion')return <DenseFaq section={section}/>;
 if(section.layout==='ctaBand')return <DarkCta section={section}/>;
 return <V5SectionContent section={section} index={index} pageId={pageId}/>;
}
function Notes({notes}:{notes?:string[]}){if(!notes?.length)return null;return <aside className="bs-notes"><div className="bs-shell"><details><summary>Additional information and risk disclosure</summary>{notes.map((note,i)=><p key={i}>{note}</p>)}</details></div></aside>}
export function PageRenderer({page}:{page:PageData}){
 const top=page.pageTop;
 const pageTitle=page.slug==='/'?'Forex Trade Technology':top?.title||page.hero.title;
 const hasImageBand=page.sections.some(section=>section.layout==='mediaBand');
 const preferredImage=top?.backgroundImageKey||page.hero.imageKey;
 const mediaKey=getImage(preferredImage)?preferredImage:'world_map';
 const insertedBand:SectionData={id:'media-page-title',type:'mediaBand',layout:'mediaBand',media:{layout:'mediaBand',imageKey:mediaKey}};
 const insertAfter=page.id==='faq'?0:1;
 return <main id="main-content" className="bs-main bs-v4-dense bs-v5">
  {top?.variant==='homeSlider'&&top.slides?.length ? <HomeSlider slides={top.slides} intervalMs={top.intervalMs} autoplay={top.autoplay}/> : <PageHeader page={page}/>}
  {page.sections.map((section,index)=><Fragment key={section.id}>
   {section.layout==='ctaBand'&&<V5Guide page={page}/>}
   <Section section={section} index={index} pageTitle={pageTitle} pageId={page.id}/>
   {!hasImageBand&&index===insertAfter&&<V5MediaBand section={insertedBand} title={pageTitle}/>}
  </Fragment>)}
  <Notes notes={page.documentFooterNotes}/>
 </main>;
}
