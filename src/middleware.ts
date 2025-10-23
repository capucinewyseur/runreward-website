import { NextResponse } from 'next/server';

export function middleware() {
  // Headers de sécurité
  const response = NextResponse.next();
  
  // Protection contre le clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Protection contre le sniffing de type MIME
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Protection XSS
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Politique de sécurité du contenu (CSP)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
  );
  
  // Politique de référent
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};