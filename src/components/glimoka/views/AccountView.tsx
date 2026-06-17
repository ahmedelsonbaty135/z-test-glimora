"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, LogOut, Settings, MapPin, Star, Trash2, ShoppingBag, Phone, Mail, Gift, ArrowLeft, Search, RotateCw, Share2, Copy, Check } from "lucide-react";
import { ProductCard, type ProductCardData } from "../ProductCard";
import { WishlistCard } from "../WishlistCard";
import { AddressBook } from "../AddressBook";
import { LoyaltyTierCard } from "../LoyaltyTierCard";
import { formatEGP, ORDER_STATUS_META } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  name1?: string | null;
  name2?: string | null;
  metal?: string | null;
  size?: string | null;
}
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  guestName: string;
  guestPhone: string;
  items: OrderItem[];
}

export function AccountView() {
  const { user, login, logout, setView, wishlist, toggleWishlist, openProduct, items, addToCart, loyaltyBalance } = useShopStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductCardData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState(user?.name || "");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (user.email) params.set("email", user.email);
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoadingOrders(true);
      fetch(`/api/orders/list?${params}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled) setOrders(d.orders || []);
        })
        .finally(() => {
          if (!cancelled) setLoadingOrders(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    if (wishlist.length === 0) {
      // defer to avoid synchronous setState in effect
      Promise.resolve().then(() => {
        if (!cancelled) setWishlistProducts([]);
      });
      return;
    }
    fetch(`/api/products?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const all = d.products || [];
        setWishlistProducts(all.filter((p: ProductCardData) => wishlist.includes(p.id)));
      });
    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !form.name) {
      toast.error("أدخل الاسم");
      return;
    }
    if (!form.email && !form.phone) {
      toast.error("أدخل البريد أو الهاتف");
      return;
    }
    login(form.email || form.phone, form.name || form.email.split("@")[0] || "عميل", "CUSTOMER");
    toast.success(mode === "login" ? "أهلًا بعودتك!" : "تم إنشاء حسابك بنجاح!");
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-burgundy-gradient mx-auto flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-rose-gold-light" />
            </div>
            <h1 className="text-2xl font-black text-warm-black">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
            <p className="text-warm-gray text-sm mt-1">تابع طلباتك ومفضلتك واقتنِ نقاط الولاء</p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-cream-dark rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "login" ? "bg-white text-burgundy shadow" : "text-warm-gray"}`}
            >
              دخول
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "register" ? "bg-white text-burgundy shadow" : "text-warm-gray"}`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 bg-white rounded-2xl border border-rose-gold/20 p-6">
            {mode === "register" && (
              <div>
                <Label className="text-sm font-bold">الاسم</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسمك الكامل" className="mt-1" />
              </div>
            )}
            <div>
              <Label className="text-sm font-bold">البريد الإلكتروني أو الهاتف</Label>
              <Input value={form.email || form.phone} onChange={(e) => {
                const v = e.target.value;
                if (/^\d/.test(v)) setForm({ ...form, phone: v, email: "" });
                else setForm({ ...form, email: v, phone: "" });
              }} placeholder="you@example.com أو 01012345678" dir="ltr" className="mt-1 text-right" />
            </div>
            <div>
              <Label className="text-sm font-bold">كلمة المرور</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" dir="ltr" className="mt-1 text-right" />
            </div>
            <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-deep h-11">
              {mode === "login" ? "دخول" : "إنشاء الحساب"}
            </Button>
            <p className="text-xs text-warm-gray text-center">
              بياناتك آمنة معنا. يمكن أيضًا تصفح الطلبات برقم الهاتف بدون تسجيل.
            </p>
          </form>

          <div className="mt-6 bg-cream-dark/50 rounded-xl p-4 text-center">
            <p className="text-sm text-warm-gray mb-2">لديك حساب إداري؟</p>
            <Button onClick={() => setView("admin")} variant="outline" className="border-burgundy text-burgundy">
              دخول لوحة الإدارة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="bg-burgundy-gradient rounded-2xl p-6 text-white mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-gold flex items-center justify-center text-warm-black text-2xl font-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black">{user.name}</h1>
            <p className="text-sm text-white/70" dir="ltr">{user.email}</p>
            <div className="flex items-center gap-1 mt-1 text-rose-gold-light text-xs">
              <Gift className="w-3 h-3" /> عضو GLIMOKA
            </div>
          </div>
        </div>
        <Button onClick={logout} variant="outline" className="border-white/40 text-white hover:bg-white hover:text-burgundy">
          <LogOut className="w-4 h-4 ml-1" />
          خروج
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 bg-cream-dark h-auto">
          <TabsTrigger value="orders" className="text-xs sm:text-sm"><Package className="w-4 h-4 ml-1" /> طلباتي</TabsTrigger>
          <TabsTrigger value="wishlist" className="text-xs sm:text-sm"><Heart className="w-4 h-4 ml-1" /> المفضلة</TabsTrigger>
          <TabsTrigger value="addresses" className="text-xs sm:text-sm"><MapPin className="w-4 h-4 ml-1" /> العناوين</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm"><User className="w-4 h-4 ml-1" /> الملف</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm"><Settings className="w-4 h-4 ml-1" /> الإعدادات</TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Input
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder="ابحث عن طلباتك برقم الهاتف"
              className="bg-white max-w-xs"
            />
            <Button
              onClick={async () => {
                setLoadingOrders(true);
                const d = await fetch(`/api/orders/list?phone=${encodeURIComponent(phoneSearch)}`).then((r) => r.json());
                setOrders(d.orders || []);
                setLoadingOrders(false);
              }}
              className="bg-burgundy hover:bg-burgundy-deep"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {loadingOrders ? (
            <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-rose-gold/20">
              <Package className="w-12 h-12 text-rose-gold mx-auto mb-3" />
              <p className="font-bold text-warm-black mb-1">لا توجد طلبات بعد</p>
              <p className="text-sm text-warm-gray mb-4">ابدأ التسوق واكتشف مجوهرة مميزة</p>
              <Button onClick={() => setView("products")} className="bg-burgundy hover:bg-burgundy-deep">تصفح المنتجات</Button>
            </div>
          ) : (
            orders.map((o) => {
              const meta = ORDER_STATUS_META[o.status] || ORDER_STATUS_META.PENDING;
              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-rose-gold/20 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="font-bold text-warm-black" dir="ltr">{o.orderNumber}</p>
                      <p className="text-xs text-warm-gray">{new Date(o.createdAt).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-luxury pb-2 mb-3">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-2 bg-cream-dark/40 rounded-lg p-2 shrink-0">
                        <img src={it.image} alt={it.name} className="w-10 h-10 rounded object-cover" />
                        <div className="text-xs">
                          <p className="font-bold text-warm-black max-w-[120px] truncate">{it.name}</p>
                          <p className="text-warm-gray">{it.quantity}× {formatEGP(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-gold/15">
                    <span className="text-sm text-warm-gray">{o.items.reduce((s, i) => s + i.quantity, 0)} منتج</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                        onClick={() => {
                          // Re-order: add all items back to cart
                          o.items.forEach((it) => {
                            addToCart({
                              productId: it.id,
                              slug: "",
                              name: it.name,
                              image: it.image,
                              basePrice: it.price,
                              unitPrice: it.price,
                              quantity: it.quantity,
                              customization: {
                                metal: it.metal || "SILVER_925",
                                size: it.size || "17",
                                font: "خط عربي تقليدي",
                                name1: it.name1 || "",
                                name2: it.name2 || "",
                                giftBox: false,
                                giftCard: "",
                              },
                              maxStock: 99,
                            } as any);
                          });
                          toast.success(`تمت إضافة ${o.items.length} منتج للسلة`);
                          setView("cart");
                        }}
                      >
                        <RotateCw className="w-3 h-3 ml-1" />
                        إعادة الطلب
                      </Button>
                      <span className="font-bold text-burgundy">{formatEGP(o.total)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-rose-gold/20">
              <Heart className="w-12 h-12 text-rose-gold mx-auto mb-3" />
              <p className="font-bold text-warm-black mb-1">قائمة المفضلة فارغة</p>
              <p className="text-sm text-warm-gray mb-4">أضف المنتجات التي تحبها هنا</p>
              <Button onClick={() => setView("products")} className="bg-burgundy hover:bg-burgundy-deep">تصفح المنتجات</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm text-warm-gray">{wishlistProducts.length} منتج في المفضلة</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-gold/40 text-warm-gray hover:bg-cream-dark"
                    onClick={async () => {
                      const shareUrl = `${window.location.origin}/?wishlist=${wishlist.join(",")}`;
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: "مفضلتي في GLIMOKA",
                            text: "شاهد مجوهراتي المفضلة من GLIMOKA 💎",
                            url: shareUrl,
                          });
                          toast.success("تمت المشاركة");
                        } else {
                          await navigator.clipboard.writeText(shareUrl);
                          setShareCopied(true);
                          toast.success("تم نسخ رابط المفضلة");
                          setTimeout(() => setShareCopied(false), 2000);
                        }
                      } catch {
                        // user cancelled share
                      }
                    }}
                  >
                    {shareCopied ? <Check className="w-4 h-4 ml-1 text-emerald-soft" /> : <Share2 className="w-4 h-4 ml-1" />}
                    {shareCopied ? "تم النسخ" : "مشاركة"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                    onClick={() => {
                      wishlistProducts.forEach((p) => {
                        const metals = p.metalOptions.split(",").map((m) => m.trim());
                        addToCart({
                          productId: p.id,
                          slug: p.slug,
                          name: p.name,
                          image: p.images[0]?.url || "/products/placeholder.jpg",
                          basePrice: p.basePrice,
                          unitPrice: p.basePrice,
                          quantity: 1,
                          customization: {
                            metal: metals[0] || "SILVER_925",
                            size: "17",
                            font: "خط عربي تقليدي",
                            name1: "",
                            name2: "",
                            giftBox: false,
                            giftCard: "",
                          },
                          maxStock: p.stock,
                        } as any);
                      });
                      toast.success(`تم نقل ${wishlistProducts.length} منتج للسلة`);
                      setView("cart");
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 ml-1" />
                    نقل الكل للسلة
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlistProducts.map((p) => (
                  <WishlistCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses">
          <AddressBook />
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="bg-white rounded-2xl border border-rose-gold/20 p-6 max-w-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-burgundy" />
              <h2 className="font-bold text-warm-black">الملف الشخصي</h2>
            </div>
            <div>
              <Label className="text-sm">الاسم</Label>
              <Input value={user.name} readOnly className="mt-1 bg-cream-dark/30" />
            </div>
            <div>
              <Label className="text-sm">البريد الإلكتروني</Label>
              <Input value={user.email} readOnly dir="ltr" className="mt-1 text-right bg-cream-dark/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-dark/40 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-burgundy">{orders.length}</p>
                <p className="text-xs text-warm-gray">إجمالي الطلبات</p>
              </div>
              <div className="bg-cream-dark/40 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-burgundy">{wishlist.length}</p>
                <p className="text-xs text-warm-gray">في المفضلة</p>
              </div>
            </div>
            <div className="bg-rose-gold/10 rounded-xl p-4 flex items-center gap-3">
              <Gift className="w-8 h-8 text-burgundy" />
              <div>
                <p className="font-bold text-warm-black text-sm">نقاط الولاء</p>
                <p className="text-xs text-warm-gray">اكسب نقطة لكل 10 ج.م — استبدلها بخصومات</p>
              </div>
              <span className="mr-auto font-black text-burgundy text-xl">{loyaltyBalance}</span>
            </div>
          </div>

          {/* Loyalty Tier System */}
          <LoyaltyTierCard />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="bg-white rounded-2xl border border-rose-gold/20 p-6 max-w-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-burgundy" />
              <h2 className="font-bold text-warm-black">إعدادات الإشعارات</h2>
            </div>
            {[
              { label: "إشعارات الطلبات (واتساب)", desc: "تأكيد الطلب وتحديثات الشحن" },
              { label: "العروض والخصومات", desc: "كن أول من يعرف عن العروض" },
              { label: "النشرة البريدية", desc: "أحدث المنتجات والقصص" },
            ].map((s, i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream-dark/40 cursor-pointer">
                <div>
                  <p className="font-bold text-sm text-warm-black">{s.label}</p>
                  <p className="text-xs text-warm-gray">{s.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={i === 0} className="w-5 h-5 accent-burgundy" />
              </label>
            ))}
            <div className="pt-3 border-t border-rose-gold/15">
              <Button variant="outline" className="border-danger-soft text-danger-soft hover:bg-danger-soft hover:text-white">
                <Trash2 className="w-4 h-4 ml-1" />
                حذف الحساب
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
