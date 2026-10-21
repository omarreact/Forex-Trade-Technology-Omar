import { pexels } from './pexels-photos';

type HomePhoto = typeof pexels[keyof typeof pexels];

/** Home imagery is contextual, dispersed and never presented as client work. */
const sectionImages: Record<string, HomePhoto> = {
  about: pexels.strategy,
  'mt5-and-mt4-technology-for-brokers': pexels.screens,
  'liquidity-and-connectivity': pexels.tradeTeam,
  'brokerage-infrastructure-you-can-rely-on': pexels.dataCenter,
};
const backgrounds: Record<string, HomePhoto> = {
  'how-it-works': pexels.meeting,
  'who-we-work-with': pexels.tradingOffice,
  'why-brokers-work-with-us': pexels.metricsMeeting,
};
/**
 * Render-only enhancements to the source-backed Gutenberg HTML. Never change
 * words, links or source page markup files; use photography only.
 */
export function withRealHomePhotos(html: string): string {
  return html.replace(/<section\b[\s\S]*?<\/section>/gi, (section) => {
    const slug = section.match(/<section\b[^>]*\bid="([^"]+)"/i)?.[1] || '';
    const replacement = sectionImages[slug];
    let updated = section;
    if (replacement) {
      updated = updated.replace(/<img\b[^>]*\bsrc="\/theme-assets\/images\/[^"]+"[^>]*>/gi, (tag) => {
        let img = tag.replace(/\bsrc="[^"]*"/i, `src="${replacement.src}"`);
        img = img.replace(/\balt="[^"]*"/i, `alt="${replacement.alt}"`);
        if (!/\bloading=/.test(img)) img = img.replace(/\s*\/>$/, ' loading="lazy" />');
        return img;
      });
    }
    const backdrop = backgrounds[slug];
    if (backdrop) {
      updated = updated.replace(/(<section\b)([^>]*)(>)/i, (_m, start: string, rest: string, end: string) => {
        const cls = /\bclass="([^"]+)"/;
        if (cls.test(rest)) rest = rest.replace(cls, 'class="$1 ftt-home-photo-wash"');
        return `${start}${rest} style="--ftt-home-backdrop:url('${backdrop.src}')"${end}`;
      });
    }
    if (slug === 'how-your-trading-stack-connects') {
      // A functional systems diagram built from approved page links. No extra marketing copy.
      const workflow = `<nav class="ftt-stack-workflow" aria-label="Explore the connected trading technology">
        <a href="/solutions/mt5-white-label/"><span>01 / PLATFORM</span><strong>MT5 Trading Platform</strong><small>Explore MT5 White Label ↗</small></a>
        <a href="/solutions/forex-liquidity-connectivity/"><span>02 / EXECUTION</span><strong>Bridge &amp; Liquidity</strong><small>Explore Liquidity Connectivity ↗</small></a>
        <a href="/products/forex-crm/"><span>03 / OPERATIONS</span><strong>Reporting &amp; CRM</strong><small>Explore Forex CRM ↗</small></a>
      </nav>`;
      const endTag = '</div></section>';
      const closeAt = updated.lastIndexOf(endTag);
      if (closeAt >= 0) updated = updated.slice(0, closeAt) + workflow + updated.slice(closeAt);
    }
    if (slug === 'solutions' || slug === 'frequently-asked-questions') {
      updated = updated.replace(/<figure\b[^>]*class="[^"]*ftt-doc-home-photo[^"]*"[\s\S]*?<\/figure>/gi, '');
    }
    return updated;
  });
}
