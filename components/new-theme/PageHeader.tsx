import Link from 'next/link';
import Image from 'next/image';
import {canonicalHref,getImage,type PageData} from '@/lib/site-data';
export function PageHeader({page}:{page:PageData}){
 const top=page.pageTop,image=getImage(top?.backgroundImageKey||page.hero.imageKey);
 // Some v3 JSON subtitles contain source-document breadcrumb labels; never present those as marketing copy.
 const raw=(top?.subtitle||'').trim();
 const fallback=page.hero.leadParagraphs?.find(text=>text.trim()&&!/^(Breadcrumb|Label):/i.test(text.trim()))||page.hero.subtitle||'';
 const subtitle=/^(Breadcrumb|Label):/i.test(raw)?fallback:raw;
 return <section className="bs-page-header" aria-labelledby="bs-page-heading" data-view-transition={top?.viewTransition||'hero'}>
  {image&&<Image className="bs-page-bg" src={image.url} alt={image.alt} fill priority unoptimized sizes="100vw"/>}
  <div className="bs-page-header-overlay"/>
  <div className="bs-shell bs-page-header-content">
   <nav className="bs-breadcrumb" aria-label="Breadcrumb">{(top?.breadcrumbs||[{label:'Home',href:'/'},{label:top?.title||page.hero.title}]).map((crumb,i,arr)=><span key={`${crumb.label}-${i}`} className="bs-crumb">{i>0&&<span aria-hidden="true" className="bs-crumb-slash">/</span>}{crumb.href&&i<arr.length-1?<Link href={canonicalHref(crumb.href)}>{crumb.label}</Link>:<span aria-current={i===arr.length-1?'page':undefined}>{crumb.label}</span>}</span>)}</nav>
   <span className="bs-hero-kicker">{top?.kicker||page.hero.kicker||'FOREX TRADE TECHNOLOGY'}</span>
   <h1 id="bs-page-heading" className="bs-page-title">{top?.title||page.hero.title}</h1>
   {subtitle&&<p className="bs-page-subtitle">{subtitle}</p>}
  </div>
 </section>;
}
