import type {NextConfig} from 'next';
import site from './content/site.config.json';
const paths=site.routing.paths;
const aliases:Record<string,string>={
 '/brokerage-setup':paths['brokerage-setup'], '/mt5-white-label':paths['mt5-white-label'],
 '/hosting':paths.hosting,'/liquidity':paths.liquidity,'/crm':paths.crm,
 '/kyc-aml':paths['kyc-aml'],'/payments':paths.payments,
 '/prop-firm':paths['prop-firm'],'/about':paths.about,
};
const isGitHubPages=process.env.GITHUB_PAGES_EXPORT==='true';
const nextConfig:NextConfig={
 reactStrictMode:true,
 trailingSlash:isGitHubPages,
 ...(isGitHubPages?{output:'export' as const,basePath:'/Forex-Trade-Technology-Omar'}:{}),
 images:{unoptimized:isGitHubPages,remotePatterns:[{protocol:'https',hostname:'images.pexels.com'},{protocol:'https',hostname:'images.unsplash.com'}]},
 ...(!isGitHubPages?{async redirects(){return Object.entries(aliases).filter(([from,to])=>from!==to).map(([source,destination])=>({source,destination,permanent:true}));}}:{}),
};
export default nextConfig;
