/**
 * GLIMOKA — Supabase-backed data access layer
 *
 * This module replaces the Prisma client with a Supabase-compatible API.
 * It provides a `db` object with the same shape used across the app
 * (db.product.findMany, db.order.create, etc.) but powered by Supabase.
 *
 * Tables use snake_case in Supabase; this layer handles camelCase mapping.
 */
import {
  supabaseAdmin,
  toCamelCase,
  toSnakeCase,
  selectOne,
  selectMany,
  insertRow,
  insertMany,
  updateRow,
  deleteRows,
  countRows,
  aggregate,
} from "@/lib/supabase/admin";

// ===== Helper: build query filters =====
function applyFilters(q: any, where: any, table: string): any {
  if (!where) return q;
  for (const [key, value] of Object.entries(where)) {
    const snakeKey = toSnakeCase(key);
    if (value === null) {
      q = q.is(snakeKey, null);
    } else if (typeof value === "object" && !Array.isArray(value) && value instanceof Date) {
      q = q.eq(snakeKey, value.toISOString());
    } else if (typeof value === "object" && !Array.isArray(value)) {
      // Prisma-style operators: { gte, lte, gt, lt, neq, in, contains }
      for (const [op, opVal] of Object.entries(value as any)) {
        if (op === "gte") q = q.gte(snakeKey, opVal);
        else if (op === "lte") q = q.lte(snakeKey, opVal);
        else if (op === "gt") q = q.gt(snakeKey, opVal);
        else if (op === "lt") q = q.lt(snakeKey, opVal);
        else if (op === "neq") q = q.neq(snakeKey, opVal);
        else if (op === "in") q = q.in(snakeKey, opVal);
        else if (op === "contains") {
          // ILIKE for case-insensitive contains
          q = q.ilike(snakeKey, `%${opVal}%`);
        }
      }
    } else {
      q = q.eq(snakeKey, value);
    }
  }
  return q;
}

