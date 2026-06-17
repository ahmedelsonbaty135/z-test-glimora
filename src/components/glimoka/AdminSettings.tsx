"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SETTING_FIELDS = [
  { key: "storeName", label: "اسم المتجر", type: "text", icon: "🏪" },
  { key: "whatsappNumber", label: "رقم واتساب", type: "text", icon: "💬", dir: "ltr" },
  { key: "freeShippingThreshold", label: "حد الشحن المجاني (ج.م)", type: "number", icon: "🚚" },
  { key: "codEnabled", label: "الدفع عند الاستلام مفعّل", type: "boolean", icon: "💰" },
  { key: "loyaltyRate", label: "معدل النقاط (كل X ج.م = نقطة)", type: "number", icon: "⭐" },
  { key: "instagramUrl", label: "رابط إنستجرام", type: "text", icon: "📷", dir: "ltr" },
  { key: "facebookUrl", label: "رابط فيسبوك", type: "text", icon: "📘", dir: "ltr" },
  { key: "tiktokUrl", label: "رابط تيك توك", type: "text", icon: "🎵", dir: "ltr" },
  { key: "adminAccessCode", label: "كود الأدمن السري", type: "text", icon: "🔐", dir: "ltr" },
];

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/settings");
      if (!res.ok) return;
      const data = await res.json();
      setSettings(data.settings || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("تم حفظ الإعدادات");
      } else {
        toast.error(data.error || "فشل الحفظ");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-gold/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-warm-black flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-burgundy" />
          إعدادات المتجر
        </h3>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm" className="border-rose-gold/30">
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-burgundy hover:bg-burgundy-deep"
            disabled={saving}
          >
            <Save className="w-4 h-4 ml-1" />
            {saving ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-rose-gold/10 border border-rose-gold/30 rounded-xl p-3 text-xs text-warm-black flex items-start gap-2"
          >
            <span className="text-base">💡</span>
            <div>
              <p className="font-bold mb-1">إعدادات التحكم الكامل في المتجر</p>
              <p className="text-warm-gray">يمكنك تغيير اسم المتجر، أرقام التواصل، حدود الشحن، معدل النقاط، روابط السوشيال ميديا، وكود الأدمن السري.</p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SETTING_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  <span>{field.icon}</span>
                  {field.label}
                </Label>
                {field.type === "boolean" ? (
                  <select
                    value={settings[field.key] || "true"}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-rose-gold/30 bg-white text-sm focus:border-burgundy focus:outline-none"
                  >
                    <option value="true">مفعّل</option>
                    <option value="false">متوقف</option>
                  </select>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    dir={field.dir as "ltr" | "rtl" | undefined}
                    className={`border-rose-gold/30 ${field.dir === "ltr" ? "text-left" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-danger-soft/5 border border-danger-soft/20 rounded-xl p-3 flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div className="text-xs">
              <p className="font-bold text-danger-soft">تحذير أمني</p>
              <p className="text-warm-gray mt-0.5">
                تغيير كود الأدمن السري سيؤثر على وصول جميع المدراء. احفظ الكود الجديد في مكان آمن.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
