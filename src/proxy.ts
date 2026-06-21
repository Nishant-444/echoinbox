import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: ['/sign-in', '/sign-up', '/dashboard/:path*', '/', '/verify/:path*'],
};

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // comment if want to seee the dashboard page without login
  // if (!token && url.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }

  return NextResponse.next();
}
