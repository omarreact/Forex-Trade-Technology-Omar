import { getExpandedPagePhotos } from './pexels-photos';

/**
 * Source editorial copy and technical diagrams in the BODY remain untouched.
 * Replace only illustrations within the FIRST (hero) section, and give TOC
 * banners a photograph of their own when no original hero picture exists.
 * No generated images or third-party source links are introduced into markup.
 */
export function curateInteriorMedia(html: string, slug: string): string {
  const heroEnd = html.indexOf('</section>');
  if (heroEnd < 0) return html;
  const photo = getExpandedPagePhotos(slug)[0];
  const cut = heroEnd + '</section>'.length;
  let intro = html.slice(0, cut);
  const rest = html.slice(cut);
  const svgHeroImage = /<img\b[^>]*src="[^"]*\/illustrations\/[^"]+\.svg"[^>]*>/gi;
  const hasHeroIllustration = svgHeroImage.test(intro);
  svgHeroImage.lastIndex = 0;

  if (hasHeroIllustration) {
    intro = intro.replace(svgHeroImage, (tag) => {
      let image = tag.replace(/\bsrc="[^"]*"/i, `src="${photo.src}"`);
      image = image.replace(/\balt="[^"]*"/i, `alt="${photo.alt}"`);
      image = image.replace(/\bloading="[^"]*"/i, 'loading="eager"');
      if (!/\bfetchpriority=/.test(image)) image = image.replace(/\s*\/>$/, ' fetchpriority="high" />');
      return image;
    });
  } else if (intro.includes('ftt-rd-lead-toc')) {
    const visual = `<div class="ftt-rd-toc-photo"><img src="${photo.src}" alt="${photo.alt}" loading="eager" decoding="async" width="960" height="600" /></div>`;
    intro = intro.replace(/(<div class="[^"]*\bftt-rd-lead-toc\b[^"]*">)/, '$1' + visual);
  }

  return (intro + rest).replace(/<img\b[^>]*>/gi, (tag) => {
    let updated = tag;
    if (!/\bloading=/.test(updated)) updated = updated.replace(/\s*\/>$/, ' loading="lazy" />');
    if (!/\bdecoding=/.test(updated)) updated = updated.replace(/\s*\/>$/, ' decoding="async" />');
    return updated;
  });
}
