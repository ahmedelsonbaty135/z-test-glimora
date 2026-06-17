"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus, Quote, Loader2 } from "lucide-react";

interface ReviewsSummaryData {
  summary: string;
  sentiment: string;
  highlights: string[];
  reviewCount: number;
  avgRating?: string;
}

export function AIReviewsSummary({ productId, reviewCount }: { productId: string; reviewCount: number }) {
  const [data, setData] = useState<ReviewsSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (reviewCount === 0) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/ai/reviews-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, reviewCount]);

  if (reviewCount === 0) return null;

  const sentimentConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    "إيجابي": { icon: TrendingUp, color: "#10B981", bg: "#D1FAE5", label: "إيجابي" },
    "سلبي": { icon: TrendingDown, color: "#9B2C2C", bg: "#FED7D7", label: "سلبي" },
    "محايد": { icon: Minus, color: "#6B5560", bg: "#F5EDE6", label: "محايد" },
  };

  const sentiment = data?.sentiment || "إيجابي";
  const cfg = sentimentConfig[sentiment] || sentimentConfig["إيجابي"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-l from-burgundy/5 via-rose-gold/5 to-burgundy/5 rounded-xl p-4 border border-rose-gold/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-burgundy-gradient flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-rose-gold-light" />
        </div>
        <div>
          <h4 className="font-bold text-warm-black text-sm">ملخص ذكي بالـ AI</h4>
          <p className="text-[10px] text-warm-gray">تحليل آلي لـ {reviewCount} مراجعة</p>
        </div>
        {data && (
          <span
            className="mr-auto flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            <cfg.icon className="w-3 h-3" />
            {cfg.label}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4 gap-2 text-warm-gray">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">جارٍ تحليل المراجعات...</span>
        </div>
      ) : error ? (
        <p className="text-xs text-warm-gray text-center py-2">
          تعذر تحليل المراجعات حاليًا
        </p>
      ) : data ? (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-rose-gold shrink-0 mt-0.5" />
            <p className="text-sm text-warm-black leading-relaxed">{data.summary}</p>
          </div>

          {/* Highlights */}
          {data.highlights.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-warm-gray uppercase tracking-wide">نقاط بارزة:</p>
              {data.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-xs text-warm-gray bg-white/50 rounded-lg px-2.5 py-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                    style={{ background: cfg.color }}
                  />
                  {h}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
}
