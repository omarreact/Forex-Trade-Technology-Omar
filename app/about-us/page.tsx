// app/about-us/page.tsx
/**
 * Forex Trade Technology - About Us Page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('about-us');

  return {
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

  return (
    <div className="min-h-screen bg-white text-[#192219] flex flex-col font-sans">
      <SiteHeader />
      <main
        className="flex-1 w-full ftt-page-frame"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <SiteFooter />
    </div>
  );
}
