// app/contact/page.tsx
/**
 * Forex Trade Technology - Contact & Consultation Request Page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { InteriorPageShell } from '@/components/InteriorPageShell';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getThemePageBySlug('contact');

  return {
    title: meta?.seo_title || 'Contact Us | Forex Brokerage Technology Consultation',
    description:
      meta?.meta_description ||
      "Request a forex brokerage technology consultation. Tell us your plans and we'll recommend the right platform, CRM, liquidity and hosting setup.",
    openGraph: {
      title: meta?.seo_title,
      description: meta?.meta_description,
      type: 'website',
    },
  };
}

export default function ContactPage() {
  const { meta, html } = getThemePageBySlug('contact');

  if (!meta || !html) {
    notFound();
  }

  return <InteriorPageShell meta={meta} html={html} />;}
