import { NextRequest, NextResponse } from "next/server";

/**
 * GLIMOKA — Security Middleware
 *
 * Adds security headers to all responses:
 * - Content-Security-Policy: Prevents XSS, clickjacking, injection
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Restricts browser features
 * - X-DNS-Prefetch-Control: Disables DNS prefetching
 */
export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Content Security Policy
  // Allows: self, inline styles/scripts (Next.js needs these), images from data + https, fonts from Google
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://nhcrwxotomtnnardlzuq.supabase.co",
    "media-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  // HSTS — force HTTPS for 1 year
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  return res;
}

export const config = {
  // Apply to all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"],
};
