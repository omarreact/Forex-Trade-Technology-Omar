import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import './interior-polish.css';
import './brand-consistency.css';
import './site-compact.css';

export const metadata: Metadata = {
  title: 'Forex Trade Technology | Brokerage Technology & FinTech Infrastructure',
  description:
    'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
  openGraph: {
    title: 'Forex Trade Technology | Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Trade Technology | Brokerage Solutions',
    description:
      'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.',
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
