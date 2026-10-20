import { NextResponse } from 'next/server';
import { getAllThemePages, getThemePageBySlug } from '@/lib/theme-pages';

export const dynamic = 'force-dynamic';

/**
 * Public readiness probe. Includes no credentials or environment details.
 * A missing filesystem-backed theme export should fail visibly here rather
 * than silently rendering an empty website.
 */
export function GET() {
  const pages = getAllThemePages();
  const { html } = getThemePageBySlug('home');
  const contentReady = pages.length >= 23 && html.includes(
    'Forex Brokerage Technology Built for Your Business'
  );
  return NextResponse.json(
    {
      status: contentReady ? 'ok' : 'degraded',
      homepageContentReady: contentReady,
      pagesFound: pages.length,
    },
    { status: contentReady ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
