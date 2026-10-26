'use client';
import {useEffect,useState} from 'react';
import {Icon} from '@/blocks/shared/Icon';
import {siteConfig} from '@/lib/site-data';
export function ScrollToTop(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>=siteConfig.features.scrollToTop.threshold);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 if(!siteConfig.features.scrollToTop.enabled) return null;
 return <button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className={`bs-scroll-top ${visible?'visible':''}`} aria-label={siteConfig.features.scrollToTop.label} title={siteConfig.features.scrollToTop.label}><Icon name="arrowUp" size={21}/></button>;
}
