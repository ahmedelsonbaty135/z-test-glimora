import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { rateLimit, getClientIP } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت "جليمي" — مساعد الذكاء الاصطناعي لمتجر GLIMOKA للمجوهرات الشخصية الفاخرة في مصر.
المتجر يبيع أساور وقلائد وخواتم بأسماء مخصصة. العملة بالجنيه المصري (ج.م). الدفع عند الاستلام (COD).
الشحن: القاهرة/الجيزة 30 ج.م (2-3 أيام)، المدن الكبرى 40 ج.م (3-4 أيام)، باقي المحافظات 50 ج.م (4-5 أيام). شحن مجاني للطلبات فوق 1000 ج.م.
أكواد الخصم المتاحة: WELCOME10 (خصم 10%)، GLIMOKA50 (خصم 50 ج.م للطلبات فوق 500)، FREESHIP (شحن مجاني)، VALENTINE15 (خصم 15% فوق 800).
الخامات: فضة 925، ذهب عيار 18، ذهب عيار 21، روديوم. التخصيص يشمل الاسم الأول والثاني، نوع الخط، المعدن، الحجم، علبة هدية (+50 ج.م)، بطاقة إهداء (+20 ج.م).
أجب بإيجاز وودّ بالعربية الفصحى المبسطة أو العامية المصري حسب لغة العميل. كن مفيدًا واقترح منتجات عند الإمكان. إذا كان السؤال خارج نطاق المتجر، وجّه العميل بلطف لخدمة العملاء عبر واتساب.`;

// POST /api/ai/chat  { message, history? }
export async function POST(req: NextRequest) {
  // Rate limit: 20 messages per minute per IP
  const ip = getClientIP(req);
  if (!rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: "رسائل كثيرة جدًا، حاول لاحقًا" }, { status: 429 });
  }

  const { message, history = [] } = (await req.json()) as {
    message: string;
    history?: { role: "user" | "assistant"; content: string }[];
  };

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "رسالة فارغة" }, { status: 400 });
  }

  try {
    const zai = await ZAI.create();
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.6,
      max_tokens: 500,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "عذرًا، لم أتمكن من الرد الآن. هل يمكنك إعادة المحاولة؟";

    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI error";
    console.error("[AI chat error]", msg);
    // Fallback canned response
    return NextResponse.json({
      reply:
        "أهلًا بك في GLIMOKA! أنا هنا لمساعدتك في اختيار المجوهرة المثالية. يمكنك تصفح تشكيلتنا من الأساور والقلائد والخواتم المخصصة بأسمائك. للطلبات أو الاستفسارات الشخصية، تواصل معنا عبر واتساب. كيف أقدر أساعدك؟",
    });
  }
}
