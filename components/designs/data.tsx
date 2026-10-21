import Link from 'next/link';
import {allVariationPages,variationPath,type VariationId,type ContentSection,type VariationContent} from '@/lib/variants/content';
import {getExpandedPagePhotos} from '@/lib/pexels-photos';

/** Shared data only. Every visual composition is implemented in its own design. */
export const approvedPages=allVariationPages();
export const navSets={
 solutions: approvedPages.filter(x=>x.route.startsWith('/solutions/')),
 products: approvedPages.filter(x=>x.route.startsWith('/products/')||x.route.startsWith('/technology/')),
 company: approvedPages.filter(x=>['about-us','how-it-works','faq','contact'].includes(x.slug))
};
export function withDesign(d:VariationId,route:string){return variationPath(d,route);}
export function imagesFor(page:VariationContent,offset=0){
 const photos=getExpandedPagePhotos(page.meta.slug);
 return photos.length?photos.slice(offset%photos.length).concat(photos.slice(0,offset%photos.length)):[];
}
export function imageFor(page:VariationContent,index:number,offset:number=0){
 const photos=imagesFor(page,offset);
 return photos[(index+photos.length)%photos.length];
}
export function SiteMark({design}:{design:VariationId}){
 return <Link href={withDesign(design,'/')} className="concept-brand" aria-label="Forex Trade Technology home">FOREX <span>TRADE</span><small>TECHNOLOGY</small></Link>;
}
export function HtmlSection({section}:{section:ContentSection}){
 return <div className="concept-copy" dangerouslySetInnerHTML={{__html:section.html}}/>;
}
export function Action({design,label='Request a Consultation'}:{design:VariationId,label?:string}){
 return <Link className="concept-action" href={withDesign(design,'/contact/#contact-form')}>{label}<span aria-hidden="true">↗</span></Link>;
}
export function Legal({design}:{design:VariationId}){
 return <small className="concept-legal">© {new Date().getFullYear()} Forex Trade Technology <span>Technology and infrastructure services. Regulatory obligations remain with the brokerage.</span><span>Developed by PINCODE IT</span></small>;
}
export function SectionsNav({design,filter}:{design:VariationId,filter?:'products'|'solutions'|'company'}){
 const a=filter?navSets[filter]:approvedPages;
 return <nav aria-label={filter?filter+' pages':'All approved pages'}>{a.map(page=><Link key={page.slug} href={withDesign(design,page.route)}>{page.title}</Link>)}</nav>;
}
export function ChapterHeading({section}:{section:ContentSection}){
 return <><span className="concept-index">{String(section.number).padStart(2,'0')}</span><h2>{section.heading}</h2></>;
}
export function SegmentPhoto({page,index,offset=0,className}:{page:VariationContent,index:number,offset?:number,className?:string}){
 const photo=imageFor(page,index,offset);
 if(!photo)return null;
 return <figure className={className||'concept-image'}><img src={photo.src} alt={photo.alt} width={1100} height={750} loading="lazy" decoding="async"/></figure>;
}
