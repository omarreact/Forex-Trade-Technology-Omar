import Link from 'next/link';
import {canonicalHref,siteConfig} from '@/lib/site-data';
import {Icon} from '@/blocks/shared/Icon';

/** One accessible, data-driven CTA used on every public page. */
export function FinalCta({home=false}:{home?:boolean}){
 const {kicker,title,description,action}=siteConfig.footer.cta;
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
      <span className="bs-global-cta-visual-tag">CONNECTED BROKERAGE SYSTEMS</span>
      <span className="bs-global-cta-visual-live"><span aria-hidden="true"/>Integrated stack</span>
     </div>
     <div className="bs-global-cta-visual-card">
      <span className="bs-global-cta-icon"><Icon name="server" size={24}/></span>
      <div><strong>Trading platforms</strong><span>MT5 configuration &amp; hosting</span></div>
      <Icon name="check" size={18}/>
     </div>
     <div className="bs-global-cta-visual-connector" aria-hidden="true"/>
     <div className="bs-global-cta-visual-card">
      <span className="bs-global-cta-icon"><Icon name="link" size={24}/></span>
      <div><strong>Liquidity &amp; connectivity</strong><span>Bridges, gateways &amp; integrations</span></div>
      <Icon name="check" size={18}/>
     </div>
     <div className="bs-global-cta-visual-connector" aria-hidden="true"/>
     <div className="bs-global-cta-visual-card">
      <span className="bs-global-cta-icon"><Icon name="users" size={24}/></span>
      <div><strong>Client operations</strong><span>CRM, KYC &amp; payments</span></div>
      <Icon name="check" size={18}/>
     </div>
    </div>}
    {!home&&<div className="bs-global-cta-decoration" aria-hidden="true"><span/><span/><span/></div>}
   </div>
  </div>
 </section>;
}
