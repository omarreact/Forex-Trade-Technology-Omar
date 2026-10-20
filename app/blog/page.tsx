// app/blog/page.tsx
/**
 * Headless WordPress Market Intelligence & Research Feed
 * Seamlessly styled with the Forex Trade Technology theme
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { DraftModeBanner } from '@/components/DraftModeBanner';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { EditorialPhotoBand } from '@/components/EditorialPhotoBand';
import { getPagePhotos } from '@/lib/pexels-photos';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Market Intelligence & Technical Analysis | Forex Trade Technology',
  description:
    'Institutional-grade Forex market research, quantitative algorithmic setups, and currency momentum analysis powered by Headless WordPress & Next.js.',
};

export default async function BlogIndexPage() {
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const { posts } = await getAllPosts({ isDraft });

  return (
    <div className="ftt-blog-page min-h-screen bg-[#fafbf8] text-[#192219] flex flex-col font-sans">
      {/* Draft banner only visible when Draft Mode is explicitly enabled */}
      {isDraft && <DraftModeBanner currentPath="/blog" />}

      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-[1210px] mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#7a865a] mb-6">
          <Link href="/" className="hover:text-[#192219]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#394439] font-bold">Market Intelligence Archive</span>
        </div>

        {/* Section Header */}
        <div className="mb-12 border-b border-[#dfe4d9] pb-8">
          <p className="text-[12px] font-extrabold uppercase tracking-widest text-[#71823c] mb-2">
            BROKERAGE KNOWLEDGE &amp; INSIGHTS
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#192219] tracking-tight">
            Forex Brokerage Insights &amp; Technology
          </h1>
          <p className="text-base sm:text-lg text-[#5c675c] mt-3 max-w-3xl leading-relaxed">
            Explore forex brokerage technology, trading platforms, liquidity infrastructure and practical
            business insights from our team.
          </p>
        </div>

        <EditorialPhotoBand photos={getPagePhotos('technology')} heading="Markets, infrastructure and technology" compact />

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const acf = post.acfForex;
            const isBullish = acf?.technicalBias === 'BULLISH';
            const isBearish = acf?.technicalBias === 'BEARISH';

            return (
              <article
                key={post.id || post.slug}
                className="group flex flex-col bg-white border border-[#dfe4d9] hover:border-[#b3d25a] rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Featured Image */}
                <div className="relative aspect-video w-full bg-[#f4f5f0] overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="ftt-blog-empty-image absolute inset-0 flex flex-col justify-end p-6">
                      <span className="ftt-blog-image-fallback"><span>FOREX TRADE TECHNOLOGY</span><strong>Brokerage technology insights</strong></span>
                    </div>
                  )}

                  {/* ACF Forex Pair Badge Overlay */}
                  {acf?.tradingPair && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#141613]/90 backdrop-blur-md text-xs font-mono font-bold text-white shadow">
                      {acf.tradingPair}
                    </div>
                  )}

                  {/* ACF Bias Badge */}
                  {acf?.technicalBias && (
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1 shadow ${
                        isBullish
                          ? 'bg-[#d9f17a] text-[#192219]'
                          : isBearish
                          ? 'bg-[#253b2b] text-[#f4f8f0]'
                          : 'bg-[#e7edda] text-[#2b3e2c]'
                      }`}
                    >
                      {isBullish && <TrendingUp className="w-3 h-3" />}
                      {isBearish && <TrendingDown className="w-3 h-3" />}
                      <span>{acf.technicalBias}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs font-mono text-[#7a865a] mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8c9655]" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {post.author?.node?.name && (
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3.5 h-3.5 text-[#8c9655]" />
                          {post.author.node.name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-[#192219] group-hover:text-[#71823c] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs text-[#5c675c] mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt.replace(/<[^>]*>/g, '')}
                    </p>

                    {/* ACF Mini Data Bar */}
                    {acf && (
                      <div className="mt-4 pt-3 border-t border-[#edf0e7] grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-[#f7f8f2] p-2 rounded-lg border border-[#dfe4d9]">
                          <span className="text-[10px] text-[#7a865a] block">Target (TP)</span>
                          <span className="text-[#315c28] font-bold truncate block">
                            {acf.targetPrice || 'Dynamic'}
                          </span>
                        </div>
                        <div className="bg-[#f7f8f2] p-2 rounded-lg border border-[#dfe4d9]">
                          <span className="text-[10px] text-[#7a865a] block">Algo Score</span>
                          <span className="text-[#20401a] font-bold truncate block">
                            {acf.algoConfidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="mt-6 pt-4 border-t border-[#edf0e7] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#7a865a] font-mono">
                      {acf?.timeframe ? `Timeframe: ${acf.timeframe}` : 'Insights'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-[#315c28] group-hover:translate-x-1 transition-transform"
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

      <SiteFooter />
    </div>
  );
}
