// lib/types.ts
/**
 * Strict TypeScript Definitions for WPGraphQL, ACF, and Next.js ISR
 * Platform: Forex Trade Technology (Headless Architecture)
 */

export type TechnicalBias = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type MarketSession = 'LONDON' | 'NEW_YORK' | 'TOKYO' | 'OVERLAPPING';

export interface WPFeaturedImage {
  node: {
    sourceUrl: string;
    altText?: string;
    mediaDetails?: {
      width: number;
      height: number;
    };
  };
}

export interface WPAuthor {
  node: {
    name: string;
    slug: string;
    avatar?: {
      url: string;
    };
    description?: string;
  };
}

export interface WPCategory {
  node: {
    id: string;
    name: string;
    slug: string;
    count?: number;
  };
}

export interface WPTag {
  node: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Advanced Custom Fields (ACF) - Forex & Algo Trading Schema
 * Registered via WPGraphQL for ACF or ACF GraphQL Extension
 */
export interface ACF_ForexFields {
  tradingPair: string; // e.g. "EUR/USD", "XAU/USD", "BTC/USD"
  technicalBias: TechnicalBias;
  riskScore: number; // 1 (Low) to 10 (Extreme)
  entryZone: string; // e.g. "1.0840 - 1.0860"
  targetPrice: string; // e.g. "1.0950"
  stopLoss: string; // e.g. "1.0780"
  algoConfidence: number; // 0 to 100%
  marketSession: MarketSession;
  timeframe: string; // e.g. "4H", "1D", "15M"
  indicatorsUsed: string[]; // e.g. ["RSI Divergence", "EMA 200", "Volume Delta"]
  isAutomatedSignal?: boolean;
}

export interface WPPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  uri?: string;
  featuredImage?: WPFeaturedImage | null;
  author?: WPAuthor | null;
  categories?: {
    edges: WPCategory[];
  };
  tags?: {
    edges: WPTag[];
  };
  acfForex?: ACF_ForexFields;
}

export interface WPPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface WPPostsConnection {
  edges: Array<{
    cursor: string;
    node: WPPost;
  }>;
  pageInfo: WPPageInfo;
}

export interface WPGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export interface RevalidationPayload {
  secret?: string;
  tag?: string;
  slug?: string;
  post_type?: string;
  id?: number;
  status?: string;
}

export interface DraftModeStatus {
  isEnabled: boolean;
  previewSlug?: string;
}
