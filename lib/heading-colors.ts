/**
 * Brand heading treatment: preserve original wording and semantic heading levels.
 * Split at the nearest word boundary to the center of the visible heading.
 * One-word headings split at their midpoint without introducing whitespace.
 */
export function splitHeadingText(input: string): { first: string; second: string; separator: string } {
  const text = input.trim();
  if (!text) return { first: '', second: '', separator: '' };
  const words = text.split(/\s+/);
  if (words.length === 1) {
    const chars = Array.from(text);
    const midpoint = Math.max(1, Math.floor(chars.length / 2));
    return {
      first: chars.slice(0, midpoint).join(''),
      second: chars.slice(midpoint).join(''),
      separator: '',
    };
  }
  const center = text.length / 2;
  let best = 1;
  let distance = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const n = words.slice(0, i).join(' ').length;
    const delta = Math.abs(n - center);
    if (delta < distance) {
      distance = delta;
      best = i;
    }
  }
  return { first: words.slice(0, best).join(' '), second: words.slice(best).join(' '), separator: ' ' };
}

/**
 * Operates on trusted repository-authored Gutenberg HTML, not user-submitted HTML.
 * Do not change words, attributes, IDs or SEO headings—only wrap visible title text.
 * Idempotent, so multiple render transformations cannot double-wrap a heading.
 */
export function colorizeHtmlHeadings(html: string): string {
  return html.replace(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (original, level: string, attrs: string, body: string) => {
    if (body.includes('ftt-heading-accent') || /<[^>]+>/.test(body)) return original;
    const { first, second, separator } = splitHeadingText(body);
    if (!second) return original;
    return `<h${level}${attrs}><span class="ftt-heading-base">${first}</span>${separator}<span class="ftt-heading-accent">${second}</span></h${level}>`;
  });
}
