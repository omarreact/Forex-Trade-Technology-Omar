// components/SiteFooter.tsx
import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bs-site-footer bg-[#0f110f] text-[#f4f6ef] pt-20 pb-10 border-t border-[#262c23]">
      <div className="bs-footer-inner max-w-[1210px] mx-auto px-4 sm:px-6">
        <div className="bs-footer-grid grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <h3 className="bs-footer-logo text-[34px] sm:text-[38px] font-extrabold tracking-tighter text-white">
              Forex Trade Technology<span className="text-[#d9f17a]">.</span>
            </h3>
            <p className="bs-footer-desc text-[15px] leading-relaxed text-[#9b9f94] mt-4 max-w-sm">
              Brokerage technology, infrastructure and integration—built to work together.
            </p>
          </div>

          {/* Explore Col */}
          <div className="md:col-span-4">
            <h4 className="bs-footer-heading text-[12px] font-extrabold uppercase tracking-widest text-[#93988d] mb-4">
              Explore
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[15px] text-[#c4c9bf]">
              <Link href="/solutions/mt5-white-label" className="hover:text-[#d9f17a] transition-colors py-1">
                Solutions
              </Link>
              <Link href="/technology" className="hover:text-[#d9f17a] transition-colors py-1">
                Technology
              </Link>
              <Link href="/products/forex-crm" className="hover:text-[#d9f17a] transition-colors py-1">
                Products
              </Link>
              <Link href="/about-us" className="hover:text-[#d9f17a] transition-colors py-1">
                About Us
              </Link>
              <Link href="/portfolio" className="hover:text-[#d9f17a] transition-colors py-1">
                Portfolio
              </Link>
              <Link href="/faq" className="hover:text-[#d9f17a] transition-colors py-1">
                FAQs
              </Link>
              <Link href="/blog" className="hover:text-[#d9f17a] transition-colors py-1 text-[#d9f17a]">
                Market Feed
              </Link>
              <Link href="/" className="hover:text-[#d9f17a] transition-colors py-1 text-slate-400">
                Command Center
              </Link>
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3">
            <h4 className="bs-footer-heading text-[12px] font-extrabold uppercase tracking-widest text-[#93988d] mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-[15px] text-[#c4c9bf]">
              <p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-[#d9f17a] hover:underline font-semibold"
                >
                  Request a Consultation ↗
                </Link>
              </p>
              <p className="text-xs text-[#8c9187] leading-relaxed">
                Free initial consultation. Direct discussion of platforms, CRM, liquidity and hosting.
              </p>
            </div>
          </div>
        </div>

        <div className="bs-footer-bottom pt-8 border-t border-[#30372b] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8c9187]">
          <p>© 2026 Forex Trade Technology. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Independent technology services do not replace jurisdiction-specific legal or regulatory advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
