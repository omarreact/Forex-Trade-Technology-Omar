import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,HtmlSection,SegmentPhoto,SiteMark,Legal,SectionsNav,navSets,withDesign} from '../data';
const design='design-5' as const;
function Header(){
 return <header className="c5-header"><div className="c5-top"><SiteMark design={design}/><span>TRADING SOFTWARE / INTEGRATION</span><Action design={design} label="Get in touch"/></div>
 <nav className="c5-nav" aria-label="Soft-FX-inspired navigation">
  <details><summary>Brokerage solutions</summary><div>{navSets.solutions.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}</Link>)}</div></details>
  <details><summary>Technology products</summary><div>{navSets.products.map(p=><Link href={withDesign(design,p.route)} key={p.slug}>{p.title}</Link>)}</div></details>
  <Link href={withDesign(design,'/how-it-works/')}>Delivery process</Link><Link href={withDesign(design,'/about-us/')}>Company</Link><Link href={withDesign(design,'/contact/')}>Contact</Link>
 </nav></header>;
}
function Hero({content}:{content:VariationContent}){
 return <section className="c5-hero"><div className="c5-hero-copy"><span className="c5-label">// FOREX TRADE TECHNOLOGY</span><h1>{content.title}</h1>
 <p>{content.description}</p>{content.lead&&<p className="c5-lead">{content.lead}</p>}
 <div className="c5-hero-actions"><Action design={design} label="Discuss your project"/><a href="#c5-sections">Explore capabilities ↘</a></div></div>
 <div className="c5-hero-system"><div className="c5-diagram" aria-label="Trading technology ecosystem diagram"><span className="c5-diagram-label">OPERATING SYSTEM</span><div className="c5-diagram-core">Brokerage<br/>Technology</div><div className="c5-diagram-grid"><span>PLATFORM</span><span>LIQUIDITY</span><span>CRM</span><span>HOSTING</span></div></div>
 <SegmentPhoto page={content} index={0} offset={3} className="c5-diagram-photo"/></div></section>;
}
function Infrastructure({content}:{content:VariationContent}){
 return <div className="c5-sections" id="c5-sections">
 {content.home&&<section className="c5-brief"><span>INTEGRATED SERVICES</span><div>{content.highlights.map((h,i)=><article key={i}><strong>0{i+1}</strong><h2>{h.title}</h2><p>{h.description}</p></article>)}</div></section>}
 {content.sections.map((s,i)=><section id={s.id} className={'c5-unit c5-unit-'+i%4} key={s.id}>
  <div className="c5-unit-head"><span>MODULE / {String(i+1).padStart(2,'0')}</span><h2>{s.heading}</h2></div>
  <div className="c5-unit-body"><HtmlSection section={s}/></div>
  {i%2===0&&<SegmentPhoto page={content} index={i+1} className="c5-unit-photo"/>}
  {i%4===3&&<div className="c5-connection" aria-hidden="true"><span>FLEXIBLE CONFIGURATION</span><i/><span>SYSTEM INTEGRATION</span></div>}
 </section>)}</div>;
}
function CTA({content}:{content:VariationContent}){
 return <section className="c5-cta"><SegmentPhoto page={content} index={3} className="c5-cta-media"/><div><span>DEPLOY / INTEGRATE / SUPPORT</span><h2>Ready to plan your technology infrastructure?</h2><p>{content.meta.title} — discuss the requirements with our team.</p><Action design={design} label="Connect with us"/></div></section>;
}
function Footer(){
 return <footer className="c5-footer"><div className="c5-footer-inner"><div className="c5-footer-lead"><SiteMark design={design}/><p>Software and infrastructure for modern broker operations.</p></div>
 <div className="c5-footer-directory"><section><h3>// Solutions</h3><SectionsNav design={design} filter="solutions"/></section><section><h3>// Products</h3><SectionsNav design={design} filter="products"/></section><section><h3>// Information</h3><SectionsNav design={design} filter="company"/></section></div></div><Legal design={design}/></footer>;
}
export default function SoftFxProposal({content}:{content:VariationContent}){return <div className="concept c5"><Header/><main><Hero content={content}/><Infrastructure content={content}/></main><CTA content={content}/><Footer/></div>;}
