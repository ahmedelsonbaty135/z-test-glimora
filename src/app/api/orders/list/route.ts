import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/orders/list?phone=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const email = searchParams.get("email");

  if (!phone && !email) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await db.order.findMany({
    where: {
      OR: [
        phone ? { guestPhone: { contains: phone } } : {},
        email ? { guestEmail: { contains: email } } : {},
      ].filter((c) => Object.keys(c).length > 0),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ orders });
}
