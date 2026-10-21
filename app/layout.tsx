import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import './interior-polish.css';
import './brand-consistency.css';
import './site-compact.css';
import './editorial-flow.css';
import './doc-refresh-2026.css';
import './heading-system.css';
import './variants.css';
import './design-switcher.css';
import './designs-base.css';
import './design-2-matchtrade.css';
import './design-3-b2broker.css';
import './design-4-leverate.css';
import './design-5-softfx.css';
import './design-6-uptrader.css';
import './design-1-original-cta.css';
import './fonts-reference.css';
import './design-1-compact.css';
import './reference-2.css';
import './reference-3.css';
import './reference-4.css';
import './reference-5.css';
import './reference-6.css';
import { DesignSwitcher } from '@/components/DesignSwitcher';
import {ContactFormHandler} from '@/components/variants/ContactFormHandler';

export const metadata: Metadata = {
  title: 'Forex Trade Technology | Brokerage Technology & FinTech Infrastructure',
  description:
    'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
  openGraph: {
    title: 'Forex Trade Technology | Brokerage Solutions',
    description:
      'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Trade Technology | Brokerage Solutions',
    description:
      'MT5 setup, server hosting, liquidity connectivity and CRM integrations for forex brokers and prop firms. Plan your trading infrastructure with our team.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <DesignSwitcher />
        <ContactFormHandler />
        {children}
      </body>
    </html>
  );
}
