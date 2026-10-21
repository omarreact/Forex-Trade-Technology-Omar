'use client';
import {useState} from 'react';
export default function PhotoWithFallback({src,alt}:{src?:string,alt:string}){
 const [failed,setFailed]=useState(false);
 return <>
  {src&&!failed&&<img src={src} alt={alt} width={1100} height={750} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
  <div className="concept-media-system" aria-hidden="true">
   <div className="concept-media-system-top"><span>FOREX TRADE TECHNOLOGY</span><span>PLATFORM / SYSTEMS</span></div>
   <svg viewBox="0 0 460 180" preserveAspectRatio="none"><g stroke="currentColor" strokeOpacity=".13" strokeWidth="1"><path d="M0 45H460M0 90H460M0 135H460M60 0V180M120 0V180M180 0V180M240 0V180M300 0V180M360 0V180M420 0V180"/></g><polyline points="0 154 29 136 57 142 83 99 112 113 141 70 174 89 199 54 235 75 273 41 311 57 348 21 388 36 429 11 460 24" fill="none" stroke="currentColor" strokeWidth="4"/></svg>
   <div className="concept-media-system-bottom"><span>TRADING</span><span>CRM</span><span>CONNECTIVITY</span></div>
  </div>
 </>;
}
