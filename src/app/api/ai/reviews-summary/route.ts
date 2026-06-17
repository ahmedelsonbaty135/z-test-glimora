import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/ai/reviews-summary  { productId }
export async function POST(req: NextRequest) {
  const { productId } = (await req.json()) as { productId: string };

  if (!productId) {
    return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
  }

  // Fetch approved reviews
  const reviews = await db.review.findMany({
    where: { productId, isApproved: true },
    select: { rating: true, title: true, body: true, authorName: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  if (reviews.length === 0) {
    return NextResponse.json({
      summary: "لا توجد مراجعات بعد. كن أول من يشارك رأيه!",
      sentiment: "neutral",
      highlights: [],
      reviewCount: 0,
    });
  }

  const reviewText = reviews
    .map((r) => `(${r.rating}★) ${r.authorName}: ${r.title || ""} — ${r.body}`)
    .join("\n");

  const avgRating =
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  try {
    const zai = await ZAI.create();
    const prompt = `أنت محلل مراجعات لمتجر مجوهرات فاخر GLIMOKA. حلّل المراجعات التالية وقدم:
1. ملخص قصير (جملة واحدة) عن انطباع العملاء العام
2. التصنيف الوجداني: "إيجابي" أو "محايد" أو "سلبي"
3. 3 نقاط بارزة (إيجابية أو سلبية) يكررها العملاء

المراجعات (متوسط التقييم ${avgRating.toFixed(1)}/5):
${reviewText}

أجب بصيغة JSON فقط:
{"summary": "...", "sentiment": "إيجابي|محايد|سلبي", "highlights": ["...", "...", "..."]}`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكي يحلل مراجعات المنتجات. أجب دائمًا بصيغة JSON صحيحة فقط بدون نص إضافي.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = completion.choices?.[0]?.message?.content || "";
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          summary: parsed.summary || "مراجعات إيجابية عمومًا",
          sentiment: parsed.sentiment || "إيجابي",
          highlights: Array.isArray(parsed.highlights)
            ? parsed.highlights.slice(0, 3)
            : [],
          reviewCount: reviews.length,
          avgRating: avgRating.toFixed(1),
        });
      } catch {
        // JSON parse failed, return basic
      }
    }

    // Fallback
    return NextResponse.json({
      summary:
        avgRating >= 4.5
          ? "العملاء سعداء جدًا بهذا المنتج!"
          : avgRating >= 4
          ? "المنتج يحظى بتقييمات إيجابية بشكل عام"
          : "آراء العملاء متباينة",
      sentiment: avgRating >= 4 ? "إيجابي" : "محايد",
      highlights: [],
      reviewCount: reviews.length,
      avgRating: avgRating.toFixed(1),
    });
  } catch {
    return NextResponse.json({
      summary:
        avgRating >= 4.5
          ? "العملاء سعداء جدًا بهذا المنتج!"
          : avgRating >= 4
          ? "المنتج يحظى بتقييمات إيجابية بشكل عام"
          : "آراء العملاء متباينة",
      sentiment: avgRating >= 4 ? "إيجابي" : "محايد",
      highlights: [],
      reviewCount: reviews.length,
      avgRating: avgRating.toFixed(1),
    });
  }
}
