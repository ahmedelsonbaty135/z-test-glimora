"use client";

import { useState } from "react";
import { useShopStore, calcSubtotal, calcDiscount, calcShipping, EGYPT_GOVERNORATES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, ShieldCheck, Truck, Lock, ChevronLeft, CheckCircle2, Banknote } from "lucide-react";
import { formatEGP } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function CheckoutView() {
  const { items, setView, coupon, clearCart, setLastOrder, user, login } = useShopStore();
  const [form, setForm] = useState({
    guestName: user?.name || "",
    guestPhone: "",
    guestEmail: user?.email || "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = calcSubtotal(items);
  const discount = calcDiscount(subtotal, coupon);
  const shipping = calcShipping(subtotal, form.governorate, coupon);
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-warm-black mb-2">سلتك فارغة</h1>
        <p className="text-warm-gray mb-6">أضف منتجات لإتمام الطلب</p>
        <Button onClick={() => setView("products")} className="bg-burgundy hover:bg-burgundy-deep">تصفح المنتجات</Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.guestPhone || !form.governorate || !form.city || !form.address) {
      toast.error("أكمل جميع الحقول المطلوبة");
      return;
    }
    // Basic Egyptian phone validation
    const phoneClean = form.guestPhone.replace(/\s/g, "");
    if (!/^(\+?20)?01[0125]\d{8}$/.test(phoneClean)) {
      toast.error("رقم هاتف غير صحيح (مثال: 01012345678)");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.unitPrice,
        quantity: i.quantity,
        metal: i.customization.metal,
        size: i.customization.size,
        font: i.customization.font,
        name1: i.customization.name1,
        name2: i.customization.name2,
        giftBox: i.customization.giftBox,
        giftCard: i.customization.giftCard,
        customizationJson: JSON.stringify(i.customization),
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          subtotal,
          shippingCost: shipping,
          discount,
          total,
          couponCode: coupon?.code,
          paymentMethod: "COD",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل إنشاء الطلب");
        return;
      }
      // mock login as customer for tracking
      if (!user) login(form.guestEmail || form.guestPhone, form.guestName, "CUSTOMER");
      setLastOrder(data.orderNumber);
      clearCart();
      setView("thankyou");
      toast.success("تم إنشاء طلبك بنجاح!");
    } catch {
      toast.error("خطأ في إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-4">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <button onClick={() => setView("cart")} className="hover:text-burgundy">السلة</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">الدفع</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-black text-warm-black mb-6">إتمام الطلب</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Contact */}
          <section className="bg-white rounded-2xl border border-rose-gold/20 p-5 sm:p-6">
            <h2 className="font-bold text-warm-black text-lg mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-burgundy text-white text-sm flex items-center justify-center">1</span>
              معلومات التواصل
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="name" className="text-sm font-bold">الاسم الكامل <span className="text-danger-soft">*</span></Label>
                <Input
                  id="name"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  placeholder="مثال: أحمد محمد"
                  required
                  className="mt-1 bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-bold">رقم الهاتف <span className="text-danger-soft">*</span></Label>
                <Input
                  id="phone"
                  value={form.guestPhone}
                  onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                  placeholder="01012345678"
                  required
                  dir="ltr"
                  className="mt-1 text-right bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-bold">البريد الإلكتروني (اختياري)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  placeholder="you@example.com"
                  dir="ltr"
                  className="mt-1 text-right bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold"
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white rounded-2xl border border-rose-gold/20 p-5 sm:p-6">
            <h2 className="font-bold text-warm-black text-lg mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-burgundy text-white text-sm flex items-center justify-center">2</span>
              عنوان الشحن
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-bold">المحافظة <span className="text-danger-soft">*</span></Label>
                <Select value={form.governorate} onValueChange={(v) => setForm({ ...form, governorate: v })}>
                  <SelectTrigger className="mt-1 bg-cream-dark/30 border-rose-gold/30">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    {EGYPT_GOVERNORATES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city" className="text-sm font-bold">المدينة <span className="text-danger-soft">*</span></Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="مثال: مدينة نصر"
                  required
                  className="mt-1 bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-sm font-bold">العنوان بالتفصيل <span className="text-danger-soft">*</span></Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="الشارع، رقم العمارة، الدور، الشقة..."
                  required
                  className="mt-1 bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold min-h-[70px]"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes" className="text-sm font-bold">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="أي تعليمات خاصة بالتوصيل أو التغليف..."
                  className="mt-1 bg-cream-dark/30 border-rose-gold/30 focus-visible:ring-rose-gold min-h-[50px]"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-2xl border border-rose-gold/20 p-5 sm:p-6">
            <h2 className="font-bold text-warm-black text-lg mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-burgundy text-white text-sm flex items-center justify-center">3</span>
              طريقة الدفع
            </h2>
            <div className="border-2 border-burgundy rounded-xl p-4 bg-burgundy/5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy-gradient flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5 text-rose-gold-light" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-warm-black">الدفع عند الاستلام (COD)</p>
                <p className="text-sm text-warm-gray mt-0.5">ادفع نقدًا عند استلام طلبك. آمن وموثوق.</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-burgundy" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px] text-warm-gray">
              <div className="flex flex-col items-center gap-1 p-2 bg-cream-dark/40 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-burgundy" /> دفع آمن
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-cream-dark/40 rounded-lg">
                <Lock className="w-4 h-4 text-burgundy" /> بيانات محمية
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-cream-dark/40 rounded-lg">
                <Truck className="w-4 h-4 text-burgundy" /> شحن سريع
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="bg-cream-dark/50 rounded-2xl border-2 border-rose-gold/30 p-5 space-y-4">
            <h2 className="font-black text-warm-black text-lg">طلبك</h2>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-luxury pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-burgundy text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-warm-black truncate">{item.name}</p>
                    {item.customization.name1 && (
                      <p className="text-[11px] text-warm-gray truncate">
                        {item.customization.name1} {item.customization.name2} • {item.customization.metal}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-burgundy whitespace-nowrap">{formatEGP(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-gold/20 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">المجموع الفرعي</span>
                <span className="font-semibold">{formatEGP(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-soft">
                  <span>الخصم {coupon && `(${coupon.code})`}</span>
                  <span className="font-semibold">-{formatEGP(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray">الشحن</span>
                <span className="font-semibold">{shipping === 0 ? "مجاني" : formatEGP(shipping)}</span>
              </div>
            </div>

            <div className="border-t-2 border-rose-gold/30 pt-3 flex justify-between items-center">
              <span className="font-bold text-warm-black">الإجمالي</span>
              <span className="text-2xl font-black text-burgundy">{formatEGP(total)}</span>
            </div>

            <Button type="submit" disabled={submitting} size="lg" className="w-full bg-burgundy hover:bg-burgundy-deep h-12 text-base">
              {submitting ? (
                "جارٍ تأكيد الطلب..."
              ) : (
                <>
                  <CreditCard className="w-5 h-5 ml-2" />
                  تأكيد الطلب
                </>
              )}
            </Button>

            <p className="text-[11px] text-warm-gray text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              بالضغط على تأكيد الطلب، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
