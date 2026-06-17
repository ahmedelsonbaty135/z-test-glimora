"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  isActive: boolean;
  order: number;
}

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "",
    order: 0,
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/banners");
      if (!res.ok) return;
      const data = await res.json();
      setBanners(data.banners || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", subtitle: "", image: "", ctaText: "", ctaLink: "", order: 0, isActive: true });
    setOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image || "",
      ctaText: b.ctaText || "",
      ctaLink: b.ctaLink || "",
      order: b.order,
      isActive: b.isActive,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("العنوان مطلوب");
      return;
    }
    const body = { ...form, id: editing?.id };
    const res = await adminFetch("/api/admin/banners", {
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      toast.success(editing ? "تم تحديث البانر" : "تمت إضافة البانر");
      setOpen(false);
      load();
    } else {
      toast.error(data.error || "فشل الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا البانر؟")) return;
    const res = await adminFetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف البانر");
      load();
    }
  };

  const toggleActive = async (b: Banner) => {
    const res = await adminFetch("/api/admin/banners", {
      method: "PATCH",
      body: JSON.stringify({ id: b.id, isActive: !b.isActive }),
    });
    if (res.ok) {
      toast.success(!b.isActive ? "تم تفعيل البانر" : "تم إيقاف البانر");
      load();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-gold/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-warm-black flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-burgundy" />
          إدارة البانرات ({banners.length})
        </h3>
        <Button onClick={openAdd} size="sm" className="bg-burgundy hover:bg-burgundy-deep">
          <Plus className="w-4 h-4 ml-1" />
          بانر جديد
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
      ) : banners.length === 0 ? (
        <p className="text-center text-warm-gray py-8">لا توجد بانرات</p>
      ) : (
        <div className="space-y-2">
          {banners.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                b.isActive ? "bg-cream-dark/40 border-rose-gold/20" : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-warm-black text-sm">{b.title}</p>
                <p className="text-xs text-warm-gray line-clamp-1">{b.subtitle || "—"}</p>
                {b.ctaText && (
                  <span className="inline-block mt-1 text-[10px] bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                    {b.ctaText} → {b.ctaLink || ""}
                  </span>
                )}
              </div>
              <span className="text-xs text-warm-gray shrink-0">ترتيب: {b.order}</span>
              <button
                onClick={() => toggleActive(b)}
                className={`p-1.5 rounded-lg transition-colors ${
                  b.isActive
                    ? "text-emerald-soft hover:bg-emerald-soft/10"
                    : "text-warm-gray hover:bg-gray-200"
                }`}
                title={b.isActive ? "مفعّل" : "متوقف"}
              >
                {b.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => openEdit(b)}
                className="p-1.5 text-warm-gray hover:text-burgundy hover:bg-white rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
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
              {editing ? "تعديل البانر" : "إضافة بانر جديد"}
            </DialogTitle>
          </DialogHeader>
          <p className="sr-only">نموذج إدارة البانر</p>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-bold">العنوان *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 border-rose-gold/30"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">العنوان الفرعي</Label>
              <Textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                rows={2}
                className="mt-1 border-rose-gold/30 resize-none"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">رابط الصورة</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/brand/hero.jpg"
                dir="ltr"
                className="mt-1 text-right border-rose-gold/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-bold">نص الزر</Label>
                <Input
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="تسوق الآن"
                  className="mt-1 border-rose-gold/30"
                />
              </div>
              <div>
                <Label className="text-sm font-bold">رابط الزر</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                  placeholder="products"
                  className="mt-1 border-rose-gold/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-bold">الترتيب</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="mt-1 border-rose-gold/30"
                />
              </div>
              <div>
                <Label className="text-sm font-bold">الحالة</Label>
                <select
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-rose-gold/30 bg-white text-sm"
                >
                  <option value="active">مفعّل</option>
                  <option value="inactive">متوقف</option>
                </select>
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
