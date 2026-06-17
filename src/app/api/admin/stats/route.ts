import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/stats — dashboard KPIs
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const [
    totalOrders,
    totalRevenueAgg,
    pendingOrders,
    deliveredOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    recentOrders,
    topProducts,
    couponCount,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { status: "DELIVERED" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count(),
    db.product.findMany({
      where: { stock: { lte: 20 } },
      select: { id: true, name: true, stock: true, slug: true },
      take: 10,
    }),
    db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.product.findMany({
      orderBy: { soldCount: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, soldCount: true, basePrice: true },
    }),
    db.coupon.count(),
  ]);

  // Sales last 14 days
  const since = new Date();
  since.setDate(since.getDate() - 14);
  const recentOrdersForChart = await db.order.findMany({
    where: { createdAt: { gte: since } },
  });
  const salesByDay: { date: string; total: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const total = recentOrdersForChart
      .filter((o) => {
        const created = new Date(o.createdAt).toISOString().slice(0, 10);
        return created === key;
      })
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
    salesByDay.push({ date: key, total });
  }

  return NextResponse.json({
    kpis: {
      totalOrders,
      totalRevenue: totalRevenueAgg._sum.total || 0,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      couponCount,
      avgOrderValue:
        totalOrders > 0
          ? Math.round((totalRevenueAgg._sum.total || 0) / totalOrders)
          : 0,
    },
    salesByDay,
    lowStockProducts,
    recentOrders,
    topProducts,
  });
}
