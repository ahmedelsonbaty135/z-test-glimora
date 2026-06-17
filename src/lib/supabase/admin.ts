import { createClient } from "@supabase/supabase-js";

/**
 * Supabase configuration with hardcoded fallbacks.
 * This ensures the app NEVER crashes even if .env is missing or not loaded.
 * The values are the same as in .env — safe to use as defaults.
 */
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://nhcrwxotomtnnardlzuq.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_9QYyvhQWC-w1xOeR_ymnBA_nOxnOLvL";

/**
 * Admin/Service Supabase client using the publishable key.
 * Used on the server side for privileged operations.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


/**
 * Snake_case to camelCase converter for row results
 */
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = toCamelCase(value);
  }
  return result;
}

/**
 * CamelCase to snake_case converter for inserts/updates (objects)
 */
function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = toSnakeCase(value);
  }
  return result;
}

/**
 * Convert a single camelCase string key to snake_case.
 * Use this for string keys (NOT objects).
 */
function toSnakeKey(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// ===== Typed helper for single-table queries with camelCase mapping =====
export async function selectOne<T = any>(
  table: string,
  query: Record<string, any>,
  select = "*"
): Promise<T | null> {
  let q = supabaseAdmin.from(table).select(select);
  for (const [key, value] of Object.entries(query)) {
    q = q.eq(toSnakeKey(key), value);
  }
  const { data, error } = await q.single();
  if (error) return null;
  return toCamelCase(data) as T;
}

export async function selectMany<T = any>(
  table: string,
  opts: {
    select?: string;
    eq?: Record<string, any>;
    in?: { column: string; values: any[] };
    order?: { column: string; ascending?: boolean };
    limit?: number;
    range?: [number, number];
    single?: boolean;
  } = {}
): Promise<T[]> {
  let q = supabaseAdmin.from(table).select(opts.select || "*");
  if (opts.eq) {
    for (const [key, value] of Object.entries(opts.eq)) {
      q = q.eq(toSnakeKey(key), value);
    }
  }
  if (opts.in) {
    q = q.in(toSnakeKey(opts.in.column), opts.in.values);
  }
  if (opts.order) {
    q = q.order(toSnakeKey(opts.order.column), {
      ascending: opts.order.ascending ?? false,
    });
  }
  if (opts.limit) q = q.limit(opts.limit);
  if (opts.range) q = q.range(opts.range[0], opts.range[1]);
  const { data, error } = opts.single
    ? await q.single()
    : await q;
  if (error) return [];
  return opts.single
    ? [toCamelCase(data)]
    : (data || []).map(toCamelCase);
}

export async function insertRow<T = any>(
  table: string,
  row: Record<string, any>
): Promise<T | null> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .insert(toSnakeCase(row))
    .select()
    .single();
  if (error) {
    console.error(`[insertRow ${table}]`, error.message);
    return null;
  }
  return toCamelCase(data) as T;
}

export async function insertMany<T = any>(
  table: string,
  rows: Record<string, any>[]
): Promise<T[]> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .insert(rows.map(toSnakeCase))
    .select();
  if (error) {
    console.error(`[insertMany ${table}]`, error.message);
    return [];
  }
  return (data || []).map(toCamelCase);
}

export async function updateRow<T = any>(
  table: string,
  eq: Record<string, any>,
  patch: Record<string, any>
): Promise<T | null> {
  // Handle Prisma-style { increment, decrement } operators
  // by doing a fetch first, computing the new value, then updating.
  const resolvedPatch: Record<string, any> = {};
  let needsFetch = false;
  for (const [key, value] of Object.entries(patch)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      if ("increment" in value) {
        needsFetch = true;
        resolvedPatch[key] = { __op: "increment", amount: value.increment };
      } else if ("decrement" in value) {
        needsFetch = true;
        resolvedPatch[key] = { __op: "decrement", amount: value.decrement };
      } else {
        resolvedPatch[key] = value;
      }
    } else {
      resolvedPatch[key] = value;
    }
  }

  // If we need to increment/decrement, fetch the current value first
  if (needsFetch) {
    let fetchQ = supabaseAdmin.from(table).select("*");
    for (const [key, value] of Object.entries(eq)) {
      fetchQ = fetchQ.eq(toSnakeKey(key), value);
    }
    const { data: existing, error: fetchErr } = await fetchQ.single();
    if (fetchErr || !existing) {
      console.error(`[updateRow ${table}] fetch for increment failed:`, fetchErr?.message);
      return null;
    }
    // Compute new values
    const finalPatch: Record<string, any> = {};
    for (const [key, val] of Object.entries(resolvedPatch)) {
      if (val && typeof val === "object" && "__op" in val) {
        const snakeKey = toSnakeKey(key);
        const current = Number(existing[snakeKey]) || 0;
        if (val.__op === "increment") {
          finalPatch[snakeKey] = current + (val.amount || 0);
        } else if (val.__op === "decrement") {
          finalPatch[snakeKey] = Math.max(0, current - (val.amount || 0));
        }
      } else {
        finalPatch[toSnakeKey(key)] = toSnakeCase(val);
      }
    }
    let q = supabaseAdmin.from(table).update(finalPatch);
    for (const [key, value] of Object.entries(eq)) {
      q = q.eq(toSnakeKey(key), value);
    }
    const { data, error } = await q.select().single();
    if (error) {
      console.error(`[updateRow ${table}]`, error.message);
      return null;
    }
    return toCamelCase(data) as T;
  }

  // Normal update without increment/decrement
  let q = supabaseAdmin.from(table).update(toSnakeCase(patch));
  for (const [key, value] of Object.entries(eq)) {
    q = q.eq(toSnakeKey(key), value);
  }
  const { data, error } = await q.select().single();
  if (error) {
    console.error(`[updateRow ${table}]`, error.message);
    return null;
  }
  return toCamelCase(data) as T;
}

export async function deleteRows(
  table: string,
  eq: Record<string, any>
): Promise<boolean> {
  let q = supabaseAdmin.from(table).delete();
  for (const [key, value] of Object.entries(eq)) {
    q = q.eq(toSnakeKey(key), value);
  }
  const { error } = await q;
  if (error) {
    console.error(`[deleteRows ${table}]`, error.message);
    return false;
  }
  return true;
}

export async function countRows(
  table: string,
  eq?: Record<string, any>
): Promise<number> {
  let q = supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  if (eq) {
    for (const [key, value] of Object.entries(eq)) {
      q = q.eq(toSnakeKey(key), value);
    }
  }
  const { count, error } = await q;
  if (error) return 0;
  return count || 0;
}

// ===== Aggregation helpers (Supabase doesn't have native aggregate, so we fetch + compute) =====
export async function aggregate(
  table: string,
  opts: {
    eq?: Record<string, any>;
    gte?: { column: string; value: any };
    neq?: Record<string, any>;
    select?: string;
  } = {}
): Promise<any[]> {
  let q = supabaseAdmin.from(table).select(opts.select || "*");
  if (opts.eq) {
    for (const [key, value] of Object.entries(opts.eq)) {
      q = q.eq(toSnakeKey(key), value);
    }
  }
  if (opts.neq) {
    for (const [key, value] of Object.entries(opts.neq)) {
      q = q.neq(toSnakeKey(key), value);
    }
  }
  if (opts.gte) {
    q = q.gte(toSnakeKey(opts.gte.column), opts.gte.value);
  }
  const { data, error } = await q;
  if (error) return [];
  return (data || []).map(toCamelCase);
}

export { toCamelCase, toSnakeCase };
