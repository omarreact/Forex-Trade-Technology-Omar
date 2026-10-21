'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <div className="ftt-design-switcher" role="region" aria-label="Website design switcher">
      <div className="ftt-design-switcher__label">
        <span className="ftt-design-switcher__dot" aria-hidden="true" />
        <span>VIEW DESIGNS</span>
      </div>
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
