import type {MetadataRoute} from 'next';
// Metadata routes must be prerenderable for the GitHub Pages static export.
export const dynamic='force-static';
import {absoluteUrl} from '@/content';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/'},sitemap:absoluteUrl('/sitemap.xml')}}
