import Link from 'next/link';
import {canonicalHref,siteConfig} from '@/lib/site-data';
import {Icon} from '@/blocks/shared/Icon';
import {Fragment} from 'react';

/** One accessible, data-driven CTA used on every public page. */
export function FinalCta({home=false}:{home?:boolean}){
 const {kicker,title,description,action,visual}=siteConfig.footer.cta;
 return <section
  className={`bs-cta-wrap bs-global-cta ${home?'bs-global-cta-home':''}`}
  aria-labelledby="bs-final-cta-title"
 >
  <div className="bs-shell">
   <div className="bs-global-cta-panel">
    <div className="bs-global-cta-content">
     <span className="bs-global-cta-eyebrow"><span className="bs-global-cta-pulse" aria-hidden="true"/>{kicker}</span>
     <h2 id="bs-final-cta-title">{title}</h2>
     <p>{description}</p>
     <Link className="bs-global-cta-button" href={canonicalHref(action.href)}>
      {action.label}<Icon name="arrowUpRight" size={19}/>
     </Link>
    </div>
    {home&&<div className="bs-global-cta-visual" aria-label="One connected brokerage technology stack">
     <div className="bs-global-cta-visual-header">
      <span className="bs-global-cta-visual-tag">{visual.eyebrow}</span>
      <span className="bs-global-cta-visual-live"><span aria-hidden="true"/>{visual.status}</span>
     </div>
     {visual.items.map((item,index)=><Fragment key={item.title}>
      {index>0&&<div className="bs-global-cta-visual-connector" aria-hidden="true"/>}
      <div className="bs-global-cta-visual-card">
       <span className="bs-global-cta-icon"><Icon name={item.icon} size={24}/></span>
       <div><strong>{item.title}</strong><span>{item.caption}</span></div>
       <Icon name="check" size={18}/>
      </div>
     </Fragment>)}
    </div>}
    {!home&&<div className="bs-global-cta-decoration" aria-hidden="true"><span/><span/><span/></div>}
   </div>
  </div>
 </section>;
}
