import { locales } from "./lib/i18n";
import { updateSession } from '@/utils/supabase/middleware'


import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('^^^^^^^^^^^^^^^^^^^^^my pathname = ', pathname)
  
  const isExit = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (isExit) {
    return await updateSession(request)
  }

  // if (pathname === '/auth/callback') {
  //   console.log('call /auth/callback')
  //   return;
  // }

  // request.nextUrl.pathname = `/`;
  // return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|terms|.*\\.(?:txt|xml|ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf|eot)).*)'
  ]
};