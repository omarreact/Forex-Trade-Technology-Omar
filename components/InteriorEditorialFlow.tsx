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

function contentFigure(photo: EditorialPhoto, layout: number): string {
  return `<figure class="ftt-flow-inline ftt-flow-inline--layout-${layout}">
    <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" width="920" height="610" />
    <figcaption><span class="ftt-flow-inline-mark" aria-hidden="true"></span>${photo.credit} / Pexels</figcaption>
  </figure>`;
}

function enrichArticle(markup: string, photo: EditorialPhoto, layout: number): string | null {
  // Body wrapping is inside source article/rail; no headings or paragraphs are altered.
  if (!/ftt-rd-section--article|ftt-rd-section--rail/.test(markup)) return null;
  const open = /(<div class="[^"]*\bftt-rd-section-body\b[^"]*">)/;
  if (!open.test(markup)) return null;
  return markup.replace(open, '$1' + contentFigure(photo, layout));
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
 * Seven contextual photos are interleaved with seven sections, each using a
 * distinct editorial composition. Images never collect into a gallery.
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
  const photoBySection = new Map<number, { photo: EditorialPhoto; layout: number }>();
  eligible.slice(0, photos.length).forEach((sectionIndex, imageIndex) => {
    photoBySection.set(sectionIndex, { photo: photos[imageIndex], layout: imageIndex + 1 });
  });

  return (
    <div className="ftt-interior-flow">
      {sections.map(({markup, id}, i) => {
        let rendered = markup;
        const media = photoBySection.get(i);
        if (media) rendered = enrichArticle(rendered, media.photo, media.layout) || rendered;
        return (
          <div className="ftt-interior-flow-entry" key={id + '-' + i}>
            <div dangerouslySetInnerHTML={{ __html: rendered }} />
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
