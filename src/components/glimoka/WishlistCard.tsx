"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { useShopStore, type CartItem } from "@/lib/store";
import { cn, formatEGP, discountPercent } from "@/lib/utils";
import { toast } from "sonner";

export interface WishlistCardData {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  comparePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  rating: number;
  reviewCount: number;
  stock: number;
  metalOptions: string;
  isOnSale?: boolean;
  category?: { name: string } | null;
  shortDesc?: string;
}

export function WishlistCard({ product }: { product: WishlistCardData }) {
  const { openProduct, addToCart, toggleWishlist } = useShopStore();
  const image = product.images[0]?.url || "/products/placeholder.jpg";
  const discount = discountPercent(product.basePrice, product.comparePrice);

  const moveToCart = () => {
    const metals = product.metalOptions.split(",").map((m) => m.trim());
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image,
      basePrice: product.basePrice,
      unitPrice: product.basePrice,
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
      maxStock: product.stock,
    } as Omit<CartItem, "id">);
    toggleWishlist(product.id);
    toast.success(`تم نقل "${product.name}" للسلة`);
  };

  const remove = () => {
    toggleWishlist(product.id);
    toast.success("أُزيل من المفضلة");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-2xl border border-rose-gold/20 overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow"
    >
      {/* Remove button */}
      <button
        onClick={remove}
        className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-danger-soft hover:text-white transition-colors"
        aria-label="إزالة من المفضلة"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Badges */}
      {discount > 0 && (
        <span className="absolute top-2 right-2 z-10 bg-danger-soft text-white text-xs font-bold px-2 py-1 rounded-full">
          خصم {discount}%
        </span>
      )}

      {/* Image */}
      <button
        onClick={() => openProduct(product.slug)}
        className="block w-full aspect-square overflow-hidden bg-cream-dark"
      >
        <img
          src={image}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </button>

      {/* Body */}
      <div className="p-3">
        {product.category && (
          <p className="text-[11px] text-rose-gold font-semibold mb-0.5">{product.category.name}</p>
        )}
        <button
          onClick={() => openProduct(product.slug)}
          className="text-right w-full"
        >
          <h3 className="font-bold text-warm-black text-sm line-clamp-1 mb-1 hover:text-burgundy transition-colors">
            {product.name}
          </h3>
        </button>
        {product.shortDesc && (
          <p className="text-xs text-warm-gray line-clamp-1 mb-2">{product.shortDesc}</p>
        )}

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-rose-gold text-rose-gold" />
          <span className="text-xs font-semibold text-warm-black">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-warm-gray">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between gap-2 mb-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-burgundy">{formatEGP(product.basePrice)}</span>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span className="text-xs text-warm-gray line-through">{formatEGP(product.comparePrice)}</span>
            )}
          </div>
          <Heart className="w-4 h-4 fill-burgundy text-burgundy" />
        </div>

        <button
          onClick={moveToCart}
          className="w-full bg-burgundy hover:bg-burgundy-deep text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          نقل للسلة
        </button>
      </div>
    </motion.div>
  );
}
