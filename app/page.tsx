/**
 * Marketing homepage. All editorial copy comes from the source-verified
 * Gutenberg export; this file adds only the site experience around it.
 */
import type { Metadata } from 'next';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HomeHero } from '@/components/home/HomeHero';
import { getHomeHeroData } from '@/lib/home-hero';
import { HomeCapabilityStrip } from '@/components/home/HomeCapabilityStrip';
import { withRealHomePhotos } from '@/lib/home-media';
import './home-polish.css';
import './home-fullwidth.css';
import './home-editorial-media.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Forex Brokerage Technology & MT5 Solutions for Brokers | Forex Trade Technology',
  description:
    'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
  keywords: [
    'forex brokerage technology',
    'MT5 white label',
    'forex CRM',
    'liquidity connectivity',
    'forex broker hosting',
    'turnkey brokerage',
  ],
  openGraph: {
    title: 'Forex Brokerage Technology & MT5 Solutions for Brokers',
    description:
      'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Brokerage Technology & MT5 Solutions for Brokers',
    description:
      'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
  },
};

/**
 * The Gutenberg export contains a single top-level hero <section> followed
 * by its editorial sections. Splitting on the first closing section allows
 * a reusable navigation rail without changing a word of source copy.
 * If its structure changes, render the complete original document instead.
 */
function partitionHomeMarkup(html: string): { hero: string; rest: string } {
  const heroStart = html.indexOf('<section');
  const heroEnd = html.indexOf('</section>');
  if (heroStart === -1 || heroEnd < heroStart) {
    return { hero: html, rest: '' };
  }
  const cut = heroEnd + '</section>'.length;
  return { hero: html.slice(0, cut), rest: html.slice(cut) };
}

export default function HomePage() {
  const { html } = getThemePageBySlug('home');
  const { hero, rest } = partitionHomeMarkup(html);
  const realEditorial = withRealHomePhotos(rest);
  const { intro, slides } = getHomeHeroData(hero, rest);

  return (
    <div className="ftt-home min-h-screen flex flex-col">
      <a className="ftt-home-skip" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="ftt-home-main flex-1">
        <HomeHero intro={intro} slides={slides} />
        {rest && <HomeCapabilityStrip />}
        {rest && (
          <div
            className="ftt-home-editorial ftt-page-frame"
            dangerouslySetInnerHTML={{ __html: realEditorial }}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
