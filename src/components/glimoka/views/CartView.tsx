"use client";

import { useState } from "react";
import { useShopStore, calcSubtotal, calcDiscount, calcShipping } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, X, Truck, Sparkles, Gift } from "lucide-react";
import { formatEGP, calcLoyaltyDiscount, calcLoyaltyEarn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartView() {
  const { items, updateQty, removeFromCart, setView, coupon, applyCoupon, removeCoupon, clearCart, loyaltyBalance, useLoyaltyPoints, setUseLoyaltyPoints } = useShopStore();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = calcSubtotal(items);
  const couponDiscount = calcDiscount(subtotal, coupon);
  const loyaltyDiscount = calcLoyaltyDiscount(loyaltyBalance, useLoyaltyPoints, subtotal);
  const discount = couponDiscount + loyaltyDiscount;
  const shipping = calcShipping(subtotal, "القاهرة", coupon);
  const total = Math.max(0, subtotal - discount + shipping);
  const willEarn = calcLoyaltyEarn(total);

  const applyCouponHandler = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "كود غير صالح");
        return;
      }
      applyCoupon(data.coupon);
      toast.success(`تم تطبيق الكود! وفّرت ${formatEGP(data.discount)}`);
      setCouponInput("");
    } catch {
      toast.error("خطأ في تطبيق الكود");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-rose-gold" />
          </div>
          <h1 className="text-2xl font-black text-warm-black mb-2">سلتك فارغة</h1>
          <p className="text-warm-gray mb-6">لم تضف أي منتجات بعد. اكتشف تشكيلتنا الفاخرة وابدأ التسوق.</p>
          <Button onClick={() => setView("products")} size="lg" className="bg-burgundy hover:bg-burgundy-depx-8">
            تصفح المنتجات
            <ArrowLeft className="w-5 h-5 mr-1" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-warm-black">سلة التسوق</h1>
        <button
          onClick={() => {
            if (confirm("هل تريد إفراغ السلة؟")) {
              clearCart();
              toast.success("تم إفراغ السلة");
            }
          }}
          className="text-sm text-warm-gray hover:text-danger-soft transition-colors"
        >
          إفراغ السلة
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Items */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-2xl border border-rose-gold/20 p-4 flex gap-4"
              >
                <button
                  onClick={() => useShopStore.getState().openProduct(item.slug)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-dark shrink-0"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => useShopStore.getState().openProduct(item.slug)}
                      className="text-right"
                    >
                      <h3 className="font-bold text-warm-black hover:text-burgundy transition-colors">{item.name}</h3>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-warm-gray hover:text-danger-soft hover:bg-danger-soft/10 rounded-lg transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customization summary */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {item.customization.name1 && (
                      <span className="text-[11px] bg-cream-dark text-warm-gray px-2 py-0.5 rounded-full">
                        الاسم: {item.customization.name1}{item.customization.name2 && ` ${item.customization.name2}`}
                      </span>
                    )}
                    {item.customization.metal && (
                      <span className="text-[11px] bg-cream-dark text-warm-gray px-2 py-0.5 rounded-full">
                        {item.customization.metal}
                      </span>
                    )}
                    {item.customization.size && (
                      <span className="text-[11px] bg-cream-dark text-warm-gray px-2 py-0.5 rounded-full">
                        مقاس {item.customization.size}
                      </span>
                    )}
                    {item.customization.font && (
                      <span className="text-[11px] bg-cream-dark text-warm-gray px-2 py-0.5 rounded-full">
                        {item.customization.font}
                      </span>
                    )}
                    {item.customization.giftBox && (
                      <span className="text-[11px] bg-rose-gold/15 text-burgundy px-2 py-0.5 rounded-full">
                        🎁 علبة هدية
                      </span>
                    )}
                    {item.customization.giftCard && (
                      <span className="text-[11px] bg-rose-gold/15 text-burgundy px-2 py-0.5 rounded-full">
                        💌 بطاقة إهداء
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-rose-gold/30 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-2 hover:bg-cream-dark">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-2 hover:bg-cream-dark">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-burgundy">{formatEGP(item.unitPrice * item.quantity)}</p>
                      {item.unitPrice !== item.basePrice && (
                        <p className="text-[11px] text-warm-gray">{formatEGP(item.unitPrice)} / قطعة</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => setView("products")}
            className="text-sm text-burgundy hover:text-burgundy-light flex items-center gap-1 mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            متابعة التسوق
          </button>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="bg-cream-dark/50 rounded-2xl border-2 border-rose-gold/30 p-5 space-y-4">
            <h2 className="font-black text-warm-black text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-burgundy" />
              ملخص الطلب
            </h2>

            {/* Coupon */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-soft/10 rounded-lg border border-emerald-soft/30">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-soft" />
                  <div>
                    <p className="text-sm font-bold text-emerald-soft">{coupon.code}</p>
                    <p className="text-[11px] text-warm-gray">
                      {coupon.type === "PERCENTAGE" ? `خصم ${coupon.value}%` : coupon.type === "FIXED" ? `خصم ${formatEGP(coupon.value)}` : "شحن مجاني"}
                    </p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="p-1 hover:bg-white/50 rounded">
                  <X className="w-4 h-4 text-warm-gray" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="كود الخصم"
                    className="bg-white border-rose-gold/40 uppercase"
                  />
                  <Button onClick={applyCouponHandler} disabled={applying} variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white shrink-0">
                    {applying ? "..." : "تطبيق"}
                  </Button>
                </div>
                <p className="text-[11px] text-warm-gray mt-1.5">
                  جرّب: WELCOME10 • GLIMOKA50 • FREESHIP • VALENTINE15
                </p>
              </div>
            )}

            {/* Loyalty redemption */}
            {loyaltyBalance > 0 && (
              <label className="flex items-start gap-2 p-3 rounded-lg border border-rose-gold/30 bg-rose-gold/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLoyaltyPoints}
                  onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                  className="w-4 h-4 accent-burgundy mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-warm-black flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-burgundy" />
                    استخدم نقاط الولاء ({loyaltyBalance} نقطة)
                  </p>
                  <p className="text-[11px] text-warm-gray">
                    وفّر حتى {formatEGP(Math.min(loyaltyBalance, Math.floor(subtotal * 0.3)))} (حد أقصى 30% من الطلب)
                  </p>
                </div>
                {useLoyaltyPoints && loyaltyDiscount > 0 && (
                  <span className="text-xs font-bold text-emerald-soft bg-emerald-soft/10 px-2 py-1 rounded-full whitespace-nowrap">
                    -{formatEGP(loyaltyDiscount)}
                  </span>
                )}
              </label>
            )}

            <div className="border-t border-rose-gold/20 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">المجموع الفرعي</span>
                <span className="font-semibold text-warm-black">{formatEGP(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-soft">
                  <span>خصم الكوبون {coupon && `(${coupon.code})`}</span>
                  <span className="font-semibold">-{formatEGP(couponDiscount)}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-burgundy">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> خصم النقاط</span>
                  <span className="font-semibold">-{formatEGP(loyaltyDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray">الشحن</span>
                <span className="font-semibold text-warm-black">
                  {shipping === 0 ? "مجاني" : formatEGP(shipping)}
                </span>
              </div>
              {subtotal < 1000 && shipping > 0 && (
                <p className="text-[11px] text-rose-gold bg-rose-gold/10 p-2 rounded-lg flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  أضف بـ {formatEGP(1000 - subtotal)} للحصول على شحن مجاني!
                </p>
              )}
            </div>

            <div className="border-t-2 border-rose-gold/30 pt-4 flex justify-between items-center">
              <span className="font-bold text-warm-black">الإجمالي</span>
              <span className="text-2xl font-black text-burgundy">{formatEGP(total)}</span>
            </div>

            {willEarn > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-gold/10 border border-rose-gold/30">
                <Sparkles className="w-4 h-4 text-burgundy shrink-0" />
                <p className="text-xs text-warm-black">
                  ستحصل على <span className="font-bold text-burgundy">{willEarn} نقطة ولاء</span> من هذا الطلب (1 نقطة = 1 ج.م)
                </p>
              </div>
            )}

            <Button onClick={() => setView("checkout")} size="lg" className="w-full bg-burgundy hover:bg-burgundy-deep h-12 text-base">
              إتمام الطلب
              <ArrowLeft className="w-5 h-5 mr-1" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-warm-gray">
              <Truck className="w-3 h-3" />
              دفع آمن عند الاستلام
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
