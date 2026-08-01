import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * Runs before every request. Use for auth checks, redirects, headers, etc.
 */
export function middleware(request: NextRequest) {
  // TODO: Add authentication checks
  // TODO: Add rate limiting headers
  // TODO: Add CORS configuration

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser icon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
