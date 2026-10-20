/* eslint-disable @next/next/no-img-element */
import { BarChart3, CloudCog, Code2, Layers3, Network, ShieldCheck } from 'lucide-react';
import type { EditorialPhoto } from '@/lib/pexels-photos';

type Props = {
  photos: readonly EditorialPhoto[];
  heading?: string;
  compact?: boolean;
};
const galleryIcons = [BarChart3, CloudCog, Layers3, ShieldCheck, Code2, Network];

/**
 * Editorial photography is contextual only; never imply the photographed
 * companies, individuals or facilities are employees or customer projects.
 * Original image source metadata stays in the internal photo catalog.
 */
export function EditorialPhotoBand({ photos, heading = 'Technology in practice', compact = false }: Props) {
  return (
    <section className={`ftt-editorial-photos ftt-editorial-photos--refined${compact ? ' ftt-editorial-photos--compact' : ''}`} aria-label={heading}>
      <div className="ftt-editorial-photos-shell">
        <div className="ftt-editorial-photos-heading">
          <div>
            <span className="ftt-editorial-photos-kicker"><span className="ftt-small-accent" aria-hidden="true" /> TECHNOLOGY IN FOCUS</span>
            <h2>{heading}</h2>
          </div>
          <span className="ftt-editorial-photos-meta">A closer look at the technology landscape</span>
        </div>
        <div className="ftt-editorial-photos-grid">
          {photos.map((photo, index) => {
            const Icon = galleryIcons[index % galleryIcons.length];
            return (
              <figure className="ftt-editorial-photo" key={photo.src}>
                <div className="ftt-editorial-photo-media">
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width="700" height="480" />
                  <span className="ftt-editorial-photo-icon" aria-hidden="true"><Icon size={17} strokeWidth={1.8} /></span>
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{photo.alt}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
