import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/reports?type=sales-by-category|sales-by-day|top-customers|top-products
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "sales-by-category";
  const days = Number(searchParams.get("days") || 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // Fetch all orders (not cancelled) with items
  const orders = await db.order.findMany({
    where: { createdAt: { gte: since } },
  });

  // Filter out cancelled orders client-side (Supabase doesn't support nested not easily)
  const validOrders = orders.filter((o: any) => o.status !== "CANCELLED");

  if (type === "sales-by-category") {
    // Need product info for each item — fetch items separately
    const allItems: any[] = [];
    for (const order of validOrders) {
      if (order.items) {
        for (const item of order.items) {
          allItems.push(item);
        }
      }
    }

    // Fetch products with categories to map items to categories
    const products = await db.product.findMany();
    const productMap = new Map(products.map((p: any) => [p.id, p]));

    const byCategory: Record<string, { revenue: number; count: number }> = {};
    for (const item of allItems) {
      const product = productMap.get(item.productId);
      const catName = product?.category?.name || "غير مصنف";
      if (!byCategory[catName]) byCategory[catName] = { revenue: 0, count: 0 };
      byCategory[catName].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
      byCategory[catName].count += Number(item.quantity) || 1;
    }

    const result = Object.entries(byCategory)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({ report: result, type });
  }

  if (type === "sales-by-day") {
    const byDay: Record<string, { revenue: number; orders: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay[key] = { revenue: 0, orders: 0 };
    }
    for (const o of validOrders) {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (byDay[key]) {
        byDay[key].revenue += Number(o.total) || 0;
        byDay[key].orders += 1;
      }
    }

    const result = Object.entries(byDay).map(([date, data]) => ({ date, ...data }));
    return NextResponse.json({ report: result, type });
  }

  if (type === "top-customers") {
    const byCustomer: Record<string, { name: string; phone: string; email: string; totalSpent: number; orderCount: number }> = {};
    for (const o of validOrders) {
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
      byCustomer[key].totalSpent += Number(o.total) || 0;
      byCustomer[key].orderCount += 1;
    }

    const result = Object.values(byCustomer)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json({ report: result, type });
  }

  if (type === "top-products") {
    // Collect all items from valid orders
    const allItems: any[] = [];
    for (const order of validOrders) {
      if (order.items) {
        for (const item of order.items) {
          allItems.push(item);
        }
      }
    }

    const byProduct: Record<string, { name: string; revenue: number; sold: number }> = {};
    for (const it of allItems) {
      const name = it.name || "غير معروف";
      if (!byProduct[name]) byProduct[name] = { name, revenue: 0, sold: 0 };
      byProduct[name].revenue += (Number(it.price) || 0) * (Number(it.quantity) || 1);
      byProduct[name].sold += Number(it.quantity) || 1;
    }

    const result = Object.values(byProduct)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({ report: result, type });
  }

  return NextResponse.json({ error: "نوع تقرير غير معروف" }, { status: 400 });
}
