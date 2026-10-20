// lib/wordpress.ts
/**
 * Headless WordPress GraphQL Fetcher & Architecture Client
 * Built with native Next.js fetch, Incremental Static Regeneration (ISR),
 * Cache Tagging ('posts', 'wordpress'), and Draft Mode bypass.
 */

import { WPGraphQLResponse, WPPost, WPPostsConnection } from './types';
import { MOCK_FOREX_POSTS } from './mock-data';

const WP_API_URL = process.env.WORDPRESS_API_URL || '';
const WP_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN || '';

/**
 * Standard WPGraphQL query fragments for Post and ACF Forex Fields
 */
export const ACF_FOREX_FRAGMENT = `
  fragment AcfForexFields on Post {
    acfForex {
      tradingPair
      technicalBias
      riskScore
      entryZone
      targetPrice
      stopLoss
      algoConfidence
      marketSession
      timeframe
      indicatorsUsed
      isAutomatedSignal
    }
  }
`;

export const POST_CORE_FIELDS = `
  id
  databaseId
  title
  slug
  date
  modified
  excerpt
  status
  uri
  featuredImage {
    node {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
  author {
    node {
      name
      slug
      avatar {
        url
      }
      description
    }
  }
  categories {
    edges {
      node {
        id
        name
        slug
        count
      }
    }
  }
  tags {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
`;

/**
 * Core WPGraphQL Queries
 */
export const GET_ALL_POSTS_QUERY = `
  ${ACF_FOREX_FRAGMENT}
  query GetAllForexPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ${POST_CORE_FIELDS}
          ...AcfForexFields
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG_QUERY = `
  ${ACF_FOREX_FRAGMENT}
  query GetPostBySlug($id: ID!, $idType: PostIdType = SLUG) {
    post(id: $id, idType: $idType) {
      ${POST_CORE_FIELDS}
      content
      ...AcfForexFields
    }
  }
`;

export const GET_ALL_POST_SLUGS_QUERY = `
  query GetAllPostSlugs {
    posts(first: 100) {
      edges {
        node {
          slug
        }
      }
    }
  }
