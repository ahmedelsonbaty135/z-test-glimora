import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/search/semantic?q=هدية خطوبة
// Uses LLM to understand intent and match products, with keyword fallback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ products: [], slugs: [] });
  }

  // Fetch all products (small catalog)
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    },
    take: 100,
  });

  // First: keyword match (fast, reliable)
  const ql = q.toLowerCase();
  const keywordMatches = products.filter(
    (p) =>
      p.name.toLowerCase().includes(ql) ||
      p.shortDesc.includes(q) ||
      p.description.includes(q) ||
      p.category.name.includes(q) ||
      (p.material || "").toLowerCase().includes(ql) ||
      (p.color || "").includes(q)
  );

  // If we have good keyword matches, return them
  if (keywordMatches.length >= 3) {
    return NextResponse.json({
      products: keywordMatches,
      slugs: keywordMatches.map((p) => p.slug),
      method: "keyword",
    });
  }

  // Otherwise: use LLM semantic matching
  const catalog = products
    .map(
      (p) =>
        `- ${p.slug} | ${p.name} | ${p.category.name} | ${p.shortDesc} | ${p.material || ""} | ${p.color || ""}`
    )
    .join("\n");

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد بحث ذكي لمتجر مجوهرات. بناءً على استفسار العميل (قد يكون وصفيًا أو عاطفيًا مثل 'هدية خطوبة' أو 'شيء رومانسي')، اختر حتى 6 منتجات مناسبة من القائمة. أعد فقط الـ slugs مفصولة بفواصل، بدون أي نص إضافي. إذا لم تجد منتجات مناسبة، أعد كلمة NONE.",
        },
        {
          role: "user",
          content: `استفسار العميل: "${q}"\n\nقائمة المنتجات:\n${catalog}\n\nأعد الـ slugs فقط:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    const slugs = text
      .split(/[\n,،]/)
      .map((s) => s.trim().replace(/^[-*\d.\s]+/, ""))
      .filter((s) => s && s !== "NONE")
      .slice(0, 6);

    const semanticMatches = products.filter((p) => slugs.includes(p.slug));

    // Merge keyword + semantic, dedupe
    const merged = [...keywordMatches];
    for (const p of semanticMatches) {
      if (!merged.find((m) => m.id === p.id)) merged.push(p);
    }

    return NextResponse.json({
      products: merged.slice(0, 8),
      slugs: merged.map((p) => p.slug),
      method: "semantic",
    });
  } catch (e) {
    console.error("[semantic search error]", e instanceof Error ? e.message : e);
    return NextResponse.json({
      products: keywordMatches,
      slugs: keywordMatches.map((p) => p.slug),
      method: "keyword-fallback",
    });
  }
}
