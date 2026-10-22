import type {NextConfig} from 'next';
import site from './site-data/site.config.json';
import pages from './site-data/pages.content.json';
const paths = new Map(pages.pages.map(page => [page.id,page.slug]));
const redirects = site.pages
 .filter(item => paths.has(item.id) && paths.get(item.id)!==item.slug)
 .map(item=>({source:item.slug,destination:paths.get(item.id)!,permanent:true}));
const nextConfig:NextConfig={
 reactStrictMode:true,
 images:{remotePatterns:[{protocol:'https',hostname:'images.pexels.com'},{protocol:'https',hostname:'images.unsplash.com'}]},
 async redirects(){return redirects;},
};
export default nextConfig;
