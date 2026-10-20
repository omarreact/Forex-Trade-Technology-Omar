/**
 * Marketing homepage. All editorial copy comes from the source-verified
 * Gutenberg export; this file adds only the site experience around it.
 */
import type { Metadata } from 'next';
import { getThemePageBySlug } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HomeClientEffects } from '@/components/HomeClientEffects';
import { HomeCapabilityStrip } from '@/components/home/HomeCapabilityStrip';
import './home-polish.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Forex Broker Technology & Brokerage Solutions | Forex Trade Technology',
  description:
    'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
  keywords: [
    'forex broker technology',
    'MT5 white label',
    'forex CRM',
    'liquidity connectivity',
    'forex broker hosting',
    'turnkey brokerage',
  ],
  openGraph: {
    title: 'Forex Broker Technology & Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Broker Technology & Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
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

  return (
    <div className="ftt-home min-h-screen flex flex-col">
      <a className="ftt-home-skip" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="ftt-home-main flex-1">
        <div className="ftt-home-hero" dangerouslySetInnerHTML={{ __html: hero }} />
        {rest && <HomeCapabilityStrip />}
        {rest && (
          <div
            className="ftt-home-editorial ftt-page-frame"
            dangerouslySetInnerHTML={{ __html: rest }}
          />
        )}
      </main>
      <HomeClientEffects />
      <SiteFooter />
    </div>
  );
}