// ===== db.product =====
export const productRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("products").select("*, category:categories(*), images:product_images(*)");
    if (opts.where) q = applyFilters(q, opts.where, "products");
    if (opts.orderBy) {
      for (const [col, dir] of Object.entries(opts.orderBy)) {
        q = q.order(toSnakeCase(col), { ascending: dir === "asc" });
      }
    } else {
      q = q.order("created_at", { ascending: false });
    }
    if (opts.take) q = q.limit(opts.take);
    if (opts.skip) q = q.range(opts.skip, opts.skip + (opts.take || 100) - 1);
    const { data, error } = await q;
    if (error) {
      console.error("[product.findMany]", error.message);
      return [];
    }
    return (data || []).map(toCamelCase);
  },

  async findUnique(opts: any) {
    let q = supabaseAdmin
      .from("products")
      .select("*, category:categories(*), images:product_images(*), reviews:reviews(*)");
    if (opts.where) q = applyFilters(q, opts.where, "products");
    q = q.single();
    const { data, error } = await q;
    if (error) return null;
    const product = toCamelCase(data);
    // Sort images by order
    if (product.images) {
      product.images.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    // Sort reviews by createdAt desc
    if (product.reviews) {
      product.reviews.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return product;
  },

  async create(opts: { data: any }) {
    const { data } = opts;
    const row = toSnakeCase({
      name: data.name,
      slug: data.slug,
      shortDesc: data.shortDesc,
      description: data.description,
      categoryId: data.categoryId,
      basePrice: data.basePrice,
      comparePrice: data.comparePrice || null,
      metalOptions: data.metalOptions,
      sizeOptions: data.sizeOptions,
      fontOptions: data.fontOptions,
      isPersonalizable: data.isPersonalizable ?? true,
      isFeatured: data.isFeatured ?? false,
      isBestSeller: data.isBestSeller ?? false,
      isNewArrival: data.isNewArrival ?? false,
      isOnSale: data.isOnSale ?? false,
      stock: data.stock ?? 50,
      rating: data.rating ?? 5.0,
      reviewCount: data.reviewCount ?? 0,
      soldCount: data.soldCount ?? 0,
      material: data.material || null,
      color: data.color || null,
      giftBoxPrice: data.giftBoxPrice ?? 50,
      giftCardPrice: data.giftCardPrice ?? 20,
    });
    const { data: created, error } = await supabaseAdmin
      .from("products")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error("[product.create]", error.message);
      throw new Error(error.message);
    }
    return toCamelCase(created);
  },

  async update(opts: { where: any; data: any }) {
    let q = supabaseAdmin.from("products").update(toSnakeCase(opts.data));
    q = applyFilters(q, opts.where, "products");
    const { data, error } = await q.select().single();
    if (error) {
      console.error("[product.update]", error.message);
      return null;
    }
    return toCamelCase(data);
  },

  async delete(opts: { where: any }) {
    return deleteRows("products", opts.where);
  },

  async count(opts: any = {}) {
    let q = supabaseAdmin.from("products").select("*", { count: "exact", head: true });
    if (opts.where) q = applyFilters(q, opts.where, "products");
    const { count } = await q;
    return count || 0;
  },

  async aggregate(opts: any) {
    // Supabase doesn't support server-side aggregate, so fetch + compute
    const rows = await aggregate("products", { ...opts, select: opts.select || "*" });
    // Compute _sum, _avg, _count
    const result: any = {};
    if (opts._sum) {
      result._sum = {};
      for (const col of Object.keys(opts._sum)) {
        result._sum[col] = rows.reduce((s, r) => s + (Number(r[col]) || 0), 0);
      }
    }
    if (opts._avg) {
      result._avg = {};
      for (const col of Object.keys(opts._avg)) {
        result._avg[col] = rows.length > 0 ? rows.reduce((s, r) => s + (Number(r[col]) || 0), 0) / rows.length : 0;
      }
    }
    if (opts._count !== undefined) {
      result._count = rows.length;
    }
    return result;
  },
};

// ===== db.category =====
export const categoryRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("categories").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "categories");
    q = q.order("order", { ascending: true });
    const { data, error } = await q;
    if (error) return [];
    return (data || []).map(toCamelCase);
  },
  async findUnique(opts: any) {
    return selectOne("categories", opts.where);
  },
  async create(opts: { data: any }) {
    return insertRow("categories", opts.data);
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("categories", opts.where, opts.data);
  },
  async delete(opts: { where: any }) {
    return deleteRows("categories", opts.where);
  },
};

// ===== db.productImage =====
export const productImageRepo = {
  async findMany(opts: any = {}) {
    return selectMany("product_images", {
      eq: opts.where,
      order: { column: "order", ascending: true },
    });
  },
  async create(opts: { data: any }) {
    return insertRow("product_images", opts.data);
  },
  async deleteMany(opts: { where: any }) {
    return deleteRows("product_images", opts.where);
  },
};

