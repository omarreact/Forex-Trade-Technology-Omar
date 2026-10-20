/**
 * Next.js-only cleanup for preserved, source-backed Gutenberg page HTML.
 * Leave diagrams where they communicate a system architecture; never swap
 * diagrams for generated pictures or download third-party assets.
 */
export function curateInteriorMedia(html: string, _slug: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let updated = tag;
    if (!/\bloading=/.test(updated)) updated = updated.replace(/\s*\/>$/, ' loading="lazy" />');
    if (!/\bdecoding=/.test(updated)) updated = updated.replace(/\s*\/>$/, ' decoding="async" />');
    return updated;
  });
}
