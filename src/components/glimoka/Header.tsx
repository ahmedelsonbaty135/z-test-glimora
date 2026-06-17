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
  Phone,
  Sparkles,
} from "lucide-react";
import { useShopStore } from "@/lib/store";
import { BrandLogo } from "./BrandLogo";
import { cn, formatEGP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "./CartDrawer";

const NAV_ITEMS: { label: string; view: "home" | "products" | "about" | "contact" | "faq" | "admin"; category?: string }[] = [
  { label: "الرئيسية", view: "home" },
  { label: "الأساور", view: "products", category: "bracelets" },
  { label: "القلائد", view: "products", category: "necklaces" },
  { label: "الخواتم", view: "products", category: "rings" },
  { label: "العروض", view: "products", category: "offers" },
  { label: "من نحن", view: "about" },
  { label: "اتصل بنا", view: "contact" },
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

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-burgundy-gradient text-white text-xs sm:text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-rose-gold-light shrink-0" />
          <span className="font-medium">
            شحن مجاني للطلبات فوق 1000 ج.م • الدفع عند الاستلام لكل مصر • خصم 10% بكود <span className="font-bold text-rose-gold-light">WELCOME10</span>
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
                onClick={() => (user ? setView("account") : setView("account"))}
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

              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden lg:flex text-warm-gray hover:text-burgundy"
                >
                  خروج
                </Button>
              )}
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

      <CartDrawer />
    </>
  );
}
