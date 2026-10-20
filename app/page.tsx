// app/page.tsx
/**
 * Forex Trade Technology - Flagship Home Page
 * Built with Next.js App Router, Incremental Static Regeneration (ISR),
 * Official Theme Presentation & Headless WordPress Architecture
 */

import React from 'react';
import { Metadata } from 'next';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HomeClientEffects } from '@/components/HomeClientEffects';
import { InteractiveWorkbench } from '@/components/InteractiveWorkbench';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { Database } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Forex Broker Technology & Brokerage Solutions | Forex Trade Technology',
  description:
    'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
  keywords: 'forex broker technology, MT5 white label, forex CRM, liquidity connectivity, forex broker hosting, turnkey brokerage',
  openGraph: {
    title: 'Forex Broker Technology & Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Broker Technology & Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
  },
};

export default function HomePage() {
  const { html } = getThemePageBySlug('home');

  return (
    <div className="min-h-screen bg-white text-[#192219] flex flex-col font-sans">
      <SiteHeader />

      {/* Official Theme Homepage Content with Carousel & Editorial Grid */}
      <main
        className="flex-1 w-full ftt-page-frame"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Headless WordPress Architecture & Developer Workbench Section */}
      <section className="bg-[#17211a] text-white py-16 border-t border-[#2a382d]">
        <div className="max-w-[1210px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9f17a]/15 text-[#d9f17a] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Headless WordPress Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Developer Workbench &amp; Live Architecture Inspector
              </h2>
              <p className="text-xs sm:text-sm text-[#a2b59f] mt-1 max-w-2xl">
                Inspect how Next.js communicates with your WordPress origin via WPGraphQL, test on-demand ISR
                revalidation webhooks, and simulate Draft Mode previews.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <ArchitectureDiagram />
            <InteractiveWorkbench />
          </div>
        </div>
      </section>

      {/* Interactive slider & form controller */}
      <HomeClientEffects />

      <SiteFooter />
    </div>
  );
}
