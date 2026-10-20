import { pexels } from './pexels-photos';

/** Replace just the existing 4 editorial photo sources, not Gutenberg copy. */
export function withRealHomePhotos(html: string): string {
  const pictures = [pexels.strategy, pexels.tradeTeam, pexels.trader, pexels.dataCenter];
  let index = 0;
  return html.replace(/<img\b[^>]*src="\/theme-assets\/images\/[^"]+"[^>]*>/gi, (tag) => {
    const photo = pictures[index++];
    if (!photo) return tag;
    let result = tag.replace(/\bsrc="[^"]*"/i, `src="${photo.src}"`)
      .replace(/\balt="[^"]*"/i, `alt="${photo.alt}"`);
    if (!/\bloading=/.test(result)) result = result.replace(/\s*\/>$/, ' loading="lazy" />');
    if (!/\bdecoding=/.test(result)) result = result.replace(/\s*\/>$/, ' decoding="async" />');
    return result;
  });
}
