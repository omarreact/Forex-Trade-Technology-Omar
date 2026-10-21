/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import type { EditorialPhoto } from '@/lib/pexels-photos';

type FlowSection = { markup: string; id: string };

function splitAtSections(html: string): FlowSection[] {
  const chunks = html.split(/(?=<section\b)/i);
  return chunks.filter(chunk => chunk.trim()).map((chunk, i) => ({
    markup: chunk,
    id: chunk.match(/<section\b[^>]*\bid="([^"]+)"/i)?.[1] || `section-${i}`,
  }));
}

function contentFigure(photo: EditorialPhoto, kind: 'left' | 'right' | 'center'): string {
  const caption = kind === 'center' ? 'Real-world brokerage technology' : 'Technology in focus';
  return `<figure class="ftt-flow-inline ftt-flow-inline--${kind}">
    <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" width="920" height="610" />
    <figcaption><span class="ftt-flow-inline-mark" aria-hidden="true"></span>${caption}</figcaption>
  </figure>`;
}

function enrichArticle(markup: string, photo: EditorialPhoto, direction: 'left' | 'right'): string | null {
  // Body wrapping is inside source article/rail; no headings or paragraphs are altered.
  if (!/ftt-rd-section--article|ftt-rd-section--rail/.test(markup)) return null;
  const open = /(<div class="[^"]*\bftt-rd-section-body\b[^"]*">)/;
  if (!open.test(markup)) return null;
  return markup.replace(open, '$1' + contentFigure(photo, direction));
}

function backgroundSection(markup: string, photo: EditorialPhoto): string {
  // A low-opacity photo wash ensures words remain readable on tinted and white sections.
  const style = `--ftt-inline-backdrop:url('${photo.src}')`;
  return markup.replace(/(<section\b)([^>]*)(>)/i, (_match, start: string, rest: string, end: string) => {
    if (/class="[^"]*"/.test(rest)) rest = rest.replace(/class="([^"]*)"/, 'class="$1 ftt-flow-with-backdrop"');
    else rest += ' class="ftt-flow-with-backdrop"';
    return `${start}${rest} style="${style}"${end}`;
  });
}

/**
 * Five contextual images follow the hero rather than forming one large gallery.
 * Desktop positions: text-left/right, centered editorial break, soft background,
 * and reduced-motion-safe parallax panel. Small screens always stack naturally.
 */
export function InteriorEditorialFlow({ html, photos }: {
  html: string;
  photos: readonly EditorialPhoto[];
}) {
  const sections = splitAtSections(html);
  if (!sections.length) return <div dangerouslySetInnerHTML={{ __html: html }} />;

  const eligible = sections.map((section, i) => ({section, i}))
    .filter(({section}) => /ftt-rd-section--article|ftt-rd-section--rail/.test(section.markup) && /ftt-rd-section-body/.test(section.markup))
    .map(({i}) => i);
  const leftAt = eligible[0] ?? 0;
  const rightAt = eligible[1] ?? Math.min(2, sections.length - 1);
  const midAt = Math.min(sections.length - 1, Math.floor(sections.length * .37));
  const backCandidates = sections.map((x, i) => ({i, isValid: !/ftt-rd-section--cta|ftt-rd-section--form/.test(x.markup)}))
    .filter(x => x.isValid).map(x => x.i);
  const bgAt = backCandidates[Math.min(backCandidates.length - 1, Math.floor(backCandidates.length * .66))] ?? 0;
  const parallaxAt = Math.min(sections.length - 2, Math.floor(sections.length * .75));
  const [left, right, middle, backdrop, parallax] = photos;

  return (
    <div className="ftt-interior-flow">
      {sections.map(({markup, id}, i) => {
        let rendered = markup;
        let leftFallback = false;
        let rightFallback = false;
        if (i === leftAt && left) {
          const found = enrichArticle(rendered, left, 'left');
          if (found) rendered = found;
          else leftFallback = true;
        }
        if (i === rightAt && right) {
          const found = enrichArticle(rendered, right, 'right');
          if (found) rendered = found;
          else rightFallback = true;
        }
        if (i === bgAt && backdrop) rendered = backgroundSection(rendered, backdrop);
        return (
          <div className="ftt-interior-flow-entry" key={id + '-' + i}>
            <div dangerouslySetInnerHTML={{ __html: rendered }} />
            {leftFallback && <InlineBreak photo={left} align="left" />}
            {rightFallback && <InlineBreak photo={right} align="right" />}
            {i === midAt && middle && <InlineBreak photo={middle} align="center" />}
            {i === parallaxAt && parallax && <ParallaxBreak photo={parallax} />}
          </div>
        );
      })}
    </div>
  );
}

export function InlineBreak({ photo, align }: {
  photo: EditorialPhoto;
  align: 'left'|'right'|'center';
}) {
  return (
    <figure className={`ftt-flow-standalone ftt-flow-standalone--${align}`}>
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width="1150" height="640" />
      <figcaption><span aria-hidden="true" /> Brokerage technology in focus</figcaption>
    </figure>
  );
}

export function ParallaxBreak({ photo }: {photo: EditorialPhoto}) {
  return (
    <section className="ftt-flow-parallax" aria-label="Brokerage technology photography"
      style={{ '--ftt-parallax-photo': `url('${photo.src}')` } as CSSProperties}>
      <div className="ftt-flow-parallax-scrim" aria-hidden="true" />
      <div className="ftt-flow-parallax-inner">
        <span className="ftt-flow-parallax-line" aria-hidden="true" />
        
      </div>
    </section>
  );
}
