import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/categories — list all categories
export async function GET() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ categories });
}

// POST /api/admin/categories — create category (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, image, icon, order } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "الاسم والـ slug مطلوبان" }, { status: 400 });
  }

  // Sanitize inputs
  const cleanName = String(name).slice(0, 100);
  const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 100);

  try {
    const category = await db.category.create({
      data: {
        name: cleanName,
        slug: cleanSlug,
        description: description ? String(description).slice(0, 500) : null,
        image: image ? String(image).slice(0, 500) : null,
        icon: icon ? String(icon).slice(0, 50) : null,
        order: Number(order) || 0,
      },
    });
    return NextResponse.json({ success: true, category });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "فشل الإنشاء" }, { status: 500 });
  }
}

// PATCH /api/admin/categories — update category
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { id, ...patch } = body;

  if (!id) {
    return NextResponse.json({ error: "معرف الفئة مطلوب" }, { status: 400 });
  }

  // Sanitize
  const cleanPatch: any = {};
  if (patch.name !== undefined) cleanPatch.name = String(patch.name).slice(0, 100);
  if (patch.description !== undefined) cleanPatch.description = patch.description ? String(patch.description).slice(0, 500) : null;
  if (patch.image !== undefined) cleanPatch.image = patch.image ? String(patch.image).slice(0, 500) : null;
  if (patch.icon !== undefined) cleanPatch.icon = patch.icon ? String(patch.icon).slice(0, 50) : null;
  if (patch.order !== undefined) cleanPatch.order = Number(patch.order) || 0;

  const category = await db.category.update({ where: { id }, data: cleanPatch });
  if (!category) {
    return NextResponse.json({ error: "الفئة غير موجودة" }, { status: 404 });
  }
  return NextResponse.json({ success: true, category });
}

// DELETE /api/admin/categories
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "معرف الفئة مطلوب" }, { status: 400 });
  }

  const ok = await db.category.delete({ where: { id } });
  if (!ok) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
