import type {MetadataRoute} from 'next';
// Metadata routes must be prerenderable for the GitHub Pages static export.
export const dynamic='force-static';
import {absoluteUrl,allPages} from '@/lib/site-data';
export default function sitemap():MetadataRoute.Sitemap{return allPages.map(p=>({url:absoluteUrl(p.slug),changeFrequency:'monthly',priority:p.slug==='/'?1:0.7}))}
