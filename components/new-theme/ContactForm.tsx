'use client';
import {useState,type FormEvent} from 'react';
import {Icon} from './Icon';
import {siteConfig} from '@/lib/site-data';
const interests=['MT5 White Label','MT5 Grey Label','MT4 White Label','CRM','Website','Liquidity','Hosting','Turnkey','API','Other'];
const stages=['Planning','Preparing to Launch','Existing Broker','Scaling'];
const staticPreview=process.env.NEXT_PUBLIC_STATIC_EXPORT==='true';
const issueBase='https://github.com/omarreact/Forex-Trade-Technology-Omar/issues/new';
export function ContactForm(){
 const [pending,setPending]=useState(false);
 const [result,setResult]=useState<{ok:boolean;message:string}|null>(null);
 async function send(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setPending(true);setResult(null);
  const form=event.currentTarget;const body=new FormData(form);
  if(staticPreview){
   // A static site has no backend. Offer a PUBLIC GitHub issue draft; never
   // include name, email, phone or other private contact information in its URL.
   const field=(key:string)=>String(body.get(key)||'').trim();
   const title='Public website enquiry: '+(field('interest')||'General');
   const text=['## Topic',field('interest')||'General','','## Business stage',
    field('stage')||'Not specified','','## Message',field('message'),
    '','---','Public request originating on the GitHub Pages static preview.'].join('\\n');
   const issueURL=issueBase+'?'+new URLSearchParams({title,body:text}).toString();
   window.open(issueURL,'_blank','noopener,noreferrer');
   setResult({ok:false,message:'A public GitHub issue draft was requested. Sign in and confirm Submit new issue there to post it. Do not include personal or confidential information.'});
   setPending(false);
   return;
  }
  try{
   const response=await fetch('/api/contact',{method:'POST',body});
   const data=await response.json();
   setResult({ok:response.ok,message:data.message||(response.ok?'Message sent.':'Your request could not be sent.')});
   if(response.ok)form.reset();
  }catch{setResult({ok:false,message:'Unable to submit your request. Please try again later.'});}
  finally{setPending(false);}
 }
 return <div className="bs-contact-grid"><div className="bs-contact-intro">
   <span className="bs-eyebrow">REQUEST A CONSULTATION</span>
   <h2>Let&apos;s build something <em>reliable.</em></h2>
   <p>Planning a launch, fixing your existing setup, or deciding which technology you need? Tell us about your business and we&apos;ll arrange a useful technical consultation.</p>
   <p>{staticPreview?'GitHub Pages cannot submit private forms. You can create a public GitHub issue without personal contact details. Use the production form only after its domain is available and email delivery is configured.':'No sales script and no obligation. Fields marked with an asterisk are required.'}</p>
   {staticPreview?<a href={issueBase} target="_blank" rel="noopener noreferrer">Open GitHub Issues<Icon name="arrowUpRight" size={17}/></a>
     :siteConfig.site.email?<a href={`mailto:${siteConfig.site.email}`}>{siteConfig.site.email}<Icon name="arrowUpRight" size={17}/></a>
     :null}
  </div>
  <form className="bs-contact-form" onSubmit={send}>
   <input type="text" name="website" autoComplete="off" tabIndex={-1} className="bs-honeypot" aria-hidden="true"/>
   <div className="bs-form-fields">
    {!staticPreview&&<>
    <label><span>Name *</span><input autoComplete="name" type="text" name="name" placeholder="Your full name" required minLength={2} maxLength={100}/></label>
    <label><span>Business Email *</span><input autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={150}/></label>
    <label><span>Company</span><input autoComplete="organization" type="text" name="company" placeholder="Company name" maxLength={150}/></label>
    <label><span>Country</span><input autoComplete="country-name" type="text" name="country" placeholder="Country" maxLength={100}/></label>
    <label><span>Phone / WhatsApp</span><input autoComplete="tel" type="tel" name="contact" placeholder="Country code and number" maxLength={100}/></label>
    </>}
    <label><span>What are you interested in?</span><select name="interest" defaultValue=""><option value="">Select a solution</option>{interests.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>Where is your business right now?</span><select name="stage" defaultValue=""><option value="">Select your current stage</option>{stages.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>Message *</span><textarea name="message" minLength={10} maxLength={4000} rows={6} required placeholder="Share your business model, target markets, current platform, providers you've already chosen, or the problem you're trying to solve."/></label>
   </div>
   <div className="bs-form-footer"><span>{staticPreview?'Public GitHub issues are visible to everyone. Do not share personal or sensitive information.':'We will use these details only to respond to your enquiry. We do not provide brokerage or investment services.'}</span><button className="bs-btn bs-btn-primary" type="submit" disabled={pending}>{pending?'Sending…':staticPreview?'Review public GitHub issue':'Request a Consultation'}<Icon name="arrowUpRight" size={17}/></button></div>
   {result&&<p role="status" className={`bs-form-status ${result.ok?'success':'error'}`}>{result.message} {!result.ok&&staticPreview&&<a target="_blank" rel="noopener noreferrer" href={issueBase}>Open GitHub Issues</a>}</p>}
  </form>
 </div>;
}
