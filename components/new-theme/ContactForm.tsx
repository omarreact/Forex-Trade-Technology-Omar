'use client';
import {useState,type FormEvent} from 'react';
import {Icon} from './Icon';
import type {FormField} from '@/lib/site-data';
export function ContactForm({fields,submitLabel,privacyNote,email}:{fields:FormField[];submitLabel:string;privacyNote?:string;email:string}){
 const [pending,setPending]=useState(false),[result,setResult]=useState<{ok:boolean;message:string}|null>(null);
 async function send(event:FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setResult(null);
  const form=event.currentTarget,body=new FormData(form);
  try{const response=await fetch('/api/contact',{method:'POST',body}); const data=await response.json();
    setResult({ok:response.ok,message:data.message||(response.ok?'Message sent.':'We could not send your message.')}); if(response.ok)form.reset();
  }catch{setResult({ok:false,message:`Unable to submit right now. Please contact ${email}.`});}finally{setPending(false);}
 }
 return <div className="bs-contact-grid"><div className="bs-contact-intro"><span className="bs-eyebrow">START A CONVERSATION</span><h2>Let&apos;s build something <em>reliable.</em></h2><p>Tell us where you are in your launch or modernization process. We&apos;ll help map the right next steps.</p><a href={`mailto:${email}`}>{email}<Icon name="arrowUpRight"/></a></div>
   <form className="bs-contact-form" onSubmit={send} noValidate={false}>
    <input type="text" name="website" autoComplete="off" tabIndex={-1} className="bs-honeypot" aria-hidden="true"/>
    <div className="bs-form-fields">{fields.map(f=><label key={f.name} className={f.type==='textarea'?'wide':''}><span>{f.label}{f.required?' *':''}</span>{f.type==='textarea'?<textarea name={f.name} required={!!f.required} minLength={10} maxLength={4000} rows={5} placeholder="Tell us about your project, timelines and requirements"/>:<input type={f.type} name={f.name} required={!!f.required} maxLength={f.name==='message'?4000:150} placeholder={f.label}/>}</label>)}</div>
    <div className="bs-form-footer"><span>{privacyNote}</span><button className="bs-btn bs-btn-primary" type="submit" disabled={pending}>{pending?'Sending…':submitLabel}<Icon name="arrowUpRight" size={17}/></button></div>
    {result&&<p role="status" className={`bs-form-status ${result.ok?'success':'error'}`}>{result.message}</p>}
   </form>
 </div>;
}
