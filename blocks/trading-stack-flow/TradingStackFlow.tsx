import {Icon} from '@/blocks/shared/Icon';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
import type {SectionData} from '@/lib/site-data';

const connections=[
 {label:'Client trade',sub:'Order request',icon:'users'},
 {label:'MT4 / MT5',sub:'Trading platform',icon:'server'},
 {label:'Bridge / FIX',sub:'Gateway connection',icon:'link'},
 {label:'Liquidity',sub:'Price & execution',icon:'globe'},
 {label:'CRM & reporting',sub:'Trade record',icon:'database'}
] as const;

/**
 * Replaces three mostly-empty icon boxes with one legible relationship diagram.
 * Original supporting copy is preserved below the flow (section.blocks).
 */
export function TradingStackFlow({section}:{section:SectionData}){
 const copy=(section.blocks||[]).filter(b=>b.type==='p').map(b=>b.text);
 return <section id={section.id} className="bs-stack-flow-section bs-v5-section" aria-labelledby="bs-stack-flow-heading">
  <div className="bs-shell">
   <SectionHeading id="bs-stack-flow-heading" title={section.title}
    subtitle={copy[0]||'Follow a trade from the client to execution and reporting.'}/>
   <div className="bs-stack-flow-panel">
    <div className="bs-stack-flow-panel-top">
     <span>ONE CONNECTED TRADING STACK</span>
     <span className="bs-stack-flow-emphasis"><Icon name="check" size={15}/> Configuration · Testing · Monitoring</span>
    </div>
    <ol className="bs-stack-flow-steps" aria-label="Trading and reporting system connections">
     {connections.map((step,i)=><li key={step.label} className="bs-stack-flow-item">
      <div className="bs-stack-flow-node">
       <span className="bs-stack-flow-node-icon"><Icon name={step.icon} size={25}/></span>
       <strong>{step.label}</strong>
       <span>{step.sub}</span>
      </div>
      {i<connections.length-1&&<span className="bs-stack-flow-arrow" aria-hidden="true"><Icon name="arrowRight" size={20}/></span>}
     </li>)}
    </ol>
    <p className="bs-stack-flow-caption">Connected trade lifecycle — each integration must be configured, tested and monitored.</p>
   </div>
   {copy.length>1&&<div className="bs-stack-flow-explanation">
    <div className="bs-stack-flow-prose"><p>{copy[1]}</p></div>
    {copy[2]&&<aside className="bs-stack-flow-conclusion"><Icon name="shield" size={22}/><p>{copy[2]}</p></aside>}
   </div>}
  </div>
 </section>;
}
