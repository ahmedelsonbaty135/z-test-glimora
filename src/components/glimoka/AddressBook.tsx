"use client";

import { useState } from "react";
import { useShopStore, type SavedAddress, EGYPT_GOVERNORATES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Plus, Trash2, Edit2, Star, Check, Home, Briefcase, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LABEL_ICONS: Record<string, any> = {
  "المنزل": Home,
  "العمل": Briefcase,
};

export function AddressBook() {
  const { addresses, addAddress, updateAddress, removeAddress, setSelectedAddress, selectedAddressId } = useShopStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SavedAddress, "id">>({
    label: "المنزل",
    fullName: "",
    phone: "",
    governorate: "القاهرة",
    city: "",
    address: "",
    notes: "",
    isDefault: false,
  });

  const resetForm = () => {
    setForm({
      label: "المنزل",
      fullName: "",
      phone: "",
      governorate: "القاهرة",
      city: "",
      address: "",
      notes: "",
      isDefault: false,
    });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      governorate: addr.governorate,
      city: addr.city,
      address: addr.address,
      notes: addr.notes || "",
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.fullName.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return;
    }
    if (!/^01[0-9]{9}$/.test(form.phone.replace(/\s/g, ""))) {
      toast.error("يرجى إدخال رقم هاتف مصري صحيح (01XXXXXXXXX)");
      return;
    }
    if (!form.city.trim() || !form.address.trim()) {
      toast.error("يرجى إدخال المدينة والعنوان");
      return;
    }
    if (editingId) {
      updateAddress(editingId, form);
      toast.success("تم تحديث العنوان");
    } else {
      addAddress(form);
      toast.success("تم إضافة العنوان");
    }
    setOpen(false);
    resetForm();
  };

  const handleSetDefault = (addr: SavedAddress) => {
    updateAddress(addr.id, { isDefault: true });
    setSelectedAddress(addr.id);
    toast.success("تم تعيين العنوان الافتراضي");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-burgundy" />
          <h2 className="font-bold text-warm-black">دفتر العناوين</h2>
        </div>
        <Button
          onClick={openAdd}
          className="bg-burgundy hover:bg-burgundy-deep"
          size="sm"
        >
          <Plus className="w-4 h-4 ml-1" />
          عنوان جديد
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-rose-gold/30">
          <MapPinned className="w-12 h-12 text-rose-gold mx-auto mb-3" />
          <p className="font-bold text-warm-black mb-1">لا توجد عناوين محفوظة</p>
          <p className="text-sm text-warm-gray mb-4">
            احفظ عناوينك لتسريع عملية الدفع في المرات القادمة
          </p>
          <Button onClick={openAdd} className="bg-burgundy hover:bg-burgundy-deep">
            <Plus className="w-4 h-4 ml-1" />
            أضف عنوانك الأول
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((addr, idx) => {
              const Icon = LABEL_ICONS[addr.label] || MapPin;
              const isSelected = selectedAddressId === addr.id || addr.isDefault;
              return (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "relative bg-white rounded-2xl border-2 p-4 transition-all",
                    isSelected
                      ? "border-burgundy shadow-luxury"
                      : "border-rose-gold/20 hover:border-rose-gold/40"
                  )}
                >
                  {addr.isDefault && (
                    <span className="absolute -top-2 right-3 bg-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      افتراضي
                    </span>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-burgundy text-white" : "bg-cream-dark text-burgundy"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-warm-black text-sm">{addr.label}</p>
                      </div>
                      <p className="text-sm text-warm-black">{addr.fullName}</p>
                      <p className="text-xs text-warm-gray" dir="ltr">{addr.phone}</p>
                    </div>
                  </div>
                  <div className="text-xs text-warm-gray space-y-1 mb-3 bg-cream-dark/40 rounded-lg p-2.5">
                    <p>{addr.governorate} — {addr.city}</p>
                    <p className="line-clamp-2">{addr.address}</p>
                    {addr.notes && <p className="italic text-warm-gray/70">ملاحظة: {addr.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-burgundy border border-rose-gold/30 rounded-lg py-1.5 hover:bg-cream-dark transition-colors"
                      >
                        <Star className="w-3 h-3" />
                        تعيين افتراضي
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(addr)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-warm-gray border border-rose-gold/30 rounded-lg py-1.5 hover:bg-cream-dark transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        removeAddress(addr.id);
                        toast.success("تم حذف العنوان");
                      }}
                      className="flex items-center justify-center gap-1 text-xs font-semibold text-danger-soft border border-danger-soft/30 rounded-lg py-1.5 px-2 hover:bg-danger-soft/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-burgundy">
              <MapPin className="w-5 h-5" />
              {editingId ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </DialogTitle>
          </DialogHeader>
          <p className="sr-only">نموذج إدارة العنوان</p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Label selector */}
            <div>
              <Label className="text-sm font-bold mb-2 block">نوع العنوان</Label>
              <div className="grid grid-cols-3 gap-2">
                {["المنزل", "العمل", "أخرى"].map((l) => {
                  const Icon = LABEL_ICONS[l] || MapPin;
                  return (
                    <button
                      key={l}
                      onClick={() => setForm({ ...form, label: l })}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-semibold transition-all",
                        form.label === l
                          ? "border-burgundy bg-burgundy text-white"
                          : "border-rose-gold/20 text-warm-gray hover:border-burgundy/40"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-sm font-bold mb-1.5 block">الاسم الكامل *</Label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="مثال: أحمد محمد"
                className="border-rose-gold/30 focus:border-burgundy"
              />
            </div>

            <div>
              <Label className="text-sm font-bold mb-1.5 block">رقم الهاتف *</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="border-rose-gold/30 focus:border-burgundy"
                dir="ltr"
                maxLength={11}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-bold mb-1.5 block">المحافظة *</Label>
                <select
                  value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-rose-gold/30 bg-white text-sm focus:border-burgundy focus:outline-none"
                >
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-bold mb-1.5 block">المدينة *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="مثال: مدينة نصر"
                  className="border-rose-gold/30 focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-bold mb-1.5 block">العنوان التفصيلي *</Label>
              <Textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="الشارع، رقم المبنى، الشقة، علامة مميزة..."
                rows={3}
                className="border-rose-gold/30 focus:border-burgundy resize-none"
              />
            </div>

            <div>
              <Label className="text-sm font-bold mb-1.5 block">ملاحظات (اختياري)</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="مثال: اتصل قبل التوصيل"
                className="border-rose-gold/30 focus:border-burgundy"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-cream-dark/40">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-5 h-5 accent-burgundy"
              />
              <span className="text-sm font-semibold text-warm-black">
                تعيين كعنوان افتراضي
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 border-rose-gold/30 text-warm-gray"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-burgundy hover:bg-burgundy-deep"
              >
                <Check className="w-4 h-4 ml-1" />
                {editingId ? "حفظ التغييرات" : "إضافة العنوان"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
