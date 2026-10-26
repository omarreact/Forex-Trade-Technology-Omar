import Image from 'next/image';
import {getImage,type SectionData} from '@/content';
function mediaTitleParts(title:string):[string,string]{
 const clean=title.trim();
 if(clean==='Forex Trade Technology')return ['Forex Trade','Technology'];
 const ampersand=clean.indexOf(' & ');
 const forClause=clean.toLowerCase().indexOf(' for ');
 const boundary=ampersand>=0?ampersand:forClause;
 if(boundary>7)return [clean.slice(0,boundary),clean.slice(boundary+1)];
 const words=clean.split(' ').filter(Boolean);
 const pivot=Math.max(1,Math.ceil(words.length*.56));
 return [words.slice(0,pivot).join(' '),words.slice(pivot).join(' ')];
}
export function MediaBand({section,title}:{section:SectionData;title:string}){
 const img=getImage(section.media?.imageKey);if(!img)return null;
 const [primary,accent]=mediaTitleParts(title);
 const headingId=`${section.id}-heading`;
 return <section id={section.id} className="bs-v5-media bs-v5-media-title-band" aria-labelledby={headingId}>
  <Image src={img.url} alt="" fill unoptimized loading="lazy" sizes="100vw" className="bs-v5-media-photo"/>
  <div className="bs-v5-media-shade" aria-hidden="true"/>
  <div className="bs-shell bs-v5-media-caption">
   <div className="bs-v5-media-title-content">
    <span className="bs-v5-media-eyebrow">FOREX TRADE TECHNOLOGY</span>
    <h2 id={headingId} className="bs-v5-media-title">{primary}{accent&&<> <span>{accent}</span></>}</h2>
   </div>
  </div>
 </section>;
}
