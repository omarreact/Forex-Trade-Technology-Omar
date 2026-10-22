import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';
import { canonicalPath } from '@/lib/seo';

export const revalidate = 86400;
export function generateMetadata(): Metadata {
  const { meta } = getThemePageBySlug('kyc-aml-integration');
  return {title: meta?.seo_title || 'Forex Trade Technology', description: meta?.meta_description, keywords: meta ? [meta.primary_keyword,meta.secondary_keywords].filter(Boolean).join(', ') : undefined, alternates: { canonical: canonicalPath(meta?.route || '/technology/kyc-aml-integration') }, openGraph: {title:meta?.seo_title,description:meta?.meta_description}};
}
export default function Page(){
  const {meta,html} = getThemePageBySlug('kyc-aml-integration');
  if(!meta || !html) notFound();
  return <InteriorPageShell meta={meta} html={html}/>;
}
