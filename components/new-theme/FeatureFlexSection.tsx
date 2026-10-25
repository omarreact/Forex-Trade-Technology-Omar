import {IconCard} from './IconCard';
import {SectionHeading} from './SectionHeading';

export type FeatureFlexItem={title:string;description:string;icon:string};

type Props={
 id:string;
 title:string;
 items:FeatureFlexItem[];
 intro?:string[];
 variant:'infrastructure'|'benefits';
};

export function FeatureFlexSection({id,title,items,intro=[],variant}:Props){
 const dark=variant==='benefits';
 return <section
  id={id}
  className={`bs-v5-section bs-feature-flex-section bs-feature-flex-${variant}`}
  aria-labelledby={`${id}-heading`}
 >
  <div className="bs-shell">
   <SectionHeading
    id={`${id}-heading`}
    title={title}
    className="bs-feature-flex-heading"
   >
    {intro.length>0&&<div className="bs-feature-flex-intro">{intro.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>}
   </SectionHeading>
   <div className="bs-feature-flex-list">
    {items.map(item=><IconCard
      className={`bs-feature-flex-card ${dark?'bs-benefit-card':'bs-infrastructure-card'}`}
      title={item.title}
      icon={item.icon}
      description={item.description}
      key={item.title}
    />)}
   </div>
  </div>
 </section>;
}
