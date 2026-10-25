'use client';
import {useEffect,useMemo,useRef,useState,type FormEvent,type KeyboardEvent} from 'react';
import {usePathname} from 'next/navigation';
import {Icon} from './Icon';

const staticPreview=process.env.NEXT_PUBLIC_STATIC_EXPORT==='true';
const issueBase='https://github.com/omarreact/Forex-Trade-Technology-Omar/issues/new';
const categories=['Design / spacing','Typography / colors','Content correction','Mobile / responsive','Navigation / interaction','Other'];
type Status={ok:boolean;text:string};

export function ReviewFeedback(){
 const path=usePathname();
 const [open,setOpen]=useState(false);
 const [sending,setSending]=useState(false);
 const [status,setStatus]=useState<Status|null>(null);
 const [sections,setSections]=useState<Array<{id:string;label:string}>>([]);
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [message,setMessage]=useState('');
 const [category,setCategory]=useState(categories[0]);
 const [section,setSection]=useState('');
 const [honeypot,setHoneypot]=useState('');
 const buttonRef=useRef<HTMLButtonElement>(null);
 const dialogRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  if(!open)return;
  setSections([...document.querySelectorAll<HTMLElement>('main section[id]')].map(el=>({
   id:el.id,label:el.querySelector('h2,h3')?.textContent?.trim()?.slice(0,85)||el.id
  })));
  dialogRef.current?.querySelector<HTMLButtonElement>('.bs-review-close')?.focus({preventScroll:true});
  const keyDown=(ev:globalThis.KeyboardEvent)=>{
   if(ev.key==='Escape'){setOpen(false);buttonRef.current?.focus({preventScroll:true});}
  };
  document.addEventListener('keydown',keyDown);
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  return()=>{document.removeEventListener('keydown',keyDown);document.body.style.overflow=previousOverflow;};
 },[open,path]);

 const issueURL=useMemo(()=>{
  const title='Website feedback: '+category+' — '+path;
  // Do NOT include reviewer name/email in publicly readable GitHub issues.
  const body=['## Page',path,'','## Section',section||'General / entire page',
    '','## Issue type',category,'','## Requested change',message.trim()||'(Add details here)',
    '','---','Submitted from the Forex Trade Technology review widget. No private contact information included.'
  ].join('\n');
  return issueBase+'?'+new URLSearchParams({title,body}).toString();
 },[path,section,category,message]);

 function close(){setOpen(false);buttonRef.current?.focus({preventScroll:true});}
 function onKey(event:KeyboardEvent<HTMLDivElement>){
  if(event.key!=='Tab')return;
  const focusables=[...(dialogRef.current?.querySelectorAll<HTMLElement>(
   'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]'
  )||[])].filter(el=>el.getClientRects().length>0&&el.tabIndex>=0);
  if(!focusables.length)return;
  if(event.shiftKey&&document.activeElement===focusables[0]){
   event.preventDefault();focusables[focusables.length-1].focus();
  }else if(!event.shiftKey&&document.activeElement===focusables[focusables.length-1]){
   event.preventDefault();focusables[0].focus();
  }
 }

 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setStatus(null);
  setSending(true);
  const form=new FormData();
  form.set('kind','website-feedback');
  form.set('name',name.trim());form.set('email',email.trim());
  form.set('message',message.trim());form.set('category',category);
  form.set('section',section);form.set('pageUrl',window.location.href);
  form.set('website',honeypot);
  try{
   const endpoint=staticPreview?'https://forextrade.pincodeit.com/api/contact':'/api/contact';
   const response=await fetch(endpoint,{method:'POST',body:form,headers:{Accept:'application/json'}});
   const data=await response.json() as {ok?:boolean;message?:string};
   if(response.ok&&data.ok){
    setStatus({ok:true,text:'Your feedback was accepted by the email service.'});
    setMessage('');
   }else{
    setStatus({ok:false,text:data.message||'Direct email submission failed. No feedback was delivered; you can open a public GitHub issue draft below.'});
   }
  }catch{
   setStatus({ok:false,text:'The production mail API is unreachable. No feedback was delivered. You can open a public GitHub issue draft below.'});
  }finally{setSending(false);}
 }

 return <>
  <button ref={buttonRef} type="button" className="bs-review-trigger"
   aria-label="Suggest a website change" aria-haspopup="dialog" aria-expanded={open}
   onClick={()=>{setOpen(true);setStatus(null)}}>
   <Icon name="message" size={20}/><span>Suggest a change</span>
  </button>
  {open&&<div className="bs-review-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div ref={dialogRef} className="bs-review-dialog" role="dialog" aria-modal="true"
    aria-labelledby="bs-review-title" aria-describedby="bs-review-description" onKeyDown={onKey}>
    <header className="bs-review-head">
     <div><span className="bs-review-kicker">DEVELOPMENT FEEDBACK</span>
      <h2 id="bs-review-title">Suggest a change</h2></div>
     <button type="button" className="bs-review-close" aria-label="Close feedback form" onClick={close}>
      <Icon name="x" size={20}/>
     </button>
    </header>
    <div className="bs-review-body">
     <p id="bs-review-description" className="bs-review-desc">
      {'Describe a design or content change for the website team.'}
     </p>
     {staticPreview&&<p className="bs-review-privacy">
      <Icon name="info" size={17}/> Private delivery goes through the production server. If it is unavailable, a public GitHub issue draft can be opened without your name or email.
     </p>}
     <form id="bs-review-form" className="bs-review-form" onSubmit={submit}>
      <label className="bs-review-honeypot" aria-hidden="true">
       Leave blank<input value={honeypot} tabIndex={-1} onChange={e=>setHoneypot(e.target.value)} autoComplete="off"/>
      </label>
      <div className="bs-review-two">
       <label>Your name<input name="name" autoComplete="name" value={name}
        onChange={e=>setName(e.target.value)} minLength={2} maxLength={100} required placeholder="Name"/></label>
       <label>Email for reply<input name="email" autoComplete="email" type="email" value={email}
        onChange={e=>setEmail(e.target.value)} maxLength={150} required placeholder="you@example.com"/></label>
      </div>
      <div className="bs-review-two">
       <label>Page<input readOnly value={path} aria-label="Current website page"/></label>
       <label>Section<select value={section} onChange={e=>setSection(e.target.value)}>
        <option value="">Entire page</option>{sections.map(x=><option value={x.id} key={x.id}>{x.label}</option>)}
       </select></label>
      </div>
      <label>Issue type<select value={category} onChange={e=>setCategory(e.target.value)}>
       {categories.map(x=><option key={x}>{x}</option>)}
      </select></label>
      <label>What should change?
       <textarea value={message} onChange={e=>setMessage(e.target.value)}
        minLength={10} maxLength={4000} rows={4} required
        placeholder="Describe the problem and how it should look or behave."/>
      </label>
     </form>
    </div>
    <footer className="bs-review-footer">
     {status&&<p role="status" className={`bs-review-status ${status.ok?'success':'warning'}`}>{status.text}</p>}
     {(status&&!status.ok)&&<a
      className="bs-review-issue-link" href={issueURL} target="_blank" rel="noopener noreferrer">
      Review draft on GitHub <Icon name="arrowUpRight" size={17}/>
     </a>}
     <button form="bs-review-form" className="bs-review-submit" type="submit" disabled={sending}>
      {sending?'Sending…':'Send feedback'} <Icon name="arrowRight" size={18}/>
     </button>
     <p className="bs-review-note">Email delivery requires the production server and Resend. GitHub issue drafts are public and require your confirmation to post.</p>
    </footer>
   </div>
  </div>}
 </>;
}
