'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {IconCard} from './IconCard';

export type AudienceItem={title:string;description:string;icon:string};
type Props={title:string;kicker?:string;items:AudienceItem[]};

/**
 * Multi-card, responsive, circular carousel. Source copy remains in pages.content.json.
 * Three copies let the last-to-first transition move forward without a visual jump.
 */
export function AudienceCarousel({title,kicker='FOREX TRADE TECHNOLOGY',items}:Props){
 const count=items.length;
 const [position,setPosition]=useState(count);
 const [step,setStep]=useState(0);
 const [animate,setAnimate]=useState(false);
 const [interacting,setInteracting]=useState(false);
 const [reduceMotion,setReduceMotion]=useState(false);
 const viewportRef=useRef<HTMLDivElement>(null);
 const trackRef=useRef<HTMLDivElement>(null);
 const active=((position-count)%count+count)%count;

 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduceMotion(media.matches);
  update();
  media.addEventListener('change',update);
  return ()=>media.removeEventListener('change',update);
 },[]);

 useEffect(()=>{
  const viewport=viewportRef.current;
  const track=trackRef.current;
  if(!viewport||!track||!count)return;
  const measure=()=>{
   const cards=track.querySelectorAll<HTMLElement>('.bs-audience-slide');
   if(cards.length>=2){
    const distance=cards[1].offsetLeft-cards[0].offsetLeft;
    if(distance>0)setStep(distance);
   }
  };
  measure();
  const observer=new ResizeObserver(measure);
  observer.observe(viewport);
  const frame=window.requestAnimationFrame(()=>setAnimate(true));
  return ()=>{observer.disconnect();window.cancelAnimationFrame(frame);};
 },[count]);

 const next=useCallback(()=>{setAnimate(true);setPosition(current=>current+1);},[]);
 const previous=useCallback(()=>{setAnimate(true);setPosition(current=>current-1);},[]);

 useEffect(()=>{
  if(count<2||interacting||reduceMotion||step===0)return;
  const timer=window.setInterval(next,5600);
  return ()=>window.clearInterval(timer);
 },[count,interacting,reduceMotion,step,next,position]);

 const handleTransitionEnd=(event:React.TransitionEvent<HTMLDivElement>)=>{
  if(event.target!==event.currentTarget||event.propertyName!=='transform')return;
  if(position<count||position>=count*2){
   const normalized=count+((position%count)+count)%count;
   setAnimate(false);
   setPosition(normalized);
   window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>setAnimate(true)));
  }
 };
 if(!count)return null;

 return <section
  className="bs-v5-section bs-audience-carousel-section"
  aria-label={title}
  onPointerEnter={()=>setInteracting(true)}
  onPointerLeave={()=>setInteracting(false)}
  onFocusCapture={()=>setInteracting(true)}
  onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setInteracting(false);}}
 >
  <div className="bs-shell">
   <div className="bs-audience-carousel-heading">
    <div><span className="bs-audience-kicker">{kicker}</span><h2>{title}</h2></div>
    <div className="bs-audience-controls">
     <button type="button" onClick={previous} aria-label="Previous audience" className="bs-audience-arrow"><ChevronLeft size={21}/></button>
     <button type="button" onClick={next} aria-label="Next audience" className="bs-audience-arrow"><ChevronRight size={21}/></button>
    </div>
   </div>
   <div className="bs-audience-viewport" ref={viewportRef}>
    <div
     className="bs-audience-track"
     ref={trackRef}
     aria-hidden="true"
     onTransitionEnd={handleTransitionEnd}
     style={{
      transform:step>0?`translate3d(-${position*step}px,0,0)`:'none',
      transition:animate&&!reduceMotion?'transform 520ms cubic-bezier(.2,.72,.2,1)':'none'
     }}
    >
     {[0,1,2].flatMap(copy=>items.map((item,index)=>
      <div className="bs-audience-slide" key={`${copy}-${index}`}>
       <IconCard title={item.title} icon={item.icon} index={index} className="bs-audience-icon-card">
        <p>{item.description}</p>
       </IconCard>
      </div>
     ))}
    </div>
   </div>
   <div className="bs-audience-pagination" aria-label="Choose audience slide">
    {items.map((item,index)=><button
     type="button"
     key={item.title}
     aria-label={`Show ${item.title}`}
     aria-current={active===index?'true':undefined}
     className={`bs-audience-dot${active===index?' is-active':''}`}
     onClick={()=>{setAnimate(true);setPosition(count+index);}}
    />)}
   </div>
   <ul className="bs-audience-screen-reader-list">
    {items.map(item=><li key={item.title}><strong>{item.title}:</strong> {item.description}</li>)}
   </ul>
  </div>
 </section>;
}
