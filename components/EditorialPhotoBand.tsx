/* eslint-disable @next/next/no-img-element */
import type { EditorialPhoto } from '@/lib/pexels-photos';

type Props = {
  photos: readonly EditorialPhoto[];
  heading?: string;
  compact?: boolean;
};

/** Real editorial imagery only; does not claim people/places are company staff/projects. */
export function EditorialPhotoBand({ photos, heading = 'Brokerage technology in practice', compact = false }: Props) {
  return (
    <section className={`ftt-editorial-photos${compact ? ' ftt-editorial-photos--compact' : ''}`} aria-label={heading}>
      <div className="ftt-editorial-photos-shell">
        <div className="ftt-editorial-photos-heading">
          <div><span className="ftt-editorial-photos-kicker">VISUAL PERSPECTIVE</span><h2>{heading}</h2></div>
          <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer">Photography via Pexels ↗</a>
        </div>
        <div className="ftt-editorial-photos-grid">
          {photos.map((photo, index) => (
            <figure className="ftt-editorial-photo" key={photo.page}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width="600" height="420" />
              <figcaption>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <a href={photo.page} target="_blank" rel="noopener noreferrer" title={`Photo by ${photo.credit} on Pexels`}>
                  {photo.alt}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
