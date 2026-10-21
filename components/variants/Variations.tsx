import Link from 'next/link';
import type {VariationContent} from '@/lib/variants/content';
import {variationPath} from '@/lib/variants/content';
import {Brand,EndFooter,IntroHighlights,PageChapters,QuickCTA,SectionBody,SectionIndex,ShortLinks,VariationLinks,pexelsPhoto} from './shared';
import {getExpandedPagePhotos} from '@/lib/pexels-photos';

type Props={content:VariationContent};

export function VariationTwo({content}:Props){
 const design='design-2';
 return <div className="variant-site v-two">
  <header className="v2-header"><div className="v2-shell v2-header-inner">
   <Brand design={design}/><VariationLinks design={design}/><QuickCTA design={design} label="Get Started"/>
  </div></header>
  <main id="content">
   <section className="v2-hero"><div className="v2-shell v2-hero-grid">
    <div className="v2-intro"><span className="v-eyebrow"><i/> {content.eyebrow}</span><h1>{content.title}</h1>
     <p className="v-lead">{content.description}</p>{content.lead&&<p className="v-summary">{content.lead}</p>}
     <div className="v2-actions"><QuickCTA design={design} label="Request a consultation"/><a href="#v2-contents">Explore our solutions <span>↓</span></a></div>
    </div>
    <div className="v2-hero-image"><img src={getExpandedPagePhotos(content.meta.slug)[0]?.src||pexelsPhoto} alt={getExpandedPagePhotos(content.meta.slug)[0]?.alt||"Financial technology team at work"} width="1000" height="720"/><div className="v2-image-stat"><b>One connected ecosystem</b><span>Platform · Liquidity · CRM · Hosting</span></div></div>
   </div><div className="v2-shell v2-trust"><span>Brokerage technology</span><strong>Platforms</strong><strong>Liquidity</strong><strong>Client systems</strong><strong>Infrastructure</strong></div></section>
   <div className="v2-shell"><IntroHighlights content={content}/></div><div className="v2-shell v2-body" id="v2-contents">
     <div className="v2-section-caption"><span>OUR EXPERTISE</span><p>Integrated solutions for every stage of your brokerage</p></div>
     {content.sections.map((section,index)=><section className={'v2-chapter v2-chapter-'+index%3} id={section.id} key={section.id}>
      <div className="v2-chapter-top"><div><SectionIndex section={section}/><h2>{section.heading}</h2></div><span aria-hidden="true" className="v2-chapter-arrow">↗</span></div>
      <SectionBody section={section}/>
     </section>)}
   </div>
   <section className="v2-contact-band"><div className="v2-shell"><span>LET'S BUILD IT TOGETHER</span><h2>Technology that works as one.</h2><QuickCTA design={design} label="Talk to our specialists"/></div></section>
  </main>
  <footer className="v2-footer"><div className="v2-shell"><div className="v-footer-top"><div><Brand design={design}/><p>Trading infrastructure designed for how your brokerage operates.</p></div><ShortLinks design={design}/></div><EndFooter design={design}/></div></footer>
 </div>;
}

export function VariationThree({content}:Props){
 const design='design-3';
 return <div className="variant-site v-three">
  <header className="v3-header"><div className="v3-shell v3-header-bar"><span>FINANCIAL TECHNOLOGY SOLUTIONS</span><span>GLOBAL BROKERAGE INFRASTRUCTURE</span></div>
   <div className="v3-shell v3-header-inner"><Brand design={design}/><VariationLinks design={design}/><Link className="v3-header-contact" href={variationPath(design,'/contact/')}>CONTACT ↗</Link></div>
  </header>
  <main>
   <section className="v3-hero"><div className="v3-shell">
    <div className="v3-hero-label"><span>EST. FOR WHAT'S NEXT</span><span>01 — 06 / FOREX TRADE TECHNOLOGY</span></div>
    <h1>{content.title}</h1>
    <div className="v3-hero-bottom"><div><p>{content.description}</p>{content.lead&&<small>{content.lead}</small>}<QuickCTA design={design} label="Speak to our team"/></div>
     <div className="v3-chart" aria-hidden="true"><div className="v3-chart-line"/><div className="v3-chart-bars">{[25,42,32,58,47,73,56,82,72,93].map((h,i)=><span key={i} style={{height:h+'%'}}/>)}</div><div className="v3-chart-caption">INFRASTRUCTURE / CONNECTIVITY / DELIVERY</div></div>
    </div>
   </div></section>
   <div className="v3-shell"><IntroHighlights content={content}/></div><div className="v3-shell v3-editorial">
    <div className="v3-editorial-heading"><span>THE TECHNOLOGY STACK</span><strong>{String(content.sections.length).padStart(2,'0')} expertise chapters</strong></div>
    {content.sections.map((section,index)=><section id={section.id} key={section.id} className={'v3-chapter v3-chapter-'+index%2}>
      <aside className="v3-chapter-meta"><SectionIndex section={section}/><span>FOREX TRADE TECHNOLOGY</span></aside>
      <article><h2>{section.heading}</h2><SectionBody section={section}/></article>
    </section>)}
   </div>
   <section className="v3-close"><div className="v3-shell"><span>YOUR NEXT STEP</span><h2>Move with confidence.<br/>Build for scale.</h2><QuickCTA design={design} label="Start a conversation"/></div></section>
  </main>
  <footer className="v3-footer"><div className="v3-shell"><div className="v-footer-top"><div><Brand design={design}/><p>Institutional-grade technology. Independent solutions.</p></div><ShortLinks design={design}/></div><EndFooter design={design}/></div></footer>
 </div>;
}

