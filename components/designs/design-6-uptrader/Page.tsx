import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,HtmlSection,SegmentPhoto,SiteMark,Legal,SectionsNav,navSets,withDesign} from '../data';
const design='design-6' as const;
function Header(){return <header className="c6-header"><div className="c6-head-inner"><SiteMark design={design}/><nav aria-label="UpTrader-inspired navigation">
 <details><summary>Solutions</summary><div>{navSets.solutions.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}</Link>)}</div></details>
 <details><summary>Our Products</summary><div>{navSets.products.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}</Link>)}</div></details>
 <Link href={withDesign(design,'/about-us/')}>About us</Link><Link href={withDesign(design,'/faq/')}>FAQs</Link></nav><Link className="c6-header-contact" href={withDesign(design,'/contact/')}>Contact ↗</Link></div></header>;}
function Hero({content}:{content:VariationContent}){
 return <section className="c6-hero"><div className="c6-hero-word"><span className="c6-hero-kicker">FOREX TRADE TECHNOLOGY · BROKER SERVICES</span><h1>{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="c6-hero-lead">{content.lead}</p>}
 <div className="c6-hero-actions"><Action design={design}/><a href="#c6-more">Explore what we do →</a></div></div>
 <div className="c6-hero-bento"><SegmentPhoto page={content} index={0} offset={4} className="c6-bento-main"/><SegmentPhoto page={content} index={1} offset={3} className="c6-bento-small"/><div className="c6-bento-note"><span>BUILT AROUND YOUR REQUIREMENTS</span><strong>Connected<br/>technology</strong></div></div>
 </section>;
}
function Content({content}:{content:VariationContent}){
 return <div id="c6-more" className="c6-content">
 {content.home&&<div className="c6-services"><div className="c6-services-lead"><span>WHAT WE OFFER</span><h2>Connect the systems that matter.</h2></div><div className="c6-service-grid">{content.highlights.map((h,i)=><article key={i}><span>0{i+1}</span><h3>{h.title}</h3><p>{h.description}</p></article>)}</div></div>}
 {content.sections.map((s,i)=><section id={s.id} key={s.id} className={'c6-story c6-story-'+i%5}>
  <div className="c6-story-lead"><span>STORY {String(i+1).padStart(2,'0')}</span><h2>{s.heading}</h2></div>
  {i%2===0&&<SegmentPhoto page={content} index={i+2} className="c6-story-photo"/>}
  <div className="c6-story-words"><HtmlSection section={s}/></div>
  {i%2!==0&&<SegmentPhoto page={content} index={i+2} className="c6-story-photo"/>}
 </section>)}</div>;
}
function CTA({content}:{content:VariationContent}){
 return <section className="c6-cta"><SegmentPhoto page={content} index={5} className="c6-cta-photo"/><div className="c6-cta-content"><span>READY FOR THE NEXT STEP?</span><h2>Let's discuss your brokerage technology.</h2><p>Talk through your requirements, including {content.meta.title.toLowerCase()}, with our team.</p><Action design={design} label="Request a consultation"/></div></section>;
}
function Footer(){
 return <footer className="c6-footer"><div className="c6-foot-heading"><SiteMark design={design}/><p>Systems for modern brokerage operations.</p></div><div className="c6-foot-grid"><div><h3>Explore solutions</h3><SectionsNav design={design} filter="solutions"/></div><div><h3>Our products</h3><SectionsNav design={design} filter="products"/></div><div><h3>Information</h3><SectionsNav design={design} filter="company"/></div></div><Legal design={design}/></footer>;
}
export default function UpTraderProposal({content}:{content:VariationContent}){return <div className="concept c6"><Header/><main><Hero content={content}/><Content content={content}/></main><CTA content={content}/><Footer/></div>;}
