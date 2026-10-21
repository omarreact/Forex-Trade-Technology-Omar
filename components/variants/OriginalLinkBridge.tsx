'use client';
import {useRouter} from 'next/navigation';
import type {ReactNode,MouseEvent} from 'react';
/** Keeps every link in the existing, unchanged Design 1 site under /design-1. */
export function OriginalLinkBridge({children}:{children:ReactNode}){
 const router=useRouter();
 function navigate(event:MouseEvent<HTMLDivElement>){
  if(event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
  if(!(event.target instanceof Element))return;
  const anchor=event.target.closest('a');
  if(!anchor || anchor.target==='_blank' || anchor.hasAttribute('download'))return;
  const raw=anchor.getAttribute('href');
  if(!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:'))return;
  const url=new URL(anchor.href,window.location.href);
  if(url.origin!==window.location.origin || url.pathname.startsWith('/design-1') || url.pathname.startsWith('/api/'))return;
  event.preventDefault();router.push('/design-1'+(url.pathname==='/'?'':url.pathname)+url.search+url.hash);
 }
 return <div className="variation-original" onClickCapture={navigate}>{children}</div>;
}
