"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Quote,
  Heart,
  Gift,
  Palette,
  Ruler,
  Award,
  TrendingUp,
  Shield,
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  Gem,
  Scissors,
  X,
} from "lucide-react";
import { useShopStore } from "@/lib/store";
import { ProductCard, type ProductCardData } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/lib/utils";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const CATEGORIES = [
  { slug: "bracelets", name: "أساور", desc: "باسمك المخصص", icon: " bracelet", img: "/categories/bracelets.jpg" },
  { slug: "necklaces", name: "قلائد", desc: "تصاميم رومانسية", img: "/categories/necklaces.jpg" },
  { slug: "rings", name: "خواتم", desc: "بكل المقاسات", img: "/categories/rings.jpg" },
  { slug: "offers", name: "عروض", desc: "حتى خصم 33%", img: "/categories/offers.jpg" },
];

const TESTIMONIALS = [
  { name: "نورهان أحمد", city: "القاهرة", rating: 5, text: "السوار وصل في علبة فخمة جدًا والاسم مكتوب بدقة. أحسن هدية لزميلتي!" },
  { name: "محمد خالد", city: "الجيزة", rating: 5, text: "اشتريت قلادة لزوجتي في عيد ميلادها وانبهرت. الجودة ممتازة والخدمة محترمة." },
  { name: "سارة محمود", city: "الإسكندرية", rating: 5, text: "خاتم الخطوبة طلع أحلى من الصور. شكرًا GLIMOKA على الذوق الراقي." },
  { name: "أحمد فؤاد", city: "المنصورة", rating: 5, text: "تعاملت معاهم أكتر من مرة وكل مرة بيفاجئوني بالجودة. أنصح فيهم بشدة." },
];

