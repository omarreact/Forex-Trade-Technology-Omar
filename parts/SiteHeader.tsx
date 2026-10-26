'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {Icon} from '@/blocks/shared/Icon';
import {canonicalHref,siteConfig} from '@/lib/site-data';

export function SiteHeader(){
 const [menu,setMenu]=useState(false);
 const [submenu,setSubmenu]=useState(false);
 const headerRef=useRef<HTMLElement>(null);
 const dropdownRef=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 const isCurrent=(href:string)=>{
  const normalize=(value:string)=>value.replace(/\/+$/,'')||'/';
  return normalize(pathname)===normalize(canonicalHref(href));
 };

 useEffect(()=>{setMenu(false);setSubmenu(false)},[pathname]);
 useEffect(()=>{
  const closeOnOutside=(event:PointerEvent)=>{
   if(!headerRef.current?.contains(event.target as Node)){setMenu(false);setSubmenu(false)}
   else if(!dropdownRef.current?.contains(event.target as Node)){setSubmenu(false)}
  };
  const closeOnEscape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){setSubmenu(false);setMenu(false)}
  };
  document.addEventListener('pointerdown',closeOnOutside);
  document.addEventListener('keydown',closeOnEscape);
  return ()=>{
   document.removeEventListener('pointerdown',closeOnOutside);
   document.removeEventListener('keydown',closeOnEscape);
  };
 },[]);

 return <header className="bs-site-header bs-clean-header" ref={headerRef}>
   <div className="bs-shell bs-header-inner">
    <Link href="/" className="bs-brand" aria-label={`${siteConfig.site.name} — Home`}>
      <span className="bs-brand-mark" aria-hidden="true">✳</span><span className="bs-logo-text">FOREX<span>TRADE</span><small>TECHNOLOGY</small></span>
    </Link>
    <button type="button" className="bs-mobile-menu-toggle" aria-controls="bs-primary-nav" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>{setMenu(v=>!v);setSubmenu(false)}}><Icon name={menu?'x':'menu'} size={25}/></button>
    <nav id="bs-primary-nav" aria-label="Main navigation" className={`bs-inline-nav ${menu?'is-open':''}`}>
     {siteConfig.navigation.primary.map(nav=>('children' in nav && Array.isArray(nav.children))?
        <div className="bs-nav-dropdown" key={nav.id} ref={dropdownRef}>
         <button className={`bs-nav-link bs-menu-trigger ${nav.children.some(child=>isCurrent(child.href))?'active':''}`} aria-expanded={submenu} aria-haspopup="true" aria-controls="bs-solutions" type="button" onClick={()=>setSubmenu(v=>!v)}>
          {nav.label}<Icon name="chevronDown" size={14}/>
         </button>
         <div id="bs-solutions" className={`bs-submenu ${submenu?'is-open':''}`} aria-hidden={!submenu}>
          {nav.children.map(child=><Link tabIndex={submenu?0:-1} key={child.id} href={canonicalHref(child.href)} aria-current={isCurrent(child.href)?'page':undefined} className={isCurrent(child.href)?'active':''}>{child.label}<Icon name="arrowUpRight" size={16}/></Link>)}
         </div>
        </div>
      :<Link href={canonicalHref(('href' in nav && typeof nav.href==='string')?nav.href:'/')} key={nav.id} className={`bs-nav-link ${pathname.replace(/\/$/,'')===canonicalHref(('href' in nav && typeof nav.href==='string')?nav.href:'/').replace(/\/$/,'')?'active':''}`}>{nav.label}</Link>)}
      <Link className="bs-btn bs-btn-primary bs-nav-cta" href={canonicalHref(siteConfig.navigation.cta.href)}>{siteConfig.navigation.cta.label}<Icon name="arrowUpRight" size={16}/></Link>
    </nav>
    <Link className="bs-btn bs-btn-primary bs-desktop-cta" href={canonicalHref(siteConfig.navigation.cta.href)}>{siteConfig.navigation.cta.label}<Icon name="arrowUpRight" size={16}/></Link>
   </div>
  </header>;
}