// ===== db.order =====
export const orderRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("orders").select("*, items:order_items(*)");
    if (opts.where) q = applyFilters(q, opts.where, "orders");
    if (opts.orderBy) {
      for (const [col, dir] of Object.entries(opts.orderBy)) {
        q = q.order(toSnakeCase(col), { ascending: dir === "asc" });
      }
    } else {
      q = q.order("created_at", { ascending: false });
    }
    if (opts.take) q = q.limit(opts.take);
    const { data, error } = await q;
    if (error) {
      console.error("[order.findMany]", error.message);
      return [];
    }
    return (data || []).map(toCamelCase);
  },
  async findUnique(opts: any) {
    let q = supabaseAdmin.from("orders").select("*, items:order_items(*)");
    q = applyFilters(q, opts.where, "orders");
    q = q.single();
    const { data, error } = await q;
    if (error) return null;
    return toCamelCase(data);
  },
  async create(opts: { data: any }) {
    const { items, ...orderData } = opts.data;
    const orderRow = toSnakeCase(orderData);
    const { data: created, error } = await supabaseAdmin
      .from("orders")
      .insert(orderRow)
      .select()
      .single();
    if (error) {
      console.error("[order.create]", error.message);
      throw new Error(error.message);
    }
    const order = toCamelCase(created);

    // Insert order items
    if (items && items.length > 0) {
      const itemRows = items.map((item: any) =>
        toSnakeCase({ ...item, orderId: order.id })
      );
      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(itemRows);
      if (itemsError) {
        console.error("[order.create items]", itemsError.message);
      }
      order.items = items;
    } else {
      order.items = [];
    }
    return order;
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("orders", opts.where, opts.data);
  },
  async count(opts: any = {}) {
    let q = supabaseAdmin.from("orders").select("*", { count: "exact", head: true });
    if (opts.where) q = applyFilters(q, opts.where, "orders");
    const { count } = await q;
    return count || 0;
  },
  async aggregate(opts: any) {
    let q = supabaseAdmin.from("orders").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "orders");
    const { data, error } = await q;
    if (error) return { _sum: { total: 0 }, _count: 0 };
    const rows = (data || []).map(toCamelCase);
    const result: any = {};
    if (opts._sum) {
      result._sum = {};
      for (const col of Object.keys(opts._sum)) {
        result._sum[col] = rows.reduce((s, r) => s + (Number(r[col]) || 0), 0);
      }
    }
    if (opts._count !== undefined) {
      result._count = rows.length;
    }
    return result;
  },
};

// ===== db.orderItem =====
export const orderItemRepo = {
  async findMany(opts: any = {}) {
    return selectMany("order_items", { eq: opts.where });
  },
  async aggregate(opts: any) {
    let q = supabaseAdmin.from("order_items").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "order_items");
    const { data, error } = await q;
    if (error) return { _sum: { quantity: 0, price: 0 } };
    const rows = (data || []).map(toCamelCase);
    const result: any = { _sum: {} };
    if (opts._sum) {
      for (const col of Object.keys(opts._sum)) {
        result._sum[col] = rows.reduce((s, r) => s + (Number(r[col]) || 0), 0);
      }
    }
    if (opts._count !== undefined) result._count = rows.length;
    return result;
  },
};

// ===== db.coupon =====
export const couponRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("coupons").select("*, usages:coupon_usages(count)");
    if (opts.where) q = applyFilters(q, opts.where, "coupons");
    q = q.order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) return [];
    return (data || []).map((c) => {
      const camel = toCamelCase(c);
      // Flatten usages count
      if (camel.usages && Array.isArray(camel.usages)) {
        camel.usages = { length: camel.usages.length };
        camel._count = { usages: camel.usages.length };
      } else if (camel.usages && typeof camel.usages === "object") {
        camel._count = { usages: (camel.usages as any).count || 0 };
      }
      return camel;
    });
  },
  async findUnique(opts: any) {
    const rows = await selectMany("coupons", {
      eq: opts.where,
      select: "*, usages:coupon_usages(count)",
    });
    if (rows.length === 0) return null;
    const c = rows[0] as any;
    if (c.usages && Array.isArray(c.usages)) {
      c._count = { usages: c.usages.length };
    }
    return c;
  },
  async create(opts: { data: any }) {
    return insertRow("coupons", opts.data);
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("coupons", opts.where, opts.data);
  },
  async delete(opts: { where: any }) {
    return deleteRows("coupons", opts.where);
  },
  async count(opts: any = {}) {
    return countRows("coupons", opts.where);
  },
};

// ===== db.couponUsage =====
export const couponUsageRepo = {
  async create(opts: { data: any }) {
    return insertRow("coupon_usages", opts.data);
  },
  async count(opts: any = {}) {
    return countRows("coupon_usages", opts.where);
  },
  async findMany(opts: any = {}) {
    return selectMany("coupon_usages", { eq: opts.where });
  },
};

