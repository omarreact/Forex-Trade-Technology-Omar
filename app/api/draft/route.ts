// app/api/draft/route.ts
/**
 * Next.js App Router Draft Mode Preview Handler
 * Enables content editors in WordPress to preview unpublished drafts or revisions.
 * Invoked by WordPress preview link: /api/draft?secret=...&slug=...
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  const EXPECTED_SECRET = process.env.WORDPRESS_PREVIEW_SECRET || 'forex_trade_tech_draft_preview_token_2026';

  // 1. Verify shared preview secret token
  if (!secret || secret !== EXPECTED_SECRET) {
    return NextResponse.json(
      {
        error: 'Unauthorized: Invalid or missing WordPress preview secret token.',
        hint: 'Ensure WordPress sends ?secret= matching WORDPRESS_PREVIEW_SECRET in your .env or Vercel Environment Variables.',
      },
      { status: 401 }
    );
  }

  // 2. Validate that a target resource identifier was provided
  if (!slug && !id) {
    return NextResponse.json(
      { error: 'Bad Request: Missing ?slug= or ?id= query parameter.' },
      { status: 400 }
    );
  }

  // 3. Enable Next.js Draft Mode (sets signed secure __prerender_bypass cookie)
  const draft = await draftMode();
  draft.enable();

  // 4. Redirect to the target post URL
  const targetPath = slug ? `/blog/${encodeURIComponent(slug)}?preview=true` : `/blog?preview=true`;
  redirect(targetPath);
}
