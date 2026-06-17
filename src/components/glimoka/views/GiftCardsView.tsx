"use client";

import { useState } from "react";
import { useShopStore, GIFT_CARD_PRESETS, GIFT_CARD_DESIGNS, calcGiftCardsTotal } from "@/lib/store";
import { motion } from "framer-motion";
import { Gift, Mail, User, MessageSquare, Sparkles, Trash2, ShoppingBag, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatEGP } from "@/lib/utils";
import { toast } from "sonner";

export function GiftCardsView() {
  const { giftCards, addGiftCard, removeGiftCard, setView } = useShopStore();
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [design, setDesign] = useState<string>("classic");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  const finalAmount = customAmount ? Math.max(100, Math.min(5000, parseInt(customAmount) || 0)) : amount;

  const handleAdd = () => {
    if (finalAmount < 100) {
      toast.error("الحد الأدنى لبطاقة الهدية 100 ج.م");
      return;
    }
    if (finalAmount > 5000) {
      toast.error("الحد الأقصى لبطاقة الهدية 5000 ج.م");
      return;
    }
    if (!recipientName.trim() || !recipientEmail.trim()) {
      toast.error("يرجى إدخال اسم المستلم وبريده الإلكتروني");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    addGiftCard({
      amount: finalAmount,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      senderName: senderName.trim() || "غير معروف",
      message: message.trim(),
      design,
    });
    toast.success(`تمت إضافة بطاقة هدية بقيمة ${formatEGP(finalAmount)}`);
    // reset
    setRecipientName("");
    setRecipientEmail("");
    setSenderName("");
    setMessage("");
    setCustomAmount("");
  };

  const selectedDesign = GIFT_CARD_DESIGNS.find((d) => d.id === design) || GIFT_CARD_DESIGNS[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-warm-gray mb-6">
        <button onClick={() => setView("home")} className="hover:text-burgundy">
          الرئيسية
        </button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-burgundy font-semibold">بطاقات الهدايا</span>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex w-16 h-16 rounded-2xl bg-burgundy items-center justify-center mb-4 shadow-luxury"
        >
          <Gift className="w-8 h-8 text-rose-gold" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold text-burgundy mb-2">
          بطاقات هدايا GLIMOKA
        </h1>
        <p className="text-warm-gray max-w-xl mx-auto">
          أهدِ من تحب تجربة مجوهرات فاخرة ومخصصة. البطاقة تُرسل إلكترونيًا ويمكن استخدامها في أي منتج.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-white rounded-3xl border border-rose-gold/20 p-6 sm:p-8 shadow-luxury">
          <h2 className="text-xl font-bold text-warm-black mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-gold" />
            صمّم بطاقة الهدية
          </h2>

          {/* Amount selection */}
          <div className="mb-6">
            <Label className="text-sm font-bold text-warm-black mb-3 block">
              اختر القيمة
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {GIFT_CARD_PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setAmount(v);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    !customAmount && amount === v
                      ? "border-burgundy bg-burgundy text-white shadow-luxury"
                      : "border-rose-gold/20 bg-cream text-warm-black hover:border-burgundy/50"
                  }`}
                >
                  {formatEGP(v)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Label className="text-xs text-warm-gray mb-1.5 block">
                أو أدخل قيمة مخصصة (100 - 5000 ج.م)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={100}
                  max={5000}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="مثال: 1200"
                  className="pr-16 border-rose-gold/30 focus:border-burgundy"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-warm-gray font-semibold">
                  ج.م
                </span>
              </div>
            </div>
          </div>

          {/* Design selection */}
          <div className="mb-6">
            <Label className="text-sm font-bold text-warm-black mb-3 block">
              اختر التصميم
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {GIFT_CARD_DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDesign(d.id)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                    design === d.id
                      ? "border-burgundy scale-105 shadow-luxury"
                      : "border-rose-gold/20 hover:border-burgundy/40"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${d.color} 0%, ${d.color}dd 100%)` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white/90" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-warm-black/40 text-white text-[10px] py-1 text-center">
                    {d.name}
                  </div>
                  {design === d.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-burgundy" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient info */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-bold text-warm-black mb-1.5 block">
                اسم المستلم *
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="اسم من سيرسل له الهدية"
                  className="pr-10 border-rose-gold/30 focus:border-burgundy"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-bold text-warm-black mb-1.5 block">
                بريد المستلم الإلكتروني *
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <Input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pr-10 border-rose-gold/30 focus:border-burgundy"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-bold text-warm-black mb-1.5 block">
                اسم المُرسِل (اختياري)
              </Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="اسمك (اختياري)"
                className="border-rose-gold/30 focus:border-burgundy"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-warm-black mb-1.5 block">
                رسالة شخصية (اختياري)
              </Label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-warm-gray" />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك الشخصية..."
                  rows={3}
                  className="pr-10 border-rose-gold/30 focus:border-burgundy resize-none"
                  maxLength={200}
                />
              </div>
              <p className="text-[11px] text-warm-gray mt-1 text-left">
                {message.length}/200
              </p>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            className="w-full mt-6 bg-burgundy hover:bg-burgundy-deep text-white py-6 text-base font-bold rounded-xl"
          >
            <Gift className="w-5 h-5 ml-2" />
            أضف بطاقة الهدية للسلة — {formatEGP(finalAmount)}
          </Button>
        </div>

        {/* Right: Preview + cart */}
        <div className="space-y-6">
          {/* Live preview */}
          <div className="sticky top-4">
            <h2 className="text-xl font-bold text-warm-black mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-gold" />
              معاينة البطاقة
            </h2>
            <motion.div
              key={`${design}-${finalAmount}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl overflow-hidden shadow-luxury-lg aspect-[3/2] relative"
              style={{
                background: `linear-gradient(135deg, ${selectedDesign.color} 0%, ${selectedDesign.color}cc 50%, ${selectedDesign.color}99 100%)`,
              }}
            >
              {/* decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-4 border-white" />
              </div>
              {/* content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">GLIMOKA</p>
                    <p className="text-xs opacity-90">بطاقة هدية رقمية</p>
                  </div>
                  <Gift className="w-8 h-8 opacity-90" />
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-bold mb-1">
                    {formatEGP(finalAmount)}
                  </p>
                  <p className="text-xs opacity-80">قيمة البطاقة</p>
                </div>
                <div className="flex items-end justify-between text-xs">
                  <div>
                    <p className="opacity-70 mb-0.5">إلى:</p>
                    <p className="font-bold">
                      {recipientName || "اسم المستلم"}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="opacity-70 mb-0.5">من:</p>
                    <p className="font-bold">
                      {senderName || "غير معروف"}
                    </p>
                  </div>
                </div>
                {message && (
                  <p className="text-[11px] italic opacity-90 border-t border-white/20 pt-2 mt-2">
                    "{message}"
                  </p>
                )}
              </div>
            </motion.div>

            {/* Gift cards in cart */}
            {giftCards.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-rose-gold/20 p-4 shadow-luxury">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-warm-black text-sm">
                    بطاقات في السلة ({giftCards.length})
                  </h3>
                  <span className="text-sm font-bold text-burgundy">
                    {formatEGP(calcGiftCardsTotal(giftCards))}
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {giftCards.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center gap-2 p-2 bg-cream rounded-lg"
                    >
                      <div
                        className="w-8 h-8 rounded-md shrink-0 flex items-center justify-center"
                        style={{
                          background: GIFT_CARD_DESIGNS.find((d) => d.id === g.design)?.color || "#C9A87C",
                        }}
                      >
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-warm-black">
                          {formatEGP(g.amount)} → {g.recipientName}
                        </p>
                        <p className="text-[10px] text-warm-gray truncate" dir="ltr">
                          {g.recipientEmail}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeGiftCard(g.id);
                          toast.success("أُزيلت بطاقة الهدية");
                        }}
                        className="w-7 h-7 rounded-full hover:bg-danger-soft/10 text-warm-gray hover:text-danger-soft flex items-center justify-center transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setView("cart")}
                  className="w-full mt-3 bg-burgundy hover:bg-burgundy-deep text-white"
                >
                  <ShoppingBag className="w-4 h-4 ml-2" />
                  الذهاب للسلة
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="mt-6 bg-cream-dark rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-warm-black mb-2">لماذا بطاقات GLIMOKA؟</p>
              {[
                "تُسلّم إلكترونيًا خلال دقائق",
                "صالحة لمدة 12 شهرًا",
                "تصلح لكل المنتجات والتخصيصات",
                "بدون رسوم إضافية",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-warm-gray">
                  <Check className="w-3.5 h-3.5 text-emerald-soft shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
