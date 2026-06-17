"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useShopStore } from "@/lib/store";
import { ProductCard, type ProductCardData } from "../ProductCard";
import { SlidersHorizontal, X, Star, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "best-selling", label: "الأكثر مبيعًا" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "rating", label: "الأعلى تقييمًا" },
];

const METAL_FILTERS = [
  { value: "silver", label: "فضة" },
  { value: "gold", label: "ذهب" },
  { value: "rose-gold", label: "ذهب وردي" },
  { value: "rhodium", label: "روديوم" },
];

const CATEGORY_LABELS: Record<string, string> = {
  bracelets: "الأساور",
  necklaces: "القلائد",
  rings: "الخواتم",
  offers: "العروض",
};

const PAGE_SIZE = 8;

export function ProductsView() {
  const { selectedCategory, searchQuery, setSearch, setView, setFiltersOpen, filtersOpen } = useShopStore();

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [metals, setMetals] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchProducts = useCallback(async () => {
    // If there's a search query, use semantic search endpoint for smarter matching
    if (searchQuery && !selectedCategory) {
      const semRes = await fetch(`/api/search/semantic?q=${encodeURIComponent(searchQuery)}`);
      const semData = await semRes.json();
      let list: ProductCardData[] = semData.products || [];
      // Apply remaining filters
      if (metals.length > 0) {
        list = list.filter((p) => metals.includes((p as any).material));
      }
      if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
      if (onSaleOnly) list = list.filter((p) => p.isOnSale);
      list = list.filter((p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]);
      setProducts(list);
      setVisibleCount(PAGE_SIZE);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchQuery) params.set("q", searchQuery);
    params.set("sort", sort);
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));
    if (metals.length === 1) params.set("metal", metals[0]);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    let list: ProductCardData[] = data.products || [];

    if (metals.length > 1) {
      list = list.filter((p) => metals.includes((p as any).material));
    }
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (onSaleOnly) list = list.filter((p) => p.isOnSale);

    setProducts(list);
    setVisibleCount(PAGE_SIZE);
    setLoading(false);
  }, [selectedCategory, searchQuery, sort, priceRange, metals, minRating, onSaleOnly]);

  useEffect(() => {
    let cancelled = false;
    // mark loading via async transition to satisfy react-hooks/set-state-in-effect
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
      fetchProducts().catch(() => {
        if (!cancelled) setLoading(false);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [fetchProducts]);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);

  const toggleMetal = (m: string) => {
    setMetals((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const resetFilters = () => {
    setPriceRange([0, 3000]);
    setMetals([]);
    setMinRating(0);
    setOnSaleOnly(false);
    setSearch("");
    setView("products", { category: undefined });
  };

  const activeFilterCount =
    (priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0) +
    metals.length +
    (minRating > 0 ? 1 : 0) +
    (onSaleOnly ? 1 : 0);

  const title = searchQuery
    ? `نتائج البحث: "${searchQuery}"`
    : selectedCategory
    ? CATEGORY_LABELS[selectedCategory] || "المنتجات"
    : "كل المنتجات";

  const FilterPanel = (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h4 className="font-bold text-warm-black text-sm mb-3">السعر (ج.م)</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            min={0}
            max={3000}
            step={50}
            className="my-2"
          />
          <div className="flex justify-between text-xs text-warm-gray">
            <span>{priceRange[0]} ج.م</span>
            <span>{priceRange[1]} ج.م</span>
          </div>
        </div>
      </div>

      {/* Metal */}
      <div>
        <h4 className="font-bold text-warm-black text-sm mb-3">المعدن</h4>
        <div className="space-y-2">
          {METAL_FILTERS.map((m) => (
            <div key={m.value} className="flex items-center gap-2">
              <Checkbox
                id={`metal-${m.value}`}
                checked={metals.includes(m.value)}
                onCheckedChange={() => toggleMetal(m.value)}
              />
              <Label htmlFor={`metal-${m.value}`} className="text-sm cursor-pointer">
                {m.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-warm-black text-sm mb-3">التقييم</h4>
        <div className="space-y-2">
          {[4, 3, 0].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm w-full transition-colors",
                minRating === r ? "bg-burgundy text-white" : "hover:bg-cream-dark text-warm-black"
              )}
            >
              {r > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-current" />
                  {r} نجوم فأكثر
                </>
              ) : (
                "الكل"
              )}
            </button>
          ))}
        </div>
      </div>

      {/* On sale */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="on-sale"
          checked={onSaleOnly}
          onCheckedChange={(v) => setOnSaleOnly(Boolean(v))}
        />
        <Label htmlFor="on-sale" className="text-sm cursor-pointer">
          العروض فقط 🔥
        </Label>
      </div>

      <Button onClick={resetFilters} variant="outline" className="w-full border-burgundy text-burgundy">
        إعادة تعيين الفلاتر
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-4">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">{title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-warm-black">{title}</h1>
          <p className="text-sm text-warm-gray mt-1">
            {loading ? "جارٍ التحميل..." : `${products.length} منتج متاح`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden border-burgundy text-burgundy"
          >
            <SlidersHorizontal className="w-4 h-4 ml-1" />
            فلترة
            {activeFilterCount > 0 && (
              <span className="mr-1 w-5 h-5 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white border-rose-gold/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 bg-white rounded-2xl border border-rose-gold/20 p-5 shadow-luxury">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-rose-gold/15">
              <SlidersHorizontal className="w-4 h-4 text-burgundy" />
              <h3 className="font-bold text-warm-black">تصفية النتائج</h3>
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Products grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-rose-gold/20 overflow-hidden"
                  style={{ animation: `float-up 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <div className="aspect-square shimmer" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-2.5 w-1/3 shimmer rounded-full" />
                    <div className="h-3.5 w-3/4 shimmer rounded" />
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 shimmer rounded-full" />
                      <div className="h-2 w-10 shimmer rounded" />
                    </div>
                    <div className="flex items-end justify-between pt-1">
                      <div className="space-y-1">
                        <div className="h-5 w-16 shimmer rounded" />
                        <div className="h-2.5 w-12 shimmer rounded" />
                      </div>
                      <div className="w-9 h-9 shimmer rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-rose-gold/20">
              <div className="w-20 h-20 mx-auto rounded-full bg-cream-dark flex items-center justify-center mb-4">
                <LayoutGrid className="w-10 h-10 text-rose-gold" />
              </div>
              <h3 className="text-xl font-bold text-warm-black mb-2">لا توجد نتائج</h3>
              <p className="text-warm-gray mb-4">جرّب تعديل الفلاتر أو البحث بكلمات أخرى</p>
              <Button onClick={resetFilters} className="bg-burgundy hover:bg-burgundy-deep">
                إعادة تعيين الفلاتر
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visibleCount < products.length && (
                <div className="text-center mt-10">
                  <Button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    size="lg"
                    variant="outline"
                    className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                  >
                    عرض المزيد ({products.length - visibleCount} منتج)
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters sheet */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)}>
          <div
            className="absolute bottom-0 inset-x-0 bg-cream rounded-t-3xl max-h-[85vh] overflow-y-auto scrollbar-luxury"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-cream px-5 py-4 border-b border-rose-gold/20 flex items-center justify-between">
              <h3 className="font-bold text-warm-black flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-burgundy" />
                تصفية النتائج
              </h3>
              <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-cream-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">{FilterPanel}</div>
            <div className="sticky bottom-0 bg-cream p-4 border-t border-rose-gold/20">
              <Button onClick={() => setFiltersOpen(false)} className="w-full bg-burgundy hover:bg-burgundy-deep">
                عرض {products.length} منتج
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
