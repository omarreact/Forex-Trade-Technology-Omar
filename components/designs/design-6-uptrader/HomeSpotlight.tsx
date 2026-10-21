import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {Action,navSets,withDesign} from '../data';
import CRMWorkflow from './CRMWorkflow';
const d='design-6' as const;
function CrmDashboard(){return <CRMWorkflow/>}
export default function HomeSpotlight({content}:{content:VariationContent}){return <>
 <section className="r6-hero" aria-labelledby="r6-home-title"><div className="r6-hero-content"><small>FOREX CRM / BROKER TECHNOLOGY</small><h1 id="r6-home-title">{content.title}</h1><p>{content.description}</p><Action design={d} label="Explore our solutions"/><div className="r6-hero-links">{navSets.products.slice(0,3).map(p=><Link key={p.slug} href={withDesign(d,p.route)}>{p.title} ↗</Link>)}</div></div><div className="r6-hero-dashboard"><CrmDashboard/></div></section>
 <div className="r6-home-rail" aria-label="Featured product capabilities">{content.highlights.map((h,i)=><article key={h.title}><span>0{i+1} / TECHNOLOGY</span><h2>{h.title}</h2><p>{h.description}</p></article>)}</div>
 </>}