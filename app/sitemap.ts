import type {MetadataRoute} from 'next';
import {absoluteUrl,allPages} from '@/lib/site-data';
export default function sitemap():MetadataRoute.Sitemap{return allPages.map(p=>({url:absoluteUrl(p.slug),changeFrequency:'monthly',priority:p.slug==='/'?1:0.7}))}
