import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/settings — all settings (admin only)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const settings = await db.setting.findMany();
  const obj: Record<string, string> = {};
  settings.forEach((s: any) => {
    obj[s.key] = s.value;
  });
  return NextResponse.json({ settings: obj });
}

// PATCH /api/admin/settings — update settings (admin only)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json();
  const { settings } = body as { settings: Record<string, string> };

  if (!settings || typeof settings !== "object") {
    return NextResponse.json({ error: "الإعدادات مطلوبة" }, { status: 400 });
  }

  // Allowed keys (whitelist for security)
  const ALLOWED_KEYS = [
    "storeName",
    "whatsappNumber",
    "freeShippingThreshold",
    "codEnabled",
    "loyaltyRate",
    "instagramUrl",
    "facebookUrl",
    "tiktokUrl",
    "adminAccessCode",
  ];

  for (const [key, value] of Object.entries(settings)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    const cleanValue = String(value).slice(0, 1000);
    await db.setting.upsert({
      where: { key },
      create: { key, value: cleanValue },
      update: { value: cleanValue },
    });
  }

  return NextResponse.json({ success: true });
}
