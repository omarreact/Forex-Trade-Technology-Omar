'use client';
import {useState} from 'react';
const modes=[
 {label:'Trading',heading:'Trading terminal',rows:['Market watch','Execution workspace','Platform connections']},
 {label:'Clients',heading:'Client operations',rows:['Client onboarding','Account administration','CRM integration']},
 {label:'Connectivity',heading:'Infrastructure',rows:['Liquidity connectivity','MT5 infrastructure','Broker hosting']}
];
export default function TradingDesk(){
 const [active,setActive]=useState(0);
 const mode=modes[active];
 return <div className="rp2-desk" aria-label="Interactive trading platform technology illustration">
 <div className="rp2-desk-top"><span className="rp2-desk-dots" aria-hidden="true">● ● ●</span><strong>FOREX TRADE TECHNOLOGY</strong><small>DEMONSTRATION / NOT LIVE MARKET DATA</small></div>
 <div className="rp2-desk-tabs" role="tablist" aria-label="Platform preview modules">{modes.map((v,i)=><button type="button" role="tab" key={v.label} id={'rp2-tab-'+i} aria-selected={active===i} aria-controls="rp2-panel" onClick={()=>setActive(i)}>{v.label}</button>)}</div>
 <div className="rp2-desk-body" id="rp2-panel" role="tabpanel" aria-labelledby={'rp2-tab-'+active}><div className="rp2-desk-graphic"><div className="rp2-desk-graphic-head"><b>{mode.heading}</b><small>MODULE {String(active+1).padStart(2,'0')}</small></div>
 <svg viewBox="0 0 370 170" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="rp2-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#36d1c7" stopOpacity=".31"/><stop offset="100%" stopColor="#36d1c7" stopOpacity="0"/></linearGradient></defs><g stroke="#dce7ef" strokeWidth="1"><path d="M0 34H370M0 85H370M0 136H370M62 0V170M124 0V170M186 0V170M248 0V170M310 0V170"/></g><path d={active===0?'M0 140L30 116L57 123L84 78L112 98L140 65L171 82L199 48L227 59L255 27L285 36L315 17L340 33L370 11':'M0 116L30 120L57 94L84 105L112 60L140 70L171 35L199 62L227 28L255 48L285 27L315 31L340 14L370 22'} fill="none" stroke="#13adbb" strokeWidth="4" strokeLinejoin="round"/><path d="M0 140L30 116L57 123L84 78L112 98L140 65L171 82L199 48L227 59L255 27L285 36L315 17L340 33L370 11V170H0Z" fill="url(#rp2-area)"/></svg>
 <div className="rp2-desk-progress"><span/><span/><span/></div></div><div className="rp2-desk-list"><span className="rp2-desk-list-title">CAPABILITIES</span>{mode.rows.map((label,i)=><div key={label}><b>0{i+1}</b><span>{label}</span><span aria-hidden="true">↗</span></div>)}<p>Illustrative software interface · not a customer account</p></div></div></div>;
}
