import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
import EcosystemView from './EcosystemView';
const d='design-3' as const;
function EcosystemPanel({content}:{content:VariationContent}){return <div className="r3-eco"><div className="r3-eco-header"><small>CONNECTED BROKERAGE INFRASTRUCTURE</small><h2>One technology ecosystem</h2><p>{content.lead||content.description}</p></div><EcosystemView/><div className="r3-eco-services">{navSets.solutions.slice(0,4).map((p,i)=><Link key={p.slug} href={withDesign(d,p.route)}><span>0{i+1}</span><strong>{p.title}</strong><span>↗</span></Link>)}</div></div>}
export default function HomeSpotlight({content}:{content:VariationContent}){return <>
 <section className="r3-skyhero" aria-labelledby="r3-home-title"><div className="r3-halo" aria-hidden="true"/><div className="r3-city" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div><div className="r3-skycopy"><small>INSTITUTIONAL FINTECH INFRASTRUCTURE</small><h1 id="r3-home-title">{content.title}</h1><p>{content.description}</p><Action design={d}/></div></section>
 <div className="r3-eco-wrap"><EcosystemPanel content={content}/></div>
 <div className="r3-feature-row" aria-label="Featured brokerage capabilities">{content.highlights.map((h,i)=><article key={h.title}><span>0{i+1} / TECHNOLOGY</span><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 </>}