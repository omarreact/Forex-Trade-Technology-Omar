import type {Metadata,Viewport} from 'next';
import '@/theme/styles/index.css';
import {siteConfig,absoluteUrl} from '@/content';
import {bodyThemeStyle} from '@/theme/css-variables';
import {SiteHeader} from '@/parts/SiteHeader';
import {SiteFooter} from '@/parts/SiteFooter';
import {ScrollToTop} from '@/parts/ScrollToTop';
import {ReviewFeedback} from '@/parts/ReviewFeedback';

export const metadata:Metadata={
 metadataBase:new URL(absoluteUrl('/')),
 title:{default:siteConfig.site.name,template:`%s | ${siteConfig.site.name}`},
 description:siteConfig.site.tagline,
 openGraph:{type:'website',siteName:siteConfig.site.name},
 robots:{index:true,follow:true}
};
export const viewport:Viewport={width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang={siteConfig.site.locale}><body style={bodyThemeStyle}><a href="#main-content" className="bs-skip-link">Skip to main content</a><SiteHeader/>{children}<SiteFooter/><ScrollToTop/><ReviewFeedback/></body></html>;
}
