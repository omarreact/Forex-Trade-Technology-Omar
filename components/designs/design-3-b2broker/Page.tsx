import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import HomeSpotlight from './HomeSpotlight';
import EcosystemView from './EcosystemView';
import {Action,HtmlSection,SegmentPhoto,SiteMark,Legal,SectionsNav,navSets,withDesign} from '../data';
const design='design-3' as const;
function Header(){
 return <header className="c3-header"><div className="c3-topline"><span>FOREX TRADE TECHNOLOGY / INSTITUTIONAL INFRASTRUCTURE</span><Link href={withDesign(design,'/contact/')}>Speak with us ↗</Link></div>
 <div className="c3-nav"><SiteMark design={design}/><nav aria-label="B2Broker-inspired navigation">
 <details><summary>Solutions +</summary><div className="c3-dropdown">{navSets.solutions.map(p=><Link key={p.slug} href={withDesign(design,p.route)}>{p.title}</Link>)}</div></details>
 <details><summary>Technology +</summary><div className="c3-dropdown">{navSets.products.map(p=><Link key={p.slug} href={withDesign(design,p.route)}>{p.title}</Link>)}</div></details>
 <Link href={withDesign(design,'/how-it-works/')}>How it Works</Link><Link href={withDesign(design,'/about-us/')}>About</Link></nav><Action design={design} label="Get Started"/></div></header>;
}
function Hero({content}:{content:VariationContent}){
 return <section className="c3-hero" aria-labelledby="c3-title"><div className="c3-gradient-atmosphere" aria-hidden="true"/>
 <div className="c3-hero-inner"><span className="c3-eyebrow"><i/> INSTITUTIONAL FINTECH SERVICES</span><h1 id="c3-title">{content.title}</h1>
 <p>{content.description}</p>{content.lead&&<p className="c3-hero-lead">{content.lead}</p>}
 <div className="c3-buttons"><Action design={design}/><a href="#c3-sections">Explore the ecosystem ↓</a></div></div>
 <EcosystemView/><div className="c3-hero-end"><span>PLATFORM ENGINEERING</span><span>CONNECTIVITY</span><span>OPERATIONS</span></div>
 </section>;
}
function Body({content}:{content:VariationContent}){
 return <div id="c3-sections" className={'c3-content'+(content.home?' c3-content--home':'')}>
 {content.sections.map((section,i)=>section.id==='trust'?<aside id={section.id} key={section.id} className="c3-tech-strip"><HtmlSection section={section}/></aside>:<section id={section.id} className={'c3-section c3-section-'+i%3} key={section.id}>
  <div className="c3-left"><span>{String(i+1).padStart(2,'0')} / {String(content.sections.length).padStart(2,'0')}</span><SegmentPhoto page={content} index={i+2} className="c3-inset-photo"/></div>
  <div className="c3-text"><h2>{section.heading}</h2><HtmlSection section={section}/></div>
 </section>)}</div>;
}
function CTA({content}:{content:VariationContent}){
 return <section className="c3-cta"><span>LET&apos;S TALK TECHNOLOGY</span><h2>{content.home?'Ready to discuss your brokerage technology?':content.meta.title}</h2><p>Tell us about your goals and the systems you need to connect.</p><Action design={design} label="Start a conversation"/></section>;
}
function Footer(){
 return <footer className="c3-footer"><div className="c3-footer-title"><SiteMark design={design}/><span>Technology behind the trading experience.</span></div>
 <div className="c3-footer-cols"><div><h3>Solutions</h3><SectionsNav design={design} filter="solutions"/></div><div><h3>Products & Technology</h3><SectionsNav design={design} filter="products"/></div><div><h3>Company & Contact</h3><SectionsNav design={design} filter="company"/></div></div>
 <div className="c3-foot-meta"><Legal design={design}/></div></footer>;
}
export default function B2BrokerProposal({content}:{content:VariationContent}){return <div className="concept c3"><Header/><main>{content.home?<HomeSpotlight content={content}/>:<Hero content={content}/>}<Body content={content}/></main><CTA content={content}/><Footer/></div>;}
