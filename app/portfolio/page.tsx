// app/portfolio/page.tsx
/**
 * Forex Trade Technology - Portfolio & Case Studies
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('portfolio');

  return {
    title: meta?.seo_title || 'Forex Brokerage Technology Projects | Portfolio',
    description:
      meta?.meta_description ||
      'Examples of our forex brokerage technology projects, from MT5 launches and CRM migrations to liquidity integration, prop firm systems and hosting.',
    openGraph: {
      title: meta?.seo_title,
      description: meta?.meta_description,
      type: 'website',
    },
  };
}

export default function PortfolioPage() {
  const { meta, html } = getThemePageBySlug('portfolio');

  if (!meta || !html) {
    notFound();
  }

  return <InteriorPageShell meta={meta} html={html} />;}
