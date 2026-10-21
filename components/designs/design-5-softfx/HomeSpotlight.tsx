import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
import InfrastructureTerminal from './InfrastructureTerminal';
const d='design-5' as const;
function Terminal(){return <InfrastructureTerminal/>}
export default function HomeSpotlight({content}:{content:VariationContent}){return <>
 <section className="r5-homehero" aria-labelledby="r5-home-title"><div className="r5-hero-copy"><small>TRADING SOFTWARE & BROKER TECHNOLOGY</small><h1 id="r5-home-title">{content.title}</h1><p>{content.description}</p><div><Action design={d}/><Link href={withDesign(d,'/products/forex-crm/')}>Explore products ↗</Link></div></div><div className="r5-hero-terminal"><Terminal/></div></section>
 <section className="r5-product-matrix" aria-labelledby="r5-product-heading"><small>TECHNOLOGY SOLUTIONS</small><h2 id="r5-product-heading">Choose the systems you need</h2><div>{navSets.products.concat(navSets.solutions.slice(0,2)).map((p,i)=><Link href={withDesign(d,p.route)} key={p.slug}><small>0{i+1} / SYSTEM</small><h3>{p.title}</h3><div className="r5-mini-chart"><span/><span/><span/><span/><span/></div><span>Explore capability ↗</span></Link>)}</div></section>
 <div className="r5-home-services" aria-label="Featured capabilities">{content.highlights.map((h,i)=><article key={h.title}><b>0{i+1}</b><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 <section className="r5-topology"><small>TECHNOLOGY ARCHITECTURE</small><h2>One connected brokerage infrastructure</h2><div className="r5-topology-map"><span>MT5</span><span>CRM</span><strong>FOREX TRADE<br/>TECHNOLOGY</strong><span>LIQUIDITY</span><span>HOSTING</span></div></section>
 </>}