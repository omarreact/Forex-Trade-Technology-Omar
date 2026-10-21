import {NextRequest,NextResponse} from 'next/server';
export function middleware(request:NextRequest){
  const response=NextResponse.next();
  const design=request.nextUrl.searchParams.get('design');
  if(request.nextUrl.pathname.startsWith('/showroom') || request.nextUrl.searchParams.get('embed')==='1' || (design && design!=='original')){
    response.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
  }
  return response;
}
export const config={matcher:['/((?!api|_next/static|_next/image|favicon.ico|theme-assets|assets).*)']};
