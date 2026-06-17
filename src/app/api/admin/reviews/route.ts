import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/reviews — list all reviews (with product info) for moderation
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "pending" | "approved" | "all"

  const where: Record<string, unknown> = {};
  if (status === "pending") where.isApproved = false;
  else if (status === "approved") where.isApproved = true;

  const reviews = await db.review.findMany({
    where,
    include: {
      product: {
        select: { id: true, name: true, slug: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ reviews });
}

// PATCH /api/admin/reviews — approve/reject (id + isApproved in body)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id, isApproved } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "معرف المراجعة مطلوب" }, { status: 400 });
  }

  const review = await db.review.update({
    where: { id },
    data: { isApproved: Boolean(isApproved) },
  });

  // Update product aggregate rating
  const productId = review.productId;
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

// DELETE /api/admin/reviews?id=...
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "معرف المراجعة مطلوب" }, { status: 400 });
  }

  const review = await db.review.findUnique({ where: { id }, select: { productId: true } });
  await db.review.delete({ where: { id } });

  // Recalculate product rating
  if (review) {
    const agg = await db.review.aggregate({
      where: { productId: review.productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    await db.product.update({
      where: { id: review.productId },
      data: {
        rating: agg._count > 0 ? Math.round((agg._avg.rating || 5) * 10) / 10 : 5,
        reviewCount: agg._count,
      },
    });
  }

  return NextResponse.json({ success: true });
}
