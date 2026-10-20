import fs from 'node:fs';
import path from 'node:path';

/**
 * Read the marketing hero and featured service slides from the verified
 * Gutenberg export. This keeps the Next.js experience in sync with the
 * bundled WordPress page copy without rendering the old full-width banner.
 */
export interface HomeHeroIntro {
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface HomeHeroSlide {
  title: string;
  summary: string;
  image: string;
  alt: string;
  href: string;
}

// Generate artwork is selected only when the approved local files are present.
// Without the files we preserve the existing live photo to avoid broken images.
const approvedSlideArtwork = [
  '/theme-assets/images/home-mt5-platform.avif',
  '/theme-assets/images/home-forex-crm.avif',
  '/theme-assets/images/home-broker-hosting.avif',
] as const;
function preferredSlideImage(index: number, fallback: string): string {
  const selected = approvedSlideArtwork[index];
  if (!selected) return fallback;
  const fullPath = path.join(process.cwd(), 'public', selected.replace(/^\//, ''));
  return fs.existsSync(fullPath) ? selected : fallback;
}

const serviceLinks = [
  '/solutions/mt5-white-label/',
  '/products/forex-crm/',
  '/solutions/forex-broker-hosting/',
] as const;

function decodeHtmlText(input: string): string {
  return input
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#0*39);/g, (entity) => {
      const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&nbsp;': ' ',
        '&#039;': "'",
        '&#39;': "'",
      };
      return entities[entity] || entity;
    })
    .replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, (_, hex: string | undefined, decimal: string | undefined) => {
      const codepoint = parseInt(hex || decimal || '', hex ? 16 : 10);
      return Number.isFinite(codepoint) && codepoint >= 0 && codepoint <= 0x10ffff
        ? String.fromCodePoint(codepoint)
        : '';
    })
    .trim();
}

function contentForClass(html: string, tag: string, className: string): string {
  const expression = new RegExp(
    '<' + tag + '\\b[^>]*class="[^"]*\\b' + className + '\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/' + tag + '>',
    'i'
  );
  return decodeHtmlText(html.match(expression)?.[1] || '');
}

export function getHomeHeroData(heroHtml: string): {
  intro: HomeHeroIntro;
  slides: HomeHeroSlide[];
} {
  const buttonMatches = [...heroHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const slideFragments = heroHtml.split(/<div class="wp-block-group ftt-slide ftt-slide-\d+">/).slice(1);

  const slides = slideFragments.slice(0, 3).map((part, i) => {
    const picture = part.match(/<img\b[^>]*src="([^"]+)"[^>]*>/i)?.[0] || '';
    const src = picture.match(/src="([^"]+)"/)?.[1] || '';
    const alt = picture.match(/alt="([^"]*)"/)?.[1] || '';

    return {
      title: contentForClass(part, 'h3', 'ftt-slide-title'),
      summary: contentForClass(part, 'p', 'ftt-slide-summary'),
      image: preferredSlideImage(i, src.startsWith('/theme-assets/images/') ? src : '/theme-assets/images/workstation-1200.webp'),
      alt: decodeHtmlText(alt),
      href: serviceLinks[i] || '/solutions/',
    };
  }).filter((slide) => slide.title && slide.summary);

  const fallbackSlides: HomeHeroSlide[] = [
    {
      title: 'MT5 White Label',
      summary: 'Branded MT5 technology for a professional brokerage launch, with more control over your trading environment.',
      image: preferredSlideImage(0, '/theme-assets/images/workstation-1200.webp'),
      alt: 'Technology workstation',
      href: serviceLinks[0],
    },
    {
      title: 'Forex CRM',
      summary: 'Clients, KYC, deposits, withdrawals, IBs and day-to-day operations managed from one system.',
      image: preferredSlideImage(1, '/theme-assets/images/analytics-1200.webp'),
      alt: 'Analytics workstation',
      href: serviceLinks[1],
    },
    {
      title: 'Forex Broker Hosting',
      summary: 'MT4 and MT5 server infrastructure with monitoring, backups and technical support.',
      image: preferredSlideImage(2, '/theme-assets/images/datacenter-1200.webp'),
      alt: 'Data center equipment',
      href: serviceLinks[2],
    },
  ];

  return {
    intro: {
      eyebrow: contentForClass(heroHtml, 'p', 'bs-hero-kicker') || 'Brokerage Technology & FinTech Infrastructure',
      title: contentForClass(heroHtml, 'h1', 'bs-hero-title') || 'Forex Brokerage Technology Built for Your Business',
      lead: contentForClass(heroHtml, 'p', 'bs-hero-subtitle') || 'Launch, manage and scale your forex brokerage with integrated trading platforms, CRM, liquidity connectivity, hosting and brokerage technology.',
      description: contentForClass(heroHtml, 'p', 'ftt-hero-description') || 'We build and connect the forex broker technology that sits behind a working brokerage. Trading servers, client systems, liquidity links, payments, onboarding. You focus on the business. We make sure the stack underneath it holds together.',
      primaryLabel: decodeHtmlText(buttonMatches[0]?.[2] || '') || 'Request a Consultation',
      primaryHref: buttonMatches[0]?.[1]?.startsWith('/') ? buttonMatches[0][1] : '/contact/#contact-form',
      secondaryLabel: decodeHtmlText(buttonMatches[1]?.[2] || '') || 'Explore Solutions',
      secondaryHref: buttonMatches[1]?.[1]?.startsWith('/') ? buttonMatches[1][1] : '/#solutions',
    },
    slides: slides.length === 3 ? slides : fallbackSlides,
  };
}
