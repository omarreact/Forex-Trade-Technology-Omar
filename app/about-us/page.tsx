// app/about-us/page.tsx
/**
 * Forex Trade Technology - About Us Page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';
import { canonicalPath } from '@/lib/seo';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('about-us');

  return {
    alternates: { canonical: canonicalPath(meta?.route || '/about-us') },
    title: meta?.seo_title || 'About Us | Forex Brokerage Technology Company',
    description:
      meta?.meta_description ||
      "We're a forex technology company helping brokers launch, run and scale with MT5, MT4, CRM, liquidity connectivity, hosting and integrations.",
    openGraph: {
      title: meta?.seo_title,
      description: meta?.meta_description,
      type: 'website',
    },
  };
}

export default function AboutUsPage() {
  const { meta, html } = getThemePageBySlug('about-us');

  if (!meta || !html) {
    notFound();
  }

  return <InteriorPageShell meta={meta} html={html} />;}
