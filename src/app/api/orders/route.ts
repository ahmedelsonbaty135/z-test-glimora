import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface OrderItemInput {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  metal?: string;
  size?: string;
  font?: string;
  name1?: string;
  name2?: string;
  giftBox?: boolean;
  giftCard?: string;
  customizationJson?: string;
}

// POST /api/orders — create order (COD)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    guestName,
    guestPhone,
    guestEmail,
    governorate,
    city,
    address,
    notes,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    couponCode,
    paymentMethod = "COD",
  } = body as {
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    governorate: string;
    city: string;
    address: string;
    notes?: string;
    items: OrderItemInput[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    couponCode?: string;
    paymentMethod?: string;
  };

  if (!guestName || !guestPhone || !governorate || !city || !address) {
    return NextResponse.json(
      { error: "يرجى ملء جميع الحقول المطلوبة" },
      { status: 400 }
    );
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
  }

  // Generate order number: GLM-YYYYMMDD-XXXX
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `GLM-${ymd}-${rand}`;

  // Loyalty: 1 point per 10 EGP
  const loyaltyEarned = Math.floor(total / 10);

  const order = await db.order.create({
    data: {
      orderNumber,
      guestName,
      guestPhone,
      guestEmail,
      governorate,
      city,
      address,
      notes,
      paymentMethod,
      status: "PENDING",
      subtotal,
      shippingCost,
      discount,
      total,
      couponCode,
      loyaltyEarned,
      items: {
        create: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          image: it.image,
          price: it.price,
          quantity: it.quantity,
          metal: it.metal || null,
          size: it.size || null,
          font: it.font || null,
          name1: it.name1 || null,
          name2: it.name2 || null,
          giftBox: it.giftBox || false,
          giftCard: it.giftCard || null,
          customizationJson: it.customizationJson || null,
        })),
      },
    },
    include: { items: true },
  });

  // Increment coupon usage
  if (couponCode) {
    const c = await db.coupon.findUnique({ where: { code: couponCode } });
    if (c) {
      await db.coupon.update({
        where: { id: c.id },
        data: { usedCount: { increment: 1 } },
      });
      await db.couponUsage.create({
        data: {
          couponId: c.id,
          email: guestEmail,
        },
      });
    }
  }

  // Update product soldCount & stock
  for (const it of items) {
    try {
      await db.product.update({
        where: { id: it.productId },
        data: {
          soldCount: { increment: it.quantity },
          stock: { decrement: it.quantity },
        },
      });
    } catch {
      // ignore stock errors in sandbox
    }
  }

  return NextResponse.json({
    success: true,
    orderNumber: order.orderNumber,
    orderId: order.id,
    total: order.total,
    loyaltyEarned,
  });
}
