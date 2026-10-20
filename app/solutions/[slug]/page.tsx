// app/solutions/[slug]/page.tsx
/**
 * Forex Trade Technology - Solutions Route Handler
 * Static-First Incremental Static Regeneration (ISR)
 * Renders verified editorial content with the theme system
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllThemePages, getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';

export const revalidate = 86400; // Static delivery, revalidated on content update

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const pages = getAllThemePages();
  return pages
    .filter((p) => p.category === 'solutions')
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getThemePageBySlug(slug);

  if (!meta) {
    return {
      title: 'Solution Not Found | Forex Trade Technology',
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

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { meta, html } = getThemePageBySlug(slug);

  if (!meta || !html) {
    notFound();
  }

  return <InteriorPageShell meta={meta} html={html} />;}
