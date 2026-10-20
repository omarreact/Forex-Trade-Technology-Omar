// app/technology/page.tsx
/**
 * Forex Trade Technology - Technology Hub
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('technology');

  return {
    title: meta?.seo_title || 'Forex Brokerage Technology | MT4, MT5, CRM & Trading Infrastructure',
    description:
      meta?.meta_description ||
      'Explore the forex brokerage technology behind a modern brokerage: MT4, MT5, trading servers, liquidity bridge, FIX API, CRM, payments, KYC/AML and security.',
    openGraph: {
      title: meta?.seo_title,
      description: meta?.meta_description,
      type: 'website',
    },
  };
}

export default function TechnologyPage() {
  const { meta, html } = getThemePageBySlug('technology');

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
