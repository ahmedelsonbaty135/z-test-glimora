import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client (uses publishable/anon key)
 * Safe to use in client components.
 * Has hardcoded fallbacks so it never crashes.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://nhcrwxotomtnnardlzuq.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_9QYyvhQWC-w1xOeR_ymnBA_nOxnOLvL"
  );
}
