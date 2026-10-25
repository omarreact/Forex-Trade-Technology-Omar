'use client';
import {useEffect,useState,useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {canonicalHref,getImage,type SlideData} from '@/lib/site-data';
import {Icon} from './Icon';

export function HomeSlider({slides,intervalMs=6000,autoplay=true}:{slides:SlideData[];intervalMs?:number;autoplay?:boolean}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false);
 const focusInside=useRef(false);
 useEffect(()=>{
  if(!autoplay||paused||slides.length<2)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches)return;
  const timer=window.setInterval(()=>setIndex(i=>(i+1)%slides.length),Math.max(3000,intervalMs));
  return ()=>window.clearInterval(timer);
 },[autoplay,paused,intervalMs,slides.length]);
 const previous=()=>setIndex(i=>(i-1+slides.length)%slides.length);
 const next=()=>setIndex(i=>(i+1)%slides.length);
 if(!slides.length)return null;
 return <section className="bs-home-slider" aria-label="Featured brokerage solutions" aria-roledescription="carousel"
  onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>{if(!focusInside.current)setPaused(false)}}
  onFocusCapture={()=>{focusInside.current=true;setPaused(true)}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget)){focusInside.current=false;setPaused(false)}}}
  onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();previous()}else if(e.key==='ArrowRight'){e.preventDefault();next()}}}>
  {slides.map((slide,i)=>{
   const image=getImage(slide.imageKey),active=i===index;
   return <div className={`bs-slide ${active?'is-active':''}`} key={slide.imageKey}
    role="group" aria-roledescription="slide" aria-label={`Slide ${i+1} of ${slides.length}`}
    aria-hidden={!active} inert={!active}>
    {image&&<Image src={image.url} alt={image.alt} fill priority={i===0} unoptimized sizes="100vw" style={{objectPosition:image.position||'center'}} className="bs-slide-photo"/>}
    <div className="bs-slide-shade"/>
    <div className="bs-shell bs-slide-copy">
     <div className="bs-slide-content">
      <span className="bs-slide-kicker">{slide.kicker||'FOREX TRADE TECHNOLOGY'}</span>
      {i===0?<h1>{slide.title}</h1>:<h2>{slide.title}</h2>}
      {slide.subtitle&&<p>{slide.subtitle}</p>}
      {slide.cta&&<Link href={canonicalHref(slide.cta.href)} className="bs-btn bs-btn-primary">{slide.cta.label}<Icon name="arrowUpRight" size={17}/></Link>}
     </div>
    </div>
   </div>;
  })}
  <div className="bs-slide-controls">
   <div className="bs-slide-dots" role="group" aria-label="Choose slide">{slides.map((slide,i)=><button type="button" key={slide.imageKey} aria-label={`Go to slide ${i+1}`} aria-current={i===index?'true':undefined} className={i===index?'is-active':''} onClick={()=>setIndex(i)}/>)}</div>
  </div>
 </section>;
}
