"use client";

import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useShopStore, type CartItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn, formatEGP, discountPercent, METAL_LABELS } from "@/lib/utils";
import { toast } from "sonner";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  comparePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  rating: number;
  reviewCount: number;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stock: number;
  metalOptions: string;
  category?: { name: string } | null;
  shortDesc?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { openProduct, addToCart, toggleWishlist, wishlist, setView } = useShopStore();
  const image = product.images[0]?.url || "/products/placeholder.jpg";
  const discount = discountPercent(product.basePrice, product.comparePrice);
  const isWishlisted = wishlist.includes(product.id);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const metals = product.metalOptions.split(",").map((m) => m.trim());
    const customization = {
      metal: metals[0] || "SILVER_925",
      size: "17",
      font: "خط عربي تقليدي",
      name1: "",
      name2: "",
      giftBox: false,
      giftCard: "",
    };
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image,
      basePrice: product.basePrice,
      unitPrice: product.basePrice,
      quantity: 1,
      customization,
      maxStock: product.stock,
    } as Omit<CartItem, "id">);
    toast.success(`تمت إضافة "${product.name}" للسلة`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => openProduct(product.slug)}
      className="group relative bg-white rounded-2xl border border-rose-gold/20 overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-lg transition-shadow"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-start">
        {discount > 0 && (
          <span className="bg-danger-soft text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            خصم {discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-emerald-soft text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            جديد
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-rose-gold text-warm-black text-xs font-bold px-2 py-1 rounded-full shadow">
            الأكثر مبيعًا
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
          toast.success(isWishlisted ? "أُزيل من المفضلة" : "أُضيف للمفضلة");
        }}
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        aria-label="أضف للمفضلة"
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-all",
            isWishlisted ? "fill-burgundy text-burgundy" : "text-warm-gray"
          )}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <img
          src={image}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-warm-black/0 group-hover:bg-warm-black/10 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <span className="text-xs text-white bg-burgundy/90 px-3 py-1.5 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" /> عرض سريع
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        {product.category && (
          <p className="text-[11px] text-rose-gold font-semibold mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-bold text-warm-black text-sm sm:text-base line-clamp-1 mb-1">
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="text-xs text-warm-gray line-clamp-1 mb-2">{product.shortDesc}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-rose-gold text-rose-gold" />
          <span className="text-xs font-semibold text-warm-black">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-warm-gray">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-burgundy">
              {formatEGP(product.basePrice)}
            </span>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span className="text-xs text-warm-gray line-through">
                {formatEGP(product.comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={quickAdd}
            className="w-9 h-9 rounded-full bg-burgundy hover:bg-burgundy-deep text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="أضف للسلة"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
