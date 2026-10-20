// components/ForexMetaCard.tsx
import React from 'react';
import { ACF_ForexFields } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Cpu,
  Clock,
  Crosshair,
  Target,
  AlertOctagon,
  Layers,
} from 'lucide-react';

interface ForexMetaCardProps {
  acf?: ACF_ForexFields;
}

export function ForexMetaCard({ acf }: ForexMetaCardProps) {
  if (!acf) return null;

  const {
    tradingPair,
    technicalBias,
    riskScore,
    entryZone,
    targetPrice,
    stopLoss,
    algoConfidence,
    marketSession,
    timeframe,
    indicatorsUsed,
    isAutomatedSignal,
  } = acf;

  const isBullish = technicalBias === 'BULLISH';
  const isBearish = technicalBias === 'BEARISH';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {/* Glow highlight based on bias */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-amber-500'
        }`}
      />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-lg font-black tracking-wider text-slate-100 font-mono shadow-inner">
            {tradingPair || 'FX:PAIR'}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
              isBullish
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : isBearish
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isBullish && <TrendingUp className="w-3.5 h-3.5" />}
            {isBearish && <TrendingDown className="w-3.5 h-3.5" />}
            {!isBullish && !isBearish && <Minus className="w-3.5 h-3.5" />}
            <span>{technicalBias} BIAS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isAutomatedSignal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-950/70 border border-sky-800/60 text-sky-300 font-mono">
              <Cpu className="w-3 h-3 text-sky-400" />
              Algorithmic Signal
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            {marketSession} SESSION
          </span>
          {timeframe && (
            <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] font-semibold">
              TF: {timeframe}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Key Execution Levels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Entry Zone */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-sky-400" /> Entry Zone
            </span>
            <span className="text-[10px] text-slate-500">ACF Field</span>
          </div>
          <div className="text-sm font-mono font-bold text-sky-300 truncate">
            {entryZone || 'Market execution'}
          </div>
        </div>

        {/* Target Price */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Target (TP)
            </span>
            <span className="text-[10px] text-slate-500">ACF Field</span>
          </div>
          <div className="text-sm font-mono font-bold text-emerald-300 truncate">
            {targetPrice || 'Dynamic'}
          </div>
        </div>

        {/* Stop Loss */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Stop Loss (SL)
            </span>
            <span className="text-[10px] text-slate-500">ACF Field</span>
          </div>
          <div className="text-sm font-mono font-bold text-rose-300 truncate">
            {stopLoss || 'Structural'}
          </div>
        </div>
      </div>

      {/* Metrics Row: Risk Score & Model Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-slate-800/70 text-xs">
        {/* Risk Rating */}
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Risk Rating
            </span>
            <span className="font-bold text-slate-200">{riskScore} / 10</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                riskScore <= 3
                  ? 'bg-emerald-500'
                  : riskScore <= 6
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, riskScore * 10))}%` }}
            />
          </div>
        </div>

        {/* Algo Confidence */}
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-400" /> Algorithmic Confidence
            </span>
            <span className="font-bold text-sky-300">{algoConfidence}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${algoConfidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Indicators Used */}
      {indicatorsUsed && indicatorsUsed.length > 0 && (
        <div className="pt-3 border-t border-slate-800/70 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3 text-slate-500" /> Indicators:
          </span>
          {indicatorsUsed.map((ind, i) => (
            <span
              key={i}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
            >
              {ind}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
