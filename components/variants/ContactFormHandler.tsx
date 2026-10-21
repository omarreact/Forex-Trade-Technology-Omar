'use client';
import {useEffect} from 'react';
/** Adds validation and an accessible async status to the existing approved HTML form. */
export function ContactFormHandler(){
 useEffect(()=>{
  async function handle(event:Event){
   const target=event.target;
   if(!(target instanceof HTMLFormElement)||!target.matches('.bs-contact-form'))return;
   event.preventDefault();
   const status=target.querySelector<HTMLElement>('.bs-form-status,[role="status"]');
   const button=target.querySelector<HTMLButtonElement>('button[type="submit"]');
   if(!target.reportValidity())return;
   if(button)button.disabled=true;
   if(status)status.textContent='Sending your request…';
   try{
    const response=await fetch('/api/contact',{method:'POST',body:new FormData(target)});
    const data=await response.json() as {ok?:boolean;message?:string};
    if(status)status.textContent=data.message||(response.ok?'Sent.':'Unable to send.');
    if(data.ok&&response.ok)target.reset();
   }catch{
    if(status)status.textContent='Unable to send your request. Please check your connection.';
   }finally{if(button)button.disabled=false;}
  }
  document.addEventListener('submit',handle,true);
  return ()=>document.removeEventListener('submit',handle,true);
 },[]);
 return null;
}
