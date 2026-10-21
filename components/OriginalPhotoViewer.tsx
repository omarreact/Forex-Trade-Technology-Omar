'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
const selector='.ftt-home-editorial figure img,.ftt-interior figure img';
const fallbackKinds=['chart','workspace','infrastructure','integrations'] as const;
type Photo={src:string;alt:string};
/** Smaller article photos expand only on request; no heavyweight lightbox dependency. */
export function OriginalPhotoViewer(){
 const pathname=usePathname()||'/';
 const [photo,setPhoto]=useState<Photo|null>(null);
 const close=useRef<HTMLButtonElement>(null);
 const isOriginal=!/^\/design-[2-6](?:\/|$)/.test(pathname);
 useEffect(()=>{
   if(!isOriginal)return;
   const assignFallbackKind=(img:HTMLImageElement)=>{
     const figure=img.closest('figure');
     if(!figure||figure.classList.contains('ftt-photo-fallback--chart')||figure.classList.contains('ftt-photo-fallback--workspace')||figure.classList.contains('ftt-photo-fallback--infrastructure')||figure.classList.contains('ftt-photo-fallback--integrations'))return;
     const figures=[...document.querySelectorAll<HTMLImageElement>(selector)].map(image=>image.closest('figure')).filter((item):item is HTMLElement=>!!item);
     const index=figures.indexOf(figure);
     figure.classList.add('ftt-photo-fallback--'+fallbackKinds[(index<0?0:index)%fallbackKinds.length]);
   };
   const click=(event:MouseEvent)=>{
     const target=event.target;
     if(!(target instanceof HTMLImageElement)||!target.matches(selector))return;
     if(target.closest('figure')?.classList.contains('ftt-photo-missing'))return;
     if(!target.currentSrc && !target.src)return;
     setPhoto({src:target.currentSrc||target.src,alt:target.alt||'Forex Trade Technology editorial image'});
   };
   const key=(event:KeyboardEvent)=>{
     if(event.key==='Escape')setPhoto(null);
     if((event.key==='Enter'||event.key===' ')&&event.target instanceof HTMLImageElement&&event.target.matches(selector)){
       event.preventDefault();setPhoto({src:event.target.currentSrc||event.target.src,alt:event.target.alt||'Forex Trade Technology editorial image'});
     }
   };
   const onImageError=(event:Event)=>{
     const target=event.target;
     if(target instanceof HTMLImageElement && target.matches(selector)){
       assignFallbackKind(target);
       target.closest('figure')?.classList.add('ftt-photo-missing');
       target.removeAttribute('role');
       target.removeAttribute('tabindex');
     }
   };
   const setup=()=>{
     document.querySelectorAll<HTMLImageElement>(selector).forEach(img=>{
       assignFallbackKind(img);
       if(img.complete && img.currentSrc && !img.naturalWidth){
         img.closest('figure')?.classList.add('ftt-photo-missing');
       }
       if(img.closest('figure')?.classList.contains('ftt-photo-missing'))return;
       img.tabIndex=0;
       img.setAttribute('role','button');
       img.setAttribute('aria-label','Enlarge image: '+(img.alt||'Photo'));
     });
   };
   setup();
   const observer=new MutationObserver(setup);
   observer.observe(document.body,{childList:true,subtree:true});
   document.addEventListener('error',onImageError,true);
   document.addEventListener('click',click);
   document.addEventListener('keydown',key);
   return ()=>{observer.disconnect();document.removeEventListener('error',onImageError,true);document.removeEventListener('click',click);document.removeEventListener('keydown',key);};
 },[pathname,isOriginal]);
 useEffect(()=>{if(photo)close.current?.focus();},[photo]);
 if(!photo)return null;
 return <div className="ftt-photo-viewer" role="presentation" onClick={()=>setPhoto(null)}>
  <div className="ftt-photo-viewer__dialog" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={e=>e.stopPropagation()}>
   <button ref={close} type="button" onClick={()=>setPhoto(null)} aria-label="Close image preview">Close ×</button>
   <img src={photo.src} alt={photo.alt}/><p>{photo.alt}</p>
  </div>
 </div>;
}
