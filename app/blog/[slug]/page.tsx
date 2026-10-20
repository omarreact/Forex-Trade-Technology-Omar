// app/blog/[slug]/page.tsx
/**
 * Headless WordPress Single Article & Technical Setup Page
 * Seamlessly styled with the Forex Trade Technology theme
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
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  Clock,
  User,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Tag,
} from 'lucide-react';

export const revalidate = 3600;

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

  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const { post } = await getPostBySlug(slug, { isDraft });

  if (!post) {
    notFound();
  }

  const sanitizedContent = sanitizeWordPressHtml(post.content);

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
    <div className="ftt-blog-article min-h-screen bg-[#fafbf8] text-[#192219] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Banner only shown when editor is in draft preview mode */}
      {isDraft && <DraftModeBanner currentPath={`/blog/${post.slug}`} postTitle={post.title} />}

      <SiteHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-[960px] mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-mono text-[#7a865a] mb-6">
          <Link href="/" className="hover:text-[#192219]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-[#192219]">
            Market Intelligence
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#394439] truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Categories */}
        {post.categories?.edges && post.categories.edges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.edges.map(({ node }) => (
              <span
                key={node.id}
                className="px-2.5 py-1 rounded-md bg-[#eef2e8] border border-[#dfe4d9] text-[#41532a] text-xs font-mono font-bold"
              >
                {node.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#192219] tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Publication Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#dfe4d9] mb-8 text-xs font-mono text-[#5c675c]">
          <div className="flex items-center gap-3">
            {post.author?.node?.avatar?.url ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#dfe4d9]">
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name}
                  fill
                  className="object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#eef2e8] flex items-center justify-center text-[#5c675c]">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-bold text-[#192219] block text-sm">
                {post.author?.node?.name || 'Forex Trade Technology Research Team'}
              </span>
              <span className="text-[11px] text-[#7a865a]">Forex Trade Technology Specialist</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#5c675c]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8c9655]" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8c9655]" />
              Article
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#dfe4d9] shadow-md mb-8 bg-[#f4f5f0]">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              priority
              className="object-cover"
              unoptimized
              sizes="(max-width: 1024px) 100vw, 896px"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* ACF Forex Terminal Card */}
        {post.acfForex && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7a865a] font-bold">
                BROKERAGE MARKET DATA
              </span>
              <span className="text-[10px] font-mono text-[#315c28] bg-[#d9f17a]/30 px-2 py-0.5 rounded border border-[#b3d25a]">
                Research snapshot
              </span>
            </div>
            <ForexMetaCard acf={post.acfForex} />
          </div>
        )}

        {/* Sanitized HTML Body */}
        <div className="prose max-w-none text-[#394439] prose-headings:text-[#192219] prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-5 prose-a:text-[#315c28] hover:prose-a:underline prose-blockquote:border-l-[#d9f17a] prose-blockquote:bg-[#f7f8f2] prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-[#5c675c] prose-code:text-[#315c28] prose-code:font-mono prose-pre:bg-[#192219] prose-pre:text-white">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>

        {/* Tags */}
        {post.tags?.edges && post.tags.edges.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#dfe4d9] flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-[#7a865a] mr-1" />
            {post.tags.edges.map(({ node }) => (
              <span
                key={node.id}
                className="px-2.5 py-1 rounded-lg bg-[#eef2e8] text-[#41532a] border border-[#dfe4d9] text-xs font-mono"
              >
                #{node.name}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Card */}
        {post.author?.node?.description && (
          <div className="mt-12 p-6 rounded-2xl bg-[#f7f8f2] border border-[#dfe4d9] flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {post.author.node.avatar?.url && (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#dfe4d9]">
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
              <h4 className="text-base font-bold text-[#192219] mb-1">
                Written by {post.author.node.name}
              </h4>
              <p className="text-xs text-[#5c675c] leading-relaxed">
                {post.author.node.description}
              </p>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
