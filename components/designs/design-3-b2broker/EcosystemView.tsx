'use client';
import {useState} from 'react';
import {handleTabListKeyDown} from '../tab-keyboard';
const groups=[{name:'Solutions',items:['Brokerage setup','MT5 white label','Liquidity connectivity','Forex broker hosting']},{name:'Operations',items:['Forex CRM','KYC & AML integration','Payment integration','Prop firm CRM & API']}];
export default function EcosystemView(){
 const [index,setIndex]=useState(0);
 return <div className="rp3-eco" aria-label="Interactive institutional brokerage ecosystem illustration"><div className="rp3-eco-title"><span>FOREX TRADE TECHNOLOGY</span><strong>Technology Ecosystem</strong><small>ORIGINAL ARCHITECTURAL OVERVIEW</small></div>
 <div className="rp3-eco-switch" role="tablist" aria-label="Ecosystem groups">{groups.map((g,i)=><button type="button" role="tab" aria-selected={i===index} tabIndex={i===index?0:-1} aria-controls="rp3-eco-list" id={'rp3-eco-tab-'+i} key={g.name} onKeyDown={handleTabListKeyDown} onClick={()=>setIndex(i)}>{g.name}</button>)}</div>
 <div className="rp3-eco-diagram" id="rp3-eco-list" role="tabpanel" aria-labelledby={'rp3-eco-tab-'+index}><div className="rp3-eco-central"><span>INTEGRATED</span><b>FOREX<br/>TRADE</b><small>TECHNOLOGY</small></div><div className="rp3-eco-nodes">{groups[index].items.map((label,i)=><div key={label}><i>{String(i+1).padStart(2,'0')}</i><span>{label}</span><b>↗</b></div>)}</div></div><div className="rp3-eco-foot"><span>PLATFORM</span><span>INTEGRATIONS</span><span>OPERATIONS</span></div></div>;
}
