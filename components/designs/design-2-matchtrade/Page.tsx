import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,ChapterHeading,HtmlSection,SegmentPhoto,SiteMark,Legal,SectionsNav,navSets,withDesign} from '../data';

const design='design-2' as const;
function Header(){
 return <header className="c2-head"><div className="c2-nav"><SiteMark design={design}/><nav className="c2-links" aria-label="Match-Trade-inspired navigation">
  <details><summary>Our Solutions</summary><div className="c2-mega">{navSets.solutions.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}<span>↗</span></Link>)}</div></details>
  <details><summary>Platforms & Products</summary><div className="c2-mega">{navSets.products.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}<span>↗</span></Link>)}</div></details>
  <Link href={withDesign(design,'/how-it-works/')}>How it works</Link><Link href={withDesign(design,'/about-us/')}>Company</Link></nav>
  <Link className="c2-nav-cta" href={withDesign(design,'/contact/')}>Let&apos;s talk <span>↗</span></Link>
 </div></header>;
}
function Hero({content}:{content:VariationContent}){
 return <section className="c2-hero" aria-labelledby="c2-title"><div className="c2-hero-copy"><span className="c2-kicker">{content.eyebrow}</span>
  <h1 id="c2-title">{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="c2-support">{content.lead}</p>}
  <div className="c2-actions"><Action design={design}/><a href="#c2-content">Discover our technology ↓</a></div>
 </div><div className="c2-visual"><SegmentPhoto page={content} index={0} offset={0} className="c2-hero-photo"/>
 <div className="c2-float c2-float--top"><span>CONNECTED WORKFLOWS</span><strong>Trading platforms</strong></div>
 <div className="c2-float c2-float--bottom"><b>CORE INFRASTRUCTURE</b><span>Platforms / Liquidity / CRM</span></div></div></section>;
}
function Story({content}:{content:VariationContent}){
 return <div id="c2-content" className="c2-content">
 {content.home&&<div className="c2-product-strip">{content.highlights.map((h,i)=><article key={i}><small>0{i+1}</small><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>}
 <div className="c2-chapters">
 {content.sections.map((section,i)=><section className={'c2-chapter c2-chapter--'+i%3} key={section.id} id={section.id}>
  <div className="c2-chapter-title"><ChapterHeading section={section}/></div>
  {i%3===1&&<SegmentPhoto page={content} index={i+1} className="c2-story-photo"/>}
  <div className="c2-chapter-body"><HtmlSection section={section}/></div>
  {i%3===0&&<SegmentPhoto page={content} index={i+1} className="c2-story-photo"/>}
 </section>)}</div></div>;
}
function CTA({content}:{content:VariationContent}){
 return <section className="c2-cta" aria-label="Contact us"><div><span>YOUR NEXT STEP</span><h2>{content.home?'Build the right technology foundation.':'Talk to us about '+content.meta.title+'.'}</h2><p>Discuss your brokerage technology requirements with Forex Trade Technology.</p><Action design={design} label="Contact our team"/></div><SegmentPhoto page={content} index={4} className="c2-cta-image"/></section>;
}
function Footer(){
 return <footer className="c2-footer"><div className="c2-footer-main"><div className="c2-about"><SiteMark design={design}/><p>Forex brokerage technology, integration and infrastructure.</p></div>
 <div><h3>Solutions</h3><SectionsNav design={design} filter="solutions"/></div>
 <div><h3>Products</h3><SectionsNav design={design} filter="products"/></div>
 <div><h3>Company</h3><SectionsNav design={design} filter="company"/></div></div><Legal design={design}/></footer>;
}
export default function MatchTradeProposal({content}:{content:VariationContent}){return <div className="concept c2"><Header/><main><Hero content={content}/><Story content={content}/></main><CTA content={content}/><Footer/></div>;}
