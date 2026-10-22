import site from '@/site-data/site.config.json';
import theme from '@/site-data/theme.styles.json';
import content from '@/site-data/pages.content.json';

export type ButtonData={label:string;href:string;variant?:string;icon?:string};
export type HeroData={kicker?:string;title:string;subtitle?:string;imageKey?:string;ctas?:ButtonData[];viewTransition?:string};
export type CardData={num?:string;title:string;desc?:string;href?:string;icon?:string;imageKey?:string};
export type FaqItem={q:string;a:string};
export type FormField={name:string;label:string;type:string;required?:boolean};
export type SectionData={id:string;type:'trustStrip'|'cardGrid'|'prose'|'darkCta'|'faqAccordion'|'contactForm';viewTransition?:string;kicker?:string;title?:string;subtitle?:string;columns?:number;items?:Array<string|CardData|FaqItem>;paragraphs?:string[];imageKey?:string;cta?:ButtonData;email?:string;fields?:FormField[];submitLabel?:string;privacyNote?:string;openFirst?:boolean};
export type PageData={id:string;slug:string;seo:{title:string;description:string};hero:HeroData;sections:SectionData[]};

export const siteConfig=site;
export const themeConfig=theme;
export const allPages=content.pages as unknown as PageData[];
export const allSlugs=allPages.map(p=>p.slug);
export function getPage(slug:string){return allPages.find(p=>p.slug===slug);}
export function getImage(key?:string){
 const images=theme.assets.images as Record<string,{url:string;alt:string;source?:string}>;
 return key?images[key]:undefined;
}
export function absoluteUrl(path:string){
 const url=process.env.NEXT_PUBLIC_SITE_URL || 'https://forextrade.pincodeit.com';
 return new URL(path,url).toString();
}
