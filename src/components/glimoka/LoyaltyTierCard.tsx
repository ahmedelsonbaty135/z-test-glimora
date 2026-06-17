"use client";

import { useShopStore } from "@/lib/store";
import { getTierProgress, LOYALTY_TIERS, type LoyaltyTier } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, TrendingUp, Gift, Truck } from "lucide-react";
import { formatEGP } from "@/lib/utils";

export function LoyaltyTierCard() {
  const { totalSpend, loyaltyBalance } = useShopStore();
  const { current, next, progress, remaining } = getTierProgress(totalSpend);

  return (
    <div className="space-y-4">
      {/* Current tier card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden border-2 p-5"
        style={{ borderColor: current.color + "40", background: current.bg }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
          style={{ background: current.color }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ background: current.color + "20" }}
              >
                {current.icon}
              </div>
              <div>
                <p className="text-xs text-warm-gray font-semibold mb-0.5">عضويتك الحالية</p>
                <h3 className="text-xl font-black" style={{ color: current.color }}>
                  {current.name}
                </h3>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-warm-gray">إجمالي الإنفاق</p>
              <p className="text-lg font-black text-warm-black">{formatEGP(totalSpend)}</p>
            </div>
          </div>

          {/* Points balance */}
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur rounded-xl p-3 mb-3">
            <Sparkles className="w-5 h-5 text-burgundy" />
            <div className="flex-1">
              <p className="text-xs text-warm-gray">رصيد النقاط</p>
              <p className="text-sm font-bold text-warm-black">{loyaltyBalance} نقطة</p>
            </div>
            <span className="text-xs text-warm-gray">(1 نقطة = 1 ج.م)</span>
          </div>

          {/* Progress to next tier */}
          {next ? (
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-warm-gray">
                  تقدّم نحو <span className="font-bold" style={{ color: next.color }}>{next.name}</span>
                </span>
                <span className="font-bold text-warm-black">{progress}%</span>
              </div>
              <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: `linear-gradient(90deg, ${current.color}, ${next.color})` }}
                >
                  <div className="absolute inset-0 shimmer-sweep opacity-50" />
                </motion.div>
              </div>
              <p className="text-[11px] text-warm-gray mt-1.5">
                أنفق <span className="font-bold" style={{ color: next.color }}>{formatEGP(remaining)}</span> إضافية للوصول للمستوى التالي
              </p>
            </div>
          ) : (
            <div className="bg-white/60 rounded-xl p-3 text-center">
              <Crown className="w-5 h-5 mx-auto mb-1" style={{ color: current.color }} />
              <p className="text-sm font-bold" style={{ color: current.color }}>
                وصلت أعلى مستوى! 💎
              </p>
              <p className="text-xs text-warm-gray">استمتع بكل المزايا الحصرية</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Current tier perks */}
      <div className="bg-white rounded-2xl border border-rose-gold/20 p-4">
        <h4 className="font-bold text-warm-black text-sm mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4" style={{ color: current.color }} />
          مزايا مستواك {current.name}
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {current.perks.map((perk) => (
            <div key={perk} className="flex items-start gap-2 text-xs text-warm-gray">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: current.color }} />
              {perk}
            </div>
          ))}
        </div>
      </div>

      {/* All tiers overview */}
      <div className="bg-white rounded-2xl border border-rose-gold/20 p-4">
        <h4 className="font-bold text-warm-black text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-burgundy" />
          مستويات العضوية
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOYALTY_TIERS.map((tier) => {
            const isCurrent = tier.id === current.id;
            const isPassed = totalSpend >= tier.minSpend;
            return (
              <div
                key={tier.id}
                className={`relative rounded-xl p-3 text-center border-2 transition-all ${
                  isCurrent ? "scale-105" : ""
                }`}
                style={{
                  borderColor: isCurrent ? tier.color : "transparent",
                  background: isPassed ? tier.bg : "#F5EDE6",
                  opacity: isPassed ? 1 : 0.5,
                }}
              >
                {isCurrent && (
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: tier.color }}
                  >
                    حالي
                  </span>
                )}
                <div className="text-2xl mb-1">{tier.icon}</div>
                <p className="text-xs font-bold" style={{ color: tier.color }}>
                  {tier.name}
                </p>
                <p className="text-[10px] text-warm-gray mt-0.5">
                  {tier.minSpend === 0 ? "مجاني" : `من ${formatEGP(tier.minSpend)}`}
                </p>
                {tier.discountPercent > 0 && (
                  <p className="text-[10px] font-bold mt-1" style={{ color: tier.color }}>
                    خصم {tier.discountPercent}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
