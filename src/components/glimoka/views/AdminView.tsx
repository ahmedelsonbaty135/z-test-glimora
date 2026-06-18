"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  LogOut,
  Lock,
  Search,
  ArrowLeft,
  Star,
  FolderTree,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatEGP, ORDER_STATUS_META } from "@/lib/utils";
import { toast } from "sonner";
import { AdminProducts } from "../AdminProducts";
import { AdminCoupons } from "../AdminCoupons";
import { AdminReviews } from "../AdminReviews";
import { AdminReports } from "../AdminReports";
import { AdminCategories } from "../AdminCategories";
import { AdminBanners } from "../AdminBanners";
import { AdminSettings } from "../AdminSettings";
import {
  setAdminCode,
  clearAdminCode,
  isAuthenticated,
  adminFetch,
  verifyAdminCode,
} from "@/lib/admin-client";

interface AdminStats {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockCount: number;
    couponCount: number;
    avgOrderValue: number;
  };
  salesByDay: { date: string; total: number }[];
  lowStockProducts: { id: string; name: string; stock: number; slug: string }[];
  recentOrders: any[];
  topProducts: { id: string; name: string; slug: string; soldCount: number; basePrice: number }[];
}

export function AdminView() {
  const { setView, user } = useShopStore();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState("");

  // Check if already authenticated (sessionStorage)
  useEffect(() => {
    if (isAuthenticated()) {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) loadStats();
  }, [authed]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/stats");
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          clearAdminCode();
          toast.error("انتهت الجلسة — أدخل الكود مرة أخرى");
        }
        return;
      }
      const d = await res.json();
      setStats(d);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass.trim()) {
      toast.error("أدخل كود الأدمن");
      return;
    }
    setVerifying(true);
    const valid = await verifyAdminCode(pass.trim());
    setVerifying(false);
    if (valid) {
      setAdminCode(pass.trim());
      setAuthed(true);
      setPass("");
      toast.success("مرحبًا أيها المدير!");
    } else {
      toast.error("كود الأدمن غير صحيح");
    }
  };

  const handleLogout = () => {
    clearAdminCode();
    setAuthed(false);
    setStats(null);
    toast.success("تم تسجيل الخروج");
    setView("home");
  };

  if (!authed) {
    return (
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-burgundy-gradient mx-auto flex items-center justify-center mb-4 shadow-luxury-lg">
              <Lock className="w-8 h-8 text-rose-gold-light" />
            </div>
            <h1 className="text-2xl font-black text-warm-black">لوحة تحكم GLIMOKA</h1>
            <p className="text-warm-gray text-sm mt-1">منطقة محمية — للمسؤولين فقط</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="space-y-4 bg-white rounded-2xl border border-rose-gold/20 p-6 shadow-luxury"
          >
            <div>
              <label className="text-sm font-bold text-warm-black">كود الأدمن السري</label>
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="mt-1 text-right border-rose-gold/30 focus:border-burgundy"
                autoFocus
                disabled={verifying}
              />
              <p className="text-xs text-warm-gray mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                الكود السري يُطلب من إدارة المتجر فقط
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-burgundy hover:bg-burgundy-deep h-11"
              disabled={verifying}
            >
              {verifying ? "جارٍ التحقق..." : "دخول لوحة الإدارة"}
            </Button>
          </form>
          <Button onClick={() => setView("home")} variant="ghost" className="w-full mt-4 text-warm-gray">
            <ArrowLeft className="w-4 h-4 ml-1" />
            العودة للمتجر
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !stats) {
    return <div className="container mx-auto px-4 py-20 text-center text-warm-gray">جارٍ تحميل البيانات...</div>;
  }

  const { kpis, salesByDay, lowStockProducts, recentOrders, topProducts } = stats;
  const chartData = salesByDay.map((s) => ({
    date: s.date.slice(5),
    total: s.total,
  }));

  const topProductsChart = topProducts.map((p) => ({
    name: p.name.slice(0, 12),
    sold: p.soldCount,
  }));

  const orderStatusPie = [
    { name: "قيد المراجعة", value: recentOrders.filter((o: any) => o.status === "PENDING").length, color: "#FEF3C7" },
    { name: "مؤكد", value: recentOrders.filter((o: any) => o.status === "CONFIRMED").length, color: "#DBEAFE" },
    { name: "تم التوصيل", value: recentOrders.filter((o: any) => o.status === "DELIVERED").length, color: "#D1FAE5" },
  ].filter((s) => s.value > 0);

  return (
    <div className="bg-cream-dark/30 min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-warm-black flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-burgundy" />
              لوحة التحكم
            </h1>
            <p className="text-sm text-warm-gray">مرحبًا {user?.name} — إليك نظرة على أداء متجرك</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setView("home")} variant="outline" size="sm" className="border-burgundy text-burgundy">
              عرض المتجر
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-danger-soft text-danger-soft">
              <LogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <KpiCard icon={DollarSign} label="إجمالي المبيعات" value={formatEGP(kpis.totalRevenue)} trend="+12%" color="emerald" />
          <KpiCard icon={ShoppingCart} label="إجمالي الطلبات" value={String(kpis.totalOrders)} trend="+8%" color="burgundy" />
          <KpiCard icon={Users} label="العملاء" value={String(kpis.totalCustomers)} trend="+5%" color="rose" />
          <KpiCard icon={TrendingUp} label="متوسط قيمة الطلب" value={formatEGP(kpis.avgOrderValue)} trend="+3%" color="gold" />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MiniStat label="طلبات قيد المراجعة" value={kpis.pendingOrders} icon={ShoppingCart} color="text-amber-600" />
          <MiniStat label="طلبات تم توصيلها" value={kpis.deliveredOrders} icon={Package} color="text-emerald-soft" />
          <MiniStat label="إجمالي المنتجات" value={kpis.totalProducts} icon={Package} color="text-burgundy" />
          <MiniStat label="منتجات منخفضة المخزون" value={kpis.lowStockCount} icon={AlertTriangle} color="text-danger-soft" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2 bg-white border-rose-gold/20">
            <CardHeader>
              <CardTitle className="text-warm-black text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-burgundy" />
                المبيعات (آخر 14 يوم)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6A1B35" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6A1B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD3" />
                  <XAxis dataKey="date" stroke="#6B5560" fontSize={11} />
                  <YAxis stroke="#6B5560" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A87C", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [formatEGP(v), "المبيعات"]}
                  />
                  <Area type="monotone" dataKey="total" stroke="#6A1B35" strokeWidth={2} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-rose-gold/20">
            <CardHeader>
              <CardTitle className="text-warm-black text-lg">حالة الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              {orderStatusPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={orderStatusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                      {orderStatusPie.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A87C", borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-warm-gray py-12 text-sm">لا توجد بيانات</p>
              )}
              <div className="space-y-1 mt-2">
                {orderStatusPie.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="font-bold text-warm-black">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top products bar chart */}
        <Card className="bg-white border-rose-gold/20 mb-6">
          <CardHeader>
            <CardTitle className="text-warm-black text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-burgundy" />
              الأكثر مبيعًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProductsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD3" />
                <XAxis dataKey="name" stroke="#6B5560" fontSize={11} />
                <YAxis stroke="#6B5560" fontSize={11} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A87C", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sold" fill="#C9A87C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs: Orders, Products, Alerts, Coupons, Reviews, Reports */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-cream-dark flex-wrap h-auto">
            <TabsTrigger value="orders"><ShoppingCart className="w-4 h-4 ml-1" /> الطلبات</TabsTrigger>
            <TabsTrigger value="products"><Package className="w-4 h-4 ml-1" /> المنتجات</TabsTrigger>
            <TabsTrigger value="categories"><FolderTree className="w-4 h-4 ml-1" /> الفئات</TabsTrigger>
            <TabsTrigger value="alerts"><AlertTriangle className="w-4 h-4 ml-1" /> المخزون</TabsTrigger>
            <TabsTrigger value="coupons"><Tag className="w-4 h-4 ml-1" /> الكوبونات</TabsTrigger>
            <TabsTrigger value="reviews"><Star className="w-4 h-4 ml-1" /> المراجعات</TabsTrigger>
            <TabsTrigger value="banners"><ImageIcon className="w-4 h-4 ml-1" /> البانرات</TabsTrigger>
            <TabsTrigger value="reports"><TrendingUp className="w-4 h-4 ml-1" /> التقارير</TabsTrigger>
            <TabsTrigger value="settings"><SettingsIcon className="w-4 h-4 ml-1" /> الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="bg-white border-rose-gold/20">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-warm-black text-lg">أحدث الطلبات ({recentOrders.length})</CardTitle>
                <Input
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  placeholder="بحث برقم الطلب أو الاسم..."
                  className="max-w-xs bg-cream-dark/30"
                />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم الطلب</TableHead>
                        <TableHead>العميل</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>المحافظة</TableHead>
                        <TableHead>الإجمالي</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تحديث</TableHead>
                        <TableHead>التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders
                        .filter((o: any) =>
                          !orderFilter ||
                          o.orderNumber.includes(orderFilter) ||
                          o.guestName.includes(orderFilter)
                        )
                        .map((o: any) => {
                          const meta = ORDER_STATUS_META[o.status] || ORDER_STATUS_META.PENDING;
                          return (
                            <TableRow key={o.id}>
                              <TableCell className="font-mono text-xs" dir="ltr">{o.orderNumber}</TableCell>
                              <TableCell className="font-medium">{o.guestName}</TableCell>
                              <TableCell className="text-xs" dir="ltr">{o.guestPhone}</TableCell>
                              <TableCell className="text-xs">{o.governorate}</TableCell>
                              <TableCell className="font-bold text-burgundy">{formatEGP(o.total)}</TableCell>
                              <TableCell>
                                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>
                                  {meta.label}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={o.status}
                                  onValueChange={async (v) => {
                                    try {
                                      const res = await adminFetch(`/api/admin/orders/${o.id}/status`, {
                                        method: "PATCH",
                                        body: JSON.stringify({ status: v }),
                                      });
                                      if (res.ok) {
                                        toast.success("تم تحديث حالة الطلب");
                                        loadStats();
                                      } else {
                                        toast.error("فشل تحديث الحالة");
                                      }
                                    } catch {
                                      toast.error("خطأ في الاتصال");
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px] h-8 text-xs bg-cream-dark/30">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(ORDER_STATUS_META).map(([key, m]) => (
                                      <SelectItem key={key} value={key} className="text-xs">
                                        {m.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-xs text-warm-gray">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="bg-white border-rose-gold/20">
              <CardHeader>
                <CardTitle className="text-warm-black text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-danger-soft" />
                  منتجات منخفضة المخزون
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-center text-warm-gray py-8">كل المنتجات بمخزون جيد ✅</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-cream-dark/40 rounded-xl">
                        <div>
                          <p className="font-bold text-sm text-warm-black">{p.name}</p>
                          <p className="text-xs text-warm-gray">المخزون المتبقي</p>
                        </div>
                        <span className={`text-2xl font-black ${p.stock <= 10 ? "text-danger-soft" : "text-amber-600"}`}>
                          {p.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <AdminCoupons />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="banners">
            <AdminBanners />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color: "emerald" | "burgundy" | "rose" | "gold";
}) {
  const colorMap = {
    emerald: "bg-emerald-soft/15 text-emerald-soft",
    burgundy: "bg-burgundy/15 text-burgundy",
    rose: "bg-rose-gold/15 text-burgundy",
    gold: "bg-amber-400/15 text-amber-600",
  };
  return (
    <Card className="bg-white border-rose-gold/20 overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-warm-gray mb-1">{label}</p>
            <p className="text-xl sm:text-2xl font-black text-warm-black">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs">
          <TrendingUp className="w-3 h-3 text-emerald-soft" />
          <span className="text-emerald-soft font-bold">{trend}</span>
          <span className="text-warm-gray">عن آخر شهر</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-rose-gold/20 p-3 flex items-center gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className="text-lg font-black text-warm-black leading-none">{value}</p>
        <p className="text-[11px] text-warm-gray mt-0.5">{label}</p>
      </div>
    </div>
  );
}
