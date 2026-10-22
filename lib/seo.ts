export const siteOrigin = 'https://forextrade.pincodeit.com';
export const siteMetadataBase = new URL(`${siteOrigin}/`);

export function canonicalPath(route: string) {
  const path = route.trim().replace(/^\/+|\/+$/g, '');
  return path ? `/${path}` : '/';
}
