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
