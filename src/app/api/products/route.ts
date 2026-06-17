import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // slug
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");
  const newArrival = searchParams.get("newArrival");
  const onSale = searchParams.get("onSale");
  const search = searchParams.get("q");
  const sort = searchParams.get("sort") || "newest";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 100000);
  const metal = searchParams.get("metal");
  const limit = Number(searchParams.get("limit") || 100);

  const where: Record<string, unknown> = {};

  if (category && category !== "all") {
    const cat = await db.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (featured === "true") where.isFeatured = true;
  if (bestSeller === "true") where.isBestSeller = true;
  if (newArrival === "true") where.isNewArrival = true;
  if (onSale === "true") where.isOnSale = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDesc: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (minPrice > 0 || maxPrice < 100000) {
    where.basePrice = { gte: minPrice, lte: maxPrice };
  }
  if (metal) where.metal = metal;

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePrice: "asc" };
  else if (sort === "price-desc") orderBy = { basePrice: "desc" };
  else if (sort === "best-selling") orderBy = { soldCount: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };

  const products = await db.product.findMany({
    where,
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
    orderBy,
    take: limit,
  });

  return NextResponse.json({ products });
}
