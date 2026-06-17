"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { motion } from "framer-motion";
import { GitCompare, X, ShoppingBag, Heart, Check, Minus, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEGP, discountPercent, METAL_LABELS, METAL_COLOR_HEX } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  comparePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  rating: number;
  reviewCount: number;
  stock: number;
  metalOptions: string;
  sizeOptions: string;
  fontOptions: string;
  isPersonalizable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  material: string;
  color: string;
  giftBoxPrice: number;
  giftCardPrice: number;
  category?: { name: string } | null;
}

export function CompareView() {
  const { compareList, removeFromCompare, clearCompare, openProduct, addToCart, toggleWishlist, wishlist, setView } = useShopStore();
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.products)) {
          const filtered = data.products.filter((p: CompareProduct) =>
            compareList.includes(p.id)
          );
          // preserve compareList order
          const ordered = compareList
            .map((id) => filtered.find((p) => p.id === id))
            .filter(Boolean) as CompareProduct[];
          setProducts(ordered);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [compareList]);

  const handleAddToCart = (p: CompareProduct) => {
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
    toast.success(`تمت إضافة "${p.name}" للسلة`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-gold/30 border-t-burgundy rounded-full animate-spin" />
      </div>
    );
  }

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto rounded-full bg-cream-dark flex items-center justify-center mb-6">
            <GitCompare className="w-10 h-10 text-rose-gold" />
          </div>
          <h1 className="text-3xl font-bold text-burgundy mb-3">قائمة المقارنة فارغة</h1>
          <p className="text-warm-gray mb-8">
            أضف منتجات للمقارنة بالضغط على أيقونة المقارنة في بطاقة المنتج
          </p>
          <Button
            onClick={() => setView("products")}
            className="bg-burgundy hover:bg-burgundy-deep text-white px-8"
          >
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  // rows for comparison
  const rows: { label: string; render: (p: CompareProduct) => React.ReactNode; highlight?: boolean }[] = [
    {
      label: "السعر",
      highlight: true,
      render: (p) => (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-burgundy">{formatEGP(p.basePrice)}</span>
          {p.comparePrice && p.comparePrice > p.basePrice && (
            <span className="text-xs text-warm-gray line-through">{formatEGP(p.comparePrice)}</span>
          )}
        </div>
      ),
    },
    {
      label: "الخصم",
      render: (p) => {
        const d = discountPercent(p.basePrice, p.comparePrice);
        return d > 0 ? (
          <span className="bg-danger-soft text-white text-xs font-bold px-2 py-1 rounded-full">
            {d}%
          </span>
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        );
      },
    },
    {
      label: "التقييم",
      render: (p) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 fill-rose-gold text-rose-gold" />
          <span className="font-bold text-warm-black">{p.rating.toFixed(1)}</span>
          <span className="text-xs text-warm-gray">({p.reviewCount})</span>
        </div>
      ),
    },
    {
      label: "الفئة",
      render: (p) => <span className="text-sm text-warm-black">{p.category?.name || "—"}</span>,
    },
    {
      label: "المعدن الأساسي",
      render: (p) => {
        const metals = p.metalOptions.split(",").map((m) => m.trim());
        return (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {metals.map((m) => (
              <span
                key={m}
                className="flex items-center gap-1 text-xs bg-cream-dark px-2 py-1 rounded-full"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-warm-gray/30"
                  style={{ background: METAL_COLOR_HEX[m] || "#ccc" }}
                />
                {METAL_LABELS[m] || m}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      label: "اللون",
      render: (p) => <span className="text-sm text-warm-black">{p.color}</span>,
    },
    {
      label: "قابل للتخصيص",
      render: (p) =>
        p.isPersonalizable ? (
          <Check className="w-5 h-5 text-emerald-soft mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        ),
    },
    {
      label: "الخطوط المتاحة",
      render: (p) => (
        <span className="text-xs text-warm-gray">{p.fontOptions.split(",").length} خطوط</span>
      ),
    },
    {
      label: "المقاسات المتاحة",
      render: (p) => (
        <span className="text-xs text-warm-gray">{p.sizeOptions.split(",").length} مقاسات</span>
      ),
    },
    {
      label: "علبة هدية",
      render: (p) =>
        p.giftBoxPrice > 0 ? (
          <span className="text-sm text-emerald-soft font-semibold">+{formatEGP(p.giftBoxPrice)}</span>
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        ),
    },
    {
      label: "بطاقة إهداء",
      render: (p) =>
        p.giftCardPrice > 0 ? (
          <span className="text-sm text-emerald-soft font-semibold">+{formatEGP(p.giftCardPrice)}</span>
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        ),
    },
    {
      label: "المخزون",
      render: (p) => (
        <span
          className={
            p.stock > 20
              ? "text-sm font-semibold text-emerald-soft"
              : p.stock > 0
              ? "text-sm font-semibold text-amber-600"
              : "text-sm font-semibold text-danger-soft"
          }
        >
          {p.stock > 0 ? `${p.stock} قطعة` : "غير متوفر"}
        </span>
      ),
    },
    {
      label: "الأكثر مبيعًا",
      render: (p) =>
        p.isBestSeller ? (
          <Check className="w-5 h-5 text-emerald-soft mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        ),
    },
    {
      label: "جديد",
      render: (p) =>
        p.isNewArrival ? (
          <Check className="w-5 h-5 text-emerald-soft mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-warm-gray/40 mx-auto" />
        ),
    },
    {
      label: "وصف مختصر",
      render: (p) => (
        <p className="text-xs text-warm-gray line-clamp-3 px-2">{p.shortDesc}</p>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-burgundy flex items-center gap-3">
            <GitCompare className="w-7 h-7 text-rose-gold" />
            مقارنة المنتجات
          </h1>
          <p className="text-warm-gray mt-1 text-sm">
            قارن بين {products.length} منتجات من حيث السعر والمميزات
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              clearCompare();
              toast.success("تم مسح قائمة المقارنة");
            }}
            className="border-rose-gold/30 text-burgundy hover:bg-cream-dark"
          >
            مسح الكل
          </Button>
          <Button
            onClick={() => setView("products")}
            className="bg-burgundy hover:bg-burgundy-deep text-white"
          >
            إضافة المزيد
          </Button>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-3 min-w-full"
          style={{
            gridTemplateColumns: `140px repeat(${products.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* Header row: images */}
          <div className="sticky right-0 bg-cream z-10 flex items-center">
            <span className="text-xs font-bold text-warm-gray uppercase">المنتج</span>
          </div>
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-rose-gold/20 overflow-hidden shadow-luxury"
            >
              <div className="relative aspect-square overflow-hidden bg-cream-dark">
                <img
                  src={p.images[0]?.url || "/products/placeholder.jpg"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromCompare(p.id)}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 hover:bg-danger-soft hover:text-white text-warm-gray flex items-center justify-center transition-colors shadow"
                  aria-label="إزالة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <h3
                  className="font-bold text-warm-black text-sm line-clamp-2 mb-1 cursor-pointer hover:text-burgundy transition-colors"
                  onClick={() => openProduct(p.slug)}
                >
                  {p.name}
                </h3>
                {p.category && (
                  <p className="text-[11px] text-rose-gold font-semibold mb-2">
                    {p.category.name}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Data rows */}
          {rows.map((row) => (
            <FragmentRow key={row.label} label={row.label} highlight={row.highlight}>
              {products.map((p) => (
                <div
                  key={p.id}
                  className={
                    row.highlight
                      ? "bg-burgundy/5 px-3 py-4 flex items-center justify-center"
                      : "px-3 py-4 flex items-center justify-center"
                  }
                >
                  {row.render(p)}
                </div>
              ))}
            </FragmentRow>
          ))}

          {/* Action row */}
          <div className="sticky right-0 bg-cream z-10 flex items-center">
            <span className="text-xs font-bold text-warm-gray uppercase">إجراءات</span>
          </div>
          {products.map((p) => {
            const isWish = wishlist.includes(p.id);
            return (
              <div key={p.id} className="bg-white border-t border-rose-gold/20 p-3 flex flex-col gap-2">
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={p.stock === 0}
                  className="w-full flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy-deep disabled:bg-warm-gray/40 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  أضف للسلة
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      toggleWishlist(p.id);
                      toast.success(isWish ? "أُزيل من المفضلة" : "أُضيف للمفضلة");
                    }}
                    className="flex items-center justify-center gap-1.5 border border-rose-gold/30 text-burgundy py-2 rounded-xl text-xs font-semibold hover:bg-cream-dark transition-colors"
                  >
                    <Heart className={isWish ? "w-3.5 h-3.5 fill-burgundy" : "w-3.5 h-3.5"} />
                    المفضلة
                  </button>
                  <button
                    onClick={() => openProduct(p.slug)}
                    className="flex items-center justify-center gap-1.5 border border-rose-gold/30 text-burgundy py-2 rounded-xl text-xs font-semibold hover:bg-cream-dark transition-colors"
                  >
                    التفاصيل
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-warm-gray mt-8">
        💡 يمكنك مقارنة حتى 3 منتجات في آنٍ واحد
      </p>
    </div>
  );
}

function FragmentRow({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <>
      <div
        className={`sticky right-0 z-10 flex items-center px-2 ${
          highlight ? "bg-burgundy/10" : "bg-cream"
        }`}
      >
        <span className="text-xs font-bold text-warm-black">{label}</span>
      </div>
      {children}
    </>
  );
}
