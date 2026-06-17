import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/orders/track?order=GLM-...&phone=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("order");
  const phone = searchParams.get("phone");

  if (!orderNumber) {
    return NextResponse.json({ error: "أدخل رقم الطلب" }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { orderNumber: orderNumber.toUpperCase() },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  if (phone && order.guestPhone.replace(/\s/g, "") !== phone.replace(/\s/g, "")) {
    return NextResponse.json({ error: "رقم الهاتف غير مطابق" }, { status: 403 });
  }

  return NextResponse.json({ order });
}
