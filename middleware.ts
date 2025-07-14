import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country');

  // Allow only users from Israel
  if (country !== 'IL') {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
}; 