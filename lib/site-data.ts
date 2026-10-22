import site from '@/site-data/site.config.json';
import theme from '@/site-data/theme.styles.json';
import content from '@/site-data/pages.content.json';

export type ButtonData = {label:string;href:string;variant?:string;icon?:string};
export type HeroData = {kicker?:string;title:string;subtitle?:string;leadParagraphs?:string[];imageKey?:string;ctas?:ButtonData[];viewTransition?:string};
export type ContentBlock = {type:'h2'|'h3'|'p';text:string;parentH2?:string|null;parentH3?:string|null};
export type FaqItem = {q:string;a:string};
export type SectionData = {
 id:string;type:'trustStrip'|'contentSection'|'ctaRow'|'darkCta'|'faqAccordion'|'contactForm'|'cardGrid'|'prose';viewTransition?:string;
 title?:string;subtitle?:string;kicker?:string;blocks?:ContentBlock[];items?:Array<string|FaqItem>;ctas?:ButtonData[];cta?:ButtonData;
 columns?:number;paragraphs?:string[];imageKey?:string;openFirst?:boolean;
};
export type PageData = {id:string;slug:string;seo:{title:string;description:string;canonicalPath?:string;primaryKeyword?:string;secondaryKeywords?:string};hero:HeroData;sections:SectionData[];rawBlockCount?:number;wordCountApprox?:number;fullBlocks?:ContentBlock[];documentFooterNotes?:string[]};

export const siteConfig=site;
export const themeConfig=theme;
export const allPages=content.pages as unknown as PageData[];
export const allSlugs=allPages.map(p=>p.slug);
export const pageById=new Map(allPages.map(page=>[page.id,page]));
const legacyPaths=new Map(site.pages.map(item=>[item.slug,item.id]));
function normalizePath(path:string){const url=path.split('?')[0].split('#')[0];return url==='/'?'/':'/'+url.replace(/^\/+|\/+$/g,'')+'/';}
export function canonicalHref(href:string){
 if(!href.startsWith('/') || href.startsWith('//'))return href;
 const [base,fragment]=href.split('#'); const [pathname,query]=base.split('?');
 const id=legacyPaths.get(pathname)||legacyPaths.get(pathname.replace(/\/$/,''));
 return (id ? (pageById.get(id)?.slug||pathname):pathname) +(query?'?'+query:'')+(fragment?'#'+fragment:'');
}
export function getPage(slug:string){const path=normalizePath(slug);return allPages.find(p=>normalizePath(p.slug)===path);}
export function getPageById(id:string){return pageById.get(id);}
export function getImage(key?:string){
 const images=theme.assets.images as Record<string,{url:string;alt:string;source?:string}>;
 return key?images[key]:undefined;
}
export function absoluteUrl(path:string){
 const url=process.env.NEXT_PUBLIC_SITE_URL || 'https://forextrade.pincodeit.com';
 return new URL(path,url).toString();
}
export const pageStats={...content.stats};
