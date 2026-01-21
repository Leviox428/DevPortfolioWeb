import createMiddleware from 'next-intl/middleware';
import { routing } from '../src/i18n/routing';
import { verifyRequest } from './lib/verifyRequest';
import { NextRequest } from 'next/server';

// Create the base i18n middleware
const i18nMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Only apply JWT/origin check to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const { authorized, response } = await verifyRequest(request);
    return response;
  }

  // Apply i18n middleware for all other routes
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)'
  ],
};
