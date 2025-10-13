import createMiddleware from 'next-intl/middleware';
import { routing } from '../src/i18n/routing';
import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';

const supportedLocales = ['en', 'sk'];
const defaultLocale = 'en';

// Create the base i18n middleware
const intlMiddleware = createMiddleware(routing);

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return (
      languages.find((lang: string) =>
        supportedLocales.includes(lang.split('-')[0])
      ) || defaultLocale
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If no locale prefix (e.g. just "/"), redirect based on language
  if (pathname === '/' || pathname === '') {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api, /trpc, /_next, /_vercel
    // - and files like favicon.ico
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ],
};