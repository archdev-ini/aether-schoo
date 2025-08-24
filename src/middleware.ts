
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminIds = (process.env.ADMIN_AETHER_IDS || '').split(',');
  const userId = request.cookies.get('aether_user_id')?.value;

  // If the user is trying to access an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // And they are not an admin (or not logged in)
    if (!userId || !adminIds.includes(userId)) {
      // Redirect them to the login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
