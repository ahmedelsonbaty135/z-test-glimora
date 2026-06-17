"use client";

import { useEffect, useState } from "react";
import { useShopStore, calcSubtotal } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowLeft, Clock, Sparkles } from "lucide-react";
import { formatEGP, whatsappLink } from "@/lib/utils";

const REMINDER_THRESHOLD_MS = 30 * 1000; // 30 seconds for demo (real: 60min = 3600000)

export function AbandonedCartReminder() {
  const { items, cartLastUpdated, cartReminderDismissed, dismissCartReminder, setView, setCartDrawerOpen } = useShopStore();
  const [show, setShow] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 || !cartLastUpdated || cartReminderDismissed) {
      setShow(false);
      return;
    }
    const elapsed = Date.now() - cartLastUpdated;
    if (elapsed >= REMINDER_THRESHOLD_MS) {
      setShow(true);
      return;
    }
    // schedule a check
    const remaining = REMINDER_THRESHOLD_MS - elapsed;
    const timer = setTimeout(() => setShow(true), remaining);
    return () => clearTimeout(timer);
  }, [hydrated, items.length, cartLastUpdated, cartReminderDismissed]);

  if (!hydrated || !show || items.length === 0) return null;

  const subtotal = calcSubtotal(items);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const elapsedMin = cartLastUpdated ? Math.floor((Date.now() - cartLastUpdated) / 60000) : 0;

  const waMessage = `مرحبًا GLIMOKA 💎\nلديّ ${itemCount} منتج في سلة التسوق بقيمة ${formatEGP(subtotal)}\nأحتاج مساعدة في إتمام الطلب.\n\nالمنتجات:\n${items.map((i) => `• ${i.name} ×${i.quantity}`).join("\n")}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-luxury-lg border-2 border-rose-gold/40 overflow-hidden">
          {/* Header */}
          <div className="bg-burgundy-gradient px-4 py-2.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-rose-gold-light" />
              </div>
              <span className="text-sm font-bold">
                {elapsedMin > 0 ? `سلتك تنتظرك منذ ${elapsedMin} دقيقة` : "سلتك تنتظرك"}
              </span>
            </div>
            <button
              onClick={() => {
                dismissCartReminder();
                setShow(false);
              }}
              className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {items.slice(0, 3).map((i) => (
                  <div
                    key={i.id}
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-cream-dark shrink-0"
                  >
                    <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cream-dark flex items-center justify-center text-xs font-bold text-burgundy shrink-0">
                    +{items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-warm-black text-sm line-clamp-1">
                  {itemCount} منتج في سلتك
                </p>
                <p className="text-xs text-warm-gray">
                  القيمة: <span className="font-bold text-burgundy">{formatEGP(subtotal)}</span>
                </p>
              </div>
            </div>

            <div className="bg-rose-gold/10 rounded-lg p-2.5 mb-3 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <p className="text-xs text-warm-black leading-relaxed">
                أكمل طلبك الآن واحصل على نقاط ولاء وعلى شحن مجاني للطلبات فوق 1000 ج.م
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setView("cart");
                  setShow(false);
                }}
                className="flex items-center justify-center gap-1.5 bg-burgundy hover:bg-burgundy-deep text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                متابعة الطلب
              </button>
              <a
                href={whatsappLink("201000000000", waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShow(false)}
                className="flex items-center justify-center gap-1.5 border border-emerald-soft text-emerald-soft hover:bg-emerald-soft hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                مساعدة واتساب
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
