"use client";

import { useState } from "react";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail, MapPin, Clock, Send, Package, Search, Truck, RotateCcw, Shield, CreditCard, ChevronLeft, Award, Heart, Sparkles, Gem } from "lucide-react";
import { formatEGP, ORDER_STATUS_META } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ===== About =====
export function AboutView() {
  const { setView } = useShopStore();
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">من نحن</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/15 text-burgundy text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4" /> قصة GLIMOKA
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-warm-black mb-4">
          مجوهرات تُحكي <span className="text-gradient-burgundy">قصتك</span>
        </h1>
        <p className="text-warm-gray text-lg leading-relaxed">
          بدأت GLIMOKA من حلم بسيط: أن يحمل كل شخص مجوهرة فريدة تحكي قصته. نختار خاماتنا بعناية،
          وننقش الأسماء بأيدي حرفيين مهرة، لنقدم لك قطعة تدوم معك سنوات وتُذكر بلحظاتك الجميلة.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-center mb-14">
        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury-lg">
          <img src="/brand/story.jpg" alt="حرفية GLIMOKA" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-warm-black">رسالتنا</h2>
          <p className="text-warm-gray leading-relaxed">
            نؤمن أن الفخامة الحقيقية في التفاصيل — في علبة الهدية، في بطاقة الإهداء، في رسالة الواتساب
            التي تؤكد طلبك. كل تفصيلة في GLIMOKA صُممت لتمنحك تجربة استثنائية تليق بلحظاتك الثمينة.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: Award, title: "جودة مضمونة", desc: "خامات أصلية مختبرة" },
              { icon: Heart, title: "صناعة بحب", desc: "كل قطعة تُصنع بإتقان" },
              { icon: Gem, title: "تصاميم فريدة", desc: "تخصيص كامل لكل عميل" },
              { icon: Shield, title: "ضمان مدى الحياة", desc: "على النقش والصناعة" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-rose-gold/20 p-4">
                <v.icon className="w-6 h-6 text-burgundy mb-2" />
                <p className="font-bold text-warm-black text-sm">{v.title}</p>
                <p className="text-xs text-warm-gray">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-burgundy-gradient rounded-3xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl font-black mb-3">قيمنا</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          {[
            { title: "الفخامة المعاصرة", desc: "نمزج بين الأصالة واللمسة العصرية في كل تصميم" },
            { title: "الدفء والقرب", desc: "لسنا برود الفخامة الكلاسيكية — نحن قريبون منك" },
            { title: "الجودة فوق كل شيء", desc: "لا نساوم على جودة الخامات أو دقة الصناعة" },
          ].map((v) => (
            <div key={v.title}>
              <h3 className="font-bold text-rose-gold-light mb-1">{v.title}</h3>
              <p className="text-sm text-white/70">{v.desc}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => setView("products")} className="mt-8 bg-rose-gold hover:bg-rose-gold-light text-warm-black">
          اكتشف تشكيلتنا
        </Button>
      </div>
    </div>
  );
}

// ===== Contact =====
export function ContactView() {
  const { setView } = useShopStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">اتصل بنا</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-warm-black mb-2">تواصل معنا</h1>
        <p className="text-warm-gray">فريقنا جاهز لمساعدتك في أي وقت</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {[
            { icon: Phone, title: "الهاتف", value: "+20 100 000 0000", href: "tel:+201000000000", dir: "ltr" },
            { icon: Mail, title: "البريد", value: "hello@glimoka.com", href: "mailto:hello@glimoka.com", dir: "ltr" },
            { icon: MapPin, title: "العنوان", value: "القاهرة، مصر" },
            { icon: Clock, title: "ساعات العمل", value: "السبت - الخميس، 10ص - 10م" },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-rose-gold/20 p-4 hover:shadow-luxury transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-burgundy-gradient flex items-center justify-center shrink-0">
                <c.icon className="w-6 h-6 text-rose-gold-light" />
              </div>
              <div>
                <p className="text-sm text-warm-gray">{c.title}</p>
                <p className="font-bold text-warm-black" dir={c.dir as any}>{c.value}</p>
              </div>
            </a>
          ))}
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-emerald-soft/10 rounded-2xl border border-emerald-soft/30 p-4 hover:bg-emerald-soft/15 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-soft flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
            </div>
            <div>
              <p className="text-sm text-warm-gray">واتساب</p>
              <p className="font-bold text-warm-black">دردش معنا الآن</p>
            </div>
          </a>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("تم إرسال رسالتك! سنرد قريبًا"); setForm({ name: "", email: "", phone: "", message: "" }); }}
          className="bg-white rounded-2xl border border-rose-gold/20 p-6 space-y-4"
        >
          <h2 className="font-black text-warm-black text-lg">أرسل لنا رسالة</h2>
          <div>
            <Label className="text-sm font-bold">الاسم</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold">البريد</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required dir="ltr" className="mt-1 text-right" />
            </div>
            <div>
              <Label className="text-sm font-bold">الهاتف</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" className="mt-1 text-right" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-bold">رسالتك</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="mt-1 min-h-[120px]" />
          </div>
          <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-deep h-11">
            <Send className="w-4 h-4 ml-1" />
            إرسال
          </Button>
        </form>
      </div>
    </div>
  );
}

