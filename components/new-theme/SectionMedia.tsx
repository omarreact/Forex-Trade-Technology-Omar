import Image from 'next/image';
import {getImage,type MediaData} from '@/lib/site-data';

function Photo({imageKey,className=''}:{imageKey:string;className?:string}){
 const image=getImage(imageKey);
 if(!image)return null;
 return <div className={`bs-section-photo ${className}`}><Image src={image.url} alt={image.alt} fill unoptimized loading="lazy" sizes="(max-width: 800px) 94vw, (max-width: 1250px) 46vw, 700px"/></div>;
}
export function SectionMedia({media,pageImages=[]}:{media?:MediaData;pageImages?:string[]}){
 const primary=media?.imageKey;
 if(!primary||!getImage(primary))return null;
 if(media.layout==='backgroundWash'){
  const img=getImage(primary)!;
  return <div className="bs-section-wash" aria-hidden="true" style={{backgroundImage:`linear-gradient(90deg,rgba(245,248,238,.96),rgba(245,248,238,.83)),url("${img.url}")`}}/>;
 }
 if(media.layout==='gridGallery'){
  const keys=[primary,...pageImages.filter(k=>k!==primary&&getImage(k))].slice(0,3);
  return <div className="bs-section-media bs-gallery" aria-label="Related technology imagery">{keys.map(key=><Photo key={key} imageKey={key}/>)}</div>;
 }
 return <div className={`bs-section-media bs-photo-${media.layout}`}><Photo imageKey={primary}/>{media.caption&&<p className="bs-image-caption">{media.caption}</p>}</div>;
}
