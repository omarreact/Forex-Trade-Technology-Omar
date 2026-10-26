import type {Metadata} from 'next';
import type {PageData} from '@/content/schema/page';
import {absoluteUrl} from './absolute-url';
export function pageMetadata(page:PageData):Metadata{
 return {title:page.seo.title,description:page.seo.description,keywords:[page.seo.primaryKeyword,page.seo.secondaryKeywords].filter(Boolean).join(', '),alternates:{canonical:absoluteUrl(page.seo.canonicalPath||page.slug)},openGraph:{title:page.seo.title,description:page.seo.description,url:absoluteUrl(page.slug)},twitter:{card:'summary_large_image',title:page.seo.title,description:page.seo.description}};
}
