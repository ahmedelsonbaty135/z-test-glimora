"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/lib/store";
import { QuickViewModal, type QuickViewProduct } from "./QuickViewModal";

export function QuickViewManager() {
  const { quickViewSlug, closeQuickView } = useShopStore();
  const [product, setProduct] = useState<QuickViewProduct | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quickViewSlug) {
      Promise.resolve().then(() => setProduct(null));
      return;
    }
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
      fetch(`/api/products/${quickViewSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.product) setProduct(data.product);
          else closeQuickView();
        })
        .catch(() => {
          if (!cancelled) closeQuickView();
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [quickViewSlug, closeQuickView]);

  return (
    <QuickViewModal
      product={product}
      open={Boolean(quickViewSlug) && !loading}
      onOpenChange={(v) => {
        if (!v) closeQuickView();
      }}
    />
  );
}
