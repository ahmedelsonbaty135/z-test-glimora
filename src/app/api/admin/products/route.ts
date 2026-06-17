import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, sanitizeInput, rateLimit, getClientIP } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/products — list all products for admin management
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

// POST /api/admin/products — create a new product
export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIP(req);
  if (!rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: "طلبات كثيرة جدًا، حاول لاحقًا" }, { status: 429 });
  }

  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const {
    name, slug, shortDesc, description, categoryId,
    basePrice, comparePrice, metalOptions, sizeOptions, fontOptions,
    isPersonalizable, isFeatured, isBestSeller, isNewArrival, isOnSale,
    stock, material, color, imageUrl,
  } = body;

  if (!name || !slug || !categoryId || !basePrice) {
    return NextResponse.json({ error: "بيانات المنتج ناقصة" }, { status: 400 });
  }

  // Sanitize string inputs
  const cleanName = sanitizeInput(String(name)).slice(0, 200);
  const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 200);
  const cleanShortDesc = sanitizeInput(String(shortDesc || "")).slice(0, 300);
  const cleanDescription = sanitizeInput(String(description || "")).slice(0, 5000);

  // Check slug uniqueness
  const existing = await db.product.findUnique({ where: { slug: cleanSlug } });
  if (existing) {
    return NextResponse.json({ error: "الـ slug مستخدم بالفعل" }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      name: cleanName,
      slug: cleanSlug,
      shortDesc: cleanShortDesc,
      description: cleanDescription,
      categoryId: String(categoryId),
      basePrice: Math.max(0, Number(basePrice) || 0),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      metalOptions: String(metalOptions || "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM").slice(0, 500),
      sizeOptions: String(sizeOptions || "16,17,18,19,20").slice(0, 500),
      fontOptions: String(fontOptions || "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز").slice(0, 500),
      isPersonalizable: isPersonalizable !== false,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      isOnSale: Boolean(isOnSale),
      stock: Math.max(0, Number(stock) || 0),
      material: material ? String(material).slice(0, 50) : "silver",
      color: color ? String(color).slice(0, 50) : null,
    },
  });

  // Add image if provided
  if (imageUrl) {
    await db.productImage.create({
      data: {
        productId: product.id,
        url: String(imageUrl).slice(0, 500),
        alt: cleanName,
        order: 0,
      },
    });
  }

  return NextResponse.json({ success: true, product });
}

// PATCH /api/admin/products — update a product (id in body)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  const allowed = [
    "name", "shortDesc", "description", "basePrice", "comparePrice",
    "metalOptions", "sizeOptions", "fontOptions", "isPersonalizable",
    "isFeatured", "isBestSeller", "isNewArrival", "isOnSale",
    "stock", "material", "color",
  ];
  for (const key of allowed) {
    if (key in updates) {
      if (["basePrice", "comparePrice", "stock"].includes(key)) {
        data[key] = updates[key] !== null ? Math.max(0, Number(updates[key]) || 0) : null;
      } else if (["isPersonalizable", "isFeatured", "isBestSeller", "isNewArrival", "isOnSale"].includes(key)) {
        data[key] = Boolean(updates[key]);
      } else if (typeof updates[key] === "string") {
        // Sanitize string inputs
        const maxLen = key === "description" ? 5000 : key === "shortDesc" ? 300 : 500;
        data[key] = sanitizeInput(updates[key]).slice(0, maxLen);
      } else {
        data[key] = updates[key];
      }
    }
  }

  const product = await db.product.update({ where: { id }, data });

  return NextResponse.json({ success: true, product });
}

// DELETE /api/admin/products — delete a product (id in query)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
  }

  // Delete related images first
  await db.productImage.deleteMany({ where: { productId: id } });
  await db.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
