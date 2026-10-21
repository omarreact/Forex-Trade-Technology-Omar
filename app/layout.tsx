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
        {children}
      </body>
    </html>
  );
}
