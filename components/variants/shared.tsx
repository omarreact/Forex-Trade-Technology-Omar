import Link from 'next/link';
import type {ReactNode} from 'react';
import {allVariationPages,variationPath,type VariationId,type ContentSection, type VariationContent} from '@/lib/variants/content';

const all=allVariationPages();
const solutions=all.filter(p=>p.route.startsWith('/solutions/'));
const products=all.filter(p=>p.route.startsWith('/products/')||p.route.startsWith('/technology/'));
const company=all.filter(p=>p.route==='/how-it-works/'||p.route==='/about-us/'||p.route==='/faq/'||p.route==='/contact/');
export const photo='/theme-assets/images/workstation-1200.webp';
export const pexelsPhoto='https://images.pexels.com/photos/6285079/pexels-photo-6285079.jpeg?auto=compress&cs=tinysrgb&w=1300';
export function VariationLinks({design,kind}:{design:VariationId;kind?:'header'|'footer'}){
 return <nav className={'v-menu v-menu--'+(kind||'header')} aria-label="Main navigation">
  <Link href={variationPath(design,'/')}>Home</Link>
  <details><summary>Solutions</summary><div className="v-submenu">{solutions.map(p=><Link href={variationPath(design,p.route)} key={p.slug}>{p.slug==='mt5-white-label'?'MT5 White Label':p.title}</Link>)}</div></details>
  <details><summary>Products</summary><div className="v-submenu">{products.map(p=><Link href={variationPath(design,p.route)} key={p.slug}>{p.title}</Link>)}</div></details>
  <details><summary>Company</summary><div className="v-submenu">{company.map(p=><Link href={variationPath(design,p.route)} key={p.slug}>{p.slug==='faq'?'FAQs':p.title}</Link>)}</div></details>
  <Link href={variationPath(design,'/contact/')}>Contact</Link>
 </nav>;
}
export function ShortLinks({design}:{design:VariationId}){
 return <nav aria-label="Footer pages" className="v-footer-links">{all.filter(p=>p.slug!=='home').map(p=><Link href={variationPath(design,p.route)} key={p.slug}>{p.slug==='faq'?'FAQs':p.title}</Link>)}</nav>;
}
export function Brand({design}:{design:VariationId}){return <Link className="v-brand" href={variationPath(design,'/')} aria-label="Forex Trade Technology — home">Forex Trade <span>Technology</span><b>.</b></Link>;}
export function SectionBody({section}:{section:ContentSection}){
 return <div className="v-richtext" dangerouslySetInnerHTML={{__html:section.html}}/>;
}
export function SectionIndex({section}:{section:ContentSection}){return <span className="v-section-index">{String(section.number).padStart(2,'0')} / {String(section.number+1).padStart(2,'0')}</span>;}
export function QuickCTA({design,label='Discuss your project'}:{design:VariationId;label?:string}){return <Link className="v-cta" href={variationPath(design,'/contact/#contact-form')}>{label}<span aria-hidden="true"> ↗</span></Link>;}
export function EndFooter({design,children}:{design:VariationId;children?:ReactNode}){
 return <div className="v-legal"><span>© {new Date().getFullYear()} Forex Trade Technology</span><span>Technology services do not replace regulatory authorisation.</span><span>Developed by PINCODE IT</span>{children}</div>;
}
export function PageChapters({content}:{content:VariationContent}){
 return <nav aria-label="On this page" className="v-chapters">{content.sections.slice(0,9).map(s=><a key={s.id} href={'#'+s.id}>{s.heading}</a>)}</nav>;
}
