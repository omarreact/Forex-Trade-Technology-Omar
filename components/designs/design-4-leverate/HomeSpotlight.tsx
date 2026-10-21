import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
import BrokerageWorkbench from './BrokerageWorkbench';
const d='design-4' as const;
function PlatformMock(){return <BrokerageWorkbench/>}
export default function HomeSpotlight({content}:{content:VariationContent}){return <>
 <section className="r4-hero" aria-labelledby="r4-home-title"><div className="r4-hero-copy"><small>ONE TECHNOLOGY PARTNER</small><h1 id="r4-home-title">{content.title}</h1><p>{content.description}</p><Action design={d} label="Explore the solutions"/></div><div className="r4-hero-visual"><PlatformMock/></div></section>
 <section className="r4-journey" aria-labelledby="r4-journey-title"><small>TECHNOLOGY SOLUTIONS</small><h2 id="r4-journey-title">Solutions for your brokerage</h2><div className="r4-solution-cards">{navSets.solutions.map((p,i)=><Link key={p.slug} href={withDesign(d,p.route)}><span>0{i+1}</span><h3>{p.title}</h3><span>Explore solution →</span></Link>)}</div></section>
 <div className="r4-home-proof" aria-label="Featured technology">{content.highlights.map((h,i)=><article key={h.title}><span>0{i+1}</span><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 </>}