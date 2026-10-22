import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {absoluteUrl,allPages,getPage} from '@/lib/site-data';
import {PageRenderer} from '@/components/new-theme/PageRenderer';

export const dynamicParams=false;
export function generateStaticParams(){return allPages.filter(p=>p.slug!=='/').map(p=>({slug:p.slug.split('/').filter(Boolean)}));}
type Props={params:Promise<{slug:string[]}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params, page=getPage('/'+slug.join('/'));
 if(!page)return {};
 return {title:page.seo.title,description:page.seo.description,
  keywords:[page.seo.primaryKeyword,page.seo.secondaryKeywords].filter(Boolean).join(', '),
  alternates:{canonical:absoluteUrl(page.seo.canonicalPath||page.slug)},
  openGraph:{title:page.seo.title,description:page.seo.description,url:absoluteUrl(page.slug)},
  twitter:{card:'summary_large_image',title:page.seo.title,description:page.seo.description}};
}
export default async function ContentPage({params}:Props){const {slug}=await params,page=getPage('/'+slug.join('/'));if(!page)notFound();return <PageRenderer page={page}/>;}
