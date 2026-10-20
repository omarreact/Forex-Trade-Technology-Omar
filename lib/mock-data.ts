// lib/mock-data.ts
import { WPPost } from './types';

export const MOCK_FOREX_POSTS: WPPost[] = [
  {
    id: 'cG9zdDoxMDI0',
    databaseId: 1024,
    title: 'EUR/USD Quantitative Momentum: ECB Dovish Pivot & Liquidity Sweeps',
    slug: 'eur-usd-quantitative-momentum-ecb-liquidity-sweeps',
    date: '2026-10-18T14:30:00Z',
    modified: '2026-10-19T09:15:00Z',
    excerpt: 'Institutional order book volume delta points towards an impending upside breakout above key resistance at 1.0920.',
    status: 'publish',
    uri: '/blog/eur-usd-quantitative-momentum-ecb-liquidity-sweeps',
    author: {
      node: {
        name: 'Elena Rostova',
        slug: 'elena-rostova',
        avatar: {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        description: 'Chief Quantitative Currency Strategist at Forex Trade Tech. Specializes in statistical arbitrage and G10 FX order flow.',
      },
    },
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
        altText: 'Forex algorithmic charts with candlestick patterns and volume delta',
        mediaDetails: {
          width: 1200,
          height: 630,
        },
      },
    },
    categories: {
      edges: [
        { node: { id: 'Y2F0OjE=', name: 'Technical Analysis', slug: 'technical-analysis', count: 14 } },
        { node: { id: 'Y2F0OjI=', name: 'G10 Currencies', slug: 'g10-currencies', count: 8 } },
      ],
    },
    tags: {
      edges: [
        { node: { id: 'dGFnOjE=', name: 'EUR/USD', slug: 'eur-usd' } },
        { node: { id: 'dGFnOjI=', name: 'ECB', slug: 'ecb' } },
        { node: { id: 'dGFnOjM=', name: 'Order Blocks', slug: 'order-blocks' } },
      ],
    },
    acfForex: {
      tradingPair: 'EUR/USD',
      technicalBias: 'BULLISH',
      riskScore: 4,
      entryZone: '1.0845 - 1.0870',
      targetPrice: '1.0980',
      stopLoss: '1.0805',
      algoConfidence: 89,
      marketSession: 'LONDON',
      timeframe: '4H',
      indicatorsUsed: ['Order Flow Delta', 'EMA 200 Pullback', 'FVG Fair Value Gap', 'VWAP Band'],
      isAutomatedSignal: true,
    },
    content: `
      <h2>Executive Summary: High-Probability Accumulation</h2>
      <p>During the London open liquidity cascade, institutional market makers absorbed retail stop runs below the prior daily low of 1.0838. Real-time tick data from EBS and Currenex confirms aggressive passive bidding by top-tier Tier-1 liquidity providers.</p>
      
      <div class="callout-box bg-slate-900 border border-emerald-500/30 p-4 rounded-xl my-6">
        <h4 class="text-emerald-400 font-semibold mb-1">Key Algorithmic Finding</h4>
        <p class="text-slate-300 text-sm">Cumulative Volume Delta (CVD) divergence on the 1-hour chart has triggered a Level-3 buy signal with a 2.87 Sharpe ratio expectancy over the next 72 hours.</p>
      </div>

      <h3>Core Structural Levels</h3>
      <table class="w-full text-left my-4 border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400">
            <th class="py-2">Level Type</th>
            <th class="py-2">Price Target</th>
            <th class="py-2">Invalidation Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-slate-900">
            <td class="py-2 text-emerald-400 font-medium">Primary Entry</td>
            <td class="py-2">1.0855</td>
            <td class="py-2 text-slate-400">Close below 1.0805</td>
          </tr>
          <tr class="border-b border-slate-900">
            <td class="py-2 text-sky-400 font-medium">Take Profit 1</td>
            <td class="py-2">1.0920</td>
            <td class="py-2 text-slate-400">Partial 50% scale-out</td>
          </tr>
          <tr>
            <td class="py-2 text-amber-400 font-medium">Take Profit 2 (Extension)</td>
            <td class="py-2">1.0980</td>
            <td class="py-2 text-slate-400">Trailing stop activated</td>
          </tr>
        </tbody>
      </table>

      <h3>Risk Management & Sizing Protocol</h3>
      <p>Given the upcoming Federal Reserve and ECB symposium rhetoric, standard positional sizing should not exceed 1.5% portfolio equity risk. Trailing stop protections should lock in break-even once price breaches 1.0905.</p>
    `,
  },
  {
    id: 'cG9zdDoxMDI1',
    databaseId: 1025,
    title: 'XAU/USD Gold Breakout: Safe Haven Velocity & Central Bank Reserves',
    slug: 'xau-usd-gold-breakout-safe-haven-central-bank-reserves',
    date: '2026-10-17T11:00:00Z',
    modified: '2026-10-18T16:20:00Z',
    excerpt: 'Gold prices challenge multi-month ascending channel ceiling as algorithmic models project sustained momentum into $2,840/oz.',
    status: 'publish',
    uri: '/blog/xau-usd-gold-breakout-safe-haven-central-bank-reserves',
    author: {
      node: {
        name: 'Marcus Sterling',
        slug: 'marcus-sterling',
        avatar: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        description: 'Precious Metals & Macro Commodities Architect at Forex Trade Technology.',
      },
    },
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&auto=format&fit=crop&q=80',
        altText: 'Gold bullion bars representing safe haven asset accumulation',
        mediaDetails: {
          width: 1200,
          height: 630,
        },
      },
    },
    categories: {
      edges: [
        { node: { id: 'Y2F0OjM=', name: 'Commodities & Metals', slug: 'commodities', count: 9 } },
        { node: { id: 'Y2F0OjQ=', name: 'Macro Trends', slug: 'macro-trends', count: 12 } },
      ],
    },
    tags: {
      edges: [
        { node: { id: 'dGFnOjQ=', name: 'XAU/USD', slug: 'xau-usd' } },
        { node: { id: 'dGFnOjU=', name: 'Gold', slug: 'gold' } },
        { node: { id: 'dGFnOjY=', name: 'Inflation Hedge', slug: 'inflation-hedge' } },
      ],
    },
    acfForex: {
      tradingPair: 'XAU/USD',
      technicalBias: 'BULLISH',
      riskScore: 6,
      entryZone: '$2,780 - $2,795',
      targetPrice: '$2,865',
      stopLoss: '$2,750',
      algoConfidence: 94,
      marketSession: 'OVERLAPPING',
      timeframe: '1D',
      indicatorsUsed: ['Fibonacci Extension 1.618', 'Bollinger Band Squeeze', 'Volume Profile POC'],
      isAutomatedSignal: false,
    },
    content: `
      <h2>Geopolitical Convexity and Monetary De-Dollarization</h2>
      <p>Institutional accumulation of physical and algorithmic futures contracts in bullion has reached highest relative strength index percentiles since Q2. Cross-asset correlation regressions show traditional negative yield drag decoupling from gold prices.</p>

      <h3>Algorithmic Setup Criteria</h3>
      <ul>
        <li><strong>Volatility Squeeze:</strong> Daily Bollinger Band width compressed under 1.2 standard deviations before exploding upward.</li>
        <li><strong>Open Interest Delta:</strong> Comex non-commercial net longs expanded by 18,400 contracts week-over-week.</li>
        <li><strong>Algorithmic Execution:</strong> TWAP (Time-Weighted Average Price) algorithmic orders detected during London afternoon fixing.</li>
      </ul>

      <p>Traders should look for intraday pullbacks into the Value Area High (VAH) between $2,780 and $2,795 to establish core positioning.</p>
    `,
  },
  {
    id: 'cG9zdDoxMDI2',
    databaseId: 1026,
    title: 'GBP/JPY Bearish Reversal Alert: BoJ Intervention Threat & Yield Spreads',
    slug: 'gbp-jpy-bearish-reversal-alert-boj-intervention-yield-spreads',
    date: '2026-10-15T08:00:00Z',
    modified: '2026-10-16T10:00:00Z',
    excerpt: 'The "Dragon" currency pair faces severe overbought exhaustion at multi-year resistance with Ministry of Finance verbal intervention intensifying.',
    status: 'publish',
    uri: '/blog/gbp-jpy-bearish-reversal-alert-boj-intervention-yield-spreads',
    author: {
      node: {
        name: 'Kenji Takahashi',
        slug: 'kenji-takahashi',
        avatar: {
          url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        description: 'Asian FX Session Lead and Statistical Volatility Specialist at Forex Trade Tech.',
      },
    },
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
        altText: 'Financial trading market monitors in Tokyo trading floor',
        mediaDetails: {
          width: 1200,
          height: 630,
        },
      },
    },
    categories: {
      edges: [
        { node: { id: 'Y2F0OjU=', name: 'Cross Pairs', slug: 'cross-pairs', count: 6 } },
        { node: { id: 'Y2F0OjY=', name: 'Central Banks', slug: 'central-banks', count: 11 } },
      ],
    },
    tags: {
      edges: [
        { node: { id: 'dGFnOjc=', name: 'GBP/JPY', slug: 'gbp-jpy' } },
        { node: { id: 'dGFnOjg=', name: 'BoJ', slug: 'boj' } },
        { node: { id: 'dGFnOjk=', name: 'Volatility', slug: 'volatility' } },
      ],
    },
    acfForex: {
      tradingPair: 'GBP/JPY',
      technicalBias: 'BEARISH',
      riskScore: 8,
      entryZone: '198.50 - 199.10',
      targetPrice: '193.40',
      stopLoss: '200.25',
      algoConfidence: 81,
      marketSession: 'TOKYO',
      timeframe: '4H',
      indicatorsUsed: ['RSI Triple Bearish Divergence', 'ATR Volatility Spike', 'Liquidity Imbalance'],
      isAutomatedSignal: true,
    },
    content: `
      <h2>The Dragon Approaches Historical Exhaustion</h2>
      <p>GBP/JPY has printed a classic 3-drive bearish pattern on the 4-hour timeframe. Japanese Ministry of Finance officials have escalated rhetoric to "standing ready to counter extreme FX volatility without ruling out any options."</p>

      <h3>Execution Checklist</h3>
      <p>1. Confirm rejection candle at 198.80 with elevated selling volume.</p>
      <p>2. Enter short on 15-minute market structure shift (MSS).</p>
      <p>3. Scale out aggressively at 196.20 and 193.40.</p>
    `,
  },
  {
    id: 'cG9zdDoxMDI3',
    databaseId: 1027,
    title: '[DRAFT PREVIEW] Automated Quantitative Grid Trading for USD/CHF',
    slug: 'automated-quantitative-grid-trading-usd-chf',
    date: '2026-10-19T22:00:00Z',
    modified: '2026-10-20T00:30:00Z',
    excerpt: 'Internal editorial preview: Algorithmic backtest results and deployment schedule for the automated SNB policy hedge system.',
    status: 'draft',
    uri: '/blog/automated-quantitative-grid-trading-usd-chf',
    author: {
      node: {
        name: 'Elena Rostova',
        slug: 'elena-rostova',
        avatar: {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        description: 'Chief Quantitative Currency Strategist at Forex Trade Tech.',
      },
    },
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        altText: 'Algorithmic code on screen with real-time financial telemetry',
        mediaDetails: {
          width: 1200,
          height: 630,
        },
      },
    },
    categories: {
      edges: [
        { node: { id: 'Y2F0Ojc=', name: 'Algorithmic Systems', slug: 'algo-systems', count: 5 } },
      ],
    },
    tags: {
      edges: [
        { node: { id: 'dGFnOjEw=', name: 'USD/CHF', slug: 'usd-chf' } },
        { node: { id: 'dGFnOjEx=', name: 'Quantitative', slug: 'quantitative' } },
      ],
    },
    acfForex: {
      tradingPair: 'USD/CHF',
      technicalBias: 'NEUTRAL',
      riskScore: 3,
      entryZone: '0.8520 - 0.8580',
      targetPrice: '0.8690',
      stopLoss: '0.8460',
      algoConfidence: 96,
      marketSession: 'NEW_YORK',
      timeframe: '1H',
      indicatorsUsed: ['Grid Spacing Algorithm', 'Mean Reversion Z-Score', 'Historical Volatility Matrix'],
      isAutomatedSignal: true,
    },
    content: `
      <div class="draft-badge bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-lg font-mono text-xs mb-4">
        ⚠️ UNPUBLISHED DRAFT (Next.js Draft Mode Active) — Reviewed for Compliance Only
      </div>
      <h2>Internal Review: 18-Month Grid Strategy Backtest</h2>
      <p>This draft paper presents empirical performance data across 4,200 simulated automated trades during high-volatility Swiss National Bank rate adjustments.</p>
      <p>Max drawdown remained capped at 3.14% using dynamic volatility expansion triggers.</p>
    `,
  },
];
