"use client";

import { useState } from "react";
import { useShopStore, type CartItem, type CartItemCustomization } from "@/lib/store";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Gift, Sparkles, ChevronLeft } from "lucide-react";
import { formatEGP } from "@/lib/utils";
import { toast } from "sonner";

export interface BundleProduct {
  productId: string;
  slug: string;
  name: string;
  image: string;
  basePrice: number;
  stock: number;
  metalOptions: string;
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  products: BundleProduct[];
  originalTotal: number;
  bundlePrice: number;
  badge: string;
  accent: string;
}

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart, setView } = useShopStore();
  const [added, setAdded] = useState(false);

  const savings = bundle.originalTotal - bundle.bundlePrice;
  const savingsPct = Math.round((savings / bundle.originalTotal) * 100);

  const handleAddBundle = () => {
    bundle.products.forEach((p) => {
      const metals = p.metalOptions.split(",").map((m) => m.trim());
      const customization: CartItemCustomization = {
        metal: metals[0] || "SILVER_925",
        size: "17",
        font: "خط عربي تقليدي",
        name1: "",
        name2: "",
        giftBox: false,
        giftCard: "",
      };
      addToCart({
        productId: p.productId,
        slug: p.slug,
        name: p.name,
        image: p.image,
        basePrice: p.basePrice,
        unitPrice: p.basePrice,
        quantity: 1,
        customization,
        maxStock: p.stock,
      } as Omit<CartItem, "id">);
    });
    setAdded(true);
    toast.success(`تمت إضافة باقة "${bundle.title}" للسلة — وفّرت ${formatEGP(savings)}!`);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl border-2 overflow-hidden shadow-luxury card-luxury-hover"
      style={{ borderColor: bundle.accent + "40" }}
    >
      {/* Header */}
      <div
        className="relative px-5 py-3 text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bundle.accent}, ${bundle.accent}cc)` }}
      >
        <div className="absolute inset-0 shimmer-sweep opacity-30" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">{bundle.title}</span>
          </div>
          <span className="text-xs bg-white/20 backdrop-blur px-2.5 py-1 rounded-full font-bold">
            {bundle.badge}
          </span>
        </div>
      </div>

      {/* Products preview */}
      <div className="p-5">
        <p className="text-xs text-warm-gray mb-3 leading-relaxed">{bundle.description}</p>

        {/* Product thumbnails */}
        <div className="flex gap-2 mb-4">
          {bundle.products.map((p, idx) => (
            <div key={p.productId} className="relative flex-1">
              <div className="aspect-square rounded-xl overflow-hidden bg-cream-dark border border-rose-gold/20">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {idx < bundle.products.length - 1 && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white border border-rose-gold/30 flex items-center justify-center text-xs font-bold text-burgundy">
                  +
                </span>
              )}
              <p className="text-[10px] text-warm-gray text-center mt-1 line-clamp-1">{p.name}</p>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="bg-cream-dark/50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-warm-gray">السعر الأصلي</span>
            <span className="text-sm text-warm-gray line-through">{formatEGP(bundle.originalTotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-burgundy">سعر الباقة</span>
            <span className="text-xl font-black text-burgundy">{formatEGP(bundle.bundlePrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-soft flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              وفّر
            </span>
            <span className="text-sm font-bold text-emerald-soft">
              {formatEGP(savings)} ({savingsPct}%)
            </span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleAddBundle}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            added
              ? "bg-emerald-soft text-white"
              : "bg-burgundy hover:bg-burgundy-deep text-white"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              تمت الإضافة للسلة
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              أضف الباقة للسلة
            </>
          )}
        </button>
        <button
          onClick={() => setView("products")}
          className="w-full flex items-center justify-center gap-1 mt-2 text-xs text-warm-gray hover:text-burgundy transition-colors"
        >
          تصفح كل المنتجات
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
