import type {Metadata} from 'next';
import {absoluteUrl,getPage} from '@/lib/site-data';
import {PageRenderer} from '@/components/new-theme/PageRenderer';
const page=getPage('/')!;
export const metadata:Metadata={title:page.seo.title,description:page.seo.description,keywords:[page.seo.primaryKeyword,page.seo.secondaryKeywords].filter(Boolean).join(', '),alternates:{canonical:absoluteUrl('/')},openGraph:{title:page.seo.title,description:page.seo.description,url:absoluteUrl('/')},twitter:{card:'summary_large_image'}};
export default function Home(){return <PageRenderer page={page}/>}
