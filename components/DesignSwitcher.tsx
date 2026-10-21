'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DESIGN_IDS = [1, 2, 3, 4, 5, 6] as const;

/**
 * Persistent, accessible design switcher: keeps the current one of 13 page
 * routes selected when moving between all six visual implementations.
 */
export function DesignSwitcher() {
  const pathname = usePathname() || '/';
  const match = pathname.match(/^\/design-([1-6])(?=\/|$)/);
  const active = match ? Number(match[1]) : 1;
  const suffix = match ? pathname.replace(/^\/design-[1-6](?=\/|$)/, '') || '/' : pathname;
  const pagePath = suffix === '/' ? '' : suffix;
  const [lastDesign, setLastDesign] = useState<number | null>(null);
  useEffect(() => {
    try {
      if (match) {
        window.localStorage.setItem('forex-showroom-last-design', String(active));
        setLastDesign(active);
      } else {
        const saved = Number(window.localStorage.getItem('forex-showroom-last-design'));
        if (saved >= 1 && saved <= 6) setLastDesign(saved);
      }
    } catch { /* Private browsing may block storage; routing remains functional. */ }
  }, [active, pathname, !!match]);

  return (
    <div className="ftt-design-switcher" role="region" aria-label="Website design switcher">
      <div className="ftt-design-switcher__label">
        <span className="ftt-design-switcher__dot" aria-hidden="true" />
        <span>VIEW DESIGNS</span>
      </div>
      {!match && lastDesign && lastDesign !== 1 && (
        <Link className="ftt-design-switcher__resume" href={`/design-${lastDesign}${pagePath}`} title={`Return to your last viewed Design ${lastDesign}`}>
          Resume {lastDesign} ↗
        </Link>
      )}
      <nav className="ftt-design-switcher__nav" aria-label="Choose website design">
        {DESIGN_IDS.map((n) => (
          <Link
            key={n}
            href={`/design-${n}${pagePath}`}
            className={active === n ? 'ftt-design-switcher__link is-active' : 'ftt-design-switcher__link'}
            aria-current={active === n ? 'page' : undefined}
            title={`Open Design ${n} for this page`}
          >
            Design {n}
          </Link>
        ))}
      </nav>
    </div>
  );
}
