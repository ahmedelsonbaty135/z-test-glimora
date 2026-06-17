"use client";

import { useEffect, useState, useRef } from "react";
import { useShopStore, type CartItemCustomization, type CartItem } from "@/lib/store";
import {
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  CreditCard,
  RotateCcw,
  ChevronLeft,
  Check,
  Gift,
  MessageSquare,
  Sparkles,
  ZoomIn,
  Camera,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  formatEGP,
  discountPercent,
  METAL_LABELS,
  METAL_PRICE_ADDON,
  METAL_COLOR_HEX,
  starArray,
} from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ProductCard, type ProductCardData } from "../ProductCard";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  body: string;
  photosJson?: string | null;
  createdAt: string;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  comparePrice?: number | null;
  metalOptions: string;
  sizeOptions: string;
  fontOptions: string;
  isPersonalizable: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  giftBoxPrice: number;
  giftCardPrice: number;
  material?: string | null;
  category: { name: string };
  images: { url: string; alt?: string | null }[];
  reviews: Review[];
}

export function ProductDetailView() {
  const { selectedProductSlug, openProduct, addToCart, setView, toggleWishlist, wishlist, addRecentlyViewed, toggleBackInStockSub, backInStockSubs } = useShopStore();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, title: "", body: "" });
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]); // base64 data URLs
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoom, setZoom] = useState(false);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const metals = product?.metalOptions.split(",").map((m) => m.trim()) || [];
  const sizes = product?.sizeOptions.split(",").map((s) => s.trim()) || [];
  const fonts = product?.fontOptions.split(",").map((f) => f.trim()) || [];

  const [customization, setCustomization] = useState<CartItemCustomization>({
    metal: "",
    size: "",
    font: "",
    name1: "",
    name2: "",
    giftBox: false,
    giftCard: "",
  });

  useEffect(() => {
    if (!selectedProductSlug) {
      setView("products");
      return;
    }
    setLoading(true);
    setActiveImage(0);
    setQty(1);
    fetch(`/api/products/${selectedProductSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          addRecentlyViewed(data.product.id);
          setCustomization({
            metal: data.product.metalOptions.split(",")[0]?.trim() || "SILVER_925",
            size: data.product.sizeOptions.split(",")[0]?.trim() || "",
            font: data.product.fontOptions.split(",")[0]?.trim() || "",
            name1: "",
            name2: "",
            giftBox: false,
            giftCard: "",
          });
        } else {
          toast.error("المنتج غير موجود");
          setView("products");
        }
      })
      .finally(() => setLoading(false));
  }, [selectedProductSlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square shimmer rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 shimmer rounded" />
            <div className="h-4 w-1/3 shimmer rounded" />
            <div className="h-10 w-1/4 shimmer rounded" />
            <div className="h-24 w-full shimmer rounded" />
            <div className="h-12 w-full shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = discountPercent(product.basePrice, product.comparePrice);
  const metalAddon = METAL_PRICE_ADDON[customization.metal] || 0;
  const unitPrice =
    product.basePrice +
    metalAddon +
    (customization.giftBox ? product.giftBoxPrice : 0) +
    (customization.giftCard ? product.giftCardPrice : 0);
  const isWishlisted = wishlist.includes(product.id);
  const images = product.images.length > 0 ? product.images : [{ url: "/products/placeholder.jpg", alt: product.name }];
  const isRing = product.category.name.includes("خواتم");
  const metalColor = METAL_COLOR_HEX[customization.metal] || "#C9A87C";

  const handleAddToCart = () => {
    if (product.isPersonalizable) {
      if (!customization.name1.trim()) {
        toast.error("من فضلك أدخل الاسم الأول");
        return;
      }
      if (!customization.metal || !customization.size) {
        toast.error("اختر المعدن والمقاس");
        return;
      }
    }
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0].url,
      basePrice: product.basePrice,
      unitPrice,
      quantity: qty,
      customization,
      maxStock: product.stock,
    } as Omit<CartItem, "id">);
    toast.success(`تمت إضافة "${product.name}" للسلة`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setView("checkout");
  };

  const handleWhatsApp = () => {
    const msg = `أهلًا GLIMOKA! حابب أستفسر عن: ${product.name} (${formatEGP(unitPrice)})\nالمعدن: ${METAL_LABELS[customization.metal] || customization.metal}\nالاسم: ${customization.name1} ${customization.name2}`;
    window.open(`https://wa.me/201000000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName || !reviewForm.body) {
      toast.error("أكمل بيانات المراجعة");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, productId: product.id, photos: reviewPhotos }),
      });
      if (res.ok) {
        toast.success("شكرًا! تمت إضافة مراجعتك");
        setReviewForm({ authorName: "", rating: 5, title: "", body: "" });
        setReviewPhotos([]);
        // refresh
        const data = await fetch(`/api/products/${product.slug}`).then((r) => r.json());
        if (data.product) setProduct(data.product);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const maxPhotos = 3;
    const remaining = maxPhotos - reviewPhotos.length;
    if (remaining <= 0) {
      toast.error("يمكن إضافة حتى 3 صور");
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setReviewPhotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => r.rating === star).length;
    const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5 flex-wrap">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <button onClick={() => setView("products", { category: product.category.name.includes("خواتم") ? "rings" : product.category.name.includes("قلائد") ? "necklaces" : "bracelets" })} className="hover:text-burgundy">
          {product.category.name}
        </button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ===== Gallery ===== */}
        <div className="space-y-3">
          <div
            ref={imgWrapRef}
            className="relative aspect-square rounded-3xl overflow-hidden bg-cream-dark border border-rose-gold/20 cursor-zoom-in group"
            onClick={() => setZoom((z) => !z)}
            onMouseMove={(e) => {
              if (!zoom) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--zx", `${x}%`);
              e.currentTarget.style.setProperty("--zy", `${y}%`);
            }}
            style={
              zoom
                ? {
                    backgroundImage: `url(${images[activeImage].url})`,
                    backgroundSize: "200%",
                    backgroundPosition: "var(--zx) var(--zy)",
                  }
                : undefined
            }
          >
            {!zoom && (
              <>
                <img
                  src={images[activeImage].url}
                  alt={images[activeImage].alt || product.name}
                  className="w-full h-full object-cover"
                />
                {/* Live preview name overlay */}
                {product.isPersonalizable && customization.name1 && (
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-center pb-12 pointer-events-none">
                    <motion.span
                      key={customization.name1 + customization.name2 + customization.metal}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl sm:text-3xl font-bold"
                      style={{
                        color: metalColor,
                        textShadow: "0 2px 8px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.6)",
                        fontFamily: customization.font.includes("إنجليزي") ? "Inter, sans-serif" : "'Cairo', sans-serif",
                      }}
                    >
                      {customization.name1}
                      {customization.name2 && ` ${customization.name2}`}
                    </motion.span>
                    {customization.giftCard && (
                      <span className="mt-2 text-sm bg-white/80 text-warm-black px-3 py-1 rounded-full max-w-xs text-center">
                        {customization.giftCard}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="bg-danger-soft text-white text-xs font-bold px-2.5 py-1 rounded-full">خصم {discount}%</span>
              )}
              {product.soldCount > 100 && (
                <span className="bg-rose-gold text-warm-black text-xs font-bold px-2.5 py-1 rounded-full">🔥 الأكثر مبيعًا</span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3 h-3" /> انقر للتكبير
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-luxury pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                    activeImage === i ? "border-burgundy scale-105" : "border-rose-gold/20 opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img.url} alt={img.alt || `صورة ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { icon: Shield, label: "ضمان الجودة" },
              { icon: Truck, label: "شحن لكل مصر" },
              { icon: CreditCard, label: "دفع عند الاستلام" },
              { icon: RotateCcw, label: "إرجاع 14 يوم" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-rose-gold/15 text-center">
                <b.icon className="w-5 h-5 text-burgundy" />
                <span className="text-[11px] text-warm-gray font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Info ===== */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-rose-gold font-bold mb-1">{product.category.name}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-warm-black leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                {starArray(product.rating).map((s, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      s === "full" ? "fill-rose-gold text-rose-gold" : s === "half" ? "fill-rose-gold/50 text-rose-gold" : "text-rose-gold/30"
                    )}
                  />
                ))}
                <span className="text-sm font-bold text-warm-black mr-1">{product.rating.toFixed(1)}</span>
              </div>
              <button
                onClick={() => document.getElementById("reviews-tab")?.click()}
                className="text-sm text-warm-gray hover:text-burgundy"
              >
                ({product.reviewCount} مراجعة)
              </button>
              <span className="text-sm text-emerald-soft font-medium">• بيع {product.soldCount}+ قطعة</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-burgundy">{formatEGP(unitPrice)}</span>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span className="text-lg text-warm-gray line-through">{formatEGP(product.comparePrice)}</span>
            )}
            {discount > 0 && (
              <span className="bg-danger-soft/10 text-danger-soft text-sm font-bold px-2 py-0.5 rounded-full">
                وفّر {formatEGP((product.comparePrice || 0) - product.basePrice)}
              </span>
            )}
          </div>
          {metalAddon > 0 && (
            <p className="text-xs text-warm-gray">شامل إضافة المعدن {formatEGP(metalAddon)}</p>
          )}

          <p className="text-warm-gray leading-relaxed">{product.shortDesc}</p>

          {/* ===== Personalization Form ===== */}
          {product.isPersonalizable && (
            <div className="bg-cream-dark/50 rounded-2xl p-5 border-2 border-rose-gold/30 relative">
              <div className="absolute -top-3 right-5 bg-burgundy-gradient text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-gold-light" />
                خصّص مجوهرك
              </div>

              <div className="space-y-4 mt-2">
                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name1" className="text-sm font-bold text-warm-black">
                      الاسم الأول <span className="text-danger-soft">*</span>
                    </Label>
                    <Input
                      id="name1"
                      value={customization.name1}
                      onChange={(e) => setCustomization({ ...customization, name1: e.target.value.slice(0, 15) })}
                      placeholder="مثال: أحمد"
                      maxLength={15}
                      className="bg-white border-rose-gold/40 focus-visible:ring-rose-gold mt-1"
                    />
                    <p className="text-[11px] text-warm-gray mt-1">{customization.name1.length}/15</p>
                  </div>
                  <div>
                    <Label htmlFor="name2" className="text-sm font-bold text-warm-black">
                      الاسم الثاني (اختياري)
                    </Label>
                    <Input
                      id="name2"
                      value={customization.name2}
                      onChange={(e) => setCustomization({ ...customization, name2: e.target.value.slice(0, 15) })}
                      placeholder="مثال: سارة"
                      maxLength={15}
                      className="bg-white border-rose-gold/40 focus-visible:ring-rose-gold mt-1"
                    />
                    <p className="text-[11px] text-warm-gray mt-1">{customization.name2.length}/15</p>
                  </div>
                </div>

                {/* Font */}
                <div>
                  <Label className="text-sm font-bold text-warm-black mb-2 block">نوع الخط</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fonts.map((f) => (
                      <button
                        key={f}
                        onClick={() => setCustomization({ ...customization, font: f })}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm transition-all text-right",
                          customization.font === f
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-rose-gold/30 bg-white hover:border-burgundy"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metal */}
                <div>
                  <Label className="text-sm font-bold text-warm-black mb-2 block">المعدن</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {metals.map((m) => {
                      const addon = METAL_PRICE_ADDON[m] || 0;
                      return (
                        <button
                          key={m}
                          onClick={() => setCustomization({ ...customization, metal: m })}
                          className={cn(
                            "px-3 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2",
                            customization.metal === m
                              ? "border-burgundy bg-burgundy/5"
                              : "border-rose-gold/30 bg-white hover:border-burgundy"
                          )}
                        >
                          <span
                            className="w-5 h-5 rounded-full border-2 border-white shadow shrink-0"
                            style={{ backgroundColor: METAL_COLOR_HEX[m] }}
                          />
                          <div className="text-right flex-1 min-w-0">
                            <p className="font-medium text-warm-black truncate">{METAL_LABELS[m] || m}</p>
                            {addon > 0 && <p className="text-[11px] text-warm-gray">+{formatEGP(addon)}</p>}
                          </div>
                          {customization.metal === m && <Check className="w-4 h-4 text-burgundy" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <Label className="text-sm font-bold text-warm-black mb-2 block">
                    {isRing ? "مقاس الخاتم" : "مقاس اليد (سم)"}
                  </Label>
                  <Select value={customization.size} onValueChange={(v) => setCustomization({ ...customization, size: v })}>
                    <SelectTrigger className="bg-white border-rose-gold/40">
                      <SelectValue placeholder="اختر المقاس" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((s) => (
                        <SelectItem key={s} value={s}>{s}{isRing ? "" : " سم"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gift addons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-start gap-2 p-3 rounded-lg border border-rose-gold/30 bg-white cursor-pointer hover:border-burgundy">
                    <Checkbox
                      checked={customization.giftBox}
                      onCheckedChange={(v) => setCustomization({ ...customization, giftBox: Boolean(v) })}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-bold text-warm-black flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-rose-gold" /> علبة هدية فاخرة
                      </p>
                      <p className="text-[11px] text-warm-gray">+{formatEGP(product.giftBoxPrice)}</p>
                    </div>
                  </label>
                  <div className="p-3 rounded-lg border border-rose-gold/30 bg-white">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <Checkbox
                        checked={Boolean(customization.giftCard)}
                        onCheckedChange={(v) => setCustomization({ ...customization, giftCard: v ? " " : "" })}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-warm-black flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-gold" /> بطاقة إهداء
                        </p>
                        <p className="text-[11px] text-warm-gray mb-1">+{formatEGP(product.giftCardPrice)}</p>
                        {customization.giftCard && (
                          <Input
                            value={customization.giftCard.trim()}
                            onChange={(e) => setCustomization({ ...customization, giftCard: e.target.value.slice(0, 60) })}
                            placeholder="رسالتك..."
                            className="h-7 text-xs mt-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          {product.stock > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-rose-gold/30 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-cream-dark transition-colors" aria-label="إنقاص">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-warm-black">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3 hover:bg-cream-dark transition-colors" aria-label="زيادة">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-warm-gray">المخزون: {product.stock} قطعة</span>
            </div>
          ) : (
            <div className="bg-danger-soft/10 border border-danger-soft/30 rounded-xl p-4">
              <p className="text-sm font-bold text-danger-soft mb-2">⚠️ نفد المخزون مؤقتًا</p>
              <p className="text-xs text-warm-gray mb-3">سجل برقمك وسيصلك إشعار واتساب فور توفر المنتج</p>
              <button
                onClick={() => {
                  toggleBackInStockSub(product.id);
                  toast.success(
                    backInStockSubs.includes(product.id)
                      ? "تم إلغاء الاشتراك"
                      : "تم الاشتراك! سنخبرك فور التوفر 🔔"
                  );
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  backInStockSubs.includes(product.id)
                    ? "bg-emerald-soft/10 text-emerald-soft border border-emerald-soft/30"
                    : "bg-burgundy text-white hover:bg-burgundy-deep"
                }`}
              >
                <Bell className="w-4 h-4" />
                {backInStockSubs.includes(product.id) ? "✓ مشترك — اضغط للإلغاء" : "أخبرني عند التوفر"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleAddToCart} size="lg" className="bg-burgundy hover:bg-burgundy-deep h-12 text-base">
              <ShoppingBag className="w-5 h-5 ml-2" />
              أضف للسلة
            </Button>
            <Button onClick={handleBuyNow} size="lg" className="bg-rose-gold hover:bg-rose-gold-light text-warm-black h-12 text-base">
              اشترِ الآن
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleWhatsApp} variant="outline" size="lg" className="border-emerald-soft text-emerald-soft hover:bg-emerald-soft hover:text-white h-11">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current ml-1"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
              استفسار واتساب
            </Button>
            <Button
              onClick={() => {
                toggleWishlist(product.id);
                toast.success(isWishlisted ? "أُزيل من المفضلة" : "أُضيف للمفضلة ❤");
              }}
              variant="outline"
              size="lg"
              className={cn(
                "h-11",
                isWishlisted
                  ? "border-burgundy text-burgundy bg-burgundy/5"
                  : "border-rose-gold text-warm-gray hover:text-burgundy"
              )}
            >
              <Heart className={cn("w-4 h-4 ml-1", isWishlisted && "fill-burgundy")} />
              {isWishlisted ? "في المفضلة" : "أضف للمفضلة"}
            </Button>
          </div>

          {/* Description tabs */}
          <Tabs defaultValue="desc" className="mt-4">
            <TabsList className="grid grid-cols-4 bg-cream-dark h-auto">
              <TabsTrigger value="desc" className="text-xs sm:text-sm">الوصف</TabsTrigger>
              <TabsTrigger value="specs" className="text-xs sm:text-sm">المواصفات</TabsTrigger>
              <TabsTrigger value="reviews" id="reviews-tab" className="text-xs sm:text-sm">المراجعات ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping" className="text-xs sm:text-sm">الشحن</TabsTrigger>
            </TabsList>

            <TabsContent value="desc" className="mt-4 bg-white rounded-xl p-5 border border-rose-gold/15">
              <p className="text-warm-gray leading-relaxed whitespace-pre-line">{product.description}</p>
            </TabsContent>

            <TabsContent value="specs" className="mt-4 bg-white rounded-xl p-5 border border-rose-gold/15">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <SpecRow label="الفئة" value={product.category.name} />
                <SpecRow label="المعدن" value={METAL_LABELS[customization.metal] || product.material || "حسب الاختيار"} />
                <SpecRow label="التخصيص" value={product.isPersonalizable ? "متاح" : "غير متاح"} />
                <SpecRow label="المقاسات" value={product.sizeOptions.split(",").slice(0,4).join(", ") + (product.sizeOptions.split(",").length > 4 ? "..." : "")} />
                <SpecRow label="الخطوط" value={`${product.fontOptions.split(",").length} خطوط متاحة`} />
                <SpecRow label="الضمان" value="ضمان مدى الحياة على النقش" />
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-4">
              {/* Summary */}
              <div className="bg-white rounded-xl p-5 border border-rose-gold/15">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="text-center sm:border-l border-rose-gold/20 sm:pl-5">
                    <p className="text-4xl font-black text-burgundy">{product.rating.toFixed(1)}</p>
                    <div className="flex justify-center gap-0.5 my-1">
                      {starArray(product.rating).map((s, i) => (
                        <Star key={i} className={cn("w-4 h-4", s !== "empty" ? "fill-rose-gold text-rose-gold" : "text-rose-gold/30")} />
                      ))}
                    </div>
                    <p className="text-xs text-warm-gray">{product.reviewCount} مراجعة</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {ratingDist.map((r) => (
                      <div key={r.star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-warm-gray">{r.star}</span>
                        <Star className="w-3 h-3 fill-rose-gold text-rose-gold" />
                        <div className="flex-1 h-2 bg-cream-dark rounded-full overflow-hidden">
                          <div className="h-full bg-rose-gold rounded-full" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="w-6 text-warm-gray">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-3">
                {product.reviews.length === 0 ? (
                  <p className="text-center text-warm-gray py-8">لا توجد مراجعات بعد. كن أول من يراجع!</p>
                ) : (
                  product.reviews.map((r) => {
                    const reviewPhotos: string[] = r.photosJson
                      ? (() => {
                          try {
                            const parsed = JSON.parse(r.photosJson);
                            return Array.isArray(parsed) ? parsed : [];
                          } catch {
                            return [];
                          }
                        })()
                      : [];
                    return (
                      <div key={r.id} className="bg-white rounded-xl p-4 border border-rose-gold/15">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-burgundy-gradient text-white text-sm font-bold flex items-center justify-center">
                              {r.authorName.charAt(0)}
                            </div>
                            <p className="font-bold text-sm text-warm-black">{r.authorName}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-rose-gold text-rose-gold" />
                            ))}
                          </div>
                        </div>
                        {r.title && <p className="font-bold text-sm text-warm-black mb-1">{r.title}</p>}
                        <p className="text-sm text-warm-gray leading-relaxed">{r.body}</p>
                        {reviewPhotos.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {reviewPhotos.map((photo, idx) => (
                              <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-rose-gold/20">
                                <img src={photo} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Write review */}
              <form onSubmit={submitReview} className="bg-cream-dark/50 rounded-xl p-5 border border-rose-gold/20 space-y-3">
                <h4 className="font-bold text-warm-black">اكتب مراجعتك</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="اسمك"
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    className="bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-warm-gray">التقييم:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                        <Star className={cn("w-6 h-6", s <= reviewForm.rating ? "fill-rose-gold text-rose-gold" : "text-rose-gold/30")} />
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="عنوان المراجعة (اختياري)"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="bg-white"
                />
                <Textarea
                  placeholder="رأيك في المنتج..."
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                  className="bg-white min-h-[80px]"
                />

                {/* Photo upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-warm-black flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-burgundy" />
                      أضف صور (اختياري — حتى 3)
                    </Label>
                    {reviewPhotos.length > 0 && (
                      <span className="text-xs text-warm-gray">{reviewPhotos.length}/3</span>
                    )}
                  </div>
                  {reviewPhotos.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {reviewPhotos.map((photo, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-rose-gold/30 group">
                          <img src={photo} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setReviewPhotos(reviewPhotos.filter((_, i) => i !== idx))}
                            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="حذف الصورة"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {reviewPhotos.length < 3 && (
                    <label className="flex items-center justify-center gap-2 w-full h-20 rounded-lg border-2 border-dashed border-rose-gold/30 hover:border-burgundy/50 hover:bg-rose-gold/5 cursor-pointer transition-colors text-sm text-warm-gray hover:text-burgundy">
                      <Camera className="w-5 h-5" />
                      <span>اضغط لإضافة صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <Button type="submit" disabled={submittingReview} className="bg-burgundy hover:bg-burgundy-deep">
                  {submittingReview ? "جارٍ الإرسال..." : "أرسل المراجعة"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="shipping" className="mt-4 bg-white rounded-xl p-5 border border-rose-gold/15 space-y-3 text-sm text-warm-gray">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-warm-black">شحن لكل مصر</p>
                  <p>القاهرة الكبرى: 30 ج.م (2-3 أيام) • المدن الكبرى: 40 ج.م (3-4 أيام) • باقي المحافظات: 50 ج.م (4-5 أيام)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-warm-black">الدفع عند الاستلام</p>
                  <p>ادفع نقدًا عند استلام طلبك. شحن مجاني للطلبات فوق 1000 ج.م.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-warm-black">إرجاع خلال 14 يوم</p>
                  <p>يمكنك إرجاع المنتج خلال 14 يوم من الاستلام في حالته الأصلية (المنتجات المخصصة غير قابلة للإرجاع إلا لعيب صناعة).</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-warm-black mb-6">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-warm-gray">{label}</dt>
      <dd className="font-medium text-warm-black text-left" dir="rtl">{value}</dd>
    </>
  );
}