// ===== db.review =====
export const reviewRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("reviews").select("*, product:products(id, name, slug)");
    if (opts.where) q = applyFilters(q, opts.where, "reviews");
    q = q.order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) return [];
    return (data || []).map(toCamelCase);
  },
  async create(opts: { data: any }) {
    return insertRow("reviews", opts.data);
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("reviews", opts.where, opts.data);
  },
  async delete(opts: { where: any }) {
    return deleteRows("reviews", opts.where);
  },
  async aggregate(opts: any) {
    let q = supabaseAdmin.from("reviews").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "reviews");
    const { data, error } = await q;
    if (error) return { _avg: { rating: 5 }, _count: 0 };
    const rows = (data || []).map(toCamelCase);
    const result: any = {};
    if (opts._avg) {
      result._avg = {};
      for (const col of Object.keys(opts._avg)) {
        result._avg[col] =
          rows.length > 0
            ? Math.round((rows.reduce((s, r) => s + (Number(r[col]) || 0), 0) / rows.length) * 10) / 10
            : 0;
      }
    }
    if (opts._count !== undefined) result._count = rows.length;
    return result;
  },
};

// ===== db.banner =====
export const bannerRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("banners").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "banners");
    q = q.order("order", { ascending: true });
    const { data, error } = await q;
    if (error) return [];
    return (data || []).map(toCamelCase);
  },
  async create(opts: { data: any }) {
    return insertRow("banners", opts.data);
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("banners", opts.where, opts.data);
  },
  async delete(opts: { where: any }) {
    return deleteRows("banners", opts.where);
  },
};

// ===== db.setting =====
export const settingRepo = {
  async findMany(opts: any = {}) {
    let q = supabaseAdmin.from("settings").select("*");
    if (opts.where) q = applyFilters(q, opts.where, "settings");
    const { data, error } = await q;
    if (error) return [];
    return (data || []).map(toCamelCase);
  },
  async upsert(opts: { where: any; create: any; update?: any }) {
    // Check if exists
    const existing = await selectOne("settings", opts.where);
    if (existing) {
      return updateRow("settings", opts.where, opts.update || opts.create);
    }
    return insertRow("settings", { ...opts.create, ...opts.where });
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("settings", opts.where, opts.data);
  },
  async delete(opts: { where: any }) {
    return deleteRows("settings", opts.where);
  },
};

// ===== db.user =====
export const userRepo = {
  async findUnique(opts: any) {
    return selectOne("users", opts.where);
  },
  async findMany(opts: any = {}) {
    return selectMany("users", { eq: opts.where });
  },
  async upsert(opts: { where: any; update?: any; create: any }) {
    const existing = await selectOne("users", opts.where);
    if (existing) {
      return existing;
    }
    return insertRow("users", opts.create);
  },
  async update(opts: { where: any; data: any }) {
    return updateRow("users", opts.where, opts.data);
  },
  async count(opts: any = {}) {
    return countRows("users", opts.where);
  },
  async aggregate(opts: any) {
    const rows = await aggregate("users", { ...opts, select: opts.select || "*" });
    const result: any = {};
    if (opts._sum) {
      result._sum = {};
      for (const col of Object.keys(opts._sum)) {
        result._sum[col] = rows.reduce((s, r) => s + (Number(r[col]) || 0), 0);
      }
    }
    if (opts._count !== undefined) result._count = rows.length;
    return result;
  },
};

// ===== Export unified db object (mimics Prisma client API) =====
export const db = {
  product: productRepo,
  category: categoryRepo,
  productImage: productImageRepo,
  order: orderRepo,
  orderItem: orderItemRepo,
  coupon: couponRepo,
  couponUsage: couponUsageRepo,
  review: reviewRepo,
  banner: bannerRepo,
  setting: settingRepo,
  user: userRepo,
  // Raw access for advanced queries
  raw: supabaseAdmin,
};

export { supabaseAdmin };
