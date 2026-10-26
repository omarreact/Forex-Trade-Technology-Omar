'use client';
import {useState,type FormEvent} from 'react';
import {Icon} from '@/blocks/shared/Icon';
import {siteConfig} from '@/lib/site-data';
const interests=['MT5 White Label','MT5 Grey Label','MT4 White Label','CRM','Website','Liquidity','Hosting','Turnkey','API','Other'];
const stages=['Planning','Preparing to Launch','Existing Broker','Scaling'];
const staticPreview=process.env.NEXT_PUBLIC_STATIC_EXPORT==='true';
const issueBase='https://github.com/omarreact/Forex-Trade-Technology-Omar/issues/new';
export function ContactForm(){
 const [pending,setPending]=useState(false);
 const [result,setResult]=useState<{ok:boolean;message:string}|null>(null);
 const [issueDraft,setIssueDraft]=useState('');
 async function send(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setPending(true);setResult(null);setIssueDraft('');
  const form=event.currentTarget;const body=new FormData(form);
  if(staticPreview){
   const field=(key:string)=>String(body.get(key)||'').trim();
   const title='Public website enquiry: '+(field('interest')||'General');
   const text=['## Topic',field('interest')||'General','','## Business stage',
    field('stage')||'Not specified','','## Message',field('message'),
    '','---','Public request originating on the GitHub Pages static preview.'].join('\n');
   setIssueDraft(issueBase+'?'+new URLSearchParams({title,body:text}).toString());
  }
  try{
   const response=await fetch(staticPreview?'https://forex-trade-technology.vercel.app/api/contact':'/api/contact',{method:'POST',body});
   const data=await response.json();
   setResult({ok:response.ok,message:data.message||(response.ok?'Message accepted by the email provider.':'Email delivery is not available. No message was sent; use the public GitHub issue fallback only if the content is safe to share.')});
   if(response.ok)form.reset();
  }catch{setResult({ok:false,message:'The production mail service is unreachable. No message was delivered. A public GitHub issue draft is available below.'});}
  finally{setPending(false);}
 }
 return <div className="bs-contact-grid"><div className="bs-contact-intro">
   <span className="bs-eyebrow">REQUEST A CONSULTATION</span>
   <h2>Let&apos;s build something <em>reliable.</em></h2>
   <p>Planning a launch, fixing your existing setup, or deciding which technology you need? Tell us about your business and we&apos;ll arrange a useful technical consultation.</p>
   <p>{staticPreview?'This static preview submits privately through the Vercel mail API when available. Otherwise, you may create a public GitHub issue without including your name, email, or phone.':'No sales script and no obligation. Fields marked with an asterisk are required.'}</p>
   {staticPreview?<a href={issueBase} target="_blank" rel="noopener noreferrer">Open GitHub Issues<Icon name="arrowUpRight" size={17}/></a>
     :siteConfig.site.email?<a href={`mailto:${siteConfig.site.email}`}>{siteConfig.site.email}<Icon name="arrowUpRight" size={17}/></a>
     :null}
  </div>
  <form className="bs-contact-form" onSubmit={send}>
   <input type="text" name="website" autoComplete="off" tabIndex={-1} className="bs-honeypot" aria-hidden="true"/>
   <div className="bs-form-fields">
    <label><span>Name *</span><input autoComplete="name" type="text" name="name" placeholder="Your full name" required minLength={2} maxLength={100}/></label>
    <label><span>Business Email *</span><input autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={150}/></label>
    <label><span>Company</span><input autoComplete="organization" type="text" name="company" placeholder="Company name" maxLength={150}/></label>
    <label><span>Country</span><input autoComplete="country-name" type="text" name="country" placeholder="Country" maxLength={100}/></label>
    <label><span>Phone / WhatsApp</span><input autoComplete="tel" type="tel" name="contact" placeholder="Country code and number" maxLength={100}/></label>
    <label><span>What are you interested in?</span><select name="interest" defaultValue=""><option value="">Select a solution</option>{interests.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>Where is your business right now?</span><select name="stage" defaultValue=""><option value="">Select your current stage</option>{stages.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>Message *</span><textarea name="message" minLength={10} maxLength={4000} rows={6} required placeholder="Share your business model, target markets, current platform, providers you've already chosen, or the problem you're trying to solve."/></label>
   </div>
   <div className="bs-form-footer"><span>{staticPreview?'Private delivery requires Vercel and Resend. Fallback GitHub issues are public and require your confirmation.':'We will use these details only to respond to your enquiry. We do not provide brokerage or investment services.'}</span><button className="bs-btn bs-btn-primary" type="submit" disabled={pending}>{pending?'Sending…':'Request a Consultation'}<Icon name="arrowUpRight" size={17}/></button></div>
   {result&&<p role="status" className={`bs-form-status ${result.ok?'success':'error'}`}>{result.message} {!result.ok&&staticPreview&&issueDraft&&<a target="_blank" rel="noopener noreferrer" href={issueDraft}>Review public GitHub issue draft (excludes personal information)</a>}</p>}
  </form>
 </div>;
}
