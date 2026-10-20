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
  solutions: pexels.meeting,
  'why-brokers-work-with-us': pexels.metricsMeeting,
};
const standalone = {
  centered: pexels.codeLaptop,
  right: pexels.phoneTrading,
  parallax: pexels.serverRows,
} as const;

function figure(photo: HomePhoto, className: string, label: string): string {
  return `<figure class="${className}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" width="1100" height="700" /><figcaption>${label}</figcaption></figure>`;
}

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
    if (slug === 'the-product-ecosystem') {
      const img = figure(standalone.right, 'ftt-home-inline-media', 'Connected trading experiences');
      updated = updated.replace(/(<\/h2>)/, '$1' + img);
    }
    if (slug === 'how-it-works') {
      updated += figure(standalone.centered, 'ftt-home-center-photo', 'Building the systems behind your brokerage');
    }
    if (slug === 'who-we-serve') {
      updated += `<section class="ftt-flow-parallax ftt-home-parallax" aria-label="Trading infrastructure image" style="--ftt-parallax-photo:url('${standalone.parallax.src}')">
        <div class="ftt-flow-parallax-scrim" aria-hidden="true"></div>
        <div class="ftt-flow-parallax-inner"><span class="ftt-flow-parallax-line" aria-hidden="true"></span><p>Connected technology. Confident operations.</p></div>
      </section>`;
    }
    return updated;
  });
}