export function VariationFour({content}:Props){
 const design='design-4';
 return <div className="variant-site v-four">
  <div className="v4-ribbon">POWERING THE NEXT GENERATION OF BROKERAGE TECHNOLOGY <span aria-hidden="true">✦</span></div>
  <header className="v4-header"><div className="v4-shell v4-header-inner"><Brand design={design}/><VariationLinks design={design}/><QuickCTA design={design} label="Let's talk"/></div></header>
  <main>
   <section className="v4-hero"><div className="v4-shell v4-hero-grid"><div className="v4-hero-copy">
    <div className="v4-tag">✦ &nbsp; {content.eyebrow}</div><h1>{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="v-summary">{content.lead}</p>}
    <div className="v4-buttons"><QuickCTA design={design} label="Launch your project"/><a href="#v4-sections">Explore technology ↗</a></div></div>
    <div className="v4-showcase" aria-label="Illustration of integrated brokerage technology">
     <div className="v4-orbit v4-orbit-one"/><div className="v4-orbit v4-orbit-two"/>
     <div className="v4-showcase-window"><div className="v4-window-head"><i/><i/><i/><span>Brokerage operations</span></div>
      <div className="v4-mock-number">One ecosystem<span>↗</span></div>
      <div className="v4-mock-grid"><b>Trading platform</b><b>Client management</b><b>Liquidity</b><b>Infrastructure</b></div>
     </div><div className="v4-float-chip">Connected by design ✓</div>
    </div>
   </div></section>
   <div className="v4-shell"><IntroHighlights content={content}/></div><div className="v4-shell v4-contents" id="v4-sections"><div className="v4-section-heading"><span>EXPLORE OUR CAPABILITIES</span><h2>Everything connects.</h2></div>
    {content.sections.map((section,i)=><section className={'v4-chapter v4-chapter-'+(i%3)} id={section.id} key={section.id}>
     <div className="v4-chapter-title"><SectionIndex section={section}/><h2>{section.heading}</h2></div>
     <div className="v4-chapter-body"><SectionBody section={section}/></div>
    </section>)}
   </div>
   <section className="v4-final"><div className="v4-shell"><div className="v4-final-card"><span>LET'S MAKE IT HAPPEN</span><h2>What could your brokerage become?</h2><QuickCTA design={design} label="Book a consultation"/></div></div></section>
  </main>
  <footer className="v4-footer"><div className="v4-shell"><div className="v-footer-top"><div><Brand design={design}/><p>Smarter systems. Stronger brokerage operations.</p></div><ShortLinks design={design}/></div><EndFooter design={design}/></div></footer>
 </div>;
}

