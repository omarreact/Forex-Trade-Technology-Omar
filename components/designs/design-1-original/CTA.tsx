import Link from 'next/link';
import type {ThemePageMeta} from '@/lib/theme-pages';

export function OriginalCTA({meta}:{meta?:ThemePageMeta}){
 const heading=meta?.slug==='contact'?'Discuss Your Brokerage Technology':'Build Your Trading Infrastructure';
 return <section className="ftt-original-cta" aria-label="Contact Forex Trade Technology">
   <div className="ftt-original-cta__inner"><div><p className="ftt-original-cta__eyebrow">FOREX TRADE TECHNOLOGY / CONSULTATION</p>
     <h2>{heading}</h2>
     <p>Tell us about your brokerage technology requirements and we&apos;ll discuss the practical next steps.</p>
   </div><Link href="/contact/#contact-form" className="ftt-original-cta__button">Request a Consultation <span aria-hidden="true">↗</span></Link></div>
 </section>;
}
