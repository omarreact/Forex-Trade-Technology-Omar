import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import HomeSpotlight from './HomeSpotlight';
import BrokerageWorkbench from './BrokerageWorkbench';
import {Action,HtmlSection,SegmentPhoto,SiteMark,Legal,SectionsNav,navSets,withDesign} from '../data';
const design='design-4' as const;
function Header(){return <><div className="c4-ribbon">FOREX TRADE TECHNOLOGY <span>TRADING SYSTEMS / INTEGRATIONS / HOSTING</span></div>
 <header className="c4-header"><SiteMark design={design}/><nav className="c4-nav" aria-label="Leverate-inspired menu">
 <details><summary>Solutions</summary><div>{navSets.solutions.map(p=><Link key={p.slug} href={withDesign(design,p.route)}>{p.title}</Link>)}</div></details>
 <details><summary>Products</summary><div>{navSets.products.map(p=><Link key={p.slug} href={withDesign(design,p.route)}>{p.title}</Link>)}</div></details>
 <Link href={withDesign(design,'/about-us/')}>Who we are</Link><Link href={withDesign(design,'/faq/')}>FAQ</Link></nav><Link className="c4-talk" href={withDesign(design,'/contact/')}>Book a consultation ↗</Link></header></>;
}
function Hero({content}:{content:VariationContent}){
 return <section className="c4-hero"><div className="c4-star c4-star-a" aria-hidden="true">✳</div><div className="c4-star c4-star-b" aria-hidden="true">✳</div>
 <div className="c4-heading"><span>FLEXIBLE BROKERAGE TECHNOLOGY</span><h1>{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="c4-lead">{content.lead}</p>}<div className="c4-buttons"><Action design={design}/><a href="#c4-journey">Explore the platform ↓</a></div></div>
 <div className="c4-hero-art c4-hero-art--interactive"><BrokerageWorkbench/></div>
 </section>;
}
function Journey({content}:{content:VariationContent}){
 const sections=content.sections;
 return <div className={'c4-content'+(content.home?' c4-content--home':'')} id="c4-journey">
 {sections.map((s,i)=>s.id==='trust'?<aside id={s.id} key={s.id} className="c4-tech-strip"><HtmlSection section={s}/></aside>:<section id={s.id} className={'c4-feature c4-feature-'+i%4} key={s.id}>
  <div className="c4-feature-head"><span className="c4-number">0{i+1} / TECHNOLOGY</span><h2>{s.heading}</h2></div>
  {(i%3!==2||content.meta.slug==='contact')&&<div className="c4-side-media"><SegmentPhoto page={content} index={i+1} className="c4-photo"/></div>}
  <article className="c4-feature-copy"><HtmlSection section={s}/></article>
 </section>)}</div>;
}
function CTA({content}:{content:VariationContent}){
 return <section className="c4-cta"><div className="c4-cta-panel"><span>LET&apos;S GET STARTED</span><h2>{content.home?'Build a stronger trading technology stack.':'Let’s talk about '+content.meta.title+'.'}</h2><p>Discuss your project with the Forex Trade Technology team.</p><Action design={design} label="Request a consultation"/>{content.meta.slug!=='home'&&<SegmentPhoto page={content} index={8} className="c4-cta-photo"/>}<span className="c4-cta-orb" aria-hidden="true"/></div></section>;
}
function Footer(){
 return <footer className="c4-footer"><div className="c4-foot-first"><SiteMark design={design}/><strong>Forex technology with the systems behind it.</strong></div><div className="c4-foot-second"><div><h3>Solutions</h3><SectionsNav design={design} filter="solutions"/></div><div><h3>Products</h3><SectionsNav design={design} filter="products"/></div><div><h3>Explore</h3><SectionsNav design={design} filter="company"/></div></div><Legal design={design}/></footer>;
}
export default function LeverateProposal({content}:{content:VariationContent}){return <div className="concept c4"><Header/><main>{content.home?<HomeSpotlight content={content}/>:<Hero content={content}/>}<Journey content={content}/></main><CTA content={content}/><Footer/></div>;}
