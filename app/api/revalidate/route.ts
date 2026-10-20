// app/api/revalidate/route.ts
/**
 * On-Demand Incremental Static Regeneration (ISR) Webhook Endpoint
 * Allows WordPress post transitions (publish, update, delete) to instantly
 * invalidate edge CDN cache tags and route paths on Vercel without a full redeploy.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const EXPECTED_SECRET =
      process.env.WORDPRESS_REVALIDATION_SECRET || 'forex_trade_tech_isr_revalidation_secret_2026';

    // 1. Authenticate webhook request via header or query parameter
    const headerSecret = request.headers.get('x-revalidate-secret');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    const providedSecret = headerSecret || querySecret;

    if (!providedSecret || providedSecret !== EXPECTED_SECRET) {
      return NextResponse.json(
        {
          revalidated: false,
          error: 'Unauthorized: Missing or invalid x-revalidate-secret token.',
        },
        { status: 401 }
      );
    }

    // 2. Parse payload from WordPress webhook
    let body: {
      tag?: string;
      slug?: string;
      post_type?: string;
      id?: number;
      action?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      // Body may be empty if triggered via query parameters
    }

    const tag = body.tag || searchParams.get('tag') || 'posts';
    const slug = body.slug || searchParams.get('slug');

    const invalidatedTargets: string[] = [];

    // 3. Revalidate cache tags if specified (e.g., 'posts', 'wordpress', or specific post tag)
    if (tag) {
      revalidateTag(tag);
      invalidatedTargets.push(`tag:${tag}`);
    }

    // 4. Invalidate specific post slug path and feed paths
    if (slug) {
      revalidatePath(`/blog/${slug}`);
      revalidateTag(`post:${slug}`);
      invalidatedTargets.push(`/blog/${slug}`, `tag:post:${slug}`);
    }

    // Always revalidate the index and archive listings on post updates
    revalidatePath('/');
    revalidatePath('/blog');
    invalidatedTargets.push('/', '/blog');

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      invalidatedTargets,
      source: 'WordPress On-Demand ISR Webhook',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        revalidated: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// Support GET for testing and simple ping webhooks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const EXPECTED_SECRET =
    process.env.WORDPRESS_REVALIDATION_SECRET || 'forex_trade_tech_isr_revalidation_secret_2026';

  const secret = searchParams.get('secret');
  if (!secret || secret !== EXPECTED_SECRET) {
    return NextResponse.json(
      {
        revalidated: false,
        error: 'Unauthorized: Invalid secret query parameter.',
      },
      { status: 401 }
    );
  }

  const tag = searchParams.get('tag') || 'posts';
  const slug = searchParams.get('slug');

  if (tag) revalidateTag(tag);
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidateTag(`post:${slug}`);
  }
  revalidatePath('/');
  revalidatePath('/blog');

  return NextResponse.json({
    revalidated: true,
    method: 'GET',
    timestamp: new Date().toISOString(),
    tag,
    slug: slug || 'all',
  });
}
