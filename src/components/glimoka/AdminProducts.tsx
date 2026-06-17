"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, X, Search, Star } from "lucide-react";
import { formatEGP, cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  comparePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  material?: string | null;
  rating: number;
  soldCount: number;
  category: { id: string; name: string };
  images: { url: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف المنتج");
      load();
    } else {
      toast.error("فشل الحذف");
    }
  };

  const filtered = products.filter(
    (p) => !search || p.name.includes(search) || p.slug.includes(search)
  );

  return (
    <Card className="bg-white border-rose-gold/20">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-warm-black text-lg flex items-center gap-2">
          إدارة المنتجات ({products.length})
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث..."
              className="pr-8 w-40 bg-cream-dark/30 h-9"
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-burgundy hover:bg-burgundy-deep h-9"
          >
            <Plus className="w-4 h-4 ml-1" />
            منتج جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-warm-gray py-8">لا توجد منتجات</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-rose-gold/15 bg-cream-dark/20 hover:bg-cream-dark/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-gray text-xs">لا صورة</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-warm-black text-sm truncate">{p.name}</p>
                    {p.isFeatured && <span className="text-[10px] bg-rose-gold/20 text-burgundy px-1.5 py-0.5 rounded-full">مميز</span>}
                    {p.isBestSeller && <span className="text-[10px] bg-burgundy/10 text-burgundy px-1.5 py-0.5 rounded-full">الأكثر مبيعًا</span>}
                    {p.isOnSale && <span className="text-[10px] bg-danger-soft/10 text-danger-soft px-1.5 py-0.5 rounded-full">خصم</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-warm-gray mt-0.5">
                    <span className="font-bold text-burgundy">{formatEGP(p.basePrice)}</span>
                    <span>•</span>
                    <span>{p.category.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-rose-gold text-rose-gold" />
                      {p.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>مبيع: {p.soldCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    p.stock <= 10 ? "bg-danger-soft/10 text-danger-soft" : p.stock <= 20 ? "bg-amber-100 text-amber-700" : "bg-emerald-soft/10 text-emerald-soft"
                  )}>
                    مخزون: {p.stock}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-burgundy hover:bg-burgundy/10"
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-danger-soft hover:bg-danger-soft/10"
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Product form dialog */}
      <ProductFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        product={editing}
        categories={categories}
        onSaved={() => {
          setShowForm(false);
          load();
        }}
      />
    </Card>
  );
}

function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: AdminProduct | null;
  categories: Category[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    description: "",
    categoryId: "",
    basePrice: "",
    comparePrice: "",
    stock: "50",
    material: "silver",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: false,
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description: product.description,
        categoryId: product.category.id,
        basePrice: String(product.basePrice),
        comparePrice: product.comparePrice ? String(product.comparePrice) : "",
        stock: String(product.stock),
        material: product.material || "silver",
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        isOnSale: product.isOnSale,
        imageUrl: product.images[0]?.url || "",
      });
    } else {
      setForm({
        name: "",
        slug: "",
        shortDesc: "",
        description: "",
        categoryId: categories[0]?.id || "",
        basePrice: "",
        comparePrice: "",
        stock: "50",
        material: "silver",
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isOnSale: false,
        imageUrl: "",
      });
    }
  }, [product, categories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.categoryId || !form.basePrice) {
      toast.error("أكمل الحقول المطلوبة");
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        ...form,
        basePrice: Number(form.basePrice),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock: Number(form.stock),
      };
      if (product) {
        // Update
        body.id = product.id;
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("تم تحديث المنتج");
          onSaved();
        } else {
          const d = await res.json();
          toast.error(d.error || "فشل التحديث");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("تم إضافة المنتج");
          onSaved();
        } else {
          const d = await res.json();
          toast.error(d.error || "فشل الإضافة");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-luxury bg-cream">
        <DialogHeader>
          <DialogTitle className="text-warm-black text-lg flex items-center justify-between">
            {product ? "تعديل المنتج" : "إضافة منتج جديد"}
            <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-cream-dark rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <p className="sr-only">نموذج إدارة المنتج</p>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">اسم المنتج *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 bg-white"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-bold">الـ Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="silver-name-bracelet"
                dir="ltr"
                className="mt-1 text-right bg-white"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold">وصف مختصر</Label>
            <Input
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              className="mt-1 bg-white"
            />
          </div>

          <div>
            <Label className="text-sm font-bold">الوصف الكامل</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 bg-white min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-bold">السعر (ج.م) *</Label>
              <Input
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                className="mt-1 bg-white"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-bold">السعر الأصلي</Label>
              <Input
                type="number"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                placeholder="للخصم"
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">المخزون</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">الفئة</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-bold">المعدن الأساسي</Label>
              <Select value={form.material} onValueChange={(v) => setForm({ ...form, material: v })}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="silver">فضة</SelectItem>
                  <SelectItem value="gold">ذهب</SelectItem>
                  <SelectItem value="rose-gold">ذهب وردي</SelectItem>
                  <SelectItem value="rhodium">روديوم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold">رابط الصورة</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="/products/bracelet-silver-1.jpg"
              dir="ltr"
              className="mt-1 text-right bg-white"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: "isFeatured", label: "مميز" },
              { key: "isBestSeller", label: "الأكثر مبيعًا" },
              { key: "isNewArrival", label: "جديد" },
              { key: "isOnSale", label: "خصم" },
            ].map((b) => (
              <label key={b.key} className="flex items-center gap-2 p-2 rounded-lg border border-rose-gold/20 bg-white cursor-pointer">
                <Checkbox
                  checked={form[b.key as keyof typeof form] as boolean}
                  onCheckedChange={(v) => setForm({ ...form, [b.key]: Boolean(v) })}
                />
                <span className="text-sm">{b.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-burgundy hover:bg-burgundy-deep">
              {saving ? "جارٍ الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-warm-gray text-warm-gray">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
