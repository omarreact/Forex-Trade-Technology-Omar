import site from './site.config.json';
import theme from '@/theme/theme.json';
import contentMetadata from './metadata.json';
import p0 from './pages/home.json';
import p1 from './pages/brokerage-setup.json';
import p2 from './pages/mt5-white-label.json';
import p3 from './pages/hosting.json';
import p4 from './pages/liquidity.json';
import p5 from './pages/crm.json';
import p6 from './pages/kyc-aml.json';
import p7 from './pages/payments.json';
import p8 from './pages/prop-firm.json';
import p9 from './pages/how-it-works.json';
import p10 from './pages/about-us.json';
import p11 from './pages/faq.json';
import p12 from './pages/contact.json';
import type {PageData} from './schema/page';
export type * from './schema/page';
export const siteConfig=site;
export const themeConfig=theme;
export const allPages=[p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12] as unknown as PageData[];
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
export const pageStats={...contentMetadata.stats};
