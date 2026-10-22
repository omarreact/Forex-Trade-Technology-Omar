import type { MetadataRoute } from 'next';
import pageManifest from '../public/theme-assets/content/page-manifest.json';
import { canonicalPath, siteOrigin } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return pageManifest.map(({ route }) => ({
    url: new URL(canonicalPath(route), `${siteOrigin}/`).toString(),
  }));
}
