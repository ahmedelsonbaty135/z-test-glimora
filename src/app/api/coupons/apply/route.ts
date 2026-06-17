import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/coupons/apply  { code, subtotal }
export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) {
    return NextResponse.json({ error: "أدخل كود الخصم" }, { status: 400 });
  }
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "كود الخصم غير صالح" }, { status: 404 });
  }
  const now = new Date();
  if (now < coupon.startsAt) {
    return NextResponse.json({ error: "الكود لم يبدأ بعد" }, { status: 400 });
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    return NextResponse.json({ error: "انتهت صلاحية الكود" }, { status: 400 });
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "تم استخدام الكود بالكامل" }, { status: 400 });
  }
  if (subtotal < coupon.minOrder) {
    return NextResponse.json(
      { error: `الحد الأدنى للطلب ${coupon.minOrder} ج.م لاستخدام هذا الكود` },
      { status: 400 }
    );
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === "FIXED") {
    discount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === "FREE_SHIPPING") {
    discount = 0;
  }

  return NextResponse.json({
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
    },
    discount,
  });
}
