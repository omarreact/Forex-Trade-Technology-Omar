'use client';
import type {ReactNode,MouseEvent} from 'react';
import {useEffect,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {DESIGNS,resolveDesign,previewUrl,type DesignId} from '@/lib/showroom/designs';

export function DesignShowroomShell({children}:{children:ReactNode}){
  const router=useRouter();
  const pathname=usePathname();
  const params=useSearchParams();
  const explicit=params.get('design');
  const embed=params.get('embed')==='1';
  const [remembered,setRemembered]=useState<DesignId>('original');
  useEffect(()=>{
    try {setRemembered(resolveDesign(window.localStorage.getItem('ftt-showroom-design')));}
    catch { /* storage may be disabled */ }
  },[]);
  const design=explicit ? resolveDesign(explicit) : remembered;
  useEffect(()=>{
    try {window.localStorage.setItem('ftt-showroom-design',design);}
    catch { /* storage may be disabled */ }
  },[design]);
  function switchDesign(id:DesignId){
    setRemembered(id);
    const q=new URLSearchParams(params.toString());
    q.set('design',id);
    router.push(pathname+'?'+q.toString(),{scroll:false});
  }
  function preserveSelection(event:MouseEvent<HTMLDivElement>){
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    const target=event.target;
    if(!(target instanceof Element)) return;
    const anchor=target.closest('a');
    if(!anchor || anchor.target==='_blank'||anchor.hasAttribute('download'))return;
    const raw=anchor.getAttribute('href');
    if(!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:'))return;
    const href=new URL(anchor.href,window.location.href);
    if(href.origin!==window.location.origin || href.pathname.startsWith('/api/'))return;
    if(href.pathname==='/showroom')return;
    if(href.searchParams.has('design'))return;
    // Preserve the active visual system for all internal editorial links.
    if(design==='original' && !embed)return;
    event.preventDefault();
    href.searchParams.set('design',design);
    if(embed)href.searchParams.set('embed','1');
    router.push(href.pathname+href.search+href.hash);
  }
  return <div className="showroom-root" data-design={design} data-embed={embed?'yes':'no'} onClickCapture={preserveSelection}>
    {!embed && <div className="showroom-toolbar" role="region" aria-label="Design Preview Studio">
      <div className="showroom-toolbar__label"><span className="showroom-toolbar__signal" aria-hidden="true"/> Design Preview <b>Studio</b></div>
      <nav className="showroom-toolbar__tabs" aria-label="Choose a design variation">
        {DESIGNS.map((item,index)=><button key={item.id} type="button"
          className={design===item.id?'is-current':''} aria-pressed={design===item.id}
          title={item.tag} onClick={()=>switchDesign(item.id)}>
          <small>{String(index+1).padStart(2,'0')}</small> {item.name}
        </button>)}
      </nav>
      <Link className="showroom-toolbar__studio" href={'/showroom?design='+design}>Compare <span aria-hidden="true">↗</span></Link>
    </div>}
    {children}
  </div>;
}
