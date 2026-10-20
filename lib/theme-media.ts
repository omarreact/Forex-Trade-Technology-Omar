/**
 * Media art direction for Next.js presentation only.
 *
 * The complete source-backed Gutenberg HTML remains unchanged in GitHub.
 * Each page keeps its unique, palette-matched diagram in the hero. For a
 * second rendering of the same diagram, selectively use a relevant,
 * already licensed/credited local photograph instead of repeating the art.
 * Never fetch random third-party images or substitute a misleading visual.
 */
type Photo = { src: string; alt: string };

const replacementPhotos: Record<string, Photo> = {
  'forex-broker-hosting': {
    src: '/theme-assets/images/datacenter-1200.webp',
    alt: 'Data center and server infrastructure',
  },
  'forex-liquidity-connectivity': {
    src: '/theme-assets/images/analytics-1200.webp',
    alt: 'Financial analytics displayed on workstation monitors',
  },
  'forex-white-label': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Professional trading technology workstation',
  },
  'mt4-grey-label': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Trading technology workstation',
  },
  'mt4-white-label': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Trading technology workstation',
  },
  'mt5-grey-label': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Trading technology workstation',
  },
  'mt5-white-label': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Trading technology workstation',
  },
  'forex-crm': {
    src: '/theme-assets/images/analytics-1200.webp',
    alt: 'Analytics dashboard on a workstation',
  },
  'forex-manager-api': {
    src: '/theme-assets/images/analytics-1200.webp',
    alt: 'Technology analytics workstation',
  },
  'pamm-mam': {
    src: '/theme-assets/images/analytics-1200.webp',
    alt: 'Investment analytics on workstation screens',
  },
  'payment-gateway-integration': {
    src: '/theme-assets/images/analytics-1200.webp',
    alt: 'Analytics and operations workstation',
  },
  'web-trading-platform': {
    src: '/theme-assets/images/workstation-1200.webp',
    alt: 'Trading web platform workstation',
  },
};

/**
 * HTML is the already-validated, bundled page export, not visitor input.
 * Change image tags only: the title, headings, copy, IDs, links and sections
 * retain their exact source order and text.
 */
export function curateInteriorMedia(html: string, slug: string): string {
  const photo = replacementPhotos[slug];
  let diagramNumber = 0;

  return html.replace(/<img\b[^>]*>/gi, (original) => {
    let img = original;
    if (/src="\/theme-assets\/illustrations\/[^"]+\.svg"/i.test(original)) {
      diagramNumber++;
      if (photo && diagramNumber === 2) {
        img = img.replace(/\bsrc="[^"]*"/i, `src="${photo.src}"`);
        img = img.replace(/\balt="[^"]*"/i, `alt="${photo.alt}"`);
      }
    }

    if (!/\bloading=/.test(img)) img = img.replace(/\s*\/>$/, ' loading="lazy" />');
    if (!/\bdecoding=/.test(img)) img = img.replace(/\s*\/>$/, ' decoding="async" />');
    return img;
  });
}
