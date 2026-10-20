// lib/theme-pages.ts
/**
 * Theme Page Loader & Transformer for Forex Trade Technology
 * Reads compiled theme HTML pages, strips WP block comments, replaces shortcodes, and fixes asset links
 */

import fs from 'fs';
import path from 'path';

export interface ThemePageMeta {
  title: string;
  route: string;
  slug: string;
  file: string;
  seo_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords?: string;
  h2_count: number;
  h3_count: number;
  category: 'solutions' | 'products' | 'general';
}

const MANIFEST_PATH = path.join(
  process.cwd(),
  'public/theme-assets/content/page-manifest.json'
);

let cachedManifest: ThemePageMeta[] | null = null;
let cachedContactFormHtml: string | null = null;

export function getAllThemePages(): ThemePageMeta[] {
  if (cachedManifest) return cachedManifest;

  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
    const items = JSON.parse(raw);

    cachedManifest = items.map((item: any) => {
      let category: 'solutions' | 'products' | 'general' = 'general';
      if (item.route.startsWith('/solutions/')) {
        category = 'solutions';
      } else if (item.route.startsWith('/products/')) {
        category = 'products';
      }

      return {
        ...item,
        category,
      };
    });

    return cachedManifest || [];
  } catch (err) {
    console.error('[ThemePages] Failed to read page-manifest.json:', err);
    return [];
  }
}

export function getThemePageBySlug(slug: string): {
  meta: ThemePageMeta | null;
  html: string;
} {
  const pages = getAllThemePages();
  const meta = pages.find((p) => p.slug === slug) || null;

  if (!meta) {
    return { meta: null, html: '' };
  }

  const filePath = path.join(
    process.cwd(),
    'public/theme-assets/content/pages',
    meta.file
  );

  try {
    let rawHtml = fs.readFileSync(filePath, 'utf-8');

    // 1. Rewrite FTT_THEME_URI/assets/ to Next.js public route /theme-assets/
    let processedHtml = rawHtml.replace(/FTT_THEME_URI\/assets\//g, '/theme-assets/');

    // 2. Strip WordPress Gutenberg block comments (<!-- wp:... --> and <!-- /wp:... -->)
    processedHtml = processedHtml.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');

    // 3. Replace contact form shortcode if present
    if (processedHtml.includes('[ftt_roadmap_contact_form]')) {
      if (!cachedContactFormHtml) {
        const formPath = path.join(process.cwd(), 'public/theme-assets/html/contact-form.html');
        if (fs.existsSync(formPath)) {
          cachedContactFormHtml = fs.readFileSync(formPath, 'utf-8');
        } else {
          cachedContactFormHtml = '';
        }
      }
      processedHtml = processedHtml.replace('[ftt_roadmap_contact_form]', cachedContactFormHtml);
    }

    return {
      meta,
      html: processedHtml.trim(),
    };
  } catch (err) {
    console.error(`[ThemePages] Failed to read page HTML for ${slug}:`, err);
    return { meta, html: '' };
  }
}
