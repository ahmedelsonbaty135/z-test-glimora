"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, MessageCircle, Home, Copy, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function ThankYouView() {
  const { lastOrderNumber, setView } = useShopStore();
  const [confettiOn] = useState(true);

  useEffect(() => {
    if (!lastOrderNumber) {
      setView("home");
    }
  }, [lastOrderNumber, setView]);

  if (!lastOrderNumber) return null;

  const copyOrder = () => {
    navigator.clipboard.writeText(lastOrderNumber);
    toast.success("تم نسخ رقم الطلب");
  };

  const whatsappMsg = `أهلًا GLIMOKA! أكدت الطلب رقم ${lastOrderNumber}. حابب أتأكد من التفاصيل.`;

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-soft/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-soft flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        {confettiOn && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/15 text-burgundy text-sm font-bold mb-4">
            <PartyPopper className="w-4 h-4" />
            مبروك! تم تأكيد طلبك
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-black text-warm-black mb-3">شكرًا لك على طلبك! 💎</h1>
        <p className="text-warm-gray text-lg mb-6">
          تم استلام طلبك بنجاح وفريقنا بدأ في تحضيره. هنتواصل معاك على واتساب قريبًا لتأكيد التفاصيل.
        </p>

        {/* Order number card */}
        <div className="bg-cream-dark/50 rounded-2xl border-2 border-rose-gold/30 p-6 mb-6">
          <p className="text-sm text-warm-gray mb-1">رقم الطلب</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-black text-burgundy font-mono" dir="ltr">{lastOrderNumber}</p>
            <button onClick={copyOrder} className="p-2 hover:bg-white rounded-lg transition-colors" aria-label="نسخ">
              <Copy className="w-4 h-4 text-warm-gray" />
            </button>
          </div>
        </div>

        {/* Next steps */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: CheckCircle2, title: "تأكيد الطلب", desc: "خلال ساعة" },
            { icon: Package, title: "تجهيز وتخصيص", desc: "1-2 يوم" },
            { icon: Truck, title: "شحن وتوصيل", desc: "2-5 أيام" },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-xl p-4 border border-rose-gold/20"
            >
              <div className="w-10 h-10 rounded-full bg-burgundy-gradient mx-auto flex items-center justify-center mb-2">
                <s.icon className="w-5 h-5 text-rose-gold-light" />
              </div>
              <p className="font-bold text-warm-black text-sm">{s.title}</p>
              <p className="text-xs text-warm-gray">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => setView("track-order")}
            variant="outline"
            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
          >
            <Package className="w-5 h-5 ml-1" />
            تتبع الطلب
          </Button>
          <a
            href={`https://wa.me/201000000000?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-emerald-soft hover:bg-emerald-soft/90 w-full sm:w-auto">
              <MessageCircle className="w-5 h-5 ml-1" />
              تواصل واتساب
            </Button>
          </a>
          <Button onClick={() => setView("home")} variant="ghost" className="text-warm-gray hover:text-burgundy">
            <Home className="w-5 h-5 ml-1" />
            الرئيسية
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