export function VariationFive({content}:Props){
 const design='design-5';
 return <div className="variant-site v-five">
  <header className="v5-header"><div className="v5-shell v5-header-inner"><Brand design={design}/><span className="v5-status"><i/> SYSTEMS CONNECTED</span><VariationLinks design={design}/><Link className="v5-header-cta" href={variationPath(design,'/contact/')}>CONTACT / ↗</Link></div></header>
  <main>
   <section className="v5-hero"><div className="v5-shell v5-hero-grid"><div className="v5-hero-copy"><span className="v5-tag">[ FOREX TRADE TECHNOLOGY / SERVICES ]</span>
    <h1>{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="v-summary">{content.lead}</p>}
    <QuickCTA design={design} label="Connect with our experts"/></div>
    <div className="v5-system" aria-label="Connected architecture illustration"><div className="v5-system-top">INFRASTRUCTURE MAP <span>● ONLINE</span></div>
     <div className="v5-node v5-node-root">Brokerage<br/>core</div><div className="v5-nodes"><span>MT4 / MT5</span><span>BRIDGES</span><span>CRM</span><span>HOSTING</span></div><div className="v5-system-bottom">AUTOMATED • MONITORED • INTEGRATED</div>
    </div>
   </div><div className="v5-shell v5-overline">DELIVERING RELIABLE TRADING TECHNOLOGY <span>NETWORK / OPERATIONS / SUPPORT</span></div></section>
   <div className="v5-shell"><IntroHighlights content={content}/></div><div className="v5-shell v5-docs"><aside className="v5-sidebar"><p>DOCUMENTATION / INDEX</p><PageChapters content={content}/><Link href={variationPath(design,'/contact/')}>Request an assessment ↗</Link></aside>
    <div className="v5-docs-body">{content.sections.map(section=><section className="v5-chapter" id={section.id} key={section.id}>
     <span className="v5-chapter-label">SECTION {String(section.number).padStart(2,'0')} / {content.meta.category.toUpperCase()}</span><h2>{section.heading}</h2><SectionBody section={section}/>
    </section>)}</div>
   </div>
   <section className="v5-outro"><div className="v5-shell"><span>READY TO BUILD A STRONGER STACK?</span><h2>Your infrastructure deserves a plan.</h2><QuickCTA design={design}/></div></section>
  </main>
  <footer className="v5-footer"><div className="v5-shell"><div className="v-footer-top"><div><Brand design={design}/><p>Engineering the connections that make a brokerage work.</p></div><ShortLinks design={design}/></div><EndFooter design={design}/></div></footer>
 </div>;
}

export function VariationSix({content}:Props){
 const design='design-6';
 return <div className="variant-site v-six">
  <header className="v6-header"><div className="v6-shell v6-header-inner"><Brand design={design}/><VariationLinks design={design}/><QuickCTA design={design} label="Let's connect"/></div></header>
  <main>
   <section className="v6-hero"><div className="v6-shell v6-hero-grid"><div className="v6-copy">
    <div className="v6-pill">✳ &nbsp; {content.eyebrow}</div><h1>{content.title}</h1><p>{content.description}</p>{content.lead&&<p className="v-summary">{content.lead}</p>}
    <div className="v6-actions"><QuickCTA design={design} label="Start building"/><a href="#v6-capabilities">See what's possible ↓</a></div>
   </div>
    <div className="v6-photo-stack"><div className="v6-photo-main"><img src={getExpandedPagePhotos(content.meta.slug)[2]?.src||pexelsPhoto} alt={getExpandedPagePhotos(content.meta.slug)[2]?.alt||"Technology specialists at work"} width="1000" height="720"/></div>
     <div className="v6-photo-bubble">CONNECTED<br/><strong>TECHNOLOGY</strong><span>↗</span></div><div className="v6-photo-doodle" aria-hidden="true">✳</div>
    </div>
   </div></section>
   <div className="v6-service-row"><div className="v6-shell"><span>WHAT WE CONNECT</span><b>Trading</b><b>Liquidity</b><b>Operations</b><b>Growth</b></div></div>
   <div className="v6-shell"><IntroHighlights content={content}/></div><div className="v6-shell v6-content" id="v6-capabilities"><div className="v6-intro-strip"><span>CAPABILITIES & SOLUTIONS</span><h2>Everything you need to move forward.</h2></div>
    {content.sections.map((section,i)=><section className={'v6-chapter v6-chapter-'+(i%4)} id={section.id} key={section.id}>
     <div className="v6-chapter-head"><span>{String(section.number).padStart(2,'0')} / {content.meta.category}</span><h2>{section.heading}</h2><span aria-hidden="true" className="v6-spark">✦</span></div>
     <SectionBody section={section}/>
    </section>)}
   </div>
   <section className="v6-outro"><div className="v6-shell v6-outro-inner"><span>BIG IDEAS. CONNECTED SYSTEMS.</span><h2>Let's make it work.</h2><QuickCTA design={design} label="Tell us what you need"/></div></section>
  </main>
  <footer className="v6-footer"><div className="v6-shell"><div className="v-footer-top"><div><Brand design={design}/><p>Independent brokerage technology, thoughtfully integrated.</p></div><ShortLinks design={design}/></div><EndFooter design={design}/></div></footer>
 </div>;
}
