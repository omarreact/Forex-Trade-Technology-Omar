// app/faq/page.tsx
/**
 * Forex Trade Technology - Frequently Asked Questions
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('faq');

  return {
    title: meta?.seo_title || 'Forex Brokerage Technology FAQs | MT5, CRM, Liquidity & Hosting',
    description:
      meta?.meta_description ||
      'Answers to common questions about forex brokerage technology: MT5 white and grey label, CRM, liquidity bridges, hosting, APIs and support.',
    openGraph: {
      title: meta?.seo_title,
      description: meta?.meta_description,
      type: 'website',
    },
  };
}

export default function FAQPage() {
  const { meta, html } = getThemePageBySlug('faq');

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
