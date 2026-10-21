import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
const d='design-3' as const;
function EcosystemPanel(){
 const items=[...navSets.solutions,...navSets.products];
 return <div className="r3-eco"><div className="r3-eco-header"><small>CONNECTED BROKERAGE INFRASTRUCTURE</small><h2>One technology ecosystem</h2><p>Explore solutions, products and operational integrations in one place.</p></div><div className="r3-eco-grid"><article className="r3-eco-feature"><span>OUR SOLUTIONS</span><h3>Technology infrastructure built around your brokerage.</h3><p>Trading platforms, onboarding and operational systems.</p><Link href={withDesign(d,'/solutions/brokerage-setup/')}>View solutions ↗</Link></article><div className="r3-eco-services">{items.slice(0,6).map((p,i)=><Link key={p.slug} href={withDesign(d,p.route)}><span>0{i+1}</span><strong>{p.title}</strong><span>↗</span></Link>)}</div></div></div>;
}
export default function HomeSpotlight({content}:{content:VariationContent}){
 return <><section className="r3-skyhero"><div className="r3-halo" aria-hidden="true"/><div className="r3-city" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div><div className="r3-skycopy"><small>INSTITUTIONAL FINTECH INFRASTRUCTURE</small><h1>{content.title}</h1><p>{content.description}</p><Action design={d}/></div></section><div className="r3-eco-wrap"><EcosystemPanel/></div>
 <section className="r3-solutions"><div className="r3-headline"><small>EXPLORE OUR ECOSYSTEM</small><h2>Solutions shaped around brokerage operations</h2></div><div className="r3-solution-grid">{content.highlights.map((h,i)=><article key={i}><span>0{i+1}</span><h3>{h.title}</h3><p>{h.description}</p></article>)}</div></section>
 <section className="r3-solve"><div className="r3-headline"><small>OPERATIONAL REQUIREMENTS</small><h2>Each part of your brokerage infrastructure matters.</h2></div><div className="r3-solve-grid">{navSets.solutions.map((p,i)=><Link key={p.slug} href={withDesign(d,p.route)}><span>CAPABILITY {String(i+1).padStart(2,'0')}</span><h3>{p.title}</h3><span>Explore ↗</span></Link>)}</div></section></>;
}
