import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format Egyptian Pounds
export function formatEGP(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " ج.م";
}

export function formatEGPLatin(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " EGP";
}

// Discount percentage from comparePrice
export function discountPercent(basePrice: number, comparePrice?: number | null): number {
  if (!comparePrice || comparePrice <= basePrice) return 0;
  return Math.round(((comparePrice - basePrice) / comparePrice) * 100);
}

// Metal label in Arabic
export const METAL_LABELS: Record<string, string> = {
  SILVER_925: "فضة 925",
  GOLD_18K: "ذهب عيار 18",
  GOLD_21K: "ذهب عيار 21",
  RHODIUM: "روديوم",
};

export const METAL_PRICE_ADDON: Record<string, number> = {
  SILVER_925: 0,
  GOLD_18K: 400,
  GOLD_21K: 600,
  RHODIUM: 100,
};

export const METAL_COLOR_HEX: Record<string, string> = {
  SILVER_925: "#C0C0C0",
  GOLD_18K: "#D4AF37",
  GOLD_21K: "#FFD700",
  RHODIUM: "#E5E4E2",
};

// Build a WhatsApp click-to-chat URL
export function whatsappLink(phone: string, message: string): string {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

// Star rating render helper
export function starArray(rating: number): ("full" | "half" | "empty")[] {
  const out: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) out.push("full");
    else if (rating >= i - 0.5) out.push("half");
    else out.push("empty");
  }
  return out;
}

// Order status meta
export const ORDER_STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; step: number }
> = {
  PENDING: { label: "قيد المراجعة", color: "#92400E", bg: "#FEF3C7", step: 1 },
  CONFIRMED: { label: "تم التأكيد", color: "#1E40AF", bg: "#DBEAFE", step: 2 },
  CUSTOMIZING: { label: "قيد التخصيص", color: "#6A1B35", bg: "#FCE7F3", step: 3 },
  SHIPPED: { label: "تم الشحن", color: "#7C3AED", bg: "#EDE9FE", step: 4 },
  OUT_FOR_DELIVERY: { label: "في الطريق إليك", color: "#0E7490", bg: "#CFFAFE", step: 5 },
  DELIVERED: { label: "تم التوصيل", color: "#065F46", bg: "#D1FAE5", step: 6 },
  CANCELLED: { label: "ملغي", color: "#991B1B", bg: "#FEE2E2", step: 0 },
  RETURNED: { label: "مُرتجع", color: "#9B2C2C", bg: "#FED7D7", step: 0 },
};

// Loyalty: 1 point = 1 EGP. Earn 1 point per 10 EGP spent.
export const LOYALTY_EARN_RATE = 10;
export const LOYALTY_REDEEM_RATE = 1;

export function calcLoyaltyEarn(total: number): number {
  return Math.floor(total / LOYALTY_EARN_RATE);
}

export function calcLoyaltyDiscount(loyaltyBalance: number, useLoyalty: boolean, subtotal: number): number {
  if (!useLoyalty || loyaltyBalance <= 0) return 0;
  // Each point = 1 EGP, max 30% of subtotal
  const maxDiscount = Math.floor(subtotal * 0.3);
  return Math.min(loyaltyBalance, maxDiscount);
}

// Loyalty Tier System — based on total lifetime spend (EGP)
export interface LoyaltyTier {
  id: string;
  name: string;
  nameEn: string;
  minSpend: number;
  color: string;
  bg: string;
  icon: string;
  perks: string[];
  discountPercent: number; // tier-based discount on all orders
  freeShippingThreshold: number; // lower threshold for free shipping
  pointsMultiplier: number; // earn points faster
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "برونزي",
    nameEn: "Bronze",
    minSpend: 0,
    color: "#92400E",
    bg: "#FEF3C7",
    icon: "🥉",
    perks: ["1 نقطة لكل 10 ج.م", "شحن مجاني فوق 1000 ج.م", "وصول مبكر للعروض"],
    discountPercent: 0,
    freeShippingThreshold: 1000,
    pointsMultiplier: 1,
  },
  {
    id: "silver",
    name: "فضي",
    nameEn: "Silver",
    minSpend: 3000,
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: "🥈",
    perks: ["خصم 5% على كل الطلبات", "شحن مجاني فوق 800 ج.م", "نقاط مضاعفة أيام الثلاثاء", "دعم أولوية واتساب"],
    discountPercent: 5,
    freeShippingThreshold: 800,
    pointsMultiplier: 1.2,
  },
  {
    id: "gold",
    name: "ذهبي",
    nameEn: "Gold",
    minSpend: 8000,
    color: "#D4AF37",
    bg: "#FEF9C3",
    icon: "🥇",
    perks: ["خصم 10% على كل الطلبات", "شحن مجاني على كل الطلبات", "نقاط مضاعفة دائمًا (1.5×)", "هدية عيد ميلاد", "معاينة المنتجات الجديدة"],
    discountPercent: 10,
    freeShippingThreshold: 0,
    pointsMultiplier: 1.5,
  },
  {
    id: "platinum",
    name: "بلاتيني",
    nameEn: "Platinum",
    minSpend: 20000,
    color: "#9CA3AF",
    bg: "#F1F5F9",
    icon: "💎",
    perks: ["خصم 15% على كل الطلبات", "شحن مجاني على كل الطلبات", "نقاط مضاعفة دائمًا (2×)", "استشارة مجوهرات شخصية مجانية", "نقش مجاني على أي منتج", "ضمان استبدال مدى الحياة"],
    discountPercent: 15,
    freeShippingThreshold: 0,
    pointsMultiplier: 2,
  },
];

export function getLoyaltyTier(totalSpend: number): LoyaltyTier {
  let tier = LOYALTY_TIERS[0];
  for (const t of LOYALTY_TIERS) {
    if (totalSpend >= t.minSpend) tier = t;
  }
  return tier;
}

export function getNextTier(totalSpend: number): LoyaltyTier | null {
  for (const t of LOYALTY_TIERS) {
    if (totalSpend < t.minSpend) return t;
  }
  return null; // already at highest tier
}

export function getTierProgress(totalSpend: number): { current: LoyaltyTier; next: LoyaltyTier | null; progress: number; remaining: number } {
  const current = getLoyaltyTier(totalSpend);
  const next = getNextTier(totalSpend);
  if (!next) {
    return { current, next: null, progress: 100, remaining: 0 };
  }
  const range = next.minSpend - current.minSpend;
  const spent = totalSpend - current.minSpend;
  const progress = Math.min(100, Math.round((spent / range) * 100));
  const remaining = next.minSpend - totalSpend;
  return { current, next, progress, remaining };
}

