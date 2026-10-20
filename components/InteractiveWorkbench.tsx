// components/InteractiveWorkbench.tsx
'use client';

import React, { useState } from 'react';
import {
  Code2,
  Play,
  RefreshCw,
  Eye,
  FileCode,
  Copy,
  Check,
  Terminal,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export function InteractiveWorkbench() {
  const [activeTab, setActiveTab] = useState<'graphql' | 'isr' | 'draft' | 'php'>('graphql');

  // GraphQL Playground State
  const defaultQuery = `query GetForexArticles {
  posts(first: 5) {
    edges {
      node {
        id
        title
        slug
        date
        acfForex {
          tradingPair
          technicalBias
          riskScore
          entryZone
          targetPrice
          stopLoss
          algoConfidence
        }
      }
    }
  }
}`;
  const [gqlQuery, setGqlQuery] = useState(defaultQuery);
  const [gqlLoading, setGqlLoading] = useState(false);
  const [gqlResult, setGqlResult] = useState<string | null>(null);
  const [gqlMeta, setGqlMeta] = useState<{ source?: string; latencyMs?: number; endpoint?: string } | null>(null);

  // ISR Tester State
  const [isrSecret, setIsrSecret] = useState('forex_trade_tech_isr_revalidation_secret_2026');
  const [isrTag, setIsrTag] = useState('posts');
  const [isrSlug, setIsrSlug] = useState('eur-usd-quantitative-momentum-ecb-liquidity-sweeps');
  const [isrLoading, setIsrLoading] = useState(false);
  const [isrResult, setIsrResult] = useState<string | null>(null);

  // Draft Tester State
  const [draftSecret, setDraftSecret] = useState('forex_trade_tech_draft_preview_token_2026');
  const [draftSlug, setDraftSlug] = useState('automated-quantitative-grid-trading-usd-chf');

  // Copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runGraphQL = async () => {
    setGqlLoading(true);
    setGqlResult(null);
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlQuery }),
      });
      const data = await res.json();
      setGqlResult(JSON.stringify(data, null, 2));
      if (data.meta) {
        setGqlMeta(data.meta);
      }
    } catch (e) {
      setGqlResult(JSON.stringify({ error: e instanceof Error ? e.message : 'Failed' }, null, 2));
    } finally {
      setGqlLoading(false);
    }
  };

  const runISR = async () => {
    setIsrLoading(true);
    setIsrResult(null);
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': isrSecret,
        },
        body: JSON.stringify({ tag: isrTag, slug: isrSlug }),
      });
      const data = await res.json();
      setIsrResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setIsrResult(JSON.stringify({ error: e instanceof Error ? e.message : 'Failed' }, null, 2));
    } finally {
      setIsrLoading(false);
    }
  };

  const samplePhpFunctions = `<?php
/**
 * Add this to your WordPress Child Theme functions.php
 * Forex Trade Technology - Next.js App Router Webhook & Preview Bridge
 */

// 1. On-Demand ISR Revalidation on Post Save / Update / Status Change
add_action('transition_post_status', 'ftt_trigger_nextjs_isr_revalidation', 10, 3);

function ftt_trigger_nextjs_isr_revalidation($new_status, $old_status, $post) {
    if ($post->post_type !== 'post' || wp_is_post_revision($post->ID)) {
        return;
    }

    // Only fire when publishing, updating, or unpublishing
    if ($new_status === 'publish' || $old_status === 'publish') {
        $nextjs_endpoint = 'https://forex-trade-technology.vercel.app/api/revalidate';
        $secret = 'forex_trade_tech_isr_revalidation_secret_2026';

        wp_remote_post($nextjs_endpoint, [
            'method'      => 'POST',
            'timeout'     => 5,
            'redirection' => 5,
            'blocking'    => false, // Asynchronous non-blocking to prevent editor delay
            'headers'     => [
                'Content-Type'         => 'application/json',
                'x-revalidate-secret'  => $secret,
            ],
            'body'        => wp_json_encode([
                'tag'       => 'posts',
                'slug'      => $post->post_name,
                'id'        => $post->ID,
                'action'    => $new_status,
                'timestamp' => current_time('mysql'),
            ]),
        ]);
    }
}

// 2. Custom Preview Link Filter -> Routes Editors to Next.js Draft Mode
add_filter('preview_post_link', 'ftt_headless_draft_preview_link', 10, 2);

function ftt_headless_draft_preview_link($preview_link, $post) {
    $frontend_url = 'https://forex-trade-technology.vercel.app';
    $preview_secret = 'forex_trade_tech_draft_preview_token_2026';

    return add_query_arg([
        'secret' => $preview_secret,
        'slug'   => $post->post_name,
        'id'     => $post->ID,
    ], $frontend_url . '/api/draft');
}
`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('graphql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'graphql'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>WPGraphQL Playground</span>
        </button>

        <button
          onClick={() => setActiveTab('isr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'isr'
              ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>ISR Webhook Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('draft')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'draft'
              ? 'bg-slate-800 text-purple-400 border border-purple-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Draft Mode Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('php')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'php'
              ? 'bg-slate-800 text-sky-400 border border-sky-500/30 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>WordPress PHP Snippets</span>
        </button>
      </div>

      {/* Tab 1: WPGraphQL Explorer */}
      {activeTab === 'graphql' && (
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Live WPGraphQL Query Explorer
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute structured queries with ACF forex fields against the native Next.js fetch layer.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runGraphQL}
                disabled={gqlLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {gqlLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{gqlLoading ? 'Querying...' : 'Execute Query'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Query Editor */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-t-xl border border-b-0 border-slate-800">
                <span>GraphQL Request Body</span>
                <span className="text-[11px] text-emerald-400">POST /api/graphql</span>
              </div>
              <textarea
                value={gqlQuery}
                onChange={(e) => setGqlQuery(e.target.value)}
                rows={12}
                className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-b-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50 resize-none"
                spellCheck={false}
              />
            </div>

            {/* Response Viewer */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-t-xl border border-b-0 border-slate-800">
                <span>JSON Response Payload</span>
                {gqlMeta && (
                  <span className="text-[11px] text-sky-400 font-mono">
                    Latency: {gqlMeta.latencyMs}ms
                  </span>
                )}
              </div>
              <div className="h-full min-h-[240px] max-h-[300px] overflow-auto bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-b-xl border border-slate-800">
                {gqlLoading ? (
                  <div className="flex items-center justify-center h-full text-slate-500 gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Executing WPGraphQL query...</span>
                  </div>
                ) : gqlResult ? (
                  <pre className="whitespace-pre-wrap">{gqlResult}</pre>
                ) : (
                  <div className="text-slate-500 italic">
                    Click &quot;Execute Query&quot; to inspect live WPGraphQL response structure and ACF nodes.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ISR Webhook Simulator */}
      {activeTab === 'isr' && (
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              On-Demand ISR Webhook Simulator (/api/revalidate)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Simulate WordPress firing an instant cache purge upon post publication or edit. Uses Next.js{' '}
              <code className="text-amber-300">revalidateTag()</code> and{' '}
              <code className="text-amber-300">revalidatePath()</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Shared Webhook Secret (Header)
              </label>
              <input
                type="text"
                value={isrSecret}
                onChange={(e) => setIsrSecret(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Cache Tag to Invalidate
              </label>
              <input
                type="text"
                value={isrTag}
                onChange={(e) => setIsrTag(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Post Slug to Purge
              </label>
              <input
                type="text"
                value={isrSlug}
                onChange={(e) => setIsrSlug(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={runISR}
              disabled={isrLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isrLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isrLoading ? 'Purging Edge Cache...' : 'Trigger ISR Webhook'}</span>
            </button>
          </div>

          {isrResult && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Webhook Response from /api/revalidate:
              </span>
              <pre className="text-xs font-mono text-amber-300 whitespace-pre-wrap">{isrResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Draft Mode Simulator */}
      {activeTab === 'draft' && (
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              Next.js Draft Mode Preview Generator (/api/draft)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Test how WordPress content authors review unpublished revisions in real time. Draft Mode sets
              the signed cookie <code className="text-purple-300">__prerender_bypass</code> and switches
              fetching to <code className="text-purple-300">cache: &apos;no-store&apos;</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Preview Secret Token
              </label>
              <input
                type="text"
                value={draftSecret}
                onChange={(e) => setDraftSecret(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Target Post Slug (Draft or Published)
              </label>
              <input
                type="text"
                value={draftSlug}
                onChange={(e) => setDraftSlug(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Generated Preview URL:</span>
              <code className="text-xs font-mono text-purple-300 break-all">
                /api/draft?secret={draftSecret}&slug={draftSlug}
              </code>
            </div>

            <Link
              href={`/api/draft?secret=${encodeURIComponent(draftSecret)}&slug=${encodeURIComponent(
                draftSlug
              )}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-purple-600/20 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Draft Preview</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong>Security Protocol:</strong> Next.js App Router enforces cryptographically signed
              cookies for Draft Mode. Only editors with the correct shared secret can trigger preview mode,
              preventing unauthorized access to unpublished content.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: WordPress Production PHP Code */}
      {activeTab === 'php' && (
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                WordPress Theme functions.php Snippet
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Copy and paste this into your WordPress theme to link WordPress transitions directly to
                Vercel ISR and Draft Mode.
              </p>
            </div>

            <button
              onClick={() => handleCopy(samplePhpFunctions, 'php')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all border border-slate-700"
            >
              {copiedKey === 'php' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy PHP Code</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-x-auto max-h-[380px]">
            <pre className="text-xs font-mono text-sky-300 leading-relaxed whitespace-pre">
              {samplePhpFunctions}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
