/**
 * GLIMOKA — Admin API Client
 *
 * All admin API calls go through this helper.
 * It automatically attaches the admin access code header.
 * The code is stored in sessionStorage (not localStorage) for security —
 * it's cleared when the browser is closed.
 */

const ADMIN_CODE_KEY = "glimoka_admin_code";
const ADMIN_CODE_HEADER = "x-admin-code";

export function getAdminCode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_CODE_KEY);
}

export function setAdminCode(code: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_CODE_KEY, code);
}

export function clearAdminCode(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_CODE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAdminCode();
}

/**
 * Admin fetch wrapper — automatically adds the admin code header.
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const code = getAdminCode();
  const headers = new Headers(options.headers);
  if (code) {
    headers.set(ADMIN_CODE_HEADER, code);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...options, headers });
  // If unauthorized, clear the code (it's invalid)
  if (res.status === 401) {
    clearAdminCode();
  }
  return res;
}

/**
 * Verify admin code against the server.
 * Returns true if valid, false otherwise.
 */
export async function verifyAdminCode(code: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [ADMIN_CODE_HEADER]: code,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
