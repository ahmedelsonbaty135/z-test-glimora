"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { GitCompare, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface MiniProduct {
  id: string;
  name: string;
  slug: string;
  images: { url: string; alt?: string | null }[];
  basePrice: number;
}

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, setView } = useShopStore();
  const [products, setProducts] = useState<MiniProduct[]>([]);

  useEffect(() => {
    if (compareList.length === 0) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.products)) {
          const filtered = data.products.filter((p: MiniProduct) =>
            compareList.includes(p.id)
          );
          setProducts(filtered);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [compareList]);

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl"
      >
        <div className="bg-white rounded-2xl shadow-luxury-lg border border-rose-gold/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-burgundy text-white">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              <span className="text-sm font-bold">
                قائمة المقارنة ({compareList.length}/3)
              </span>
            </div>
            <button
              onClick={() => {
                clearCompare();
                toast.success("تم مسح قائمة المقارنة");
              }}
              className="text-xs hover:underline opacity-90"
            >
              مسح الكل
            </button>
          </div>
          <div className="p-3 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="relative shrink-0 w-16 group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-dark border border-rose-gold/20">
                    <img
                      src={p.images[0]?.url || "/products/placeholder.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center hover:bg-burgundy-deep transition-colors shadow"
                    aria-label="إزالة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-[10px] text-warm-gray line-clamp-1 mt-1 text-center">
                    {p.name}
                  </p>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-rose-gold/30 flex items-center justify-center"
                >
                  <span className="text-[10px] text-warm-gray">+ أضف</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setView("compare")}
              disabled={compareList.length < 2}
              className="shrink-0 flex items-center gap-2 bg-burgundy hover:bg-burgundy-deep disabled:bg-warm-gray/40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              مقارنة
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
