import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import HomePage from '@/app/page';
import {InteriorPageShell} from '@/components/InteriorPageShell';
import {OriginalLinkBridge} from '@/components/variants/OriginalLinkBridge';
import {allVariationRoutes,isVariation,resolveVariationPage,type VariationId} from '@/lib/variants/content';
import MatchTradeProposal from '@/components/designs/design-2-matchtrade/Page';
import B2BrokerProposal from '@/components/designs/design-3-b2broker/Page';
import LeverateProposal from '@/components/designs/design-4-leverate/Page';
import SoftFxProposal from '@/components/designs/design-5-softfx/Page';
import UpTraderProposal from '@/components/designs/design-6-uptrader/Page';

export const dynamicParams=false;
export const revalidate=3600;
type Params={design:string;segments?:string[]};
type Props={params:Promise<Params>};
export function generateStaticParams(){return allVariationRoutes();}
function resolve(params:Params){
 if(!isVariation(params.design))return null;
 const route='/'+(params.segments||[]).join('/');
 return resolveVariationPage(route,params.design);
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const route=await params;const entry=resolve(route);
 if(!entry)return {title:'Not Found | Forex Trade Technology'};
 // Identical editorial copy across six variations must never create duplicate indexed pages.
 return {
  title:entry.meta.seo_title+' | '+route.design,
  description:entry.meta.meta_description,
  alternates:{canonical:entry.meta.route.replace(/\/$/,'')||'/'},
  robots:{index:false,follow:true},
  openGraph:{title:entry.meta.seo_title,description:entry.meta.meta_description,type:'website'}
 };
}
export default async function VariationPage({params}:Props){
 const route=await params;const entry=resolve(route);
 if(!entry || !isVariation(route.design))notFound();
 const design=route.design as VariationId;
 if(design==='design-1'){
  if(entry.home)return <OriginalLinkBridge><HomePage/></OriginalLinkBridge>;
  const {getThemePageBySlug}=await import('@/lib/theme-pages');
  const {meta,html}=getThemePageBySlug(entry.meta.slug);
  if(!meta || !html)notFound();
  return <OriginalLinkBridge><InteriorPageShell meta={meta} html={html}/></OriginalLinkBridge>;
 }
 switch(design){
  case 'design-2':return <MatchTradeProposal content={entry}/>;
  case 'design-3':return <B2BrokerProposal content={entry}/>;
  case 'design-4':return <LeverateProposal content={entry}/>;
  case 'design-5':return <SoftFxProposal content={entry}/>;
  case 'design-6':return <UpTraderProposal content={entry}/>;
 }
}
