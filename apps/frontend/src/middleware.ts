import { NextRequest, NextResponse } from 'next/server';
import { env } from './lib/env';

// List of supported locales
const locales = env.supportedLocales;
const defaultLocale = env.defaultLocale;

// Get the preferred locale from request headers
function getLocale(request: NextRequest) {
  // Check if there is a cookie with a preferred locale
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Check the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const parsedLocales = acceptLanguage.split(',').map(l => {
      const parts = l.split(';');
      return parts[0] ? parts[0].trim() : '';
    });
    const matchedLocale = parsedLocales.find(l => locales.includes(l));
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  // Fall back to default locale
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Skip middleware for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/locales') ||
    request.nextUrl.pathname.startsWith('/fonts') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Set the language cookie based on user preference
  const locale = getLocale(request);
  const response = NextResponse.next();
  
  // Set cookie if it doesn't exist or is different
  const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (currentCookie !== locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static)
    '/((?!api|_next|static|.*\\..*).*)',
  ],
};