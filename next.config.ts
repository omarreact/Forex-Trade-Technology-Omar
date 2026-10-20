import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The editor-backed page HTML is read from disk by server components.
  // Vercel otherwise may omit these public files from ISR/function traces.
  outputFileTracingIncludes: {
    '/*': [
      './public/theme-assets/content/page-manifest.json',
      './public/theme-assets/content/pages/**/*.html',
      './public/theme-assets/html/contact-form.html',
    ],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
