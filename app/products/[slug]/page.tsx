// app/products/[slug]/page.tsx
/**
 * Forex Trade Technology - Products Route Handler
 * Static-First Incremental Static Regeneration (ISR)
 * Renders verified product documentation with theme styling
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllThemePages, getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const pages = getAllThemePages();
  return pages
    .filter((p) => p.category === 'products')
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getThemePageBySlug(slug);

  if (!meta) {
    return {
      title: 'Product Not Found | Forex Trade Technology',
    };
  }

  return {
    title: meta.seo_title,
    description: meta.meta_description,
    keywords: [meta.primary_keyword, meta.secondary_keywords].filter(Boolean).join(', '),
    openGraph: {
      title: meta.seo_title,
      description: meta.meta_description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.seo_title,
      description: meta.meta_description,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { meta, html } = getThemePageBySlug(slug);

  if (!meta || !html) {
    notFound();
  }

  return <InteriorPageShell meta={meta} html={html} />;}
