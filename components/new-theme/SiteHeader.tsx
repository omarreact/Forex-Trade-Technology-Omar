'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
import {Icon} from './Icon';
import {siteConfig} from '@/lib/site-data';
export function SiteHeader(){
 const [menu,setMenu]=useState(false),[submenu,setSubmenu]=useState(false);
 const pathname=usePathname();
 useEffect(()=>{setMenu(false);setSubmenu(false);},[pathname]);
 return <header className="bs-site-header">
   <div className="bs-shell bs-header-inner">
    <Link href="/" className="bs-brand" aria-label={`${siteConfig.site.name} — Home`}>
      <span className="bs-brand-mark" aria-hidden="true">✳</span><span className="bs-logo-text">FOREX<span>TRADE</span><small>TECHNOLOGY</small></span>
    </Link>
    <button type="button" className="bs-mobile-menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon name={menu?'x':'menu'} size={25}/></button>
    <nav aria-label="Main navigation" className={`bs-inline-nav ${menu?'is-open':''}`}>
     {siteConfig.navigation.primary.map(nav=>('children' in nav && Array.isArray(nav.children))?
        <div className="bs-nav-dropdown" key={nav.id}>
         <button className="bs-nav-link bs-menu-trigger" aria-expanded={submenu} aria-controls="bs-solutions" type="button" onClick={()=>setSubmenu(!submenu)}>{nav.label}<Icon name="chevronDown" size={14}/></button>
         <div id="bs-solutions" className={`bs-submenu ${submenu?'is-open':''}`}>
          {nav.children.map(child=><Link key={child.id} href={child.href} className={pathname===child.href?'active':''}>{child.label}<Icon name="arrowUpRight" size={16}/></Link>)}
         </div>
        </div>
      :<Link href={('href' in nav && typeof nav.href==='string')?nav.href:'/'} key={nav.id} className={`bs-nav-link ${pathname===nav.href?'active':''}`}>{nav.label}</Link>)}
      <Link className="bs-btn bs-btn-dark bs-nav-cta" href={siteConfig.navigation.cta.href}>{siteConfig.navigation.cta.label}<Icon name="arrowUpRight" size={16}/></Link>
    </nav>
    <Link className="bs-btn bs-btn-dark bs-desktop-cta" href={siteConfig.navigation.cta.href}>{siteConfig.navigation.cta.label}<Icon name="arrowUpRight" size={16}/></Link>
   </div>
  </header>;
}
