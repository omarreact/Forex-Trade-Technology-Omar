'use client';
import {useState} from 'react';
const labels=[
 ['TRADING','CRM','CONNECTIVITY'],
 ['PLATFORM','EXECUTION','REPORTS'],
 ['HOSTING','SECURITY','OPERATIONS'],
 ['ONBOARDING','KYC','PAYMENTS']
];
/** Image unavailable? Display one of four ORIGINAL diagram compositions, not
    the same empty or repeated image tile throughout the entire homepage. */
export default function PhotoWithFallback({src,alt,variant=0}:{src?:string,alt:string,variant?:number}){
 const [failed,setFailed]=useState(false);
 const mode=((variant%4)+4)%4;
 return <>
  {src&&!failed&&<img src={src} alt={alt} width={1100} height={750} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
  <div className={'concept-media-system concept-media-system--'+mode} aria-hidden="true">
   <div className="concept-media-system-top"><span>FOREX TRADE TECHNOLOGY</span><span>{mode===0?'PLATFORM / SYSTEMS':mode===1?'INTEGRATION FLOW':mode===2?'SYSTEM WORKSPACE':'CLIENT OPERATIONS'}</span></div>
   {mode===0&&<svg viewBox="0 0 460 180" preserveAspectRatio="none"><g stroke="currentColor" strokeOpacity=".13" strokeWidth="1"><path d="M0 45H460M0 90H460M0 135H460M60 0V180M120 0V180M180 0V180M240 0V180M300 0V180M360 0V180M420 0V180"/></g><polyline points="0 154 29 136 57 142 83 99 112 113 141 70 174 89 199 54 235 75 273 41 311 57 348 21 388 36 429 11 460 24" fill="none" stroke="currentColor" strokeWidth="4"/></svg>}
   {mode===1&&<div className="concept-media-system-flow"><span>Trading platform</span><b>→</b><span>Liquidity</span><b>→</b><span>CRM</span></div>}
   {mode===2&&<div className="concept-media-system-metrics"><span><i>01</i> MT5 configuration</span><span><i>02</i> Server hosting</span><span><i>03</i> Operations</span></div>}
   {mode===3&&<div className="concept-media-system-integrations"><span>CRM</span><span>API</span><strong>TECHNOLOGY</strong><span>KYC</span><span>MT5</span></div>}
   <div className="concept-media-system-bottom">{labels[mode].map(x=><span key={x}>{x}</span>)}</div>
  </div>
 </>;
}
