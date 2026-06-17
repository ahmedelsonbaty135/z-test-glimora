import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/ai/recommend  { query, recentSlugs? }
// Returns up to 4 product slugs that best match the semantic query
export async function POST(req: NextRequest) {
  const { query, recentSlugs = [] } = (await req.json()) as {
    query: string;
    recentSlugs?: string[];
  };

  if (!query) {
    return NextResponse.json({ slugs: [] });
  }

  // Fetch all products (small catalog)
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      shortDesc: true,
      description: true,
      category: { select: { name: true } },
    },
  });

  if (products.length === 0) {
    return NextResponse.json({ slugs: [] });
  }

  const catalog = products
    .map(
      (p) =>
        `- ${p.slug} | ${p.name} | ${p.category.name} | ${p.shortDesc}`
    )
    .join("\n");

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد توصيات منتجات لمتجر مجوهرات. بناءً على استفسار العميل، اختر حتى 4 منتجات من القائمة. أعد فقط الـ slugs مفصولة بفواصل، بدون أي نص إضافي.",
        },
        {
          role: "user",
          content: `استفسار العميل: "${query}"\n\nقائمة المنتجات:\n${catalog}\n\nأعد الـ slugs فقط:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    const slugs = text
      .split(/[\n,،]/)
      .map((s) => s.trim().replace(/^[-*\d.\s]+/, ""))
      .filter(Boolean)
      .slice(0, 4);

    return NextResponse.json({ slugs });
  } catch (e) {
    console.error("[AI recommend error]", e instanceof Error ? e.message : e);
    // Fallback: simple keyword match
    const q = query.toLowerCase();
    const matched = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.includes(query) ||
          p.description.includes(query) ||
          p.category.name.includes(query)
      )
      .slice(0, 4)
      .map((p) => p.slug);
    return NextResponse.json({ slugs: matched });
  }
}
