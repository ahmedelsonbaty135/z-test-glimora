"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Star, Trash2, MessageSquare } from "lucide-react";
import { cn, formatEGP } from "@/lib/utils";
import { toast } from "sonner";

interface AdminReview {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  body: string;
  isApproved: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  };
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${filter}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleAction = async (id: string, action: "approve" | "reject" | "delete") => {
    if (action === "delete") {
      if (!confirm("هل أنت متأكد من حذف هذه المراجعة؟")) return;
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف المراجعة");
        load();
      }
      return;
    }
    const isApproved = action === "approve";
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    if (res.ok) {
      toast.success(isApproved ? "تمت الموافقة على المراجعة" : "تم رفض المراجعة");
      load();
    }
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <Card className="bg-white border-rose-gold/20">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-warm-black text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-burgundy" />
          مراجعة التقييمات
        </CardTitle>
        <div className="flex gap-1 p-1 bg-cream-dark rounded-lg">
          {([
            { key: "pending", label: "قيد الانتظار" },
            { key: "approved", label: "مُوافق عليها" },
            { key: "all", label: "الكل" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-bold transition-colors",
                filter === t.key ? "bg-white text-burgundy shadow" : "text-warm-gray hover:text-warm-black"
              )}
            >
              {t.label}
              {t.key === "pending" && pendingCount > 0 && filter !== "pending" && (
                <span className="mr-1 bg-danger-soft text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  •
                </span>
              )}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-warm-gray py-8">جارٍ التحميل...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-12 h-12 text-rose-gold mx-auto mb-3" />
            <p className="font-bold text-warm-black mb-1">لا توجد مراجعات</p>
            <p className="text-sm text-warm-gray">
              {filter === "pending" ? "لا توجد مراجعات قيد الانتظار" : filter === "approved" ? "لا توجد مراجعات مُوافق عليها" : "لا توجد مراجعات"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  r.isApproved
                    ? "border-emerald-soft/20 bg-emerald-soft/5"
                    : "border-amber-300/30 bg-amber-50/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                    {r.product.images[0] ? (
                      <img src={r.product.images[0].url} alt={r.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-bold text-warm-black text-sm">{r.authorName}</p>
                        <p className="text-xs text-warm-gray">على: {r.product.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3.5 h-3.5",
                                i < r.rating ? "fill-rose-gold text-rose-gold" : "text-rose-gold/30"
                              )}
                            />
                          ))}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          r.isApproved ? "bg-emerald-soft/15 text-emerald-soft" : "bg-amber-200/50 text-amber-700"
                        )}>
                          {r.isApproved ? "مُوافق" : "قيد الانتظار"}
                        </span>
                      </div>
                    </div>
                    {r.title && (
                      <p className="font-bold text-warm-black text-sm mt-2">{r.title}</p>
                    )}
                    <p className="text-sm text-warm-gray mt-1 leading-relaxed">{r.body}</p>
                    <p className="text-[11px] text-warm-gray/70 mt-2">
                      {new Date(r.createdAt).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-rose-gold/15">
                  {!r.isApproved && (
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-emerald-soft hover:bg-emerald-soft/90"
                      onClick={() => handleAction(r.id, "approve")}
                    >
                      <Check className="w-3 h-3 ml-1" />
                      موافقة
                    </Button>
                  )}
                  {r.isApproved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={() => handleAction(r.id, "reject")}
                    >
                      <X className="w-3 h-3 ml-1" />
                      إلغاء الموافقة
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-danger-soft hover:bg-danger-soft/10"
                    onClick={() => handleAction(r.id, "delete")}
                  >
                    <Trash2 className="w-3 h-3 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
