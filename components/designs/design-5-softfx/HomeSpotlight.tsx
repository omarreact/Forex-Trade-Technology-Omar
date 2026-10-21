import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
const d='design-5' as const;
function Terminal({mini=false}:{mini?:boolean}){
 return <div className={'r5-terminal'+(mini?' r5-terminal-mini':'')} aria-label="Illustrative trading terminal display"><div className="r5-terminal-head"><span>FOREX TRADE / TERMINAL PREVIEW</span><span>● ● ●</span></div><div className="r5-terminal-body"><div className="r5-term-rail"><i/><i/><i/><i/><i/></div><div className="r5-term-main"><div className="r5-term-tabs">TRADING <span>OVERVIEW</span> INSTRUMENTS</div><svg className="r5-market-graph" viewBox="0 0 300 128" aria-hidden="true"><g stroke="#25352b" strokeWidth="1"><path d="M0 30H300 M0 65H300 M0 100H300 M60 0V128 M120 0V128 M180 0V128 M240 0V128"/></g><polyline points="0,90 24,85 45,65 72,75 102,52 124,60 145,30 175,46 199,35 232,49 257,18 278,32 300,13" fill="none" stroke="#84db52" strokeWidth="3"/></svg><div className="r5-term-figures"><i/><i/><i/><i/></div></div></div></div>;
}
export default function HomeSpotlight({content}:{content:VariationContent}){
 return <><section className="r5-homehero"><div className="r5-hero-copy"><small>TRADING SOFTWARE & BROKER TECHNOLOGY</small><h1>{content.title}</h1><p>{content.description}</p><div><Action design={d}/><Link href={withDesign(d,'/products/forex-crm/')}>Explore products ↗</Link></div></div><div className="r5-hero-terminal"><Terminal/><div className="r5-float-terminal"><Terminal mini/></div></div></section>
 <section className="r5-product-highlight"><div><small>TECHNOLOGY PLATFORM</small><h2>Connect your technology infrastructure.</h2><p>{content.lead||content.description}</p><Link href={withDesign(d,'/solutions/brokerage-setup/')}>Explore brokerage setup ↗</Link></div><Terminal/></section>
 <section className="r5-product-matrix"><small>TECHNOLOGY SOLUTIONS</small><h2>What are you looking to build?</h2><div>{navSets.products.concat(navSets.solutions.slice(0,2)).map((p,i)=><Link href={withDesign(d,p.route)} key={p.slug}><small>0{i+1} / SYSTEM</small><h3>{p.title}</h3><div className="r5-mini-chart"><span/><span/><span/><span/><span/></div><span>Explore capability ↗</span></Link>)}</div></section>
 <section className="r5-topology"><small>TECHNOLOGY ARCHITECTURE</small><h2>One connected brokerage infrastructure</h2><div className="r5-topology-map"><span>MT5</span><span>CRM</span><strong>FOREX TRADE<br/>TECHNOLOGY</strong><span>LIQUIDITY</span><span>HOSTING</span></div></section>
 <section className="r5-services"><small>SERVICES / PLATFORM SUPPORT</small><div>{content.highlights.map((h,i)=><article key={i}><b>0{i+1}</b><h3>{h.title}</h3><p>{h.description}</p></article>)}</div></section></>;
}
