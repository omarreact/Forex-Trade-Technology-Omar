// app/blog/page.tsx
/**
 * Headless WordPress Blog & Market Intelligence Archive
 * Static-First Incremental Static Regeneration (ISR: 3600s)
 * Automatically detects Next.js Draft Mode for live previews
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { DraftModeBanner } from '@/components/DraftModeBanner';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Cpu,
  Layers,
} from 'lucide-react';

export const revalidate = 3600; // Incremental Static Regeneration every hour, purged on-demand via webhook

export const metadata: Metadata = {
  title: 'Market Intelligence & Signals | Forex Trade Technology',
  description:
    'Institutional-grade Forex market analysis, quantitative algorithmic setups, and currency momentum research powered by Headless WordPress & Next.js.',
};

export default async function BlogIndexPage() {
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const { posts, isFallback, error } = await getAllPosts({ isDraft });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Draft Mode Banner if previewing */}
      {isDraft && <DraftModeBanner currentPath="/blog" />}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black font-mono">
              FX
            </div>
            <div className="flex flex-col">
              <span className="text-sm leading-none font-bold">FOREX TRADE TECH</span>
              <span className="text-[10px] font-mono text-emerald-400">HEADLESS WP ARCHITECTURE</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-xs font-mono">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              Command Center
            </Link>
            <Link
              href="/blog"
              className="text-emerald-400 font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            >
              Market Feed
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-300">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400">Market Intelligence Archive</span>
        </div>

        {/* Hero Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sub-50ms Edge ISR Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Institutional FX Research & Signals
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Algorithmic currency setups, order flow imbalances, and macro monetary policy analysis queried
            via WPGraphQL with typed ACF data hydration.
          </p>

          {isFallback && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>
                ⚡ Active Mode:{' '}
                <span className="text-emerald-400 font-bold">Forex Trade Tech Resilient Pipeline</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Hooked to WPGraphQL Schema Nodes & ACF
              </span>
            </div>
          )}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const acf = post.acfForex;
            const isBullish = acf?.technicalBias === 'BULLISH';
            const isBearish = acf?.technicalBias === 'BEARISH';

            return (
              <article
                key={post.id || post.slug}
                className="group flex flex-col bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                {/* Featured Image */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-mono text-xs">
                      No Media Attached
                    </div>
                  )}

                  {/* ACF Forex Pair Badge Overlay */}
                  {acf?.tradingPair && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-white shadow-md">
                      {acf.tradingPair}
                    </div>
                  )}

                  {/* ACF Bias Badge */}
                  {acf?.technicalBias && (
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1 border shadow-md ${
                        isBullish
                          ? 'bg-emerald-950/90 text-emerald-400 border-emerald-600/40'
                          : isBearish
                          ? 'bg-rose-950/90 text-rose-400 border-rose-600/40'
                          : 'bg-amber-950/90 text-amber-400 border-amber-600/40'
                      }`}
                    >
                      {isBullish && <TrendingUp className="w-3 h-3" />}
                      {isBearish && <TrendingDown className="w-3 h-3" />}
                      <span>{acf.technicalBias}</span>
                    </div>
                  )}

                  {/* Draft Badge if draft */}
                  {post.status === 'draft' && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-mono font-bold shadow-md">
                      DRAFT PREVIEW
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {post.author?.node?.name && (
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {post.author.node.name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt.replace(/<[^>]*>/g, '')}
                    </p>

                    {/* ACF Mini Data Bar */}
                    {acf && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Target (TP)</span>
                          <span className="text-emerald-400 font-bold truncate block">
                            {acf.targetPrice || 'Dynamic'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Algo Score</span>
                          <span className="text-sky-400 font-bold truncate block">
                            {acf.algoConfidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">
                      {acf?.timeframe ? `Timeframe: ${acf.timeframe}` : 'Technical Setup'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Forex Trade Technology. High-Performance Headless WordPress Architecture.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-300">
              Architecture Overview
            </Link>
            <Link href="/blog" className="text-emerald-400 hover:text-emerald-300">
              Market Feed
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
