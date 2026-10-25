import type {Metadata,Viewport} from 'next';
import {siteConfig,themeConfig,absoluteUrl} from '@/lib/site-data';
import {SiteHeader} from '@/components/new-theme/SiteHeader';
import {SiteFooter} from '@/components/new-theme/SiteFooter';
import {ScrollToTop} from '@/components/new-theme/ScrollToTop';
import './new-theme.css';
import './trust-carousel.css';
import './icon-box-carousel.css';
import './flex-layout.css';
import './media-title-bands.css';
import './editorial-story.css';
import './clean-reference.css';
import './responsive-polish.css';
import './faq-polish.css';
import './global-cta-footer.css';
import './component-system.css';

export const metadata:Metadata={
 metadataBase:new URL(absoluteUrl('/')),
 title:{default:siteConfig.site.name,template:`%s | ${siteConfig.site.name}`},
 description:siteConfig.site.tagline,
 openGraph:{type:'website',siteName:siteConfig.site.name},
 robots:{index:true,follow:true}
};
export const viewport:Viewport={width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang={siteConfig.site.locale}><body style={themeConfig.cssVariables as unknown as React.CSSProperties}><a href="#main-content" className="bs-skip-link">Skip to main content</a><SiteHeader/>{children}<SiteFooter/><ScrollToTop/></body></html>;
}
