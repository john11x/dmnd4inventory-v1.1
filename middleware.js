import { NextResponse } from "next/server";

function parseUserCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith('user='));
  if (!match) return null;
  try {
    const val = decodeURIComponent(match.split('=')[1] || '');
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow next internals, static files, and api
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const cookie = request.headers.get('cookie') || '';
  const user = parseUserCookie(cookie);
  const role = user?.role;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!role) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    if (role !== 'ROLE_ADMIN') {
      // redirect non-admins to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect user-only routes
  if (pathname.startsWith('/user')) {
    if (!role) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    if (role !== 'ROLE_USER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If visiting login page but already authenticated, redirect to role home
  if (pathname === '/login') {
    if (role === 'ROLE_ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (role === 'ROLE_USER') return NextResponse.redirect(new URL('/user/home', request.url));
    // Allow access to auth page if not authenticated
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/login'],
};
