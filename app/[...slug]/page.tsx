import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {allPages,getPage} from '@/content';
import {pageMetadata} from '@/lib/seo';
import {PageTemplate} from '@/templates';
export const dynamicParams=false;
export function generateStaticParams(){return allPages.filter(p=>p.slug!=='/').map(p=>({slug:p.slug.split('/').filter(Boolean)}));}
type Props={params:Promise<{slug:string[]}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params,page=getPage('/'+slug.join('/'));
 return page?pageMetadata(page):{};
}
export default async function ContentPage({params}:Props){
 const {slug}=await params,page=getPage('/'+slug.join('/'));
 if(!page)notFound();return <PageTemplate page={page}/>;
}
