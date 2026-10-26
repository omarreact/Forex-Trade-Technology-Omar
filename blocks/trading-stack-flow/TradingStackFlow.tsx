import {Icon} from '@/blocks/shared/Icon';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
import type {SectionData} from '@/lib/site-data';

import type {TradingStackFlowAttributes} from './types';

/**
 * Replaces three mostly-empty icon boxes with one legible relationship diagram.
 * Original supporting copy is preserved below the flow (section.blocks).
 */
export function TradingStackFlow({section,visual}:TradingStackFlowAttributes){
 const connections=visual.connections;
 const copy=(section.blocks||[]).filter(b=>b.type==='p').map(b=>b.text);
 return <section id={section.id} className="bs-stack-flow-section bs-v5-section" aria-labelledby="bs-stack-flow-heading">
  <div className="bs-shell">
   <SectionHeading id="bs-stack-flow-heading" title={section.title}
    subtitle={copy[0]||visual.subtitleFallback}/>
   <div className="bs-stack-flow-panel">
    <div className="bs-stack-flow-panel-top">
     <span>{visual.kicker}</span>
     <span className="bs-stack-flow-emphasis"><Icon name="check" size={15}/> {visual.status}</span>
    </div>
    <ol className="bs-stack-flow-steps" aria-label={visual.ariaLabel}>
     {connections.map((step,i)=><li key={step.label} className="bs-stack-flow-item">
      <div className="bs-stack-flow-node">
       <span className="bs-stack-flow-node-icon"><Icon name={step.icon} size={25}/></span>
       <strong>{step.label}</strong>
       <span>{step.sub}</span>
      </div>
      {i<connections.length-1&&<span className="bs-stack-flow-arrow" aria-hidden="true"><Icon name="arrowRight" size={20}/></span>}
     </li>)}
    </ol>
    <p className="bs-stack-flow-caption">{visual.caption}</p>
   </div>
   {copy.length>1&&<div className="bs-stack-flow-explanation">
    <div className="bs-stack-flow-prose"><p>{copy[1]}</p></div>
    {copy[2]&&<aside className="bs-stack-flow-conclusion"><Icon name="shield" size={22}/><p>{copy[2]}</p></aside>}
   </div>}
  </div>
 </section>;
}
