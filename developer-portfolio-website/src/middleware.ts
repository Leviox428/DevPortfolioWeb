import createMiddleware from 'next-intl/middleware';
import { routing } from '../src/i18n/routing';

// Create the base i18n middleware
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api, /trpc, /_next, /_vercel
    // - and files like favicon.ico
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ],
};