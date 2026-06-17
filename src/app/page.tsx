"use client";

import { useShopStore } from "@/lib/store";
import { Header } from "@/components/glimoka/Header";
import { Footer } from "@/components/glimoka/Footer";
import { FloatingWidgets } from "@/components/glimoka/FloatingWidgets";
import { HomeView } from "@/components/glimoka/views/HomeView";
import { ProductsView } from "@/components/glimoka/views/ProductsView";
import { ProductDetailView } from "@/components/glimoka/views/ProductDetailView";
import { CartView } from "@/components/glimoka/views/CartView";
import { CheckoutView } from "@/components/glimoka/views/CheckoutView";
import { ThankYouView } from "@/components/glimoka/views/ThankYouView";
import { AccountView } from "@/components/glimoka/views/AccountView";
import { AdminView } from "@/components/glimoka/views/AdminView";
import {
  AboutView,
  ContactView,
  FaqView,
  TrackOrderView,
  ShippingPolicyView,
  ReturnPolicyView,
} from "@/components/glimoka/views/InfoViews";
import { useEffect } from "react";

export default function Home() {
  const { view } = useShopStore();

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
    };
    document.title = titles[view] || "GLIMOKA";
  }, [view]);

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
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
