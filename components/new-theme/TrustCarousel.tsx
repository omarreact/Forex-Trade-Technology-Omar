'use client';

import {Icon} from './Icon';

type TrustCarouselProps={items:string[]};

/**
 * Seamless, reusable homepage capability ticker.
 * The second group is visually identical to the first and hidden from screen readers.
 */
export function TrustCarousel({items}:TrustCarouselProps){
 if(items.length===0)return null;
 const capabilities=(duplicate:boolean)=>(
  <div className="bs-trust-carousel-group" aria-hidden={duplicate ? true : undefined}>
   {items.map((item,index)=>(
    <span className="bs-trust-carousel-item" key={`${index}-${item}`}>
     <Icon name="check" size={18}/>
     <span>{item}</span>
    </span>
   ))}
  </div>
 );
 return <section className="bs-trust bs-trust-carousel" aria-label="Technology that connects">
  <div className="bs-shell bs-trust-carousel-inner">
   <span className="bs-trust-carousel-label">TECHNOLOGY THAT<br/>CONNECTS</span>
   <div className="bs-trust-carousel-window" aria-live="off">
    <div className="bs-trust-carousel-track">
     {capabilities(false)}
     {capabilities(true)}
    </div>
   </div>

  </div>
 </section>;
}
