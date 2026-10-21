'use client';
import {useState} from 'react';
const options=[
 {name:'Launch',title:'Brokerage setup',features:['Trading platform','Infrastructure planning','Deployment workflow']},
 {name:'Operate',title:'Broker operations',features:['Forex CRM','Client onboarding','Payment integration']},
 {name:'Connect',title:'Platform integration',features:['Liquidity connectivity','MT5 hosting','API integration']}
];
export default function BrokerageWorkbench(){
 const [chosen,setChosen]=useState(0);const mode=options[chosen];
 return <div className="rp4-workbench" aria-label="Interactive white label technology presentation"><div className="rp4-topline"><span><i/> FOREX TRADE TECHNOLOGY</span><small>PLATFORM OVERVIEW / ILLUSTRATIVE</small></div><div className="rp4-workbench-head"><h3>Broker technology workspace</h3><div role="tablist" aria-label="Broker operations modules">{options.map((o,i)=><button key={o.name} id={'rp4-tab-'+i} aria-controls="rp4-board" role="tab" aria-selected={i===chosen} onClick={()=>setChosen(i)} type="button">{o.name}</button>)}</div></div>
 <div id="rp4-board" aria-labelledby={'rp4-tab-'+chosen} role="tabpanel" className="rp4-board"><div className="rp4-board-side"><span>WORKSPACE</span><b>{mode.title}</b><p>Technology components configured around the brokerage requirements.</p><div className="rp4-board-ring">0{chosen+1}</div></div><div className="rp4-board-list">{mode.features.map((f,i)=><div key={f}><span>0{i+1}</span><b>{f}</b><span>→</span></div>)}<div className="rp4-board-meter"><i/><i/><i/><i/><i/><i/></div></div></div></div>;
}
