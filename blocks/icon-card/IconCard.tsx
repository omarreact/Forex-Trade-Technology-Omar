import type {ReactNode} from 'react';
import {Icon} from '@/blocks/shared/Icon';

import type {IconCardAttributes} from './types';
type IconCardProps=IconCardAttributes & {children?:ReactNode};

/** Decorative background icon — never read out twice by screen readers. */
export function IconWatermark({icon}:{icon:string}){
 return <span className="bs-icon-card-watermark" aria-hidden="true"><Icon name={icon} size={146}/></span>;
}

/**
 * Canonical icon-box component.
 * Pass icon + title + description/paragraphs; layout contexts may supply
 * extra class names, but do not redefine typography or badge colors.
 */
export function IconCard({title,icon,description,paragraphs,children,className=''}:IconCardProps){
 return <article className={`bs-icon-card bs-ui-card ${className}`.trim()}>
  <IconWatermark icon={icon}/>
  <div className="bs-icon-card-header">
   <span className="bs-icon-card-badge" aria-hidden="true"><Icon name={icon} size={22}/></span>
  </div>
  {title&&<h3 className="bs-ui-card-title">{title}</h3>}
  <div className="bs-icon-card-copy bs-ui-card-copy">
   {description&&<p>{description}</p>}
   {paragraphs?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
   {children}
  </div>
 </article>;
}
