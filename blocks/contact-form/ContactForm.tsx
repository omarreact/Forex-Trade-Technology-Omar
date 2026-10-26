'use client';
import {useState,type FormEvent} from 'react';
import {Icon} from '@/blocks/shared/Icon';
const staticPreview=process.env.NEXT_PUBLIC_STATIC_EXPORT==='true';
const issueBase='https://github.com/omarreact/Forex-Trade-Technology-Omar/issues/new';
import type {ContactFormAttributes} from './types';
export function ContactForm({copy,email}:ContactFormAttributes){
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
   <span className="bs-eyebrow">{copy.eyebrow}</span>
   <h2>{copy.headingBefore} <em>{copy.headingEmphasis}</em></h2>
   <p>{copy.intro}</p>
   <p>{staticPreview?copy.previewNotice:copy.publicNotice}</p>
   {staticPreview?<a href={issueBase} target="_blank" rel="noopener noreferrer">{copy.previewLinkText}<Icon name="arrowUpRight" size={17}/></a>
     :email?<a href={`mailto:${email}`}>{email}<Icon name="arrowUpRight" size={17}/></a>
     :null}
  </div>
  <form className="bs-contact-form" onSubmit={send}>
   <input type="text" name="website" autoComplete="off" tabIndex={-1} className="bs-honeypot" aria-hidden="true"/>
   <div className="bs-form-fields">
    <label><span>{copy.fields.name.label}</span><input autoComplete="name" type="text" name="name" placeholder={copy.fields.name.placeholder} required minLength={2} maxLength={100}/></label>
    <label><span>{copy.fields.email.label}</span><input autoComplete="email" type="email" name="email" placeholder={copy.fields.email.placeholder} required maxLength={150}/></label>
    <label><span>{copy.fields.company.label}</span><input autoComplete="organization" type="text" name="company" placeholder={copy.fields.company.placeholder} maxLength={150}/></label>
    <label><span>{copy.fields.country.label}</span><input autoComplete="country-name" type="text" name="country" placeholder={copy.fields.country.placeholder} maxLength={100}/></label>
    <label><span>{copy.fields.contact.label}</span><input autoComplete="tel" type="tel" name="contact" placeholder={copy.fields.contact.placeholder} maxLength={100}/></label>
    <label><span>{copy.fields.interest.label}</span><select name="interest" defaultValue=""><option value="">{copy.fields.interest.placeholder}</option>{copy.fields.interest.options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>{copy.fields.stage.label}</span><select name="stage" defaultValue=""><option value="">{copy.fields.stage.placeholder}</option>{copy.fields.stage.options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
    <label className="wide"><span>{copy.fields.message.label}</span><textarea name="message" minLength={10} maxLength={4000} rows={6} required placeholder={copy.fields.message.placeholder}/></label>
   </div>
   <div className="bs-form-footer"><span>{staticPreview?copy.previewFooter:copy.footer}</span><button className="bs-btn bs-btn-primary" type="submit" disabled={pending}>{pending?copy.submitting:copy.submit}<Icon name="arrowUpRight" size={17}/></button></div>
   {result&&<p role="status" className={`bs-form-status ${result.ok?'success':'error'}`}>{result.message} {!result.ok&&staticPreview&&issueDraft&&<a target="_blank" rel="noopener noreferrer" href={issueDraft}>Review public GitHub issue draft (excludes personal information)</a>}</p>}
  </form>
 </div>;
}
