import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowUpRight, ChevronRight, Home } from 'lucide-react';
import { getAllThemePages } from '@/lib/theme-pages';
import type { ThemePageMeta } from '@/lib/theme-pages';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { curateInteriorMedia } from '@/lib/theme-media';
import { getExpandedPagePhotos } from '@/lib/pexels-photos';
import { InteriorEditorialFlow } from './InteriorEditorialFlow';

type InteriorPageShellProps = {
  meta: ThemePageMeta;
  html: string;
};

/**
 * Shared layout for the 22 Google-Docs-derived service and information pages.
 * The complete published Gutenberg HTML is rendered unchanged. The shell
 * only provides navigation and a cohesive presentation system.
 */
export function InteriorPageShell({ meta, html }: InteriorPageShellProps) {
  const curatedHtml = curateInteriorMedia(html, meta.slug);
  const endOfIntro = curatedHtml.indexOf('</section>');
  const intro = endOfIntro < 0 ? '' : curatedHtml.slice(0, endOfIntro + '</section>'.length);
  const body = endOfIntro < 0 ? curatedHtml : curatedHtml.slice(endOfIntro + '</section>'.length);
  const photos = getExpandedPagePhotos(meta.slug);
  const heroPhoto = photos[0];
  const flowPhotos = photos.slice(1);
  const category = meta.category;
  const isContact = meta.slug === 'contact';
  const categoryName =
    category === 'solutions' ? 'Solutions'
      : category === 'products' ? 'Products'
      : meta.route.startsWith('/technology/') ? 'Technology'
      : 'Company';

  const categoryDestination = category === 'solutions'
    ? '/#solutions'
    : category === 'products'
      ? '/#the-product-ecosystem'
      : meta.route.startsWith('/technology/') ? '/technology/'
      : '/';

  const relatedPool = getAllThemePages()
    .filter((page) => page.category === category && page.route !== '/' && page.slug !== 'contact');
  const currentIndex = relatedPool.findIndex((page) => page.slug === meta.slug);
  const related = relatedPool
    .filter((page) => page.slug !== meta.slug)
    .slice(Math.max(0, currentIndex), Math.max(0, currentIndex) + 3);

  // Fill short tails with earlier pages while keeping the current page out.
  if (related.length < 3) {
    for (const page of relatedPool) {
      if (page.slug !== meta.slug && !related.some((item) => item.slug === page.slug)) {
        related.push(page);
        if (related.length === 3) break;
      }
    }
  }

  return (
    <div className="ftt-interior-layout min-h-screen bg-white text-[#192219] flex flex-col font-sans">
      <a href="#interior-main" className="ftt-interior-skip">Skip to main content</a>
      <SiteHeader />
      <main id="interior-main" className={`ftt-page-frame ftt-interior ftt-interior--${category} ftt-interior--${meta.slug} flex-1 w-full`}>
        <nav className="ftt-interior-breadcrumb" aria-label="Breadcrumb">
          <div className="ftt-interior-shell">
            <Link href="/" aria-label="Forex Trade Technology homepage">
              <Home size={14} aria-hidden="true" />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            {meta.route.startsWith('/technology/') ? <span>{categoryName}</span> : <Link href={categoryDestination}>{categoryName}</Link>}
            <ChevronRight size={13} aria-hidden="true" />
            <span className="ftt-interior-current" aria-current="page">{meta.title}</span>
          </div>
        </nav>
        {intro && (
          <div
            className="ftt-interior-intro-wrap"
            style={{ '--ftt-intro-photo': `url("${heroPhoto.src}")` } as CSSProperties}
          >
            <div className="ftt-interior-content" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        )}
        {body && <InteriorEditorialFlow html={body} photos={flowPhotos} />}
        {!isContact && related.length > 0 && (
          <aside className="ftt-interior-more" aria-labelledby="ftt-interior-more-heading">
            <div className="ftt-interior-shell">
              <div className="ftt-interior-more-top">
                <div>
                  <p className="ftt-interior-more-kicker">EXPLORE NEXT</p>
                  <h2 id="ftt-interior-more-heading">Keep exploring brokerage technology</h2>
                </div>
                <Link href="/contact/#contact-form" className="ftt-interior-contact-link">
                  Discuss your requirements <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <div className="ftt-interior-more-grid">
                {related.map((page, i) => (
                  <Link href={page.route} className="ftt-interior-more-card" key={page.route}>
                    <span className="ftt-interior-more-index">{String(i + 1).padStart(2, '0')} / {categoryName.toUpperCase()}</span>
                    <strong>{page.title}</strong>
                    <span className="ftt-interior-more-action">View page <ArrowUpRight size={16} aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
