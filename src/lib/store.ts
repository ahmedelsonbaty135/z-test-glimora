import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------- Types ----------
export type ViewName =
  | "home"
  | "products"
  | "product"
  | "cart"
  | "checkout"
  | "thankyou"
  | "account"
  | "admin"
  | "about"
  | "contact"
  | "faq"
  | "track-order"
  | "shipping-policy"
  | "return-policy"
  | "size-guide"
  | "compare"
  | "gift-cards";

export interface CartItemCustomization {
  metal: string;
  size: string;
  font: string;
  name1: string;
  name2: string;
  giftBox: boolean;
  giftCard: string;
}

export interface CartItem {
  id: string; // unique line id
  productId: string;
  slug: string;
  name: string;
  image: string;
  basePrice: number;
  unitPrice: number; // basePrice + addons
  quantity: number;
  customization: CartItemCustomization;
  maxStock: number;
}

export interface AppliedCoupon {
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" | "BOGO";
  value: number;
  minOrder: number;
}

export interface SavedAddress {
  id: string;
  label: string; // "المنزل", "العمل"
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  isDefault: boolean;
}

export interface GiftCardItem {
  id: string;
  amount: number; // EGP value
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  design: string; // "classic" | "rose" | "burgundy"
}

interface ShopState {
  // Navigation
  view: ViewName;
  selectedProductSlug: string | null;
  selectedCategory: string | null; // slug or null
  searchQuery: string;
  lastOrderNumber: string | null;

  // Cart
  items: CartItem[];
  coupon: AppliedCoupon | null;
  wishlist: string[]; // productIds
  recentlyViewed: string[]; // productIds

  // Mobile UI
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  filtersOpen: boolean;
  chatbotOpen: boolean;
  quickViewSlug: string | null;

  // Auth (mock — sandbox)
  user: { email: string; name: string; role: "CUSTOMER" | "ADMIN" } | null;

  // Loyalty
  loyaltyBalance: number;
  useLoyaltyPoints: boolean;

  // Compare
  compareList: string[]; // productIds (max 3)

  // Addresses
  addresses: SavedAddress[];
  selectedAddressId: string | null;

  // Gift cards in cart
  giftCards: GiftCardItem[];

  // Actions
  setView: (view: ViewName, opts?: { slug?: string; category?: string }) => void;
  openProduct: (slug: string) => void;
  setSearch: (q: string) => void;

  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (c: AppliedCoupon) => void;
  removeCoupon: () => void;

  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;

  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  removeFromCompare: (productId: string) => void;

  addAddress: (a: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, a: Partial<Omit<SavedAddress, "id">>) => void;
  removeAddress: (id: string) => void;
  setSelectedAddress: (id: string | null) => void;

  addGiftCard: (g: Omit<GiftCardItem, "id">) => void;
  removeGiftCard: (id: string) => void;

  setMobileMenuOpen: (v: boolean) => void;
  setCartDrawerOpen: (v: boolean) => void;
  setFiltersOpen: (v: boolean) => void;
  setChatbotOpen: (v: boolean) => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;

  login: (email: string, name: string, role?: "CUSTOMER" | "ADMIN") => void;
  logout: () => void;
  setLastOrder: (n: string) => void;
  setLoyaltyBalance: (n: number) => void;
  addLoyalty: (n: number) => void;
  setUseLoyaltyPoints: (v: boolean) => void;
}

