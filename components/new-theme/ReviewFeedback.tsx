'use client';
import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent} from 'react';
import {usePathname} from 'next/navigation';
import {Icon} from './Icon';
import {siteConfig} from '@/lib/site-data';

type Result={ok:boolean;message:string};
const categories=['Design / spacing','Typography / colors','Content correction','Mobile / responsive','Navigation / interaction','Other'];

export function ReviewFeedback(){
 const path=usePathname();
 const [open,setOpen]=useState(false);
 const [submitting,setSubmitting]=useState(false);
 const [result,setResult]=useState<Result|null>(null);
 const [sections,setSections]=useState<Array<{id:string;label:string}>>([]);
 const [draft,setDraft]=useState('');
 const trigger=useRef<HTMLButtonElement>(null);
 const panel=useRef<HTMLDivElement>(null);
 const [email,setEmail]=useState('');
 const [name,setName]=useState('');
 const [message,setMessage]=useState('');
 const [category,setCategory]=useState(categories[0]);
 const [section,setSection]=useState('');
 const [website,setWebsite]=useState('');
 const [wasSent,setWasSent]=useState(false);

 useEffect(()=>{
  if(!open)return;
  const found=[...document.querySelectorAll<HTMLElement>('main section[id]')].map(element=>({
   id:element.id,
   label:element.querySelector('h2,h3')?.textContent?.trim()?.slice(0,90)||element.id
  }));
  setSections(found);
  panel.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  const onKey=(event:globalThis.KeyboardEvent)=>{
   if(event.key==='Escape'){setOpen(false);trigger.current?.focus();}
  };
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[open,path]);

 const messageBody=()=>[
  'Website improvement request',
  'Page: '+(typeof window==='undefined'?path:window.location.href),
  'Section: '+(section||'General'),
  'Category: '+category,
  'Reviewer: '+name,
  'Reply-to: '+email,
  '',
  'Requested change:',
  message
 ].join('\n');


 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setSubmitting(true);setResult(null);setDraft('');setWasSent(false);
  if(process.env.NEXT_PUBLIC_STATIC_EXPORT==='true'){
   setDraft(`${siteConfig.site.url}/contact`);
   setResult({ok:false,message:'GitHub Pages cannot send this request directly. Copy your message and submit it using the production contact form.'});
   setSubmitting(false);
   return;
  }
  const data=new FormData();
  data.set('kind','website-feedback');
  data.set('name',name.trim());data.set('email',email.trim());
  data.set('message',message.trim());data.set('category',category);
  data.set('section',section);data.set('pageUrl',window.location.href);
  data.set('website',website);
  try{
   const response=await fetch('/api/contact',{method:'POST',body:data,headers:{Accept:'application/json'}});
   const json=await response.json();
   if(response.ok&&json.ok){
    setWasSent(true);
    setResult({ok:true,message:'Your feedback was delivered to the website team. Thank you.'});
    setMessage('');
   }else{
    setResult({ok:false,message:json.message||'Automatic delivery is unavailable. No message was sent.'});
   }
  }catch{
   setResult({ok:false,message:'Automatic delivery is unavailable. No message was sent; please retry later.'});
  }finally{setSubmitting(false)}
 }

 function trapFocus(event:KeyboardEvent<HTMLDivElement>){
  if(event.key!=='Tab')return;
  const items=[...(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')||[])].filter(x=>x.offsetParent!==null);
  if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }

 return <>
  <button
   type="button" ref={trigger}
   className="bs-review-trigger"
   aria-label="Suggest a website change"
   aria-haspopup="dialog"
   aria-expanded={open}
   onClick={()=>{setOpen(v=>!v);setResult(null);setDraft('')}}
  >
   <Icon name="message" size={20}/>
   <span>Suggest a change</span>
  </button>
  {open&&<div className="bs-review-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget){setOpen(false);trigger.current?.focus()}}}>
   <div className="bs-review-dialog" role="dialog" aria-modal="true" aria-labelledby="bs-review-title" ref={panel} onKeyDown={trapFocus}>
    <div className="bs-review-head">
     <div><span className="bs-review-kicker">DEVELOPMENT FEEDBACK</span><h2 id="bs-review-title">Suggest a change</h2></div>
     <button className="bs-review-close" type="button" aria-label="Close feedback form" onClick={()=>{setOpen(false);trigger.current?.focus()}}><Icon name="x" size={20}/></button>
    </div>
    <p className="bs-review-desc">Send a page-specific design or content comment to the website team.</p>
    <form onSubmit={submit} className="bs-review-form">
     <label className="bs-review-honeypot" aria-hidden="true">Leave blank<input tabIndex={-1} value={website} onChange={e=>setWebsite(e.target.value)} autoComplete="off"/></label>
     <div className="bs-review-two">
      <label>Your name<input name="name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={100} required placeholder="Name"/></label>
      <label>Email for reply<input type="email" name="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={150} required placeholder="you@example.com"/></label>
     </div>
     <label>Page<input readOnly value={path} aria-label="Current website page"/></label>
     <div className="bs-review-two">
      <label>Section<select value={section} onChange={e=>setSection(e.target.value)}><option value="">General / entire page</option>{sections.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
      <label>Issue type<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
     </div>
     <label>What should change?<textarea value={message} onChange={e=>setMessage(e.target.value)} minLength={10} maxLength={4000} rows={4} required placeholder="Describe the exact change and what the final result should look like."/></label>
     <button type="submit" className="bs-review-submit" disabled={submitting}>{submitting?'Sending…':'Send feedback'}<Icon name="arrowRight" size={18}/></button>
    </form>
    {result&&<p role="status" className={`bs-review-status ${result.ok?'success':'warning'}`}>{result.message}</p>}
    {draft&&!wasSent&&<div className="bs-review-fallback-actions"><button type="button" className="bs-review-email-fallback" onClick={()=>navigator.clipboard.writeText(messageBody())}>Copy feedback</button><a className="bs-review-email-fallback" href={draft}>Open production contact form <Icon name="arrowUpRight" size={17}/></a></div>}
    <p className="bs-review-note">Submitted details are used to respond to this feedback. GitHub Pages is static; its feedback form requires the production contact page to submit your message.</p>
   </div>
  </div>}
 </>;
}
