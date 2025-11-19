import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Web3 wallet authentication is handled client-side via wagmi/RainbowKit.
  // Server middleware cannot access client-side wallet state.
  //
  // Authentication flow:
  // 1. User navigates to protected route
  // 2. Client-side layout checks wallet connection via useAccount()
  // 3. If not connected, user is prompted to connect wallet
  // 4. Once connected, user has access to authenticated features
  //
  // This middleware passes through all requests, as the actual auth
  // check happens in the (authenticated) layout component.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portfolio/:path*',
    '/staking/:path*',
    '/governance/:path*',
    '/defi/:path*',
    '/transactions/:path*',
    '/profile/:path*',
  ],
};
