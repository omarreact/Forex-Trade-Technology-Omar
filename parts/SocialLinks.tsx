'use client';
import {usePathname} from 'next/navigation';
import {siteConfig} from '@/lib/site-data';

type SocialKind='whatsapp'|'telegram';

function SocialIcon({kind}:{kind:SocialKind}){
 if(kind==='whatsapp'){
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
   <path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.5Z"/>
   <path d="M9 8.3c-.3-.6-.6-.7-.9-.6-.7.3-1.2 1-1.1 1.9.2 2 3.2 5.3 5.9 6.1.8.2 1.7-.3 2-1 .2-.4.1-.6-.3-.8l-1.8-.9c-.2-.1-.4 0-.6.2l-.7.8a7.9 7.9 0 0 1-3.2-3.1l.8-.9c.2-.2.2-.4.1-.6Z"/>
  </svg>;
 }
 return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.8 3.4-4 17a.8.8 0 0 1-1.2.4l-5.2-4-2.7 2.4.4-4 9.3-8.3-11.2 7-4.4-1.4a.8.8 0 0 1-.1-1.5L20.6 2.7a.9.9 0 0 1 1.2.7Z"/></svg>;
}

/**
 * Until a verified direct-contact URL is configured, each button opens the
 * platform's official share composer for the current page. No invented handle.
 */
export function SocialLinks({location}:{location:'header'|'footer'}){
 const pathname=usePathname();
 const page=new URL(pathname||'/',siteConfig.site.url).toString();
 const links:[
  {kind:'whatsapp';href:string;label:string},
  {kind:'telegram';href:string;label:string}
 ]=[
  {kind:'whatsapp',href:process.env.NEXT_PUBLIC_FTT_WHATSAPP_URL||siteConfig.social.whatsapp||`https://api.whatsapp.com/send?text=${encodeURIComponent(page)}`,label:process.env.NEXT_PUBLIC_FTT_WHATSAPP_URL||siteConfig.social.whatsapp?'Chat on WhatsApp':'Share this page on WhatsApp'},
  {kind:'telegram',href:process.env.NEXT_PUBLIC_FTT_TELEGRAM_URL||siteConfig.social.telegram||`https://t.me/share/url?url=${encodeURIComponent(page)}&text=${encodeURIComponent(siteConfig.site.name)}`,label:process.env.NEXT_PUBLIC_FTT_TELEGRAM_URL||siteConfig.social.telegram?'Open Telegram':'Share this page on Telegram'}
 ];
 return <div className={`bs-social-links bs-social-links--${location}`} aria-label="Social channels">
   {links.map(link=><a key={link.kind} href={link.href} target="_blank" rel="noopener noreferrer" className={`bs-social-link bs-social-link--${link.kind}`} aria-label={link.label} title={link.label}><SocialIcon kind={link.kind}/></a>)}
 </div>;
}
