import Link from 'next/link';
import Image from 'next/image';
import {getImage,type ButtonData,type CardData,type FaqItem,type PageData,type SectionData} from '@/lib/site-data';
import {Icon} from './Icon';
import {ContactForm} from './ContactForm';

function Button({item}:{item:ButtonData}){return <Link href={item.href} className={`bs-btn ${item.variant==='dark'?'bs-btn-outline':'bs-btn-primary'}`}>{item.label}<Icon name={item.icon||'arrowUpRight'} size={17}/></Link>}
function Media({imageKey,priority=false,className=''}:{imageKey?:string;priority?:boolean;className?:string}){
 const image=getImage(imageKey);
 if(!image)return <div className={`bs-fallback-art ${className}`} aria-hidden="true"><span>FTT</span></div>;
 return <div className={`bs-media ${className}`}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 50vw, 580px" priority={priority} unoptimized className="bs-media-img"/></div>;
}
function Hero({page}:{page:PageData}){
 const home=page.slug==='/'; const hero=page.hero;
 return <section className={`bs-hero ${home?'is-home':'is-interior'}`} data-view-transition={hero.viewTransition||'hero'}>
  <div className="bs-hero-background"/><div className="bs-shell bs-hero-grid">
   <div className="bs-hero-copy"><span className="bs-hero-kicker"><span/> {hero.kicker||'FOREX TRADE TECHNOLOGY'}</span>
    <h1 className="bs-hero-title">{hero.title}</h1><p className="bs-hero-subtitle">{hero.subtitle}</p>
    {!!hero.ctas?.length&&<div className="bs-hero-actions">{hero.ctas.map((c,i)=><Button key={i} item={c}/>)}</div>}
    <div className="bs-hero-bottom"><span className="bs-line"/><span>Brokerage platforms · Infrastructure · Connectivity</span></div>
   </div>
   <div className="bs-hero-visual"><Media imageKey={hero.imageKey} priority className="bs-hero-image"/><div className="bs-hero-floating"><span className="bs-mini-icon"><Icon name="shield" size={20}/></span><div><strong>Connected infrastructure</strong><small>From platform to payment operations</small></div><span className="bs-float-check"><Icon name="check" size={17}/></span></div><div className="bs-hero-image-label"><span className="bs-status-dot"/> ENGINEERED FOR BROKERS</div></div>
  </div>
 </section>;
}
function Trust({section}:{section:SectionData}){return <section className="bs-trust"><div className="bs-shell bs-trust-inner"><span className="bs-trust-heading">TECHNOLOGY THAT CONNECTS</span><div className="bs-trust-items">{section.items?.map((i,index)=><span key={index}><Icon name="check" size={17}/>{typeof i==='string'?i:''}</span>)}</div></div></section>}
function CardGrid({section,index}:{section:SectionData;index:number}){
 const cards=(section.items||[]).filter((x):x is CardData=>typeof x!=='string'&&'title'in x);
 return <section id={section.id} className={`bs-section bs-grid-section ${index%2?'bs-section-tint':''}`} data-view-transition={section.viewTransition||'section'}>
   <div className="bs-shell"><div className="bs-section-head"><div>{section.kicker&&<span className="bs-eyebrow">{section.kicker}</span>}<h2>{section.title}</h2></div>{section.subtitle&&<p>{section.subtitle}</p>}</div>
    <div className={`bs-card-grid bs-cols-${section.columns||3}`}>{cards.map((card,i)=><article key={`${card.title}-${i}`} className={`bs-card ${card.imageKey?'has-photo':''}`} data-view-transition="card">
     {card.imageKey&&<Media imageKey={card.imageKey} className="bs-card-photo"/>}
     <div className="bs-card-body"><div className="bs-card-top"><div className="bs-card-icon"><Icon name={card.icon||'layers'} size={23}/></div><span className="bs-card-index">{card.num||String(i+1).padStart(2,'0')}</span></div>
      <h3>{card.title}</h3><p>{card.desc}</p>{card.href&&<Link href={card.href} className="bs-card-link" aria-label={`Explore ${card.title}`}>Explore solution <Icon name="arrowUpRight" size={17}/></Link>}
     </div></article>)}</div>
   </div></section>;
}
function Prose({section}:{section:SectionData}){return <section className="bs-section bs-prose-section" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell bs-prose-grid"><div className="bs-prose-copy"><span className="bs-eyebrow">WHY IT MATTERS</span><h2>{section.title}</h2>{section.paragraphs?.map((text,i)=><p key={i}>{text}</p>)}</div><Media imageKey={section.imageKey} className="bs-prose-photo"/></div></section>}
function DarkCta({section}:{section:SectionData}){return <section className="bs-cta-wrap" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell"><div className="bs-dark-cta"><div className="bs-cta-decoration"/><div><span className="bs-eyebrow">YOUR NEXT MOVE</span><h2>{section.title}</h2><p>{section.subtitle}</p></div>{section.cta&&<Button item={section.cta}/>}</div></div></section>}
function Faq({section}:{section:SectionData}){const items=(section.items||[]).filter((i):i is FaqItem=>typeof i!=='string'&&'q'in i);
return <section className="bs-section bs-faq-section" id={section.id} data-view-transition={section.viewTransition||'section'}><div className="bs-shell bs-faq-grid"><div className="bs-faq-aside"><span className="bs-eyebrow">HAVE QUESTIONS?</span><h2>Clear answers.<br/><em>Better decisions.</em></h2><p>What you need to know before you choose your trading technology infrastructure.</p></div><div className="bs-faq-list">{items.map((item,i)=><details key={item.q} open={section.openFirst&&i===0?true:undefined}><summary><span>{item.q}</span><span className="bs-faq-plus" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>}
function Section({section,index}:{section:SectionData;index:number}){
 switch(section.type){
  case 'trustStrip': return <Trust section={section}/>;
  case 'cardGrid':return <CardGrid section={section} index={index}/>;
  case 'prose':return <Prose section={section}/>;
  case 'darkCta':return <DarkCta section={section}/>;
  case 'faqAccordion':return <Faq section={section}/>;
  case 'contactForm':return <section className="bs-section bs-contact-section" id={section.id}><div className="bs-shell"><ContactForm fields={section.fields||[]} submitLabel={section.submitLabel||'Send Enquiry'} privacyNote={section.privacyNote} email={section.email||'business@forextradetechnology.com'}/></div></section>;
 }
}
export function PageRenderer({page}:{page:PageData}){return <main id="main-content" className="bs-main"><Hero page={page}/>{page.sections.map((section,index)=><Section key={section.id} section={section} index={index}/>)}</main>}
