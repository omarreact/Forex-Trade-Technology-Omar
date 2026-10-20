// app/api/graphql/route.ts
/**
 * Developer Workbench GraphQL Proxy Endpoint
 * Allows interactive querying of WordPress GraphQL or inspection of the mocked Forex schema.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchWordPressGraphQL } from '@/lib/wordpress';
import { MOCK_FOREX_POSTS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { query, variables } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing GraphQL query in request body' }, { status: 400 });
    }

    const wpUrl = process.env.WORDPRESS_API_URL || '';
    const hasLiveUrl = wpUrl && !wpUrl.includes('example.com') && !wpUrl.includes('your-wp-domain');

    if (hasLiveUrl) {
      const response = await fetchWordPressGraphQL(query, { variables, revalidate: 0 });
      const latencyMs = Date.now() - startTime;
      return NextResponse.json({
        ...response,
        meta: {
          source: 'Live WordPress GraphQL API',
          endpoint: wpUrl,
          latencyMs,
        },
      });
    }

    // Interactive mock response simulator
    const latencyMs = Date.now() - startTime;
    return NextResponse.json({
      data: {
        posts: {
          edges: MOCK_FOREX_POSTS.map((post) => ({
            cursor: Buffer.from(post.slug).toString('base64'),
            node: post,
          })),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
      meta: {
        source: 'Forex Trade Tech Mock Engine (Live WordPress URL not configured)',
        latencyMs,
        note: 'Configure WORDPRESS_API_URL in .env to point to your live WordPress instance.',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        errors: [{ message }],
        meta: {
          source: 'Error Handler',
          latencyMs: Date.now() - startTime,
        },
      },
      { status: 500 }
    );
  }
}
