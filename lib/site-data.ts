import site from '@/site-data/site.config.json';
import theme from '@/site-data/theme.styles.json';
import content from '@/site-data/pages.content.json';

export type ButtonData={label:string;href:string;variant?:string;icon?:string};
export type HeroData={kicker?:string;title:string;subtitle?:string;leadParagraphs?:string[];imageKey?:string;ctas?:ButtonData[];viewTransition?:string;useSlider?:boolean};
export type ContentBlock={type:'h2'|'h3'|'p';text:string;parentH2?:string|null;parentH3?:string|null};
export type FaqItem={q:string;a:string};
export type MediaLayout='splitLeft'|'splitRight'|'cardThumb'|'fullBleed'|'gridGallery'|'backgroundWash'|'mediaBand';
export type MediaData={imageKey?:string;imageKeys?:string[];layout:MediaLayout|'gallery3';caption?:string;height?:string;loading?:string;opacity?:number};
export type SlideData={imageKey:string;kicker?:string;title:string;subtitle?:string;cta?:ButtonData};
export type PageTopData={variant:'homeSlider'|'pageHeader';height?:string;fullWidth?:boolean;autoplay?:boolean;intervalMs?:number;viewTransition?:string;slides?:SlideData[];kicker?:string;title?:string;subtitle?:string;breadcrumbs?:Array<{label:string;href?:string}>;backgroundImageKey?:string;overlay?:string};
export type SectionData={
 id:string;type:'trustStrip'|'contentSection'|'ctaRow'|'darkCta'|'faqAccordion'|'mediaBand'|'contactForm'|'cardGrid'|'prose'|'gallery3';viewTransition?:string;
 title?:string;subtitle?:string;kicker?:string;blocks?:ContentBlock[];items?:Array<string|FaqItem>;ctas?:ButtonData[];cta?:ButtonData;
 columns?:number;paragraphs?:string[];imageKey?:string;openFirst?:boolean;media?:MediaData;layout?:string;density?:string;preferredRender?:string;theme?:string;
};
export type PageData={id:string;slug:string;seo:{title:string;description:string;canonicalPath?:string;primaryKeyword?:string;secondaryKeywords?:string};hero:HeroData;pageTop?:PageTopData;pageImages?:string[];sections:SectionData[];rawBlockCount?:number;wordCountApprox?:number;fullBlocks?:ContentBlock[];documentFooterNotes?:string[]};

export const siteConfig=site;
export const themeConfig=theme;
export const allPages=content.pages as unknown as PageData[];
export const allSlugs=allPages.map(p=>p.slug);
export const pageById=new Map(allPages.map(page=>[page.id,page]));
const routeMap=site.routing.paths as Record<string,string>;
const shortAliases:Record<string,string>={
 '/brokerage-setup':routeMap['brokerage-setup'], '/mt5-white-label':routeMap['mt5-white-label'],
 '/hosting':routeMap.hosting, '/liquidity':routeMap.liquidity, '/crm':routeMap.crm,
 '/kyc-aml':routeMap['kyc-aml'], '/payments':routeMap.payments,
 '/prop-firm':routeMap['prop-firm'], '/about':routeMap.about,
};
export const legacyRedirects=Object.entries(shortAliases).filter(([source,destination])=>source!==destination).map(([source,destination])=>({source,destination,permanent:true}));
export function normalizePath(value:string){const p=value.split('?')[0].split('#')[0].replace(/\/+$/,'');return p===''?'/':'/'+p.replace(/^\/+/, '');}
export function canonicalHref(href:string){
 if(!href.startsWith('/')||href.startsWith('//'))return href;
 const [base,hash]=href.split('#');const [path,query]=base.split('?');
 const resolved=shortAliases[normalizePath(path)]||normalizePath(path);
 return resolved+(query?'?'+query:'')+(hash?'#'+hash:'');
}
export function getPage(slug:string){const path=normalizePath(slug);return allPages.find(p=>normalizePath(p.slug)===path);}
export function getPageById(id:string){return pageById.get(id);}
export function getImage(key?:string){const images=theme.assets.images as Record<string,{url:string;alt:string;source?:string;position?:string;credit?:string;sourcePage?:string}>;return key?images[key]:undefined;}
export function absoluteUrl(path:string){const url=process.env.NEXT_PUBLIC_SITE_URL||site.site.url;return new URL(path,url).toString();}
export const pageStats={...content.stats};
