import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIP, sanitizeInput, isValidEgyptianPhone, isValidEmail } from "@/lib/auth";

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
  // Rate limit: 5 orders per minute per IP
  const ip = getClientIP(req);
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "طلبات كثيرة جدًا، حاول لاحقًا" }, { status: 429 });
  }

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

  // Validate phone (Egyptian format)
  if (!isValidEgyptianPhone(guestPhone)) {
    return NextResponse.json({ error: "رقم الهاتف غير صحيح (01XXXXXXXXX)" }, { status: 400 });
  }
  // Validate email if provided
  if (guestEmail && !isValidEmail(guestEmail)) {
    return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
  }
  // Validate items count (max 50)
  if (items.length > 50) {
    return NextResponse.json({ error: "عدد المنتجات كبير جدًا" }, { status: 400 });
  }
  // Validate total is positive and reasonable (max 1,000,000 EGP)
  if (total <= 0 || total > 1000000) {
    return NextResponse.json({ error: "المجموع غير صحيح" }, { status: 400 });
  }

  // Sanitize string inputs
  const cleanGuestName = sanitizeInput(String(guestName)).slice(0, 100);
  const cleanGovernorate = sanitizeInput(String(governorate)).slice(0, 50);
  const cleanCity = sanitizeInput(String(city)).slice(0, 50);
  const cleanAddress = sanitizeInput(String(address)).slice(0, 500);
  const cleanNotes = notes ? sanitizeInput(String(notes)).slice(0, 500) : null;

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
      guestName: cleanGuestName,
      guestPhone: String(guestPhone).slice(0, 20),
      guestEmail: guestEmail ? String(guestEmail).slice(0, 200) : null,
      governorate: cleanGovernorate,
      city: cleanCity,
      address: cleanAddress,
      notes: cleanNotes,
      paymentMethod: String(paymentMethod || "COD").slice(0, 20),
      status: "PENDING",
      subtotal: Number(subtotal) || 0,
      shippingCost: Number(shippingCost) || 0,
      discount: Number(discount) || 0,
      total: Number(total),
      couponCode: couponCode ? String(couponCode).slice(0, 50) : null,
      loyaltyEarned,
      items: items.map((it: OrderItemInput) => ({
        productId: String(it.productId).slice(0, 100),
        name: sanitizeInput(String(it.name)).slice(0, 200),
        image: String(it.image || "").slice(0, 500),
        price: Math.max(0, Number(it.price) || 0),
        quantity: Math.min(99, Math.max(1, Number(it.quantity) || 1)),
        metal: it.metal ? String(it.metal).slice(0, 50) : null,
        size: it.size ? String(it.size).slice(0, 20) : null,
        font: it.font ? String(it.font).slice(0, 100) : null,
        name1: it.name1 ? sanitizeInput(String(it.name1)).slice(0, 100) : null,
        name2: it.name2 ? sanitizeInput(String(it.name2)).slice(0, 100) : null,
        giftBox: Boolean(it.giftBox),
        giftCard: it.giftCard ? sanitizeInput(String(it.giftCard)).slice(0, 500) : null,
        customizationJson: it.customizationJson ? String(it.customizationJson).slice(0, 2000) : null,
      })),
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
