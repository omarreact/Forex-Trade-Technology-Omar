import {NextRequest,NextResponse} from 'next/server';
export function middleware(request:NextRequest){
 const response=NextResponse.next();
 if(/^\/design-[1-6](\/|$)/.test(request.nextUrl.pathname))response.headers.set('X-Robots-Tag','noindex');
 return response;
}
export const config={matcher:['/design-:path*']};
