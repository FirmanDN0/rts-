import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that require authentication
  const isDashboardPath = path.startsWith('/admin/dashboard');
  const isLoginPath = path === '/admin';

  // Get token from cookies
  const token = request.cookies.get('rts_auth_token')?.value;

  if (isDashboardPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('rts_auth_token');
      return response;
    }
  }

  if (isLoginPath && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
