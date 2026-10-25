import {IconCard} from './IconCard';

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
   <header className="bs-feature-flex-heading">
    <span className="bs-feature-flex-kicker">FOREX TRADE TECHNOLOGY</span>
    <h2 id={`${id}-heading`}>{title}</h2>
    {intro.length>0&&<div className="bs-feature-flex-intro">{intro.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>}
   </header>
   <div className="bs-feature-flex-list">
    {items.map((item,index)=><IconCard
      className={`bs-feature-flex-card ${dark?'bs-benefit-card':'bs-infrastructure-card'}`}
      title={item.title}
      index={index}
      icon={item.icon}
      key={item.title}
    ><p>{item.description}</p></IconCard>)}
   </div>
  </div>
 </section>;
}