`;

interface FetchGraphQLOptions {
  variables?: Record<string, unknown>;
  isDraft?: boolean;
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Low-level typed GraphQL fetcher utilizing Next.js native cache mechanics
 */
export async function fetchWordPressGraphQL<T>(
  query: string,
  options: FetchGraphQLOptions = {}
): Promise<WPGraphQLResponse<T>> {
  const { variables = {}, isDraft = false, revalidate = 3600, tags = ['wordpress', 'posts'] } = options;

  // If no endpoint is configured or URL points to placeholder example, return empty to trigger graceful fallback
  if (!WP_API_URL || WP_API_URL.includes('example.com') || WP_API_URL.includes('your-wp-domain')) {
    return {
      errors: [{ message: 'WORDPRESS_API_URL is unconfigured or set to example domain.' }],
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (WP_AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${WP_AUTH_TOKEN}`;
  }

  // Next.js App Router Native Fetch configuration
  const fetchConfig: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (isDraft) {
    // In Draft Mode: bypass edge CDN cache completely to serve real-time preview
    fetchConfig.cache = 'no-store';
  } else {
    // In Production: utilize Incremental Static Regeneration (ISR) with tag invalidation
    fetchConfig.next = {
      revalidate,
      tags,
    };
  }

  try {
    const res = await fetch(WP_API_URL, fetchConfig);

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[WPGraphQL Network Warning] Status: ${res.status} - ${errorText.slice(0, 150)}`);
      return {
        errors: [{ message: `HTTP ${res.status}: ${res.statusText}` }],
      };
    }

    const json = (await res.json()) as WPGraphQLResponse<T>;
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network failure';
    console.warn(`[WPGraphQL Fetch Error] Connection failed to ${WP_API_URL}: ${message}`);
    return {
      errors: [{ message }],
    };
  }
}

/**
 * High-level Post Retrival with Resilient Mock Fallback
 */
export async function getAllPosts(options: { isDraft?: boolean; category?: string } = {}): Promise<{
  posts: WPPost[];
  isFallback: boolean;
  error?: string;
}> {
  const { isDraft = false, category } = options;

  try {
    const response = await fetchWordPressGraphQL<{ posts: WPPostsConnection }>(
      GET_ALL_POSTS_QUERY,
      {
        isDraft,
        tags: ['wordpress', 'posts'],
        revalidate: 3600, // 1 hour ISR default
      }
    );

    if (response.data?.posts?.edges?.length) {
      let posts = response.data.posts.edges.map((edge) => edge.node);

      if (category) {
        posts = posts.filter((p) =>
          p.categories?.edges.some((c) => c.node.slug === category)
        );
      }

      if (!isDraft) {
        posts = posts.filter((p) => p.status === 'publish');
      }

      return {
        posts,
        isFallback: false,
      };
    }

    const errorMsg = response.errors?.[0]?.message;
    // Fallback to high-fidelity mock dataset for instant local dev & presentation
    let fallbackPosts = [...MOCK_FOREX_POSTS];
    if (!isDraft) {
      fallbackPosts = fallbackPosts.filter((p) => p.status === 'publish');
    }
    if (category) {
      fallbackPosts = fallbackPosts.filter((p) =>
        p.categories?.edges.some((c) => c.node.slug === category)
      );
    }

    return {
      posts: fallbackPosts,
      isFallback: true,
      error: errorMsg || 'Live WPGraphQL endpoint unavailable; using production fallback dataset.',
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Fetch failed';
    return {
      posts: MOCK_FOREX_POSTS.filter((p) => (isDraft ? true : p.status === 'publish')),
      isFallback: true,
      error,
    };
  }
}

/**
 * Retrieve Single Post by Slug with Draft Mode & ACF fields
 */
export async function getPostBySlug(
  slug: string,
  options: { isDraft?: boolean } = {}
): Promise<{
  post: WPPost | null;
  isFallback: boolean;
  error?: string;
}> {
  const { isDraft = false } = options;

  try {
    const response = await fetchWordPressGraphQL<{ post: WPPost | null }>(
      GET_POST_BY_SLUG_QUERY,
      {
        variables: { id: slug, idType: 'SLUG' },
        isDraft,
        tags: ['wordpress', 'posts', `post:${slug}`],
        revalidate: 3600,
      }
    );

    if (response.data?.post) {
      return {
        post: response.data.post,
        isFallback: false,
      };
    }

    // Check mock data fallback
    const matched = MOCK_FOREX_POSTS.find((p) => p.slug === slug);
    if (matched) {
      return {
        post: matched,
        isFallback: true,
        error: response.errors?.[0]?.message,
      };
    }

    return {
      post: null,
      isFallback: true,
      error: 'Post not found in live WordPress or fallback data.',
    };
  } catch (err) {
    const matched = MOCK_FOREX_POSTS.find((p) => p.slug === slug);
    return {
      post: matched || null,
      isFallback: true,
      error: err instanceof Error ? err.message : 'Lookup failed',
    };
  }
}

/**
 * Retrieve all post slugs for Next.js generateStaticParams()
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const response = await fetchWordPressGraphQL<{ posts: { edges: Array<{ node: { slug: string } }> } }>(
      GET_ALL_POST_SLUGS_QUERY,
      { revalidate: 3600, tags: ['wordpress'] }
    );

    if (response.data?.posts?.edges?.length) {
      return response.data.posts.edges.map((e) => e.node.slug);
    }
  } catch (e) {
    console.warn('[WPGraphQL] Slugs static generation using mock keys');
  }

  return MOCK_FOREX_POSTS.filter((p) => p.status === 'publish').map((p) => p.slug);
}
