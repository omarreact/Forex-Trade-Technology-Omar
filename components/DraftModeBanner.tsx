// components/DraftModeBanner.tsx
'use client';

import React from 'react';
import { Eye, AlertTriangle, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DraftModeBannerProps {
  currentPath?: string;
  postTitle?: string;
}

export function DraftModeBanner({ currentPath = '/blog', postTitle }: DraftModeBannerProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-slate-950 px-4 py-2.5 shadow-lg border-b border-amber-400">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-slate-950 animate-ping" />
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <Eye className="w-4 h-4" />
            <span>WORDPRESS DRAFT MODE ACTIVE</span>
          </div>
          <span className="hidden sm:inline-block text-xs bg-black/20 px-2 py-0.5 rounded text-slate-900 border border-black/10">
            CDN Edge Cache Bypassed (`cache: no-store`)
          </span>
          {postTitle && (
            <span className="hidden md:inline-block text-xs text-slate-900 truncate max-w-xs font-normal">
              • Viewing: <span className="font-semibold">{postTitle}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center text-xs text-slate-900 gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Unpublished revisions from WP are visible</span>
          </div>

          <Link
            href={`/api/disable-draft?redirect=${encodeURIComponent(currentPath)}`}
            className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-colors border border-amber-400/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
