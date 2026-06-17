import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GLIMOKA — Authentication & Authorization
 *
 * Admin access is controlled via:
 * 1. A secret access code stored in the `settings` table (key: adminAccessCode)
 * 2. The code is sent via header `x-admin-code` on every admin API request
 * 3. The code is NOT exposed in the client bundle — only entered in the hidden admin page
 *
 * The admin page URL is also not linked anywhere public — users must know the direct path.
 */

const ADMIN_CODE_HEADER = "x-admin-code";
const DEFAULT_ADMIN_CODE = "glimoka-admin-2024";

// Cache the admin code for 60 seconds to avoid DB hit on every request
let cachedAdminCode: { value: string | null; expires: number } = {
  value: null,
  expires: 0,
};

async function getAdminCode(): Promise<string> {
  const now = Date.now();
  if (cachedAdminCode.expires > now && cachedAdminCode.value !== null) {
    return cachedAdminCode.value;
  }
  try {
    const settings = await db.setting.findMany();
    const adminSetting = settings.find((s: any) => s.key === "adminAccessCode");
    cachedAdminCode = {
      value: adminSetting?.value || DEFAULT_ADMIN_CODE,
      expires: now + 60000,
    };
  } catch (e) {
    // If DB fails, use default code
    cachedAdminCode = {
      value: DEFAULT_ADMIN_CODE,
      expires: now + 60000,
    };
  }
  return cachedAdminCode.value;
}


/**
 * Verify admin access from request headers.
 * Returns { error: null } if authorized, { error: string } if not.
 */
export async function requireAdmin(req: NextRequest): Promise<{ error: string | null }> {
  const providedCode = req.headers.get(ADMIN_CODE_HEADER);
  if (!providedCode) {
    return { error: "كود الأدمن مطلوب" };
  }
  const adminCode = await getAdminCode();
  if (!adminCode || providedCode !== adminCode) {
    return { error: "كود الأدمن غير صحيح" };
  }
  return { error: null };
}

/**
 * Rate limiting — simple in-memory counter per IP.
 * Blocks after `maxRequests` in `windowMs`.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  if (entry.count > maxRequests) {
    return false; // rate limited
  }
  return true;
}

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

/**
 * Sanitize string input to prevent XSS.
 * Strips HTML tags and dangerous characters.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate Egyptian phone number (01XXXXXXXXX)
 */
export function isValidEgyptianPhone(phone: string): boolean {
  return /^01[0-2,5][0-9]{8}$/.test(phone.replace(/\s/g, ""));
}
