// components/SiteHeader.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { WordPressAdminModal } from './WordPressAdminModal';

export function SiteHeader() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const solutions = [
    { title: 'MT5 White Label', href: '/solutions/mt5-white-label' },
    { title: 'MT5 Grey Label', href: '/solutions/mt5-grey-label' },
    { title: 'MT4 White Label', href: '/solutions/mt4-white-label' },
    { title: 'MT4 Grey Label', href: '/solutions/mt4-grey-label' },
    { title: 'Forex White Label', href: '/solutions/forex-white-label' },
    { title: 'Start a Forex Brokerage', href: '/solutions/start-a-forex-brokerage' },
    { title: 'Liquidity & Connectivity', href: '/solutions/forex-liquidity-connectivity' },
    { title: 'Broker Hosting', href: '/solutions/forex-broker-hosting' },
    { title: 'Turnkey Brokerage', href: '/solutions/forex-turnkey-solution' },
  ];

  const products = [
    { title: 'Forex CRM', href: '/products/forex-crm' },
    { title: 'Broker Website', href: '/products/forex-broker-website' },
    { title: 'Mobile Trading App', href: '/products/mobile-trading-app' },
    { title: 'Web Trading Platform', href: '/products/web-trading-platform' },
    { title: 'Forex Manager API', href: '/products/forex-manager-api' },
    { title: 'Prop Firm CRM API', href: '/products/prop-firm-crm-api' },
    { title: 'PAMM / MAM', href: '/products/pamm-mam' },
    { title: 'Payment Gateway Integration', href: '/products/payment-gateway-integration' },
  ];

  return (
    <header className="bs-site-header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5e0]">
      <div className="bs-header-inner max-w-[1210px] min-h-[84px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Brand Wordmark */}
        <div className="bs-wordmark flex items-center shrink-0">
          <Link href="/" className="bs-logo-text text-[24px] sm:text-[26px] font-extrabold text-[#161816] tracking-tighter">
            Forex Trade Technology<span className="text-[#86a627] ml-0.5">•</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#141613]">
          <Link href="/" className="hover:text-[#798b32] transition-colors py-2">
            Home
          </Link>

          {/* Solutions Dropdown */}
          <div className="relative" onMouseLeave={() => setSolutionsOpen(false)}>
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onMouseEnter={() => setSolutionsOpen(true)}
              className="inline-flex items-center gap-1 hover:text-[#798b32] transition-colors py-2 focus:outline-none"
              aria-expanded={solutionsOpen}
            >
              <span>Solutions</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {solutionsOpen && (
              <div
                onMouseEnter={() => setSolutionsOpen(true)}
                className="absolute top-full -left-4 w-64 bg-white border border-[#dedfd8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {solutions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSolutionsOpen(false)}
                    className="block px-3.5 py-2 text-[13px] font-medium text-[#192219] hover:bg-[#f4f5f0] hover:text-[#71823c] rounded-xl transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Products Dropdown */}
          <div className="relative" onMouseLeave={() => setProductsOpen(false)}>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              onMouseEnter={() => setProductsOpen(true)}
              className="inline-flex items-center gap-1 hover:text-[#798b32] transition-colors py-2 focus:outline-none"
              aria-expanded={productsOpen}
            >
              <span>Products</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
            </button>

            {productsOpen && (
              <div
                onMouseEnter={() => setProductsOpen(true)}
                className="absolute top-full -left-4 w-64 bg-white border border-[#dedfd8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {products.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setProductsOpen(false)}
                    className="block px-3.5 py-2 text-[13px] font-medium text-[#192219] hover:bg-[#f4f5f0] hover:text-[#71823c] rounded-xl transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/technology" className="hover:text-[#798b32] transition-colors py-2">
            Technology
          </Link>
          <Link href="/portfolio" className="hover:text-[#798b32] transition-colors py-2">
            Portfolio
          </Link>
          <Link href="/about-us" className="hover:text-[#798b32] transition-colors py-2">
            About
          </Link>
          <Link href="/faq" className="hover:text-[#798b32] transition-colors py-2">
            FAQs
          </Link>
          <Link href="/blog" className="hover:text-[#798b32] transition-colors py-2 text-[#71823c]">
            Market Intel
          </Link>
        </nav>

        {/* Right CTA & WP Admin Portal */}
        <div className="hidden sm:flex items-center gap-3">
          <WordPressAdminModal />
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#171915] hover:bg-[#424638] text-white px-5 py-2.5 rounded-full text-[13px] font-bold tracking-tight shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span>Contact Us</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#141613] hover:bg-[#f4f5f0] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e5e5e0] bg-white px-4 py-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#141613] py-1"
          >
            Home
          </Link>

          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#7a865a] mb-2">
              Solutions
            </span>
            <div className="grid grid-cols-1 gap-1.5 pl-2 border-l-2 border-[#d9f17a]">
              {solutions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#192219] hover:text-[#71823c] py-1"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#7a865a] mb-2">
              Products
            </span>
            <div className="grid grid-cols-1 gap-1.5 pl-2 border-l-2 border-[#d9f17a]">
              {products.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#192219] hover:text-[#71823c] py-1"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#dedfd8] space-y-2">
            <Link
              href="/technology"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#141613]"
            >
              Technology
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#141613]"
            >
              Portfolio
            </Link>
            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#141613]"
            >
              About
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#141613]"
            >
              FAQs
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#71823c]"
            >
              Market Intel
            </Link>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <div className="flex justify-center">
              <WordPressAdminModal />
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#171915] text-white py-3 rounded-full text-sm font-bold shadow"
            >
              <span>Request Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
