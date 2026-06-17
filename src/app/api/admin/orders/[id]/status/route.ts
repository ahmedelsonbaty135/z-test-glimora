import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/admin/orders/[id]/status — update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = [
    "PENDING", "CONFIRMED", "CUSTOMIZING", "SHIPPED",
    "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED",
  ];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }

  const order = await db.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  return NextResponse.json({ success: true, order });
}
