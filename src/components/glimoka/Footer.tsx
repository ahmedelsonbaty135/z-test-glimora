"use client";

import { Instagram, Facebook, Mail, Phone, MapPin, Send, Shield, Truck, RotateCcw, CreditCard } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { useTranslation } from "@/lib/useTranslation";
import { BrandLogo } from "./BrandLogo";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const { setView } = useShopStore();
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState("");

  const FOOTER_LINKS: { title: string; links: { label: string; view: any }[] }[] = [
    {
      title: lang === "ar" ? "تسوق" : "Shop",
      links: [
        { label: t("allProducts"), view: "products" },
        { label: t("bracelets"), view: "products" },
        { label: t("necklaces"), view: "products" },
        { label: t("rings"), view: "products" },
        { label: t("offers"), view: "products" },
        { label: t("giftCards"), view: "gift-cards" },
      ],
    },
    {
      title: lang === "ar" ? "خدمة العملاء" : "Customer Service",
      links: [
        { label: t("contactUs"), view: "contact" },
        { label: t("faq"), view: "faq" },
        { label: t("trackOrder"), view: "track-order" },
        { label: t("sizeGuide"), view: "size-guide" },
        { label: t("shippingPolicy"), view: "shipping-policy" },
        { label: t("returnPolicy"), view: "return-policy" },
      ],
    },
    {
      title: lang === "ar" ? "عن GLIMOKA" : "About GLIMOKA",
      links: [
        { label: t("aboutUs"), view: "about" },
        { label: t("home"), view: "home" },
      ],
    },
  ];

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("تم الاشتراك بنجاح! استخدم كود WELCOME10 لخصم 10%");
    setEmail("");
  };

  return (
    <footer className="mt-auto bg-burgundy-gradient text-white relative overflow-hidden">
      {/* Decorative ornament */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-gold to-transparent" />

      {/* Trust badges strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: lang === "ar" ? "ضمان الجودة" : "Quality Guarantee", desc: lang === "ar" ? "خامات أصلية مضمونة" : "Authentic materials" },
            { icon: Truck, title: lang === "ar" ? "شحن لكل مصر" : "Shipping to All Egypt", desc: lang === "ar" ? "2-5 أيام عمل" : "2-5 business days" },
            { icon: CreditCard, title: lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery", desc: lang === "ar" ? "ادفع وقت التوصيل" : "Pay on delivery" },
            { icon: RotateCcw, title: lang === "ar" ? "إرجاع خلال 14 يوم" : "14-Day Returns", desc: lang === "ar" ? "رضاك أولويتنا" : "Your satisfaction first" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-rose-gold-light" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold">{b.title}</p>
                <p className="text-xs text-white/60 truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              GLIMOKA — متجرك الأول للمجوهرات الشخصية الفاخرة في مصر. نصنع لك
              أساورًا وقلائد وخواتم بأسماء من تحب، بجودة استثنائية ولمسة دافئة.
            </p>

            <form onSubmit={subscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-rose-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-rose-gold hover:bg-rose-gold-light text-warm-black font-semibold text-sm transition-colors flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
                اشترك
              </button>
            </form>
            <p className="text-xs text-white/50">اشترك واحصل على خصم 10% على أول طلب</p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-rose-gold-light mb-4 text-sm tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setView(link.view)}
                      className="text-sm text-white/70 hover:text-rose-gold-light transition-colors text-right"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <a href="tel:+201000000000" className="flex items-center gap-2 text-white/70 hover:text-rose-gold-light transition-colors">
            <Phone className="w-4 h-4 text-rose-gold-light" />
            <span dir="ltr">+20 100 000 0000</span>
          </a>
          <a href="mailto:hello@glimoka.com" className="flex items-center gap-2 text-white/70 hover:text-rose-gold-light transition-colors">
            <Mail className="w-4 h-4 text-rose-gold-light" />
            hello@glimoka.com
          </a>
          <div className="flex items-center gap-2 text-white/70">
            <MapPin className="w-4 h-4 text-rose-gold-light" />
            القاهرة، مصر
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 text-center sm:text-right">
            © {new Date().getFullYear()} GLIMOKA. {lang === "ar" ? "جميع الحقوق محفوظة. صُنع بحب في مصر" : "All Rights Reserved. Made with love in Egypt"} 🇪🇬
          </p>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-gold hover:text-warm-black flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-gold hover:text-warm-black flex items-center justify-center transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