function makeLineId(item: Omit<CartItem, "id">) {
  // combine productId + customization to dedupe identical lines
  const c = item.customization;
  return `${item.productId}__${c.metal}__${c.size}__${c.font}__${c.name1}__${c.name2}__${c.giftBox ? "1" : "0"}__${c.giftCard}`;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      view: "home",
      selectedProductSlug: null,
      selectedCategory: null,
      searchQuery: "",
      lastOrderNumber: null,

      items: [],
      coupon: null,
      wishlist: [],
      recentlyViewed: [],

      mobileMenuOpen: false,
      cartDrawerOpen: false,
      filtersOpen: false,
      chatbotOpen: false,
      quickViewSlug: null,

      user: null,

      loyaltyBalance: 0,
      useLoyaltyPoints: false,

      compareList: [],
      addresses: [],
      selectedAddressId: null,
      giftCards: [],

      setView: (view, opts) => {
        set({
          view,
          selectedProductSlug: opts?.slug ?? (view === "product" ? get().selectedProductSlug : null),
          selectedCategory: opts?.category ?? (view === "products" ? get().selectedCategory : view === "products" ? null : get().selectedCategory),
          mobileMenuOpen: false,
          cartDrawerOpen: false,
        });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      openProduct: (slug) => {
        set({ view: "product", selectedProductSlug: slug, mobileMenuOpen: false });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      setSearch: (q) => set({ searchQuery: q }),

      addToCart: (item) => {
        const id = makeLineId(item);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.min(i.maxStock, i.quantity + item.quantity) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, id }] });
        }
      },

      updateQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.maxStock, qty)) } : i
            )
            .filter((i) => i.quantity > 0),
        }),

      removeFromCart: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      clearCart: () => set({ items: [], coupon: null, giftCards: [] }),

      applyCoupon: (c) => set({ coupon: c }),
      removeCoupon: () => set({ coupon: null }),

      toggleWishlist: (productId) => {
        const w = get().wishlist;
        set({
          wishlist: w.includes(productId)
            ? w.filter((id) => id !== productId)
            : [...w, productId],
        });
      },

      addRecentlyViewed: (productId) => {
        const r = get().recentlyViewed.filter((id) => id !== productId);
        set({ recentlyViewed: [productId, ...r].slice(0, 8) });
      },

      toggleCompare: (productId) => {
        const c = get().compareList;
        if (c.includes(productId)) {
          set({ compareList: c.filter((id) => id !== productId) });
        } else {
          if (c.length >= 3) {
            // replace oldest
            set({ compareList: [...c.slice(1), productId] });
          } else {
            set({ compareList: [...c, productId] });
          }
        }
      },
      clearCompare: () => set({ compareList: [] }),
      removeFromCompare: (productId) =>
        set({ compareList: get().compareList.filter((id) => id !== productId) }),

      addAddress: (a) => {
        const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const newAddr: SavedAddress = { ...a, id };
        const existing = get().addresses;
        // if new is default, unset others
        const list = a.isDefault
          ? [newAddr, ...existing.map((x) => ({ ...x, isDefault: false }))]
          : [newAddr, ...existing];
        set({ addresses: list, selectedAddressId: a.isDefault ? id : get().selectedAddressId });
      },
      updateAddress: (id, patch) => {
        const list = get().addresses.map((x) =>
          x.id === id ? { ...x, ...patch } : patch.isDefault ? { ...x, isDefault: false } : x
        );
        set({ addresses: list });
      },
      removeAddress: (id) => {
        const list = get().addresses.filter((x) => x.id !== id);
        set({
          addresses: list,
          selectedAddressId: get().selectedAddressId === id ? null : get().selectedAddressId,
        });
      },
      setSelectedAddress: (id) => set({ selectedAddressId: id }),

      addGiftCard: (g) => {
        const id = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set({ giftCards: [...get().giftCards, { ...g, id }] });
      },
      removeGiftCard: (id) =>
        set({ giftCards: get().giftCards.filter((g) => g.id !== id) }),

      setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
      setCartDrawerOpen: (v) => set({ cartDrawerOpen: v }),
      setFiltersOpen: (v) => set({ filtersOpen: v }),
      setChatbotOpen: (v) => set({ chatbotOpen: v }),
      openQuickView: (slug) => set({ quickViewSlug: slug }),
      closeQuickView: () => set({ quickViewSlug: null }),

      login: (email, name, role = "CUSTOMER") =>
        set({ user: { email, name, role } }),
      logout: () => set({ user: null }),
      setLastOrder: (n) => set({ lastOrderNumber: n }),
      setLoyaltyBalance: (n) => set({ loyaltyBalance: Math.max(0, n) }),
      addLoyalty: (n) => set({ loyaltyBalance: Math.max(0, get().loyaltyBalance + n) }),
      setUseLoyaltyPoints: (v) => set({ useLoyaltyPoints: v }),
    }),
    {
      name: "glimoka-shop",
      partialize: (s) => ({
        items: s.items,
        coupon: s.coupon,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        user: s.user,
        lastOrderNumber: s.lastOrderNumber,
        loyaltyBalance: s.loyaltyBalance,
        compareList: s.compareList,
        addresses: s.addresses,
        giftCards: s.giftCards,
      }),
    }
  )
);

// ---------- Derived helpers ----------
export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function calcDiscount(subtotal: number, coupon: AppliedCoupon | null): number {
  if (!coupon) return 0;
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === "PERCENTAGE") {
    const d = (subtotal * coupon.value) / 100;
    return Math.min(d, subtotal);
  }
  if (coupon.type === "FIXED") return Math.min(coupon.value, subtotal);
  return 0;
}

export function calcShipping(
  subtotal: number,
  governorate: string,
  coupon: AppliedCoupon | null
): number {
  if (subtotal >= 1000) return 0;
  if (coupon?.type === "FREE_SHIPPING" && subtotal >= coupon.minOrder) return 0;
  const greater = ["القاهرة", "الجيزة", "6 أكتوبر", "الشيخ زايد"];
  const major = ["الإسكندرية", "المنصورة", "طنطا", "أسيوط"];
  if (greater.some((g) => governorate.includes(g))) return 30;
  if (major.some((g) => governorate.includes(g))) return 40;
  return 50;
}

export function calcGiftCardsTotal(cards: GiftCardItem[]): number {
  return cards.reduce((sum, g) => sum + g.amount, 0);
}

export const GIFT_CARD_PRESETS = [250, 500, 750, 1000, 1500, 2500];

export const GIFT_CARD_DESIGNS = [
  { id: "classic", name: "كلاسيكي", color: "#C9A87C" },
  { id: "rose", name: "ذهبي وردي", color: "#E8B4B8" },
  { id: "burgundy", name: "أحمر نبيذي", color: "#6A1B35" },
  { id: "royal", name: "ملكي", color: "#2C3E50" },
] as const;

export const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "6 أكتوبر",
  "الشيخ زايد",
  "الإسكندرية",
  "المنصورة",
  "طنطا",
  "أسيوط",
  "المنيا",
  "أسوان",
  "الأقصر",
  "بورسعيد",
  "السويس",
  "الإسماعيلية",
  "بنها",
  "زفتى",
  "دمنهور",
  "كفر الشيخ",
  "بلبيس",
  "الفيوم",
  "بني سويف",
  "قنا",
  "سوهاج",
  "الغردقة",
  "شرم الشيخ",
  "العريش",
  "دمياط",
  "الزقازيق",
  "أسيوط الجديدة",
];