// ===== FAQ =====
export function FaqView() {
  const { setView } = useShopStore();
  const faqs = [
    { q: "كيف أخصص المنتج باسمي؟", a: "افتح صفحة المنتج، أدخل الاسم الأول والثاني (اختياري)، اختر نوع الخط والمعدن والمقاس، وشاهد المعاينة الحية على الصورة قبل الإضافة للسلة." },
    { q: "ما هي طرق الدفع المتاحة؟", a: "حاليًا ندعم الدفع عند الاستلام (COD) لكل محافظات مصر. ادفع نقدًا لمندوب الشحن عند استلام طلبك." },
    { q: "كم تستغرق مدة التوصيل؟", a: "القاهرة الكبرى 2-3 أيام عمل، المدن الكبرى 3-4 أيام، باقي المحافظات 4-5 أيام. الطلبات المخصصة قد تستغرق يومًا إضافيًا للنقش." },
    { q: "هل الشحن مجاني؟", a: "نعم، الشحن مجاني لكل الطلبات فوق 1000 ج.م. يمكنك أيضًا استخدام كود FREESHIP لشحن مجاني على أي طلب." },
    { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، يمكنك الإرجاع خلال 14 يوم من الاستلام في حالته الأصلية. المنتجات المخصصة بالأسماء غير قابلة للإرجاع إلا في حال وجود عيب صناعة." },
    { q: "ما هي الخامات المستخدمة؟", a: "نستخدم فضة عيار 925، ذهب عيار 18، ذهب عيار 21، وروديوم. كل الخامات أصلية ومضمونة مع ضمان مدى الحياة على النقش." },
    { q: "كيف أتتبع طلبي؟", a: "استخدم صفحة تتبع الطلب وأدخل رقم طلبك (الذي يبدأ بـ GLM-) أو سجل الدخول لحسابك لرؤية كل طلباتك." },
    { q: "هل تتوفر علبة هدية؟", a: "نعم، يمكنك إضافة علبة هدية فاخرة (+50 ج.م) وبطاقة إهداء مخصصة (+20 ج.م) عند الطلب." },
    { q: "هل التصميم مناسب للرجال والنساء؟", a: "بالتأكيد! تصاميمنا محايدة وعصرية تناسب الجميع. اختر المعدن والخط الذي يعكس ذوقك." },
    { q: "كيف أتواصل لطلب مخصص؟", a: "راسلنا على واتساب من الزر العائم في أي صفحة، أو من صفحة اتصل بنا. فريقنا يسعد بمساعدتك." },
  ];
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">الأسئلة الشائعة</span>
      </nav>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-warm-black mb-2">الأسئلة الشائعة</h1>
        <p className="text-warm-gray">إجابات على أكثر الأسئلة شيوعًا</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl border border-rose-gold/20 px-4">
            <AccordionTrigger className="text-right font-bold text-warm-black hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-warm-gray leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="text-center mt-8 bg-cream-dark/50 rounded-2xl p-6">
        <p className="text-warm-black font-bold mb-2">لم تجد إجابتك؟</p>
        <p className="text-sm text-warm-gray mb-4">فريق خدمة العملاء جاهز لمساعدتك</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setView("contact")} variant="outline" className="border-burgundy text-burgundy">اتصل بنا</Button>
          <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer">
            <Button className="bg-emerald-soft hover:bg-emerald-soft/90">واتساب</Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// ===== Track Order =====
export function TrackOrderView() {
  const { setView, lastOrderNumber } = useShopStore();
  const [orderNum, setOrderNum] = useState(lastOrderNumber || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum) { toast.error("أدخل رقم الطلب"); return; }
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ order: orderNum });
      if (phone) params.set("phone", phone);
      const res = await fetch(`/api/orders/track?${params}`);
      const data = await res.json();
      if (res.ok) setOrder(data.order);
      else { setOrder(null); toast.error(data.error); }
    } finally {
      setLoading(false);
    }
  };

  const statusFlow = ["PENDING", "CONFIRMED", "CUSTOMIZING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

  return (
    <div className="container mx-auto px-4 py-10 lg:py-16 max-w-2xl">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">تتبع الطلب</span>
      </nav>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-burgundy-gradient mx-auto flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-rose-gold-light" />
        </div>
        <h1 className="text-3xl font-black text-warm-black mb-2">تتبع طلبك</h1>
        <p className="text-warm-gray">أدخل رقم الطلب لمعرفة حالته</p>
      </div>

      <form onSubmit={search} className="bg-white rounded-2xl border border-rose-gold/20 p-6 space-y-4 mb-6">
        <div>
          <Label className="text-sm font-bold">رقم الطلب <span className="text-danger-soft">*</span></Label>
          <Input value={orderNum} onChange={(e) => setOrderNum(e.target.value.toUpperCase())} placeholder="GLM-20260617-1234" dir="ltr" className="mt-1 text-right font-mono" />
        </div>
        <div>
          <Label className="text-sm font-bold">رقم الهاتف (للتحقق)</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01012345678" dir="ltr" className="mt-1 text-right" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-burgundy hover:bg-burgundy-deep h-11">
          <Search className="w-4 h-4 ml-1" />
          {loading ? "جارٍ البحث..." : "تتبع الطلب"}
        </Button>
      </form>

      {order && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-rose-gold/20 p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm text-warm-gray">رقم الطلب</p>
              <p className="font-mono font-bold text-warm-black" dir="ltr">{order.orderNumber}</p>
            </div>
            <span className="text-sm font-bold px-3 py-1.5 rounded-full" style={{ color: ORDER_STATUS_META[order.status]?.color, background: ORDER_STATUS_META[order.status]?.bg }}>
              {ORDER_STATUS_META[order.status]?.label}
            </span>
          </div>

          {/* Status timeline */}
          <div className="relative">
            <div className="absolute top-4 right-4 left-4 h-0.5 bg-cream-dark" />
            <div
              className="absolute top-4 right-4 h-0.5 bg-burgundy transition-all"
              style={{ width: `${(statusFlow.indexOf(order.status) / (statusFlow.length - 1)) * 100}%`, maxWidth: "calc(100% - 2rem)" }}
            />
            <div className="relative grid grid-cols-6 gap-1">
              {statusFlow.map((s, i) => {
                const idx = statusFlow.indexOf(order.status);
                const done = i <= idx;
                return (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-burgundy text-white" : "bg-cream-dark text-warm-gray"}`}>
                      {i + 1}
                    </div>
                    <span className={`text-[9px] text-center ${done ? "text-burgundy font-bold" : "text-warm-gray"}`}>
                      {ORDER_STATUS_META[s]?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-rose-gold/15 pt-4 space-y-2">
            <p className="font-bold text-warm-black text-sm">المنتجات:</p>
            {order.items.map((it: any) => (
              <div key={it.id} className="flex items-center gap-3 bg-cream-dark/40 rounded-lg p-2">
                <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-warm-black">{it.name}</p>
                  <p className="text-xs text-warm-gray">
                    {it.quantity}× {formatEGP(it.price)}
                    {it.name1 && ` • ${it.name1}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-rose-gold/15 pt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-warm-gray">{order.guestName}</p>
              <p className="text-xs text-warm-gray">{order.governorate} • {order.city}</p>
            </div>
            <p className="text-xl font-black text-burgundy">{formatEGP(order.total)}</p>
          </div>
        </motion.div>
      )}

      {searched && !order && !loading && (
        <div className="bg-white rounded-2xl border border-rose-gold/20 p-8 text-center">
          <Package className="w-12 h-12 text-rose-gold mx-auto mb-3" />
          <p className="font-bold text-warm-black mb-1">لم يتم العثور على الطلب</p>
          <p className="text-sm text-warm-gray">تأكد من رقم الطلب ورقم الهاتف</p>
        </div>
      )}
    </div>
  );
}

// ===== Shipping Policy =====
export function ShippingPolicyView() {
  const { setView } = useShopStore();
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">سياسة الشحن</span>
      </nav>
      <h1 className="text-3xl font-black text-warm-black mb-6 flex items-center gap-2">
        <Truck className="w-7 h-7 text-burgundy" /> سياسة الشحن
      </h1>
      <div className="prose prose-lg max-w-none space-y-6 text-warm-gray">
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-3">مناطق الشحن والتكاليف</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-gold/20">
                  <th className="text-right py-2 font-bold text-warm-black">المنطقة</th>
                  <th className="text-right py-2 font-bold text-warm-black">التكلفة</th>
                  <th className="text-right py-2 font-bold text-warm-black">مدة التوصيل</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: "القاهرة الكبرى (القاهرة، الجيزة، 6 أكتوبر، الشيخ زايد)", cost: "30 ج.م", time: "2-3 أيام" },
                  { area: "المدن الكبرى (الإسكندرية، المنصورة، طنطا، أسيوط)", cost: "40 ج.م", time: "3-4 أيام" },
                  { area: "باقي المحافظات", cost: "50 ج.م", time: "4-5 أيام" },
                ].map((r) => (
                  <tr key={r.area} className="border-b border-rose-gold/10">
                    <td className="py-2">{r.area}</td>
                    <td className="py-2 font-bold text-burgundy">{r.cost}</td>
                    <td className="py-2">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-3">الشحن المجاني</h2>
          <p>شحن مجاني لكل الطلبات فوق 1000 ج.م. يمكن أيضًا استخدام كود <code className="bg-cream-dark px-1 rounded">FREESHIP</code> للحصول على شحن مجاني على أي طلب.</p>
        </section>
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-3">معالجة الطلب</h2>
          <p>تُعالج الطلبات خلال 24 ساعة من تأكيدها. المنتجات المخصصة بالأسماء قد تستغرق يومًا إضافيًا للنقش. ستصلك رسالة واتساب لتأكيد الطلب وتفاصيل الشحن.</p>
        </section>
      </div>
    </div>
  );
}

// ===== Return Policy =====
export function ReturnPolicyView() {
  const { setView } = useShopStore();
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-sm text-warm-gray mb-5">
        <button onClick={() => setView("home")} className="hover:text-burgundy">الرئيسية</button>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-warm-black font-medium">سياسة الإرجاع</span>
      </nav>
      <h1 className="text-3xl font-black text-warm-black mb-6 flex items-center gap-2">
        <RotateCcw className="w-7 h-7 text-burgundy" /> سياسة الإرجاع والاستبدال
      </h1>
      <div className="space-y-4 text-warm-gray">
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-2">مدة الإرجاع</h2>
          <p>يمكنك إرجاع المنتج خلال <strong className="text-warm-black">14 يومًا</strong> من تاريخ الاستلام، بشرط أن يكون في حالته الأصلية مع كل ملحقاته (العلبة، البطاقة، إلخ).</p>
        </section>
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-2">المنتجات المخصصة</h2>
          <p>المنتجات المخصصة بالأسماء أو التواريخ <strong className="text-warm-black">غير قابلة للإرجاع أو الاستبدال</strong> إلا في حال وجود عيب صناعة. نحرص على إرسال معاينة دقيقة قبل التنفيذ.</p>
        </section>
        <section className="bg-white rounded-2xl border border-rose-gold/20 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-2">كيفية الإرجاع</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>تواصل معنا على واتساب خلال 14 يوم من الاستلام</li>
            <li>اذكر رقم الطلب وسبب الإرجاع</li>
            <li>سنرسل مندوبًا لاستلام المنتج</li>
            <li>بعد فحص المنتج، نرد المبلغ أو نرسل بديلًا خلال 5-7 أيام</li>
          </ol>
        </section>
        <section className="bg-rose-gold/10 rounded-2xl border border-rose-gold/30 p-6">
          <h2 className="font-bold text-warm-black text-lg mb-2">استرداد المبلغ</h2>
          <p>يتم استرداد المبلغ نقدًا أو عبر التحويل البنكي خلال 5-7 أيام عمل من استلام المنتج المُعاد. رسوم الشحن غير قابلة للاسترداد.</p>
        </section>
      </div>
    </div>
  );
}
