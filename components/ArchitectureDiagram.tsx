// components/ArchitectureDiagram.tsx
'use client';

import React, { useState } from 'react';
import {
  Server,
  Zap,
  Globe,
  Radio,
  Eye,
  ShieldCheck,
  ArrowRight,
  Database,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export function ArchitectureDiagram() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: 'Full Pipeline Overview',
      tag: 'ARCHITECTURE',
      desc: 'Complete Headless WordPress to Vercel Next.js App Router production pipeline with sub-50ms static delivery.',
      detail:
        'Combines WordPress for editorial authoring, WPGraphQL + ACF for structured JSON output, Vercel Edge for ISR caching, and Next.js Draft Mode for live previews.',
    },
    {
      id: 1,
      title: '1. WordPress & WPGraphQL Backend',
      tag: 'BACKEND CMS',
      desc: 'WordPress PHP stack serving WPGraphQL and ACF Forex custom field extensions.',
      detail:
        'Content editors write articles and technical signals. Fields (currency pair, bias, entry/target levels, risk rating) are exposed via WPGraphQL schema with typed nodes and edges.',
    },
    {
      id: 2,
      title: '2. Next.js App Router ISR Fetch',
      tag: 'DATA LAYER',
      desc: 'Native Next.js fetch with cache tagging: next: { revalidate: 3600, tags: ["posts"] }.',
      detail:
        'Static pages are pre-rendered at build time via generateStaticParams. Responses are cached on Vercel Global Edge Network, eliminating WordPress database overhead on visitor hits.',
    },
    {
      id: 3,
      title: '3. On-Demand ISR Webhook',
      tag: 'CACHE PURGING',
      desc: 'WordPress trigger hooks (/api/revalidate) automatically purge cache tags instantly upon publish.',
      detail:
        'When an editor publishes or updates a post, WordPress sends a signed webhook to /api/revalidate. Next.js runs revalidateTag("posts") and revalidatePath("/blog/[slug]"), updating the edge in <100ms.',
    },
    {
      id: 4,
      title: '4. Next.js Draft Mode Bypass',
      tag: 'PREVIEW PIPELINE',
      desc: 'Bypasses static cache for authenticated editors via /api/draft?secret=...&slug=...',
      detail:
        'WordPress preview button opens Next.js draft route with a cryptographic token. draftMode().enable() sets the __prerender_bypass cookie, switching fetch to cache: "no-store" for instant live draft rendering.',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-md">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Vercel + WordPress Production Topology
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            Headless WordPress & Next.js ISR Architecture
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Filter View:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  activeStep === s.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.id === 0 ? 'All' : s.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative my-6">
        {/* Step 1: WordPress */}
        <div
          onClick={() => setActiveStep(1)}
          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative ${
            activeStep === 1 || activeStep === 0
              ? 'bg-slate-950/80 border-blue-500/50 shadow-lg shadow-blue-500/10'
              : 'bg-slate-950/40 border-slate-800/60 opacity-60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
            Origin CMS
          </span>
          <h4 className="text-sm font-bold text-white">WordPress & ACF</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            PHP 8.2+ WPGraphQL backend exposing structured custom fields.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>WPGraphQL</span>
            <span className="text-blue-400">/graphql</span>
          </div>
        </div>

        {/* Step 2: Webhook / Revalidate */}
        <div
          onClick={() => setActiveStep(3)}
          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative ${
            activeStep === 3 || activeStep === 0
              ? 'bg-slate-950/80 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-950/40 border-slate-800/60 opacity-60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <RefreshCw className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            ISR Webhook
          </span>
          <h4 className="text-sm font-bold text-white">On-Demand Purge</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            revalidateTag(&apos;posts&apos;) triggered on WordPress save_post action.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Header Auth</span>
            <span className="text-amber-400">/api/revalidate</span>
          </div>
        </div>

        {/* Step 3: Vercel Edge CDN */}
        <div
          onClick={() => setActiveStep(2)}
          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative ${
            activeStep === 2 || activeStep === 0
              ? 'bg-slate-950/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950/40 border-slate-800/60 opacity-60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
            Vercel Global Edge
          </span>
          <h4 className="text-sm font-bold text-white">ISR Static CDN</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Pre-rendered HTML cached at 100+ edge locations for &lt;50ms TTFB.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Edge Cache</span>
            <span className="text-emerald-400">Sub-50ms TTFB</span>
          </div>
        </div>

        {/* Step 4: Draft Mode Preview */}
        <div
          onClick={() => setActiveStep(4)}
          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative ${
            activeStep === 4 || activeStep === 0
              ? 'bg-slate-950/80 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'bg-slate-950/40 border-slate-800/60 opacity-60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
            Draft Mode
          </span>
          <h4 className="text-sm font-bold text-white">Live WP Preview</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Next.js Draft Mode bypasses edge CDN cache for editors in real time.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Signed Cookie</span>
            <span className="text-purple-400">/api/draft</span>
          </div>
        </div>
      </div>

      {/* Active Stage Deep-Dive Banner */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {steps[activeStep].tag}
            </span>
            <h5 className="font-bold text-white text-base">{steps[activeStep].title}</h5>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
            {steps[activeStep].detail}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
