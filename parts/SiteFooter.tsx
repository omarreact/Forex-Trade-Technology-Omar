import Link from 'next/link';
import {canonicalHref,siteConfig} from '@/lib/site-data';
import {Icon} from '@/blocks/shared/Icon';
export function SiteFooter(){return <footer className="bs-footer">
 <div className="bs-shell bs-footer-main">
  <div className="bs-footer-about"><Link href="/" className="bs-footer-logo">Forex Trade <strong>Technology<span>.</span></strong></Link><p>{siteConfig.footer.brand.description}</p>{siteConfig.site.email?<a href={`mailto:${siteConfig.site.email}`} className="bs-footer-email">{siteConfig.site.email}<Icon name="arrowUpRight" size={17}/></a>:<Link href={canonicalHref("/contact")} className="bs-footer-email">Contact our team<Icon name="arrowUpRight" size={17}/></Link>}</div>
  {siteConfig.footer.columns.map(c=><div className="bs-footer-col" key={c.heading}><h3>{c.heading}</h3>{c.links.map(l=><Link href={canonicalHref(l.href)} key={l.href}>{l.label}</Link>)}</div>)}
 </div><div className="bs-shell bs-footer-bottom"><span>{siteConfig.site.copyright}</span><Link href={canonicalHref('/contact')}>Talk to our team <Icon name="arrowUpRight" size={15}/></Link></div>
 </footer>}