export function HomeView() {
  const { setView, setCartDrawerOpen, recentlyViewed: recentIds, clearRecentlyViewed } = useShopStore();
  const [bestSellers, setBestSellers] = useState<ProductCardData[]>([]);
  const [featured, setFeatured] = useState<ProductCardData[]>([]);
  const [onSale, setOnSale] = useState<ProductCardData[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [bs, ft, sale] = await Promise.all([
          fetch("/api/products?bestSeller=true&sort=best-selling&limit=8").then((r) => r.json()),
          fetch("/api/products?featured=true&limit=4").then((r) => r.json()),
          fetch("/api/products?onSale=true&sort=price-asc&limit=4").then((r) => r.json()),
        ]);
        setBestSellers(bs.products || []);
        setFeatured(ft.products || []);
        setOnSale(sale.products || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch recently viewed products (separate effect to handle hydration timing)
  useEffect(() => {
    if (recentIds.length === 0) {
      setRecentlyViewed([]);
      return;
    }
    let cancelled = false;
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const ordered = recentIds
          .map((id) => (data.products || []).find((p: ProductCardData) => p.id === id))
          .filter(Boolean)
          .slice(0, 4) as ProductCardData[];
        setRecentlyViewed(ordered);
      });
    return () => {
      cancelled = true;
    };
  }, [recentIds]);

  const [offerEnds] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 59);
    return d.getTime();
  });
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const t = setInterval(() => {
      const diff = offerEnds - Date.now();
      if (diff <= 0) {
        setTimeLeft("انتهى العرض");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d} يوم ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(t);
  }, [offerEnds]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy-gradient" />
        {/* Decorative swirls */}
        <svg className="absolute top-0 left-0 w-64 h-64 text-rose-gold/10 -translate-x-1/3 -translate-y-1/3" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.7,-58.4C54.9,-48.4,63.7,-34.1,67.6,-18.7C71.5,-3.3,70.5,13.2,63.2,26.7C55.9,40.2,42.3,50.7,27.2,57.3C12.1,63.9,-4.5,66.6,-20.3,62.7C-36.1,58.8,-51.1,48.3,-59.8,34.1C-68.5,19.9,-70.9,2,-66.5,-13.9C-62.1,-29.8,-50.9,-43.7,-37.6,-53.7C-24.3,-63.7,-8.9,-69.8,5.3,-76.8C19.5,-83.8,30.5,-68.4,42.7,-58.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-80 h-80 text-burgundy-light/20 translate-x-1/4 translate-y-1/4" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.7,-58.4C54.9,-48.4,63.7,-34.1,67.6,-18.7C71.5,-3.3,70.5,13.2,63.2,26.7C55.9,40.2,42.3,50.7,27.2,57.3C12.1,63.9,-4.5,66.6,-20.3,62.7C-36.1,58.8,-51.1,48.3,-59.8,34.1C-68.5,19.9,-70.9,2,-66.5,-13.9C-62.1,-29.8,-50.9,-43.7,-37.6,-53.7C-24.3,-63.7,-8.9,-69.8,5.3,-76.8C19.5,-83.8,30.5,-68.4,42.7,-58.4Z" transform="translate(100 100)" />
        </svg>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white text-center lg:text-right space-y-6 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-rose-gold/30">
                <Sparkles className="w-4 h-4 text-rose-gold-light" />
                <span className="text-sm font-medium">مجوهرات شخصية فاخرة — صُنعت خصيصًا لك</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                مجوهرات تحمل
                <span className="block text-gradient-rose mt-1">اسمك بفخر</span>
              </h1>

              <p className="text-lg text-white/80 max-w-lg mx-auto lg:mr-0 leading-relaxed">
                أساور وقلائد وخواتم بأسماء مخصصة، مصنوعة يدويًا بخامات فاخرة.
                الدفع عند الاستلام وشحن لكل مصر.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setView("products")}
                  className="bg-rose-gold hover:bg-rose-gold-light text-warm-black font-bold text-base px-8 h-12"
                >
                  تسوق الآن
                  <ArrowLeft className="w-5 h-5 mr-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView("products", { category: "offers" })}
                  className="border-white/40 text-white hover:bg-white hover:text-burgundy font-semibold h-12 px-6"
                >
                  <Gift className="w-5 h-5 ml-1" />
                  عروض اليوم
                </Button>
              </div>

              {/* Countdown */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur border border-rose-gold/20">
                <div className="text-right">
                  <p className="text-xs text-white/60">ينتهي عرض الحب خلال</p>
                  <p className="font-mono font-bold text-rose-gold-light text-lg" dir="ltr">
                    {timeLeft}
                  </p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-xs text-white/60">خصم يصل لـ</p>
                  <p className="font-bold text-white text-lg">33%</p>
                </div>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury-lg border-4 border-white/10">
                <img
                  src="/brand/hero.jpg"
                  alt="تشكيلة مجوهرات GLIMOKA الفاخرة"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-cream rounded-2xl shadow-luxury-lg p-4 border border-rose-gold/30 max-w-[180px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-burgundy" />
                  <span className="font-bold text-warm-black text-sm">جودة مضمونة</span>
                </div>
                <p className="text-xs text-warm-gray">خامات أصلية مع ضمان مدى الحياة على النقش</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-4 -left-4 bg-rose-gold rounded-2xl shadow-luxury-lg p-3 text-warm-black"
              >
                <p className="text-xs font-semibold">+5000 عميل سعيد</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warm-black text-warm-black" />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="container mx-auto px-4">
        <SectionHeading
          eyebrow="تسوق حسب الفئة"
          title="اكتشف تشكيلتنا"
          subtitle="مجوهرات مخصصة لكل لحظة ومناسبة"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setView("products", { category: cat.slug })}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-burgundy/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 text-center text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-0.5">{cat.name}</h3>
                <p className="text-xs text-rose-gold-light">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  تسوق الآن <ArrowLeft className="w-3 h-3" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 gap-4">
          <SectionHeading
            eyebrow="الأكثر مبيعًا"
            title="الأكثر طلبًا هذا الأسبوع"
            subtitle="اختيارات عملائنا المفضلة"
            align="right"
          />
          <Button
            variant="outline"
            onClick={() => setView("products")}
            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white shrink-0"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ===== PERSONALIZATION SHOWCASE ===== */}
      <section className="bg-cream-dark/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury-lg">
                <img src="/brand/personalization.jpg" alt="تخصيص المجوهرة باسمك" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 right-5 bg-white rounded-2xl shadow-luxury-lg p-4 border border-rose-gold/30 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-burgundy-gradient flex items-center justify-center">
                  <Palette className="w-6 h-6 text-rose-gold-light" />
                </div>
                <div>
                  <p className="font-bold text-warm-black text-sm">معاينة حية فورية</p>
                  <p className="text-xs text-warm-gray">شاهد اسمك على القطعة قبل الشراء</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-5"
            >
              <p className="text-rose-gold font-bold text-sm tracking-wide">لماذا GLIMOKA؟</p>
              <h2 className="text-3xl sm:text-4xl font-black text-warm-black leading-tight">
                خصّص مجوهرة تُحكي
                <span className="text-gradient-burgundy"> قصتك</span>
              </h2>
              <p className="text-warm-gray leading-relaxed">
                في GLIMOKA نؤمن أن كل قطعة مجوهرة تحمل قصة. اختر اسمك أو اسم من تحب،
                حدد الخط والمعدن والحجم، وشاهد المعاينة الحية قبل أن تطلب.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Palette, title: "4 خطوط للكتابة", desc: "عربي تقليدي، عربي حديث، إنجليزي، رموز" },
                  { icon: Award, title: "4 خامات فاخرة", desc: "فضة 925، ذهب 18، ذهب 21، روديوم" },
                  { icon: Ruler, title: "كل المقاسات", desc: "أساور 16-20 سم، خواتم 10-25" },
                  { icon: Gift, title: "علبة هدية فاخرة", desc: "خيار علبة هدية وبطاقة إهداء مخصصة" },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-rose-gold/20">
                    <div className="w-10 h-10 rounded-lg bg-burgundy-gradient flex items-center justify-center shrink-0">
                      <f.icon className="w-5 h-5 text-rose-gold-light" />
                    </div>
                    <div>
                      <p className="font-bold text-warm-black text-sm">{f.title}</p>
                      <p className="text-xs text-warm-gray">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setView("products")}
                className="bg-burgundy hover:bg-burgundy-deep h-12 px-8 text-base"
              >
                ابدأ التخصيص الآن
                <ArrowLeft className="w-5 h-5 mr-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ON SALE ===== */}
      {onSale.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 gap-4">
            <SectionHeading
              eyebrow="عروض محدودة"
              title="وفّر أكثر اليوم"
              subtitle="خصومات تصل إلى 33% — لفترة محدودة"
              align="right"
            />
            <Button
              variant="outline"
              onClick={() => setView("products", { category: "offers" })}
              className="border-danger-soft text-danger-soft hover:bg-danger-soft hover:text-white shrink-0"
            >
              <TrendingUp className="w-4 h-4 ml-1" />
              كل العروض
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {onSale.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-burgundy-gradient py-16 text-white relative overflow-hidden">
        <svg className="absolute top-0 right-0 w-72 h-72 text-rose-gold/10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.7,-58.4C54.9,-48.4,63.7,-34.1,67.6,-18.7C71.5,-3.3,70.5,13.2,63.2,26.7C55.9,40.2,42.3,50.7,27.2,57.3C12.1,63.9,-4.5,66.6,-20.3,62.7C-36.1,58.8,-51.1,48.3,-59.8,34.1C-68.5,19.9,-70.9,2,-66.5,-13.9C-62.1,-29.8,-50.9,-43.7,-37.6,-53.7C-24.3,-63.7,-8.9,-69.8,5.3,-76.8C19.5,-83.8,30.5,-68.4,42.7,-58.4Z" transform="translate(100 100)" />
        </svg>
        <div className="container mx-auto px-4 relative">
          <SectionHeading
            eyebrow="آراء عملائنا"
            title="قصص حقيقية، فرح حقيقي"
            subtitle="أكثر من 5000 عميل سعيد في كل مصر"
            light
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15"
              >
                <Quote className="w-8 h-8 text-rose-gold-light mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-rose-gold-light text-rose-gold-light" />
                  ))}
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-4 min-h-[80px]">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-rose-gold flex items-center justify-center text-warm-black font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-white/60">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT + INSTAGRAM ===== */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <p className="text-rose-gold font-bold text-sm tracking-wide">قصة GLIMOKA</p>
            <h2 className="text-3xl sm:text-4xl font-black text-warm-black leading-tight">
              فخامة معاصرة بلمسة
              <span className="text-gradient-burgundy"> دافئة</span>
            </h2>
            <p className="text-warm-gray leading-relaxed">
              بدأت GLIMOKA بحلم بسيط: أن يحمل كل شخص مجوهرة تُحكي قصته. نختار خاماتنا
              بعناية، وننقش الأسماء بأيدي حرفيين مهرة، لنقدم لك قطعة فريدة تدوم معك سنوات.
            </p>
            <p className="text-warm-gray leading-relaxed">
              نؤمن أن الفخامة الحقيقية في التفاصيل — في علبة الهدية، في بطاقة الإهداء،
              في رسالة الواتساب التي تؤكد طلبك. كل تفصيلة صُممت لتمنحك تجربة استثنائية.
            </p>
            <Button
              onClick={() => setView("about")}
              variant="outline"
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            >
              اقرأ المزيد عنا
              <ArrowLeft className="w-4 h-4 mr-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-luxury-lg">
              <img src="/brand/story.jpg" alt="حرفية GLIMOKA" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>

        {/* Instagram-style grid */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="@glimoka"
            title="تابعنا على إنستجرام"
            subtitle="آخر تصاميمنا وقصص عملائنا"
          />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-8">
            {[
              "bracelet-gold-1", "necklace-heart-1", "ring-gold-1",
              "bracelet-silver-1", "necklace-gold-1", "ring-silver-1",
            ].map((slug, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-cream-dark"
              >
                <img
                  src={`/products/${slug}.jpg`}
                  alt="منشور إنستجرام"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/40 transition-colors flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENTLY VIEWED ===== */}
      {recentlyViewed.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm font-bold tracking-wide mb-2 text-rose-gold">تابع التصفح</p>
              <h2 className="text-2xl sm:text-3xl font-black text-warm-black">شاهدته مؤخرًا</h2>
              <p className="text-sm text-warm-gray mt-1">استكمل من حيث توقفت</p>
            </div>
            <button
              onClick={() => {
                clearRecentlyViewed();
                toast.success("تم مسح السجل");
              }}
              className="text-xs text-warm-gray hover:text-danger-soft transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-cream-dark"
            >
              <X className="w-3.5 h-3.5" />
              مسح السجل
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ===== WHY GLIMOKA — Trust Features ===== */}
      <section className="container mx-auto px-4">
        <SectionHeading
          eyebrow="لماذا GLIMOKA؟"
          title="تجربة فاخرة من البداية للنهاية"
          subtitle="نعدك بأكثر من مجرد مجوهرة — نعدك بتجربة تليق بك"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
            {
              icon: Gem,
              title: "خامات أصلية",
              desc: "ذهب وفضة عيار 925 و18 و21 — بشهادات ضمان",
              color: "text-rose-gold",
              bg: "bg-rose-gold/10",
            },
            {
              icon: Scissors,
              title: "نقش يدوي",
              desc: "حرفيون مهرة ينقشون اسمك بدقة فائقة",
              color: "text-burgundy",
              bg: "bg-burgundy/10",
            },
            {
              icon: Truck,
              title: "شحن سريع",
              desc: "توصيل لكل محافظات مصر خلال 2-5 أيام",
              color: "text-emerald-soft",
              bg: "bg-emerald-soft/10",
            },
            {
              icon: RotateCcw,
              title: "إرجاع سهل",
              desc: "استبدال أو إرجاع خلال 14 يوم بدون تعقيد",
              color: "text-burgundy-light",
              bg: "bg-burgundy-light/10",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-rose-gold/20 p-5 text-center card-luxury-hover hover:border-rose-gold/50 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="font-bold text-warm-black text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-warm-gray leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 bg-burgundy-gradient rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
        >
          <div className="diamond-pattern absolute inset-0 opacity-30" />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "+5000", label: "عميل سعيد" },
              { value: "4.8★", label: "متوسط التقييم" },
              { value: "+12K", label: "قطعة مُخصصة" },
              { value: "24/7", label: "دعم متواصل" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-black text-rose-gold-light">{s.value}</p>
                <p className="text-xs sm:text-sm text-white/70 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== GIFT CARDS PROMO BANNER ===== */}
      <section className="container mx-auto px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setView("gift-cards")}
          className="w-full bg-gradient-to-l from-burgundy via-burgundy-light to-rose-gold rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden group text-right"
        >
          <div className="absolute inset-0 shimmer-sweep opacity-40" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold mb-2">
                <Gift className="w-3.5 h-3.5 text-rose-gold-light" />
                جديد
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-1">
                بطاقات هدايا GLIMOKA الرقمية
              </h3>
              <p className="text-sm text-white/80">
                أهدِ من تحب تجربة مجوهرات فاخرة — تُسلّم خلال دقائق
              </p>
            </div>
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-rose-gold-light" />
            </div>
          </div>
        </motion.button>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="container mx-auto px-4">
        <div className="bg-cream-dark rounded-3xl p-8 sm:p-12 border border-rose-gold/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-burgundy/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy text-white text-sm">
              <Gift className="w-4 h-4 text-rose-gold-light" />
              خصم 10% على أول طلب
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-warm-black">
              انضم لعائلة GLIMOKA
            </h2>
            <p className="text-warm-gray">
              اشترك في نشرتنا واحصل على كود خصم 10% فورًا، плюс عروض حصرية ومحدثات المنتجات الجديدة.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("تم الاشتراك! كود الخصم: WELCOME10");
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-rose-gold/30 focus:outline-none focus:border-rose-gold text-sm"
              />
              <Button type="submit" className="bg-burgundy hover:bg-burgundy-deep h-12 px-6">
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "right";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "text-right"}>
      {eyebrow && (
        <p className={`text-sm font-bold tracking-wide mb-2 ${light ? "text-rose-gold-light" : "text-rose-gold"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-tight ${light ? "text-white" : "text-warm-black"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-sm sm:text-base ${light ? "text-white/70" : "text-warm-gray"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-rose-gold/20 overflow-hidden">
          <div className="aspect-square shimmer" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-2/3 shimmer rounded" />
            <div className="h-3 w-1/2 shimmer rounded" />
            <div className="h-5 w-1/3 shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
