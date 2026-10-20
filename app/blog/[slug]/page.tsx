// app/blog/[slug]/page.tsx
/**
 * Headless WordPress Single Article & Technical Setup Page
 * Static-First Incremental Static Regeneration (ISR)
 * Seamless Draft Mode Live Preview for WordPress Content Creators
 */

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getAllPostSlugs, getPostBySlug } from '@/lib/wordpress';
import { sanitizeWordPressHtml, stripHtml } from '@/lib/sanitize';
import { ForexMetaCard } from '@/components/ForexMetaCard';
import { DraftModeBanner } from '@/components/DraftModeBanner';
import {
  Clock,
  User,
  ArrowLeft,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 3600; // 1-hour static cache, on-demand revalidation via /api/revalidate

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Forex Trade Technology',
    };
  }

  const plainExcerpt = stripHtml(post.excerpt) || `${post.title} - Forex Trade Technology Analysis`;
  const featuredImg = post.featuredImage?.node?.sourceUrl;

  return {
    title: `${post.title} | Forex Trade Technology`,
    description: plainExcerpt,
    openGraph: {
      title: post.title,
      description: plainExcerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: featuredImg ? [{ url: featuredImg }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: plainExcerpt,
      images: featuredImg ? [featuredImg] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Next.js 15 App Router Draft Mode Detection
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const { post, isFallback } = await getPostBySlug(slug, { isDraft });

  if (!post) {
    notFound();
  }

  // Securely sanitize WordPress HTML content to block XSS and malicious event handlers
  const sanitizedContent = sanitizeWordPressHtml(post.content);

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    description: stripHtml(post.excerpt),
    image: post.featuredImage?.node?.sourceUrl,
    author: {
      '@type': 'Person',
      name: post.author?.node?.name || 'Forex Trade Technology Research Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Forex Trade Technology',
      url: 'https://forex-trade-technology.vercel.app',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Banner when in Draft Mode */}
      {isDraft && <DraftModeBanner currentPath={`/blog/${post.slug}`} postTitle={post.title} />}

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Market Feed</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISR Verified Cache</span>
            </span>
            <Link
              href="/"
              className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              Architecture Center
            </Link>
          </div>
        </div>
      </header>

      {/* Article Body Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-300">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-slate-300">
            Market Intelligence
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Categories */}
        {post.categories?.edges && post.categories.edges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.edges.map(({ node }) => (
              <span
                key={node.id}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold"
              >
                {node.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Publication Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800/80 mb-8 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            {post.author?.node?.avatar?.url ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-bold text-slate-200 block text-sm">
                {post.author?.node?.name || 'Quantitative Analyst'}
              </span>
              <span className="text-[11px] text-slate-500">Forex Trade Technology Specialist</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Published:{' '}
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              5 min read
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-8 bg-slate-900">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* ACF Forex Terminal Card (Custom Fields) */}
        {post.acfForex && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                WPGraphQL ACF Field Integration
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Type-Safe Schema
              </span>
            </div>
            <ForexMetaCard acf={post.acfForex} />
          </div>
        )}

        {/* Sanitized HTML Body from WordPress */}
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5 prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-slate-900/60 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-300 prose-code:text-emerald-300 prose-code:font-mono prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>

        {/* Tags */}
        {post.tags?.edges && post.tags.edges.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500 mr-1" />
            {post.tags.edges.map(({ node }) => (
              <span
                key={node.id}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono"
              >
                #{node.name}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Card */}
        {post.author?.node?.description && (
          <div className="mt-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {post.author.node.avatar?.url && (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Written by {post.author.node.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {post.author.node.description}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Forex Trade Technology. High-Performance Headless WordPress Architecture.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-300">
              Command Center
            </Link>
            <Link href="/blog" className="text-emerald-400 hover:text-emerald-300">
              Market Feed
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
