"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, FolderTree, GripVertical } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  order: number;
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    icon: "",
    order: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/categories");
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image: "", icon: "", order: 0 });
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      icon: cat.icon || "",
      order: cat.order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast.error("الاسم والـ slug مطلوبان");
      return;
    }
    const body = { ...form, id: editing?.id };
    const res = await adminFetch("/api/admin/categories", {
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      toast.success(editing ? "تم تحديث الفئة" : "تمت إضافة الفئة");
      setOpen(false);
      load();
    } else {
      toast.error(data.error || "فشل الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذه الفئة؟ سيتم حذف منتجاتها أيضًا.")) return;
    const res = await adminFetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف الفئة");
      load();
    } else {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-gold/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-warm-black flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-burgundy" />
          إدارة الفئات ({categories.length})
        </h3>
        <Button onClick={openAdd} size="sm" className="bg-burgundy hover:bg-burgundy-deep">
          <Plus className="w-4 h-4 ml-1" />
          فئة جديدة
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-warm-gray py-8">لا توجد فئات</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-cream-dark/40 hover:bg-cream-dark transition-colors"
            >
              <GripVertical className="w-4 h-4 text-warm-gray/40 shrink-0" />
              {cat.image && (
                <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-warm-black text-sm">{cat.name}</p>
                <p className="text-xs text-warm-gray">{cat.slug} — {cat.description || "—"}</p>
              </div>
              <span className="text-xs text-warm-gray shrink-0">ترتيب: {cat.order}</span>
              <button
                onClick={() => openEdit(cat)}
                className="p-1.5 text-warm-gray hover:text-burgundy hover:bg-white rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-warm-gray hover:text-danger-soft hover:bg-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-burgundy">
              {editing ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <p className="sr-only">نموذج إدارة الفئة</p>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-bold">الاسم *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 border-rose-gold/30"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">الـ Slug * (إنجليزي)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="bracelets"
                dir="ltr"
                className="mt-1 text-right border-rose-gold/30"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">الوصف</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 border-rose-gold/30"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">رابط الصورة</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/categories/bracelets.jpg"
                dir="ltr"
                className="mt-1 text-right border-rose-gold/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-bold">الأيقونة</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Circle"
                  className="mt-1 border-rose-gold/30"
                />
              </div>
              <div>
                <Label className="text-sm font-bold">الترتيب</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="mt-1 border-rose-gold/30"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
                إلغاء
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-burgundy hover:bg-burgundy-deep">
                {editing ? "حفظ" : "إضافة"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
