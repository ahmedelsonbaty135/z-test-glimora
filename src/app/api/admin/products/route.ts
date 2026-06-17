import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/admin/products — list all products for admin management
export async function GET() {
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

// POST /api/admin/products — create a new product
export async function POST(req: NextRequest) {
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

  // Check slug uniqueness
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "الـ slug مستخدم بالفعل" }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      shortDesc: shortDesc || "",
      description: description || "",
      categoryId,
      basePrice: Number(basePrice),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      metalOptions: metalOptions || "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM",
      sizeOptions: sizeOptions || "16,17,18,19,20",
      fontOptions: fontOptions || "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
      isPersonalizable: isPersonalizable !== false,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      isOnSale: Boolean(isOnSale),
      stock: Number(stock) || 50,
      material: material || "silver",
      color: color || null,
      images: imageUrl
        ? { create: [{ url: imageUrl, alt: name, order: 0 }] }
        : undefined,
    },
    include: { images: true, category: true },
  });

  return NextResponse.json({ success: true, product });
}

// PATCH /api/admin/products — update a product (id in body)
export async function PATCH(req: NextRequest) {
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
        data[key] = updates[key] !== null ? Number(updates[key]) : null;
      } else if (["isPersonalizable", "isFeatured", "isBestSeller", "isNewArrival", "isOnSale"].includes(key)) {
        data[key] = Boolean(updates[key]);
      } else {
        data[key] = updates[key];
      }
    }
  }

  const product = await db.product.update({
    where: { id },
    data,
    include: { images: true, category: true },
  });

  return NextResponse.json({ success: true, product });
}

// DELETE /api/admin/products — delete a product (id in query)
export async function DELETE(req: NextRequest) {
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
