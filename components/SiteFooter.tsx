import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/** Compact, accessible conversion footer shared across the entire public site. */
export function SiteFooter() {
  return (
    <footer className="bs-site-footer ftt-site-footer text-[#f4f6ef]">
      <div className="bs-footer-inner max-w-[1210px] mx-auto px-4 sm:px-6">
        <div className="bs-footer-grid ftt-footer-columns">
          <div className="ftt-footer-brand">
            <Link href="/" className="bs-footer-logo inline-block font-extrabold tracking-tighter text-white">
              Forex Trade Technology<span className="text-[#d9f17a]">.</span>
            </Link>
            <p className="bs-footer-desc text-[13px] leading-relaxed text-[#bec8b8] max-w-sm">
              Brokerage technology, infrastructure and integration — built to work together.
            </p>
          </div>
          <nav className="ftt-footer-links" aria-label="Footer navigation">
            <h2 className="bs-footer-heading text-[11px] font-extrabold uppercase tracking-widest text-[#bcc5b6]">Explore</h2>
            <div className="bs-footer-nav grid grid-cols-2 gap-x-4 text-[13px] text-[#d6ddd2]">
              <Link href="/#solutions" className="hover:text-[#d9f17a]">Solutions</Link>
              <Link href="/#the-product-ecosystem" className="hover:text-[#d9f17a]">Products</Link>
              <Link href="/technology" className="hover:text-[#d9f17a]">Technology</Link>
              <Link href="/about-us" className="hover:text-[#d9f17a]">About Us</Link>
              <Link href="/portfolio" className="hover:text-[#d9f17a]">Portfolio</Link>
              <Link href="/faq" className="hover:text-[#d9f17a]">FAQs</Link>
              <Link href="/blog" className="hover:text-[#d9f17a]">Insights</Link>
              <Link href="/contact" className="hover:text-[#d9f17a]">Contact</Link>
            </div>
          </nav>
          <div className="ftt-footer-contact">
            <h2 className="bs-footer-heading text-[11px] font-extrabold uppercase tracking-widest text-[#bcc5b6]">Start a conversation</h2>
            <Link href="/contact" className="inline-flex items-center gap-2 text-[#d9f17a] text-[14px] font-bold hover:underline">
              Request a Consultation <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <p className="text-[12px] text-[#b0b9ab] leading-relaxed mt-3 max-w-xs">
              Tell us about your trading platforms, CRM, connectivity or hosting requirements.
            </p>
          </div>
        </div>
        <div className="bs-footer-bottom border-t border-[#344134] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-[#a5b0a2]">
          <p>© {new Date().getFullYear()} Forex Trade Technology. All rights reserved.</p>
          <p>Independent technology services do not replace jurisdiction-specific legal or regulatory advice.</p>
        </div>
      </div>
    </footer>
  );
}
