"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  Sparkles,
  Home,
  Tag,
  Phone,
  HelpCircle,
  Package,
  Ruler,
  Info,
  LogOut,
  ChevronLeft,
  Gift,
} from "lucide-react";
import { useShopStore } from "@/lib/store";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "./CartDrawer";

type ViewName =
  | "home" | "products" | "product" | "cart" | "checkout" | "thankyou"
  | "account" | "admin" | "about" | "contact" | "faq"
  | "track-order" | "shipping-policy" | "return-policy" | "size-guide"
  | "compare" | "gift-cards";

const NAV_ITEMS: { label: string; view: ViewName; category?: string }[] = [
  { label: "الرئيسية", view: "home" },
  { label: "الأساور", view: "products", category: "bracelets" },
  { label: "القلائد", view: "products", category: "necklaces" },
  { label: "الخواتم", view: "products", category: "rings" },
  { label: "العروض", view: "products", category: "offers" },
  { label: "بطاقات الهدايا", view: "gift-cards" },
  { label: "من نحن", view: "about" },
  { label: "اتصل بنا", view: "contact" },
];

const MOBILE_NAV_SECTIONS: {
  title: string;
  items: { label: string; view: ViewName; category?: string; icon: any }[];
}[] = [
  {
    title: "تسوق",
    items: [
      { label: "الرئيسية", view: "home", icon: Home },
      { label: "كل المنتجات", view: "products", icon: Tag },
      { label: "الأساور", view: "products", category: "bracelets", icon: Tag },
      { label: "القلائد", view: "products", category: "necklaces", icon: Tag },
      { label: "الخواتم", view: "products", category: "rings", icon: Tag },
      { label: "العروض", view: "products", category: "offers", icon: Tag },
      { label: "بطاقات الهدايا", view: "gift-cards", icon: Gift },
    ],
  },
  {
    title: "خدمة العملاء",
    items: [
      { label: "تتبع الطلب", view: "track-order", icon: Package },
      { label: "الأسئلة الشائعة", view: "faq", icon: HelpCircle },
      { label: "دليل المقاسات", view: "size-guide", icon: Ruler },
      { label: "سياسة الشحن", view: "shipping-policy", icon: Info },
      { label: "سياسة الإرجاع", view: "return-policy", icon: Info },
      { label: "اتصل بنا", view: "contact", icon: Phone },
    ],
  },
];

export function Header() {
  const {
    view,
    setView,
    selectedCategory,
    mobileMenuOpen,
    setMobileMenuOpen,
    setCartDrawerOpen,
    items,
    wishlist,
    user,
    login,
    logout,
    searchQuery,
    setSearch,
  } = useShopStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
    setView("products", { category: selectedCategory || undefined });
    setSearchOpen(false);
  };

  const handleNavClick = (view: ViewName, category?: string) => {
    setView(view, { category });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-burgundy-gradient text-white text-xs sm:text-sm overflow-hidden">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-rose-gold-light shrink-0 animate-pulse" />
          <span className="font-medium">
            شحن مجاني للطلبات فوق 1000 ج.م • الدفع عند الاستلام لكل مصر • خصم 10% بكود{" "}
            <span className="font-bold text-rose-gold-light">WELCOME10</span>
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-luxury"
            : "bg-cream/80 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-burgundy hover:text-burgundy-light transition-colors"
              aria-label="القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <button
              onClick={() => setView("home")}
              className="shrink-0"
              aria-label="GLIMOKA الرئيسية"
            >
              <BrandLogo size="md" variant="dark" />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item) => {
                const active =
                  view === item.view &&
                  (item.category ? selectedCategory === item.category : true);
                return (
                  <button
                    key={item.label}
                    onClick={() => setView(item.view, { category: item.category })}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                      active
                        ? "text-burgundy"
                        : "text-warm-black/70 hover:text-burgundy"
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 right-1/2 translate-x-1/2 w-6 h-0.5 bg-rose-gold rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="p-2 text-burgundy hover:bg-cream-dark rounded-lg transition-colors"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button
                onClick={() => setView("account")}
                className="p-2 text-burgundy hover:bg-cream-dark rounded-lg transition-colors hidden sm:block"
                aria-label="حسابي"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setView("account")}
                className="relative p-2 text-burgundy hover:bg-cream-dark rounded-lg transition-colors hidden sm:block"
                aria-label="المفضلة"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-rose-gold text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-burgundy hover:bg-cream-dark rounded-lg transition-colors"
                aria-label="سلة التسوق"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-burgundy text-white text-[10px] font-bold flex items-center justify-center animate-float-up">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar expandable */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                onSubmit={handleSearch}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-3 flex gap-2">
                  <Input
                    autoFocus
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="ابحث عن سوار، قلادة، خاتم..."
                    className="bg-white border-rose-gold/40 focus-visible:ring-rose-gold"
                  />
                  <Button type="submit" className="bg-burgundy hover:bg-burgundy-deep shrink-0">
                    <Search className="w-4 h-4 ml-1" />
                    بحث
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="w-[85vw] sm:w-96 bg-cream p-0 flex flex-col overflow-y-auto"
        >
          <SheetHeader className="bg-burgundy-gradient text-white px-5 py-4">
            <SheetTitle className="flex items-center justify-between text-white">
              <BrandLogo size="sm" variant="light" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto scrollbar-luxury px-3 py-4 space-y-5">
            {MOBILE_NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-bold text-rose-gold uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h4>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active =
                      view === item.view &&
                      (item.category ? selectedCategory === item.category : !item.category && view === item.view);
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.view, item.category)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-right",
                          active
                            ? "bg-burgundy text-white shadow-luxury"
                            : "text-warm-black hover:bg-cream-dark"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-rose-gold-light" : "text-burgundy")} />
                        <span className="flex-1">{item.label}</span>
                        {!active && <ChevronLeft className="w-4 h-4 text-warm-gray/50" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Account / Admin footer */}
          <div className="border-t border-rose-gold/20 p-3 space-y-2 bg-cream-dark/30">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick("account")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-burgundy text-white hover:bg-burgundy-deep transition-colors"
                >
                  <User className="w-4 h-4 text-rose-gold-light" />
                  <span className="flex-1 text-right">حسابي ({user.name})</span>
                </button>
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => handleNavClick("admin")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-rose-gold text-warm-black hover:bg-rose-gold-light transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span className="flex-1 text-right">لوحة الإدارة</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-soft hover:bg-danger-soft/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="flex-1 text-right">تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick("account")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-burgundy text-white hover:bg-burgundy-deep transition-colors"
              >
                <User className="w-4 h-4 text-rose-gold-light" />
                <span className="flex-1 text-right">تسجيل الدخول / حساب جديد</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick("admin")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-warm-gray hover:bg-cream-dark transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="flex-1 text-right">دخول لوحة الإدارة</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <CartDrawer />
    </>
  );
}
