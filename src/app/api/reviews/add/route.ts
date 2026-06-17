import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/reviews/add
export async function POST(req: NextRequest) {
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
      productId,
      authorName,
      rating,
      title: title || null,
      body: reviewBody,
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

