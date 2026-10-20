// app/page.tsx
/**
 * Forex Trade Technology - Headless WordPress & Next.js App Router Command Center
 * Senior Full-Stack Architecture Showcase & Interactive Workbench
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { InteractiveWorkbench } from '@/components/InteractiveWorkbench';
import { DraftModeBanner } from '@/components/DraftModeBanner';
import {
  Server,
  Zap,
  Globe,
  Database,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Code2,
  ExternalLink,
  Layers,
  Sparkles,
  GitBranch,
  Cloud,
  CheckCircle2,
  Radio,
  FileCode,
  Terminal,
} from 'lucide-react';

export const revalidate = 3600;

export default async function HomePage() {
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const { posts, isFallback } = await getAllPosts({ isDraft });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Draft Mode Banner if Active */}
      {isDraft && <DraftModeBanner currentPath="/" />}

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black font-mono shadow-lg shadow-emerald-500/20">
              FT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight">
                  FOREX TRADE TECHNOLOGY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  v2.0 HEADLESS
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Next.js App Router + WPGraphQL + ACF + Vercel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Live Market Feed</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <a
              href="https://github.com/omarreact/Forex-Trade-Technology"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Repository</span>
            </a>

            <a
              href="https://vercel.com/omarreacts-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/15"
            >
              <Cloud className="w-3.5 h-3.5 fill-current" />
              <span>Vercel Edge</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Hero Section */}
        <section className="relative pt-6 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Senior Full-Stack Architecture Blueprint</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Ultra-Low Latency Headless WordPress on Vercel
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mt-4 max-w-3xl leading-relaxed">
            Eliminate traditional PHP rendering bottlenecks. We combine{' '}
            <strong className="text-slate-200">WordPress WPGraphQL & ACF</strong> as a headless CMS with{' '}
            <strong className="text-slate-200">Next.js App Router</strong>, delivering sub-50ms TTFB via{' '}
            <strong className="text-emerald-400">On-Demand ISR</strong> and seamless real-time previews
            using <strong className="text-purple-400">Next.js Draft Mode</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                Edge Delivery
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400">&lt; 45ms</div>
              <span className="text-xs text-slate-400">Global TTFB on Vercel</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                Data Strategy
              </span>
              <div className="text-2xl font-black font-mono text-sky-400">ISR + Tags</div>
              <span className="text-xs text-slate-400">Tag Purge via Webhook</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                Editor Experience
              </span>
              <div className="text-2xl font-black font-mono text-purple-400">Draft Mode</div>
              <span className="text-xs text-slate-400">Live Preview from WP</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                Custom Fields
              </span>
              <div className="text-2xl font-black font-mono text-amber-400">ACF Schema</div>
              <span className="text-xs text-slate-400">Forex Indicators & Signals</span>
            </div>
          </div>
        </section>

        {/* Visual Architecture Map */}
        <section>
          <ArchitectureDiagram />
        </section>

        {/* Interactive Developer Workbench */}
        <section>
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Architect Diagnostic Tools</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Headless Workbench & Testing Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Execute live WPGraphQL queries, fire on-demand ISR revalidation webhooks, simulate Draft
              Mode previews, and inspect copy-pasteable WordPress PHP integration code.
            </p>
          </div>

          <InteractiveWorkbench />
        </section>

        {/* Live Articles & Forex Signals Feed */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Live Headless Content</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Market Research & Signals Feed
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hydrated directly from WPGraphQL with ACF fields (Trading Pair, Bias, Entry, Target, Risk Score).
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <span>View All Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => {
              const acf = post.acfForex;
              return (
                <article
                  key={post.id || post.slug}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {acf?.tradingPair && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/90 text-[11px] font-mono font-bold text-white border border-slate-700">
                        {acf.tradingPair}
                      </div>
                    )}
                    {acf?.technicalBias && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        {acf.technicalBias}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {post.excerpt.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">
                        Target: <strong className="text-emerald-400">{acf?.targetPrice || 'N/A'}</strong>
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-emerald-400 font-bold inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Architectural Best Practices Guide */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              Production Architecture Checklist & Best Practices
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-300">
            <div className="space-y-3">
              <h4 className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                1. Data Hydration & ISR Discipline
              </h4>
              <p>
                • <strong>Never use pure SSR for high-traffic editorial pages:</strong> Doing SSR on every
                request forces cold node execution and exposes your frontend to WordPress PHP latency
                spikes (300ms - 1200ms).
              </p>
              <p>
                • <strong>Use Static-First with ISR:</strong> Set{' '}
                <code className="text-emerald-300 font-mono">revalidate = 3600</code> and tag your fetch calls
                with <code className="text-emerald-300 font-mono">tags: [&apos;posts&apos;]</code>. Use the{' '}
                <code className="text-emerald-300 font-mono">/api/revalidate</code> webhook to invalidate
                instantly upon editor publish.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                2. Preview & Draft Mode Protocol
              </h4>
              <p>
                • <strong>Next.js Draft Mode:</strong> Always use{' '}
                <code className="text-purple-300 font-mono">const draft = await draftMode(); draft.enable()</code>.
                This sets a cryptographically signed cookie that temporarily bypasses ISR edge caches without
                rebuilding the page.
              </p>
              <p>
                • <strong>Token Protection:</strong> Protect preview and webhook endpoints using secure
                shared secrets (<code className="text-purple-300 font-mono">WORDPRESS_PREVIEW_SECRET</code>).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                3. Clean Content Injection & XSS Shield
              </h4>
              <p>
                • <strong>HTML Sanitization:</strong> WordPress returns raw HTML strings in post content. Never
                render untrusted HTML without stripping executable script tags, inline event handlers
                (onerror, onload), and malicious pseudo-protocols.
              </p>
              <p>
                • <strong>Anchor Security:</strong> Automatically enforce{' '}
                <code className="text-sky-300 font-mono">target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;</code> on
                all outbound links.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                4. Vercel Cloud Optimization
              </h4>
              <p>
                • <strong>Edge Middleware:</strong> Keep middleware lean (under 1MB) for routing or geo-blocking;
                avoid heavy data fetching inside middleware.
              </p>
              <p>
                • <strong>Image Optimization:</strong> Configure WordPress CDN and upload domains inside{' '}
                <code className="text-amber-300 font-mono">next.config.ts</code> remotePatterns.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            <span className="text-slate-300 font-bold">Forex Trade Technology</span> • Headless WordPress & Next.js App Router
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/omarreact/Forex-Trade-Technology"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://vercel.com/omarreacts-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Vercel Projects</span>
            </a>
            <Link href="/blog" className="text-emerald-400 hover:text-emerald-300">
              Market Feed
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
