import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
import TradingDesk from './TradingDesk';
const d='design-2' as const;
export default function HomeSpotlight({content}:{content:VariationContent}){
 return <>
 <section className="r2-home-hero" aria-labelledby="r2-home-title">
  <div className="r2-hero-text"><small>PLATFORM & BROKERAGE TECHNOLOGY</small><h1 id="r2-home-title">{content.title}</h1><p>{content.description}</p><div className="r2-hero-buttons"><Action design={d}/><Link href={withDesign(d,'/solutions/mt5-white-label/')}>Explore MT5 technology ↗</Link></div></div>
  <div className="r2-home-interactive"><TradingDesk/></div>
 </section>
 <div className="r2-home-modules" aria-label="Technology overview">{content.highlights.map((h,i)=><article key={h.title}><span>0{i+1} / TECHNOLOGY</span><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 <section className="r2-products" aria-labelledby="r2-product-heading"><div className="r2-section-heading"><small>SOFTWARE & INFRASTRUCTURE</small><h2 id="r2-product-heading">Explore our products</h2></div><div className="r2-product-track">{navSets.products.map((p,i)=><Link className="r2-product-card" key={p.slug} href={withDesign(d,p.route)}><span>0{i+1} / SOLUTION</span><div className={'r2-product-graphic r2-product-graphic-'+i%3}><div className="r2-graphic-toolbar">● ● ● <em>Original platform illustration</em></div><div className="r2-graphic-plot"><i/><i/><i/><i/><i/><i/></div></div><strong>{p.title}</strong><span>Explore capability ↗</span></Link>)}</div></section>
 </>;
}