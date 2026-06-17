"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X, Tag, CheckCircle2, XCircle } from "lucide-react";
import { formatEGP, cn } from "@/lib/utils";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  perCustomerLimit?: number | null;
  usedCount: number;
  startsAt: string;
  endsAt?: string | null;
  isActive: boolean;
  _count?: { usages: number };
}

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "نسبة مئوية",
  FIXED: "مبلغ ثابت",
  FREE_SHIPPING: "شحن مجاني",
  BOGO: "اشترِ واحدًا واحصل على الثاني",
};

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`هل أنت متأكد من حذف كوبون "${code}"؟`)) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف الكوبون");
      load();
    } else {
      toast.error("فشل الحذف");
    }
  };

  const toggleActive = async (c: Coupon) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
    });
    if (res.ok) {
      toast.success(c.isActive ? "تم إيقاف الكوبون" : "تم تفعيل الكوبون");
      load();
    }
  };

  return (
    <Card className="bg-white border-rose-gold/20">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-warm-black text-lg flex items-center gap-2">
          <Tag className="w-5 h-5 text-burgundy" />
          إدارة الكوبونات ({coupons.length})
        </CardTitle>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-burgundy hover:bg-burgundy-deep h-9"
        >
          <Plus className="w-4 h-4 ml-1" />
          كوبون جديد
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
        ) : coupons.length === 0 ? (
          <p className="text-center text-warm-gray py-8">لا توجد كوبونات</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {coupons.map((c) => {
              const expired = c.endsAt && new Date(c.endsAt) < new Date();
              const usagePct = c.usageLimit ? Math.round((c.usedCount / c.usageLimit) * 100) : 0;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "p-4 rounded-xl border-2 border-dashed transition-all",
                    c.isActive && !expired
                      ? "border-rose-gold/40 bg-cream-dark/30"
                      : "border-warm-gray/20 bg-warm-gray/5 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <code className="font-mono font-bold text-burgundy text-lg">{c.code}</code>
                      <p className="text-xs text-warm-gray mt-0.5">{TYPE_LABELS[c.type] || c.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(c)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full",
                          c.isActive && !expired
                            ? "bg-emerald-soft/15 text-emerald-soft"
                            : "bg-warm-gray/15 text-warm-gray"
                        )}
                      >
                        {c.isActive && !expired ? "نشط" : "متوقف"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-warm-gray">
                    <div className="flex justify-between">
                      <span>القيمة:</span>
                      <span className="font-bold text-warm-black">
                        {c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FIXED" ? formatEGP(c.value) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>حد أدنى:</span>
                      <span className="font-medium">{c.minOrder > 0 ? formatEGP(c.minOrder) : "لا يوجد"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الاستخدام:</span>
                      <span className="font-medium">
                        {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                      </span>
                    </div>
                    {c.usageLimit && (
                      <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden mt-1">
                        <div
                          className={cn("h-full rounded-full", usagePct > 80 ? "bg-danger-soft" : "bg-rose-gold")}
                          style={{ width: `${Math.min(usagePct, 100)}%` }}
                        />
                      </div>
                    )}
                    {c.endsAt && (
                      <div className="flex justify-between">
                        <span>ينتهي:</span>
                        <span className={cn("font-medium", expired && "text-danger-soft")}>
                          {new Date(c.endsAt).toLocaleDateString("ar-EG")}
                          {expired && " (منتهي)"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 mt-3 pt-2 border-t border-rose-gold/15">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-burgundy hover:bg-burgundy/10"
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                    >
                      <Pencil className="w-3 h-3 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-danger-soft hover:bg-danger-soft/10"
                      onClick={() => handleDelete(c.id, c.code)}
                    >
                      <Trash2 className="w-3 h-3 ml-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <CouponFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        coupon={editing}
        onSaved={() => {
          setShowForm(false);
          load();
        }}
      />
    </Card>
  );
}

function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  coupon: Coupon | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "10",
    minOrder: "0",
    maxDiscount: "",
    usageLimit: "1000",
    perCustomerLimit: "",
    startsAt: new Date().toISOString().slice(0, 10),
    endsAt: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code,
        type: coupon.type,
        value: String(coupon.value),
        minOrder: String(coupon.minOrder),
        maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
        usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
        perCustomerLimit: coupon.perCustomerLimit ? String(coupon.perCustomerLimit) : "",
        startsAt: new Date(coupon.startsAt).toISOString().slice(0, 10),
        endsAt: coupon.endsAt ? new Date(coupon.endsAt).toISOString().slice(0, 10) : "",
        isActive: coupon.isActive,
      });
    } else {
      setForm({
        code: "",
        type: "PERCENTAGE",
        value: "10",
        minOrder: "0",
        maxDiscount: "",
        usageLimit: "1000",
        perCustomerLimit: "",
        startsAt: new Date().toISOString().slice(0, 10),
        endsAt: "",
        isActive: true,
      });
    }
  }, [coupon]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.type || !form.startsAt) {
      toast.error("أكمل الحقول المطلوبة");
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        ...form,
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perCustomerLimit: form.perCustomerLimit ? Number(form.perCustomerLimit) : null,
        endsAt: form.endsAt || null,
      };
      if (coupon) {
        body.id = coupon.id;
        const res = await fetch("/api/admin/coupons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("تم تحديث الكوبون");
          onSaved();
        } else {
          const d = await res.json();
          toast.error(d.error || "فشل التحديث");
        }
      } else {
        const res = await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("تم إنشاء الكوبون");
          onSaved();
        } else {
          const d = await res.json();
          toast.error(d.error || "فشل الإنشاء");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto scrollbar-luxury bg-cream">
        <DialogHeader>
          <DialogTitle className="text-warm-black text-lg flex items-center justify-between">
            {coupon ? "تعديل الكوبون" : "كوبون جديد"}
            <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-cream-dark rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label className="text-sm font-bold">كود الكوبون *</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER20"
              dir="ltr"
              className="mt-1 text-right font-mono bg-white"
              required
              disabled={!!coupon}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">النوع</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-bold">القيمة</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "PERCENTAGE" ? "10" : "50"}
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">حد أدنى للطلب (ج.م)</Label>
              <Input
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">حد أقصى للخصم</Label>
              <Input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="اختياري"
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">حد الاستخدام الإجمالي</Label>
              <Input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="غير محدود"
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
            <div>
              <Label className="text-sm font-bold">حد لكل عميل</Label>
              <Input
                type="number"
                value={form.perCustomerLimit}
                onChange={(e) => setForm({ ...form, perCustomerLimit: e.target.value })}
                placeholder="غير محدود"
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">تاريخ البداية *</Label>
              <Input
                type="date"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                dir="ltr"
                className="mt-1 text-right bg-white"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-bold">تاريخ النهاية</Label>
              <Input
                type="date"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                dir="ltr"
                className="mt-1 text-right bg-white"
              />
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-lg border border-rose-gold/20 bg-white cursor-pointer">
            <span className="text-sm font-bold text-warm-black">الكوبون نشط</span>
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          </label>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-burgundy hover:bg-burgundy-deep">
              {saving ? "جارٍ الحفظ..." : coupon ? "حفظ التعديلات" : "إنشاء الكوبون"}
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
