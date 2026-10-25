import type {ReactNode} from 'react';

type Props={
 title?:string;
 kicker?:string;
 subtitle?:string;
 children?:ReactNode;
 id?:string;
 level?:'h1'|'h2';
 as?:'div'|'header';
 className?:string;
 titleClassName?:string;
 kickerClassName?:string;
 subtitleClassName?:string;
};

/**
 * Shared, semantic title block. Copy and optional kicker/subtitle come from
 * each section; typography is controlled only by component-system.css.
 * Keep a single page H1; sections default to H2.
 */
export function SectionHeading({
 title,kicker='FOREX TRADE TECHNOLOGY',subtitle,children,id,
 level='h2',as='header',className='',titleClassName='',
 kickerClassName='',subtitleClassName=''
}:Props){
 const Wrapper=as;
 const Heading=level;
 return <Wrapper className={`bs-ui-heading ${className}`.trim()}>
  {kicker&&<span className={`bs-ui-kicker ${kickerClassName}`.trim()}>{kicker}</span>}
  <Heading id={id} className={`bs-ui-title ${titleClassName}`.trim()}>{title}</Heading>
  {subtitle&&<p className={`bs-ui-lead ${subtitleClassName}`.trim()}>{subtitle}</p>}
  {children}
 </Wrapper>;
}
