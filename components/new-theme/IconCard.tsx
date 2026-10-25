import type {ReactNode} from 'react';
import {Icon} from './Icon';

type IconCardProps={
  title?:string;
  icon:string;
  children:ReactNode;
  className?:string;
};

/** Shared icon-and-watermark treatment for service cards and audience slides. */
export function IconWatermark({icon}:{icon:string}){
 return <span className="bs-icon-card-watermark" aria-hidden="true"><Icon name={icon} size={146}/></span>;
}

export function IconCard({title,icon,children,className=''}:IconCardProps){
 return <article className={`bs-icon-card ${className}`}>
  <IconWatermark icon={icon}/>
  <div className="bs-icon-card-header">
   <span className="bs-icon-card-badge" aria-hidden="true"><Icon name={icon} size={22}/></span>
  </div>
  {title&&<h3>{title}</h3>}
  <div className="bs-icon-card-copy">{children}</div>
 </article>;
}
