const productionOrigin = 'https://forextrade.pincodeit.com';

function resolveSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return productionOrigin;

  try {
    const url = new URL(configured);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.origin;
  } catch {
    // Fall back to the verified public hostname when the optional value is malformed.
  }

  return productionOrigin;
}

export const siteOrigin = resolveSiteOrigin();
export const siteMetadataBase = new URL(`${siteOrigin}/`);

export function canonicalPath(route: string) {
  const path = route.trim().replace(/^\/+|\/+$/g, '');
  return path ? `/${path}` : '/';
}
