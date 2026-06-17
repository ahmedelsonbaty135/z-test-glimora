import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/banners
export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ banners });
}

// POST /api/admin/banners — create banner (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { title, subtitle, image, ctaText, ctaLink, order, isActive } = body;

  if (!title) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }

  const banner = await db.banner.create({
    data: {
      title: String(title).slice(0, 200),
      subtitle: subtitle ? String(subtitle).slice(0, 500) : null,
      image: image ? String(image).slice(0, 500) : null,
      ctaText: ctaText ? String(ctaText).slice(0, 50) : null,
      ctaLink: ctaLink ? String(ctaLink).slice(0, 100) : null,
      order: Number(order) || 0,
      isActive: Boolean(isActive ?? true),
    },
  });
  return NextResponse.json({ success: true, banner });
}

// PATCH /api/admin/banners
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { id, ...patch } = body;

  if (!id) {
    return NextResponse.json({ error: "معرف البانر مطلوب" }, { status: 400 });
  }

  const cleanPatch: any = {};
  if (patch.title !== undefined) cleanPatch.title = String(patch.title).slice(0, 200);
  if (patch.subtitle !== undefined) cleanPatch.subtitle = patch.subtitle ? String(patch.subtitle).slice(0, 500) : null;
  if (patch.image !== undefined) cleanPatch.image = patch.image ? String(patch.image).slice(0, 500) : null;
  if (patch.ctaText !== undefined) cleanPatch.ctaText = patch.ctaText ? String(patch.ctaText).slice(0, 50) : null;
  if (patch.ctaLink !== undefined) cleanPatch.ctaLink = patch.ctaLink ? String(patch.ctaLink).slice(0, 100) : null;
  if (patch.order !== undefined) cleanPatch.order = Number(patch.order) || 0;
  if (patch.isActive !== undefined) cleanPatch.isActive = Boolean(patch.isActive);

  const banner = await db.banner.update({ where: { id }, data: cleanPatch });
  if (!banner) {
    return NextResponse.json({ error: "البانر غير موجود" }, { status: 404 });
  }
  return NextResponse.json({ success: true, banner });
}

// DELETE /api/admin/banners?id=xxx
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "معرف البانر مطلوب" }, { status: 400 });
  }

  const ok = await db.banner.delete({ where: { id } });
  if (!ok) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
