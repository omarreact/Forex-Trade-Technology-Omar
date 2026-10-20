import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forex Trade Tech - Headless WordPress & Next.js',
  description:
    'Production Headless WordPress architecture powered by Next.js App Router, WPGraphQL, ACF, ISR on-demand revalidation, and Vercel Draft Mode.',
  openGraph: {
    title: 'Forex Trade Tech - Headless WordPress & Next.js',
    description:
      'Production Headless WordPress architecture powered by Next.js App Router, WPGraphQL, ACF, ISR on-demand revalidation, and Vercel Draft Mode.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Trade Tech - Headless WordPress & Next.js',
    description:
      'Production Headless WordPress architecture powered by Next.js App Router, WPGraphQL, ACF, ISR on-demand revalidation, and Vercel Draft Mode.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
