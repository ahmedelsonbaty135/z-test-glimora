import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/coupons — list all coupons
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ coupons });
}

// POST /api/admin/coupons — create a new coupon
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const {
    code, type, value, minOrder, maxDiscount, usageLimit, perCustomerLimit,
    startsAt, endsAt, isActive,
  } = body;

  if (!code || !type || !startsAt) {
    return NextResponse.json({ error: "بيانات الكوبون ناقصة" }, { status: 400 });
  }

  const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "كود الكوبون موجود بالفعل" }, { status: 400 });
  }

  const coupon = await db.coupon.create({
    data: {
      code: code.toUpperCase(),
      type,
      value: Number(value) || 0,
      minOrder: Number(minOrder) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perCustomerLimit: perCustomerLimit ? Number(perCustomerLimit) : null,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      isActive: isActive !== false,
    },
  });

  return NextResponse.json({ success: true, coupon });
}

// PATCH /api/admin/coupons — update a coupon (id in body)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "معرف الكوبون مطلوب" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  const allowed = ["type", "value", "minOrder", "maxDiscount", "usageLimit", "perCustomerLimit", "isActive"];
  for (const key of allowed) {
    if (key in updates) {
      if (["value", "minOrder", "maxDiscount", "usageLimit", "perCustomerLimit"].includes(key)) {
        data[key] = updates[key] !== null ? Number(updates[key]) : null;
      } else if (key === "isActive") {
        data[key] = Boolean(updates[key]);
      } else {
        data[key] = updates[key];
      }
    }
  }
  if (updates.startsAt) data.startsAt = new Date(updates.startsAt);
  if (updates.endsAt !== undefined) data.endsAt = updates.endsAt ? new Date(updates.endsAt) : null;

  const coupon = await db.coupon.update({ where: { id }, data });
  return NextResponse.json({ success: true, coupon });
}

// DELETE /api/admin/coupons?id=...
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "معرف الكوبون مطلوب" }, { status: 400 });
  }
  await db.couponUsage.deleteMany({ where: { couponId: id } });
  await db.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
