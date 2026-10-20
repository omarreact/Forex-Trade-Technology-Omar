import Link from 'next/link';
import { ArrowUpRight, Cable, ChartNoAxesCombined, Layers3, ServerCog } from 'lucide-react';

const capabilities = [
  {
    number: '01',
    title: 'Trading platforms',
    detail: 'MT4 & MT5 technology',
    href: '/solutions/mt5-white-label/',
    Icon: Layers3,
  },
  {
    number: '02',
    title: 'Brokerage CRM',
    detail: 'Client & back-office systems',
    href: '/products/forex-crm/',
    Icon: ChartNoAxesCombined,
  },
  {
    number: '03',
    title: 'Liquidity',
    detail: 'Bridges & connectivity',
    href: '/solutions/forex-liquidity-connectivity/',
    Icon: Cable,
  },
  {
    number: '04',
    title: 'Infrastructure',
    detail: 'Hosting & operations',
    href: '/solutions/forex-broker-hosting/',
    Icon: ServerCog,
  },
] as const;

/** Reusable, truthful capability navigation; not an invented statistics bar. */
export function HomeCapabilityStrip() {
  return (
    <section aria-label="Explore our core brokerage technology" className="ftt-capability-rail">
      <div className="ftt-capability-shell">
        <div className="ftt-capability-heading">
          <span className="ftt-capability-rule" aria-hidden="true" />
          <span>One connected brokerage ecosystem</span>
        </div>
        <div className="ftt-capability-grid">
          {capabilities.map(({ number, title, detail, href, Icon }) => (
            <Link className="ftt-capability-card" href={href} key={number}>
              <span className="ftt-capability-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.8}/></span>
              <span className="ftt-capability-text">
                <span className="ftt-capability-number">{number} / TECHNOLOGY</span>
                <strong>{title}</strong>
                <span className="ftt-capability-detail">{detail}</span>
              </span>
              <ArrowUpRight className="ftt-capability-arrow" size={18} aria-hidden="true"/>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
