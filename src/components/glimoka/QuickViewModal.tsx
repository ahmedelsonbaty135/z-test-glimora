"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Check,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useShopStore, type CartItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatEGP, discountPercent, METAL_LABELS, METAL_PRICE_ADDON, METAL_COLOR_HEX, starArray } from "@/lib/utils";
import { toast } from "sonner";

export interface QuickViewProduct {
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
  rating: number;
  reviewCount: number;
  stock: number;
  giftBoxPrice: number;
  giftCardPrice: number;
  category: { name: string };
  images: { url: string; alt?: string | null }[];
}

export function QuickViewModal({
  product,
  open,
  onOpenChange,
}: {
  product: QuickViewProduct | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { openProduct, addToCart, toggleWishlist, wishlist } = useShopStore();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const metals = product?.metalOptions.split(",").map((m) => m.trim()) || [];
  const sizes = product?.sizeOptions.split(",").map((s) => s.trim()) || [];
  const fonts = product?.fontOptions.split(",").map((f) => f.trim()) || [];

  const [metal, setMetal] = useState("");
  const [size, setSize] = useState("");
  const [font, setFont] = useState("");
  const [name1, setName1] = useState("");
  const [giftBox, setGiftBox] = useState(false);

  useEffect(() => {
    if (!product) return;
    // defer to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      setActiveImage(0);
      setQty(1);
      setMetal(metals[0] || "SILVER_925");
      setSize(sizes[0] || "");
      setFont(fonts[0] || "");
      setName1("");
      setGiftBox(false);
    });
  }, [product]);

  if (!product) return null;

  const discount = discountPercent(product.basePrice, product.comparePrice);
  const metalAddon = METAL_PRICE_ADDON[metal] || 0;
  const unitPrice = product.basePrice + metalAddon + (giftBox ? product.giftBoxPrice : 0);
  const isWishlisted = wishlist.includes(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: "/products/placeholder.jpg", alt: product.name }];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0]?.url || "/products/placeholder.jpg",
      basePrice: product.basePrice,
      unitPrice,
      quantity: qty,
      customization: {
        metal,
        size,
        font,
        name1,
        name2: "",
        giftBox,
        giftCard: "",
      },
      maxStock: product.stock,
    } as Omit<CartItem, "id">);
    toast.success(`تمت إضافة "${product.name}" للسلة`);
    onOpenChange(false);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    useShopStore.getState().setView("checkout");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-luxury bg-cream p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <p>عرض سريع لتفاصيل المنتج</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative bg-cream-dark">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors md:hidden"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-square overflow-hidden">
              <img
                src={images[activeImage].url}
                alt={images[activeImage].alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-luxury">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                      activeImage === i ? "border-burgundy scale-105" : "border-rose-gold/20 opacity-70"
                    )}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-danger-soft text-white text-xs font-bold px-2.5 py-1 rounded-full">
                خصم {discount}%
              </span>
            )}
          </div>

          {/* Info side */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-luxury">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-rose-gold font-bold mb-1">{product.category.name}</p>
                <h2 className="text-xl sm:text-2xl font-black text-warm-black leading-tight">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {starArray(product.rating).map((s, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          s === "full" ? "fill-rose-gold text-rose-gold" : s === "half" ? "fill-rose-gold/50 text-rose-gold" : "text-rose-gold/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-warm-gray">({product.reviewCount} مراجعة)</span>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-cream-dark rounded-lg hidden md:block"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-warm-gray" />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 flex-wrap">
              <span className="text-2xl font-black text-burgundy">{formatEGP(unitPrice)}</span>
              {product.comparePrice && product.comparePrice > product.basePrice && (
                <span className="text-sm text-warm-gray line-through">{formatEGP(product.comparePrice)}</span>
              )}
              {metalAddon > 0 && (
                <span className="text-xs text-warm-gray">(+{formatEGP(metalAddon)} للمعدن)</span>
              )}
            </div>

            <p className="text-sm text-warm-gray leading-relaxed">{product.shortDesc}</p>

            {/* Personalization */}
            <div className="space-y-3 bg-cream-dark/40 rounded-xl p-3 border border-rose-gold/15">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-warm-black mb-1 block">الاسم (اختياري)</label>
                <input
                  value={name1}
                  onChange={(e) => setName1(e.target.value.slice(0, 15))}
                  placeholder="اكتب اسمك..."
                  maxLength={15}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-rose-gold/30 text-sm focus:outline-none focus:border-rose-gold"
                />
              </div>

              {/* Metal */}
              <div>
                <label className="text-xs font-bold text-warm-black mb-1.5 block">المعدن</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {metals.map((m) => {
                    const addon = METAL_PRICE_ADDON[m] || 0;
                    return (
                      <button
                        key={m}
                        onClick={() => setMetal(m)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5",
                          metal === m ? "border-burgundy bg-burgundy/5" : "border-rose-gold/30 bg-white"
                        )}
                      >
                        <span className="w-3 h-3 rounded-full border border-white shadow shrink-0" style={{ background: METAL_COLOR_HEX[m] }} />
                        <span className="truncate">{METAL_LABELS[m] || m}</span>
                        {addon > 0 && <span className="text-[10px] text-warm-gray">+{addon}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-xs font-bold text-warm-black mb-1.5 block">المقاس</label>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                        size === s ? "border-burgundy bg-burgundy text-white" : "border-rose-gold/30 bg-white text-warm-black"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift box */}
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={giftBox}
                  onChange={(e) => setGiftBox(e.target.checked)}
                  className="w-4 h-4 accent-burgundy"
                />
                <span className="font-medium text-warm-black">علبة هدية فاخرة (+{formatEGP(product.giftBoxPrice)})</span>
              </label>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-rose-gold/30 rounded-lg overflow-hidden bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-cream-dark">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2 hover:bg-cream-dark">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-warm-gray">المخزون: {product.stock}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleAddToCart} className="bg-burgundy hover:bg-burgundy-deep h-11">
                  <ShoppingBag className="w-4 h-4 ml-1" />
                  أضف للسلة
                </Button>
                <Button onClick={handleBuyNow} className="bg-rose-gold hover:bg-rose-gold-light text-warm-black h-11">
                  اشترِ الآن
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    openProduct(product.slug);
                    onOpenChange(false);
                  }}
                  variant="outline"
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white h-10"
                >
                  <Eye className="w-4 h-4 ml-1" />
                  التفاصيل الكاملة
                </Button>
                <Button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(isWishlisted ? "أُزيل من المفضلة" : "أُضيف للمفضلة ❤");
                  }}
                  variant="outline"
                  className={cn(
                    "h-10",
                    isWishlisted ? "border-burgundy text-burgundy bg-burgundy/5" : "border-rose-gold text-warm-gray hover:text-burgundy"
                  )}
                >
                  <Heart className={cn("w-4 h-4 ml-1", isWishlisted && "fill-burgundy")} />
                  {isWishlisted ? "في المفضلة" : "للمفضلة"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
