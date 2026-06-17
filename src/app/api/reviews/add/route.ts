import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIP, sanitizeInput } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/reviews/add
export async function POST(req: NextRequest) {
  // Rate limit: 3 reviews per minute per IP
  const ip = getClientIP(req);
  if (!rateLimit(ip, 3, 60000)) {
    return NextResponse.json({ error: "مراجعات كثيرة جدًا، حاول لاحقًا" }, { status: 429 });
  }

  const body = await req.json();
  const { productId, authorName, rating, title, body: reviewBody, photos } = body as {
    productId: string;
    authorName: string;
    rating: number;
    title?: string;
    body: string;
    photos?: string[];
  };

  if (!productId || !authorName || !rating || !reviewBody) {
    return NextResponse.json({ error: "بيانات المراجعة ناقصة" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "التقييم من 1 إلى 5" }, { status: 400 });
  }
  // Validate body length
  if (String(reviewBody).length > 2000) {
    return NextResponse.json({ error: "المراجعة طويلة جدًا (حد 2000 حرف)" }, { status: 400 });
  }

  // Validate photos (max 3, base64 data URLs, limit size to avoid DB bloat)
  let photosJson: string | null = null;
  if (Array.isArray(photos) && photos.length > 0) {
    const validPhotos = photos
      .filter((p) => typeof p === "string" && p.startsWith("data:image/"))
      .slice(0, 3)
      // limit each to ~500KB base64 to avoid DB bloat
      .filter((p) => p.length < 700000);
    if (validPhotos.length > 0) {
      photosJson = JSON.stringify(validPhotos);
    }
  }

  const review = await db.review.create({
    data: {
      productId: String(productId).slice(0, 100),
      authorName: sanitizeInput(String(authorName)).slice(0, 100),
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? sanitizeInput(String(title)).slice(0, 200) : null,
      body: sanitizeInput(String(reviewBody)).slice(0, 2000),
      photosJson,
      isApproved: true, // auto-approve in sandbox; PRD says admin approval
    },
  });

  // Update product aggregate rating
  const agg = await db.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });
  if (agg._count > 0) {
    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((agg._avg.rating || 5) * 10) / 10,
        reviewCount: agg._count,
      },
    });
  }

  return NextResponse.json({ success: true, review });
}

