import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/admin/reports?type=sales-by-category|sales-by-day|top-customers
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "sales-by-category";
  const days = Number(searchParams.get("days") || 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  if (type === "sales-by-category") {
    // Aggregate order items by product category
    const orders = await db.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      include: {
        items: {
          include: {
            product: { select: { category: { select: { name: true } } } },
          },
        },
      },
    });

    const byCategory: Record<string, { revenue: number; count: number }> = {};
    for (const order of orders) {
      for (const item of order.items) {
        const catName = item.product?.category?.name || "غير مصنف";
        if (!byCategory[catName]) byCategory[catName] = { revenue: 0, count: 0 };
        byCategory[catName].revenue += item.price * item.quantity;
        byCategory[catName].count += item.quantity;
      }
    }

    const result = Object.entries(byCategory)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({ report: result, type });
  }

  if (type === "sales-by-day") {
    const orders = await db.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const byDay: Record<string, { revenue: number; orders: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay[key] = { revenue: 0, orders: 0 };
    }
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (byDay[key]) {
        byDay[key].revenue += o.total;
        byDay[key].orders += 1;
      }
    }

    const result = Object.entries(byDay).map(([date, data]) => ({ date, ...data }));
    return NextResponse.json({ report: result, type });
  }

  if (type === "top-customers") {
    const orders = await db.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { guestName: true, guestPhone: true, guestEmail: true, total: true, orderNumber: true },
    });

    const byCustomer: Record<string, { name: string; phone: string; email: string; totalSpent: number; orderCount: number }> = {};
    for (const o of orders) {
      const key = o.guestPhone || o.guestEmail || o.guestName;
      if (!byCustomer[key]) {
        byCustomer[key] = {
          name: o.guestName,
          phone: o.guestPhone,
          email: o.guestEmail || "",
          totalSpent: 0,
          orderCount: 0,
        };
      }
      byCustomer[key].totalSpent += o.total;
      byCustomer[key].orderCount += 1;
    }

    const result = Object.values(byCustomer)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json({ report: result, type });
  }

  if (type === "top-products") {
    const items = await db.orderItem.findMany({
      where: { order: { createdAt: { gte: since }, status: { not: "CANCELLED" } } },
      select: { name: true, price: true, quantity: true },
    });

    const byProduct: Record<string, { name: string; revenue: number; sold: number }> = {};
    for (const it of items) {
      if (!byProduct[it.name]) byProduct[it.name] = { name: it.name, revenue: 0, sold: 0 };
      byProduct[it.name].revenue += it.price * it.quantity;
      byProduct[it.name].sold += it.quantity;
    }

    const result = Object.values(byProduct)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({ report: result, type });
  }

  return NextResponse.json({ error: "نوع تقرير غير معروف" }, { status: 400 });
}
