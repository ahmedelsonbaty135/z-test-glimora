"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, Package, Users, BarChart3 } from "lucide-react";
import { formatEGP } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-client";

const COLORS = ["#6A1B35", "#C9A87C", "#8B3A4F", "#10B981", "#9B2C2C", "#7C3AED"];

type ReportType = "sales-by-category" | "sales-by-day" | "top-customers" | "top-products";

export function AdminReports() {
  const [reportType, setReportType] = useState<ReportType>("sales-by-category");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      adminFetch(`/api/admin/reports?type=${reportType}&days=${days}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled) setData(d.report || []);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [reportType, days]);

  const REPORT_OPTIONS: { key: ReportType; label: string; icon: any }[] = [
    { key: "sales-by-category", label: "المبيعات حسب الفئة", icon: BarChart3 },
    { key: "sales-by-day", label: "المبيعات اليومية", icon: TrendingUp },
    { key: "top-products", label: "أفضل المنتجات", icon: Package },
    { key: "top-customers", label: "أفضل العملاء", icon: Users },
  ];

  return (
    <Card className="bg-white border-rose-gold/20">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-warm-black text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-burgundy" />
          التقارير والتحليلات
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-cream-dark rounded-lg">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  days === d ? "bg-white text-burgundy shadow" : "text-warm-gray hover:text-warm-black"
                }`}
              >
                {d} يوم
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Report type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {REPORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setReportType(opt.key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                reportType === opt.key
                  ? "border-burgundy bg-burgundy/5 text-burgundy"
                  : "border-rose-gold/20 bg-white text-warm-gray hover:border-burgundy/40"
              }`}
            >
              <opt.icon className="w-5 h-5" />
              <span className="text-xs font-bold text-center">{opt.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-rose-gold border-t-burgundy rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-rose-gold mx-auto mb-3" />
            <p className="font-bold text-warm-black mb-1">لا توجد بيانات</p>
            <p className="text-sm text-warm-gray">جرّب تغيير الفترة الزمنية</p>
          </div>
        ) : (
          <>
            {/* Sales by category — Pie chart */}
            {reportType === "sales-by-category" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(entry: any) => entry.name}
                      >
                        {data.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A87C", borderRadius: 12, fontSize: 12 }}
                        formatter={(v: number) => [formatEGP(v), "المبيعات"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/40">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="font-bold text-warm-black text-sm">{item.name}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-burgundy text-sm">{formatEGP(item.revenue)}</p>
                        <p className="text-[11px] text-warm-gray">{item.count} قطعة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales by day — Line chart */}
            {reportType === "sales-by-day" && (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD3" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B5560"
                    fontSize={10}
                    tickFormatter={(d) => d.slice(5)}
                  />
                  <YAxis stroke="#6B5560" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A87C", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number, name: string) =>
                      name === "revenue" ? [formatEGP(v), "المبيعات"] : [v, "الطلبات"]
                    }
                    labelFormatter={(l) => l}
                  />
                  <Legend formatter={(v) => (v === "revenue" ? "المبيعات" : "الطلبات")} />
                  <Line type="monotone" dataKey="revenue" stroke="#6A1B35" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="#C9A87C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* Top products — Bar chart */}
            {reportType === "top-products" && (
              <div className="space-y-2">
                {data.map((item, i) => {
                  const maxRev = data[0]?.revenue || 1;
                  const pct = Math.round((item.revenue / maxRev) * 100);
                  return (
                    <div key={i} className="p-3 rounded-lg bg-cream-dark/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-bold text-warm-black text-sm">{item.name}</span>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-burgundy text-sm">{formatEGP(item.revenue)}</span>
                          <span className="text-xs text-warm-gray mr-2">({item.sold} قطعة)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                        <div className="h-full bg-rose-gold rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Top customers — Table */}
            {reportType === "top-customers" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rose-gold/20">
                      <th className="text-right py-2 px-2 font-bold text-warm-black">#</th>
                      <th className="text-right py-2 px-2 font-bold text-warm-black">العميل</th>
                      <th className="text-right py-2 px-2 font-bold text-warm-black">الهاتف</th>
                      <th className="text-right py-2 px-2 font-bold text-warm-black">الطلبات</th>
                      <th className="text-right py-2 px-2 font-bold text-warm-black">إجمالي الإنفاق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((c, i) => (
                      <tr key={i} className="border-b border-rose-gold/10 hover:bg-cream-dark/30">
                        <td className="py-2 px-2">
                          <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs font-bold inline-flex items-center justify-center">
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-medium text-warm-black">{c.name}</td>
                        <td className="py-2 px-2 text-xs text-warm-gray" dir="ltr">{c.phone}</td>
                        <td className="py-2 px-2 text-warm-gray">{c.orderCount}</td>
                        <td className="py-2 px-2 font-bold text-burgundy">{formatEGP(c.totalSpent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
