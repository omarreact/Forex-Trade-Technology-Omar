/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Blocks, Headset, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { pexels } from '@/lib/pexels-photos';

/** A short visual introduction—no invented client results or metrics. */
const features = [
  {
    label: 'Mobile-first trading',
    title: 'Platforms on every screen',
    photo: pexels.phoneCharts,
    href: '/products/mobile-trading-app/',
    icon: Smartphone,
  },
  {
    label: 'Brokerage operations',
    title: 'The systems behind every client journey',
    photo: pexels.supportTeam,
    href: '/products/forex-crm/',
    icon: Headset,
  },
  {
    label: 'Connected infrastructure',
    title: 'Modern brokerage architecture',
    photo: pexels.modernServers,
    href: '/technology/',
    icon: Blocks,
  },
] as const;

export function HomeVisuals() {
  return (
    <section className="ftt-home-visuals" aria-labelledby="ftt-home-visual-title">
      <div className="ftt-home-visuals-inner">
        <div className="ftt-home-visuals-heading">
          <div>
            <span className="ftt-home-visuals-kicker">BUILT AROUND YOUR BROKERAGE</span>
            <h2 id="ftt-home-visual-title">Technology that works together.</h2>
          </div>
          <p>Trading interfaces, client operations and dependable technical foundations in one connected approach.</p>
        </div>
        <div className="ftt-home-visuals-grid">
          {features.map(({ label, title, photo, href, icon: Icon }) => (
            <Link href={href} key={href} className="ftt-home-visual-tile">
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width={630} height={500} />
              <div className="ftt-home-visual-tile-wash" />
              <span className="ftt-home-visual-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.9} /></span>
              <span className="ftt-home-visual-info">
                <small>{label}</small>
                <strong>{title}</strong>
              </span>
              <ArrowUpRight className="ftt-home-visual-arrow" size={19} aria-hidden="true"/>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
