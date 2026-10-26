import Image from 'next/image';
import {getImage,type SectionData} from '@/content';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
export function Gallery3({section}:{section:SectionData}){
 const keys=section.media?.imageKeys||[];
 return <section id={section.id} className="bs-v5-section bs-v5-gallery"><div className="bs-shell">
  <SectionHeading className="bs-v5-section-heading" kicker="TECHNOLOGY IN PRACTICE" title={section.title==='Who We Work With'?'Technology Behind the Brokerage':section.title}/>
  <div className="bs-v5-gallery-grid">{keys.map(key=>{const img=getImage(key);return img?<figure key={key}><div className="bs-v5-gallery-photo"><Image src={img.url} alt={img.alt} fill unoptimized loading="lazy" sizes="(max-width:700px) 95vw, 33vw"/></div><figcaption>{img.alt}</figcaption></figure>:null})}</div>
 </div></section>;
}
/** All fullBlocks are retained in source JSON; this includes material omitted by the v5 layout shortlist. */
