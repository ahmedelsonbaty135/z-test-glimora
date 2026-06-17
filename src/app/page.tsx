"use client";

import { useShopStore } from "@/lib/store";
import { Header } from "@/components/glimoka/Header";
import { Footer } from "@/components/glimoka/Footer";
import { FloatingWidgets } from "@/components/glimoka/FloatingWidgets";
import { QuickViewManager } from "@/components/glimoka/QuickViewManager";
import { CompareBar } from "@/components/glimoka/CompareBar";
import { AbandonedCartReminder } from "@/components/glimoka/AbandonedCartReminder";
import { HomeView } from "@/components/glimoka/views/HomeView";
import { ProductsView } from "@/components/glimoka/views/ProductsView";
import { ProductDetailView } from "@/components/glimoka/views/ProductDetailView";
import { CartView } from "@/components/glimoka/views/CartView";
import { CheckoutView } from "@/components/glimoka/views/CheckoutView";
import { ThankYouView } from "@/components/glimoka/views/ThankYouView";
import { AccountView } from "@/components/glimoka/views/AccountView";
import { AdminView } from "@/components/glimoka/views/AdminView";
import { CompareView } from "@/components/glimoka/views/CompareView";
import { GiftCardsView } from "@/components/glimoka/views/GiftCardsView";
import {
  AboutView,
  ContactView,
  FaqView,
  TrackOrderView,
  ShippingPolicyView,
  ReturnPolicyView,
  SizeGuideView,
} from "@/components/glimoka/views/InfoViews";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Home() {
  const { view, setView } = useShopStore();

  // Update document title based on view
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "GLIMOKA | مجوهرات شخصية فاخرة — أساور وقلائد بأسماء",
      products: "المنتجات | GLIMOKA",
      product: "تفاصيل المنتج | GLIMOKA",
      cart: "سلة التسوق | GLIMOKA",
      checkout: "إتمام الطلب | GLIMOKA",
      thankyou: "تم الطلب | GLIMOKA",
      account: "حسابي | GLIMOKA",
      admin: "لوحة التحكم | GLIMOKA",
      about: "من نحن | GLIMOKA",
      contact: "اتصل بنا | GLIMOKA",
      faq: "الأسئلة الشائعة | GLIMOKA",
      "track-order": "تتبع الطلب | GLIMOKA",
      "shipping-policy": "سياسة الشحن | GLIMOKA",
      "return-policy": "سياسة الإرجاع | GLIMOKA",
      "size-guide": "دليل المقاسات | GLIMOKA",
      compare: "مقارنة المنتجات | GLIMOKA",
      "gift-cards": "بطاقات الهدايا | GLIMOKA",
    };
    document.title = titles[view] || "GLIMOKA";
  }, [view]);

  // Handle shared wishlist URL (?wishlist=id1,id2,...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wishlistParam = params.get("wishlist");
    if (wishlistParam) {
      const ids = wishlistParam.split(",").filter(Boolean);
      if (ids.length > 0) {
        setTimeout(() => {
          toast.success(`💎 شارك أحدهم مفضلته معك (${ids.length} منتج)`, {
            description: "تصفح المنتجات أدناه — مفضلة صديقك بانتظارك",
            duration: 5000,
          });
          setView("products");
          // clean the URL
          window.history.replaceState({}, "", window.location.pathname);
        }, 800);
      }
    }
  }, [setView]);

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "products":
        return <ProductsView />;
      case "product":
        return <ProductDetailView />;
      case "cart":
        return <CartView />;
      case "checkout":
        return <CheckoutView />;
      case "thankyou":
        return <ThankYouView />;
      case "account":
        return <AccountView />;
      case "admin":
        return <AdminView />;
      case "about":
        return <AboutView />;
      case "contact":
        return <ContactView />;
      case "faq":
        return <FaqView />;
      case "track-order":
        return <TrackOrderView />;
      case "shipping-policy":
        return <ShippingPolicyView />;
      case "return-policy":
        return <ReturnPolicyView />;
      case "size-guide":
        return <SizeGuideView />;
      case "compare":
        return <CompareView />;
      case "gift-cards":
        return <GiftCardsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {renderView()}
        </motion.div>
      </main>
      <Footer />
      <FloatingWidgets />
      <QuickViewManager />
      <CompareBar />
      <AbandonedCartReminder />
    </div>
  );
}

