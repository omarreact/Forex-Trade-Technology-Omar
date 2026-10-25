'use client';

import {Icon} from './Icon';

type TrustCarouselProps={items:string[]};

/**
 * Edge-to-edge looping capabilities ticker. Six equal groups make the
 * one-group translation seamless even across ultrawide viewports.
 * Repeated items are hidden from assistive technology.
 */
export function TrustCarousel({items}:TrustCarouselProps){
 if(!items.length)return null;
 return <section className="bs-trust bs-trust-carousel" aria-label="Technology that connects">
  <div className="bs-trust-carousel-window" aria-live="off">
   <div className="bs-trust-carousel-track">
    {Array.from({length:6},(_,copy)=>
     <div className="bs-trust-carousel-group" key={copy} aria-hidden={copy>0}>
      {items.map((item,index)=>
       <span className="bs-trust-carousel-item" key={`${index}-${item}`}>
        <Icon name="check" size={18}/>
        <span>{item}</span>
       </span>
      )}
     </div>
    )}
   </div>
  </div>
 </section>;
}
