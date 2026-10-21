import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
const d='design-2' as const;
function TraderPhone({secondary=false}:{secondary?:boolean}){return <div className={'r2-phone'+(secondary?' r2-phone-alt':'')} aria-label="Illustrative mobile trading application">
 <div className="r2-phone-top"><span>FOREX TRADE</span><span>•••</span></div>
 <div className="r2-phone-balance"><small>TECHNOLOGY PREVIEW</small><b>{secondary?'Trading workspace':'Market overview'}</b><span>Illustrative app interface</span></div>
 <div className="r2-chart"><svg viewBox="0 0 220 100" aria-hidden="true"><path d={secondary?'M0 82L21 61L45 69L60 43L80 57L111 35L131 41L155 24L186 33L220 10':'M0 78L15 66L34 75L50 50L70 55L88 37L107 48L127 25L145 40L163 17L183 27L202 9L220 16'} fill="none" stroke={secondary?'#2db6d1':'#21bd8f'} strokeWidth="3"/></svg></div>
 <div className="r2-rows">{['EUR/USD','GBP/USD','XAU/USD'].map((item,i)=><div key={item}><span>{item}</span><strong>{i%2===0?'Charts':'Watchlist'} ↗</strong></div>)}</div>
 <div className="r2-phone-actions"><span>Overview</span><span>Markets</span><span>Activity</span></div>
 </div>;}
export default function HomeSpotlight({content}:{content:VariationContent}){
 return <>
 <section className="r2-home-hero" aria-labelledby="r2-home-title">
  <div className="r2-hero-text"><small>PLATFORM & BROKERAGE TECHNOLOGY</small><h1 id="r2-home-title">{content.title}</h1><p>{content.description}</p><div className="r2-hero-buttons"><Action design={d}/><Link href={withDesign(d,'/solutions/mt5-white-label/')}>Explore MT5 technology ↗</Link></div></div>
  <div className="r2-devices"><div className="r2-device-circles" aria-hidden="true"/><TraderPhone/><TraderPhone secondary/></div>
 </section>
 <div className="r2-home-modules" aria-label="Technology overview">{content.highlights.map((h,i)=><article key={h.title}><span>0{i+1} / TECHNOLOGY</span><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 <section className="r2-products" aria-labelledby="r2-product-heading"><div className="r2-section-heading"><small>SOFTWARE & INFRASTRUCTURE</small><h2 id="r2-product-heading">Explore our products</h2></div><div className="r2-product-track">{navSets.products.map((p,i)=><Link className="r2-product-card" key={p.slug} href={withDesign(d,p.route)}><span>0{i+1} / SOLUTION</span><div className={'r2-product-graphic r2-product-graphic-'+i%3}><div className="r2-graphic-toolbar">● ● ● <em>Original platform illustration</em></div><div className="r2-graphic-plot"><i/><i/><i/><i/><i/><i/></div></div><strong>{p.title}</strong><span>Explore capability ↗</span></Link>)}</div></section>
 </>;
}