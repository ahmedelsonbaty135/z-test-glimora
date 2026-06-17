/**
 * GLIMOKA — Supabase Seed Script
 * Run with: bun run supabase/seed.ts
 *
 * This inserts all products, images, and reviews into Supabase.
 * Make sure you've run schema.sql first in the Supabase SQL editor.
 */
import { supabaseAdmin, toSnakeCase } from "../src/lib/supabase/admin";

const categories = [
  { id: "cat_bracelets", name: "أساور", slug: "bracelets", description: "أساور شخصية بأسماء مخصصة", icon: "Circle", order: 1, image: "/categories/bracelets.jpg" },
  { id: "cat_necklaces", name: "قلائد", slug: "necklaces", description: "قلائد فاخرة بأسماء وتصاميم مخصصة", icon: "Heart", order: 2, image: "/categories/necklaces.jpg" },
  { id: "cat_rings", name: "خواتم", slug: "rings", description: "خواتم شخصية بكل المقاسات", icon: "CircleDot", order: 3, image: "/categories/rings.jpg" },
  { id: "cat_offers", name: "عروض", slug: "offers", description: "أقوى العروض الموسمية", icon: "Tag", order: 4, image: "/categories/offers.jpg" },
];

const metalOptionsMap: Record<string, string> = {
  silver: "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM",
  gold: "GOLD_18K,GOLD_21K,SILVER_925,RHODIUM",
  "rose-gold": "GOLD_18K,RHODIUM,SILVER_925",
  rhodium: "RHODIUM,SILVER_925,GOLD_18K",
};

const products = [
  {
    id: "prod_silver_bracelet",
    name: "سوار الاسم الفضي",
    slug: "silver-name-bracelet",
    shortDesc: "سوار فضي 925 باسمك مخصص",
    description: "سوار فضي عيار 925 مُصنّع يدويًا باسمك المخصص. تصميم أنيق وخفيف يناسب الإطلالة اليومية والمناسبات الخاصة. الاسم يُنقش بخط عربي أو إنجليزي حسب رغبتك.",
    categoryId: "cat_bracelets",
    basePrice: 450,
    comparePrice: 670,
    metalOptions: "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 80,
    rating: 4.8,
    reviewCount: 124,
    soldCount: 312,
    material: "silver",
    color: "فضي",
  },
  {
    id: "prod_gold_bracelet",
    name: "سوار الاسم الذهبي 18",
    slug: "gold-18k-name-bracelet",
    shortDesc: "سوار ذهبي 18 باسم مخصص",
    description: "سوار ذهبي عيار 18 فاخر باسمك المخصص. لمعان ذهبي دافئ يدوم طويلًا، يأتي في علبة هدية فاخرة. مثالي كهدايا للمناسبات والخطوبة والأعياد.",
    categoryId: "cat_bracelets",
    basePrice: 1850,
    comparePrice: 2400,
    metalOptions: "GOLD_18K,GOLD_21K,SILVER_925,RHODIUM",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isOnSale: true,
    stock: 35,
    rating: 4.9,
    reviewCount: 87,
    soldCount: 156,
    material: "gold",
    color: "ذهبي",
  },
  {
    id: "prod_rhodium_bracelet",
    name: "سوار الاسم الروديوم",
    slug: "rhodium-name-bracelet",
    shortDesc: "سوار روديوم لامع باسمك",
    description: "سوار روديوم عالي اللمعان باسمك المخصص. مقاوم للخدش والبهتان، يحافظ على بريقه لسنوات. تصميم عصري يناسب الرجال والنساء.",
    categoryId: "cat_bracelets",
    basePrice: 620,
    comparePrice: 820,
    metalOptions: "RHODIUM,SILVER_925,GOLD_18K",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 60,
    rating: 4.7,
    reviewCount: 64,
    soldCount: 142,
    material: "rhodium",
    color: "أبيض",
  },
  {
    id: "prod_dual_bracelet",
    name: "سوار مزدوج بالاسمين",
    slug: "dual-name-bracelet",
    shortDesc: "سوار باسمين — لك ولشريك حياتك",
    description: "سوار فاخر يحمل اسمين — اسمك واسم من تحب. تصميم رومانسي مثالي للخطوبة والذكرى السنوية. متوفر بثلاثة معادن: فضة، ذهب 18، روديوم.",
    categoryId: "cat_bracelets",
    basePrice: 980,
    comparePrice: 1300,
    metalOptions: "GOLD_18K,RHODIUM,SILVER_925",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 25,
    rating: 4.9,
    reviewCount: 41,
    soldCount: 67,
    material: "rose-gold",
    color: "ذهبي وردي",
  },
  // Necklaces
  {
    id: "prod_gold_necklace",
    name: "قلادة الاسم الذهبية",
    slug: "gold-name-necklace",
    shortDesc: "قلادة ذهبية باسم مخصص",
    description: "قلادة ذهبية فاخرة عيار 21 باسمك المخصص. سلسلة رفيعة أنيقة وتعليقة بالاسم بخط عربي تقليدي أو حديث. تأتي في علبة هدية فاخرة مع بطاقة إهداء.",
    categoryId: "cat_necklaces",
    basePrice: 2200,
    comparePrice: 2900,
    metalOptions: "GOLD_18K,GOLD_21K,SILVER_925,RHODIUM",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 20,
    rating: 5.0,
    reviewCount: 58,
    soldCount: 89,
    material: "gold",
    color: "ذهبي",
  },
  {
    id: "prod_silver_necklace",
    name: "قلادة الاسم الفضية",
    slug: "silver-name-necklace",
    shortDesc: "قلادة فضية أنيقة باسمك",
    description: "قلادة فضية عيار 925 باسمك المخصص. خفيفة ومريحة للارتداء اليومي. تأتي بثلاثة خطوط للاختيار من بينها.",
    categoryId: "cat_necklaces",
    basePrice: 520,
    comparePrice: 780,
    metalOptions: "SILVER_925,GOLD_18K,RHODIUM",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isOnSale: true,
    stock: 70,
    rating: 4.6,
    reviewCount: 92,
    soldCount: 178,
    material: "silver",
    color: "فضي",
  },
  {
    id: "prod_heart_necklace",
    name: "قلادة القلب بالاسم",
    slug: "heart-name-necklace",
    shortDesc: "قلادة قلب رومانسية بالاسم",
    description: "قلادة رومانسية بتعليقة على شكل قلب تحمل اسم من تحب. مثالية كهدية لعيد الحب أو الذكرى السنوية. متوفرة بذهب وردي وفضة وذهب 18.",
    categoryId: "cat_necklaces",
    basePrice: 760,
    comparePrice: 1100,
    metalOptions: "GOLD_18K,RHODIUM,SILVER_925",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 40,
    rating: 4.8,
    reviewCount: 35,
    soldCount: 52,
    material: "rose-gold",
    color: "ذهبي وردي",
  },
  {
    id: "prod_date_necklace",
    name: "قلادة التاريخ المخصص",
    slug: "date-name-necklace",
    shortDesc: "قلادة تحمل تاريخًا مميزًا",
    description: "قلادة فريدة تحمل تاريخًا مميزًا — تاريخ ميلاد، ذكرى زواج، أو لحظة خاصة. تُنقش الأرقام بدقة عالية على المعدن الذي تختاره.",
    categoryId: "cat_necklaces",
    basePrice: 690,
    comparePrice: 920,
    metalOptions: "SILVER_925,GOLD_18K,RHODIUM",
    sizeOptions: "16,17,18,19,20",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: false,
    stock: 30,
    rating: 4.7,
    reviewCount: 28,
    soldCount: 44,
    material: "silver",
    color: "فضي",
  },
  // Rings
  {
    id: "prod_gold_ring",
    name: "خاتم الاسم الذهبي",
    slug: "gold-name-ring",
    shortDesc: "خاتم ذهبي باسم مخصص",
    description: "خاتم ذهبي عيار 18 باسمك المخصص. تصميم كلاسيكي أنيق يناسب الإطلالة الرسمية واليومية. متوفر بكل المقاسات من 10 إلى 25.",
    categoryId: "cat_rings",
    basePrice: 1650,
    comparePrice: 2100,
    metalOptions: "GOLD_18K,GOLD_21K,SILVER_925,RHODIUM",
    sizeOptions: "10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 45,
    rating: 4.9,
    reviewCount: 73,
    soldCount: 118,
    material: "gold",
    color: "ذهبي",
  },
  {
    id: "prod_silver_ring",
    name: "خاتم الاسم الفضي",
    slug: "silver-name-ring",
    shortDesc: "خاتم فضي باسمك",
    description: "خاتم فضي عيار 925 باسمك المخصص. تصميم بسيط وعصري، مريح للارتداء اليومي. نقش دقيق بخطوط متعددة.",
    categoryId: "cat_rings",
    basePrice: 380,
    comparePrice: 540,
    metalOptions: "SILVER_925,GOLD_18K,RHODIUM",
    sizeOptions: "10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 90,
    rating: 4.6,
    reviewCount: 110,
    soldCount: 234,
    material: "silver",
    color: "فضي",
  },
  {
    id: "prod_engagement_ring",
    name: "خاتم الخطوبة المخصص",
    slug: "engagement-custom-ring",
    shortDesc: "خاتم خطوبة بأسماء العروسين",
    description: "خاتم خطوبة فاخر يحمل اسمي العروسين وتاريخ الخطوبة. تصميم رومانسي بحجر زركون لامع. متوفر بذهب 18 وذهب وردي.",
    categoryId: "cat_rings",
    basePrice: 2400,
    comparePrice: 3200,
    metalOptions: "GOLD_18K,RHODIUM,SILVER_925",
    sizeOptions: "10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 15,
    rating: 5.0,
    reviewCount: 22,
    soldCount: 31,
    material: "rose-gold",
    color: "ذهبي وردي",
  },
  {
    id: "prod_rhodium_ring",
    name: "خاتم التوقيع الروديوم",
    slug: "rhodium-signature-ring",
    shortDesc: "خاتم روديوم بتوقيعك الخاص",
    description: "خاتم روديوم فريد بتوقيعك الخاص أو اسمك المخصص. مقاوم للخدش ولامع يدوم. تصميم عصري يناسب الرجال والنساء.",
    categoryId: "cat_rings",
    basePrice: 540,
    comparePrice: 720,
    metalOptions: "RHODIUM,SILVER_925,GOLD_18K",
    sizeOptions: "10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
    fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 50,
    rating: 4.7,
    reviewCount: 19,
    soldCount: 38,
    material: "rhodium",
    color: "أبيض",
  },
];

const imageMap: Record<string, string[]> = {
  "silver-name-bracelet": ["/products/bracelet-silver-1.jpg", "/products/bracelet-silver-2.jpg", "/products/bracelet-silver-3.jpg"],
  "gold-18k-name-bracelet": ["/products/bracelet-gold-1.jpg", "/products/bracelet-gold-2.jpg", "/products/bracelet-gold-3.jpg"],
  "rhodium-name-bracelet": ["/products/bracelet-rhodium-1.jpg", "/products/bracelet-rhodium-2.jpg"],
  "dual-name-bracelet": ["/products/bracelet-dual-1.jpg", "/products/bracelet-dual-2.jpg"],
  "gold-name-necklace": ["/products/necklace-gold-1.jpg", "/products/necklace-gold-2.jpg", "/products/necklace-gold-3.jpg"],
  "silver-name-necklace": ["/products/necklace-silver-1.jpg", "/products/necklace-silver-2.jpg"],
  "heart-name-necklace": ["/products/necklace-heart-1.jpg", "/products/necklace-heart-2.jpg"],
  "date-name-necklace": ["/products/necklace-date-1.jpg", "/products/necklace-date-2.jpg"],
  "gold-name-ring": ["/products/ring-gold-1.jpg", "/products/ring-gold-2.jpg"],
  "silver-name-ring": ["/products/ring-silver-1.jpg", "/products/ring-silver-2.jpg"],
  "engagement-custom-ring": ["/products/ring-engagement-1.jpg", "/products/ring-engagement-2.jpg"],
  "rhodium-signature-ring": ["/products/ring-rhodium-1.jpg", "/products/ring-rhodium-2.jpg"],
};

const reviewsSeed = [
  { authorName: "نورهان أحمد", rating: 5, title: "تحفة فنية", body: "السوار فاق توقعاتي، التفاصيل دقيقة جدًا والاسم مكتوب بشكل جميل. وصل في علبة فخمة وكأنه هدية.", isApproved: true },
  { authorName: "محمد خالد", rating: 5, title: "هدية مثالية", body: "اشتريته هدية لزوجتي في عيد ميلادها وانبهرت به. الجودة ممتازة والشحن سريع.", isApproved: true },
  { authorName: "سارة محمود", rating: 4, title: "جميل جدًا", body: "القلادة رائعة ولكن تأخر الشحن يومين. غير كده كل حاجة تمام.", isApproved: true },
  { authorName: "أحمد فؤاد", rating: 5, title: "أفضل متجر مجوهرات", body: "تعاملت معاهم أكتر من مرة وكل مرة بيطلعوا فوق الممتاز. التخصيص دقيق والخدمة محترمة.", isApproved: true },
  { authorName: "مريم سعيد", rating: 5, title: "خاتم خطوبة خرافي", body: "الخاتم طلع أحلى من الصور. خطيبتي اتبهيرت بيه. شكرًا GLIMOKA.", isApproved: true },
  { authorName: "Yara M.", rating: 4, title: "Good quality", body: "The necklace is beautiful and the name engraving is precise. Took a bit long to arrive but worth it.", isApproved: true },
];

async function seed() {
  console.log("🌱 Seeding GLIMOKA Supabase database...");

  // 1. Categories
  console.log("  → Categories...");
  const { error: catError } = await supabaseAdmin
    .from("categories")
    .upsert(categories.map(toSnakeCase), { onConflict: "slug" });
  if (catError) console.error("  ✗ Categories:", catError.message);
  else console.log("  ✓ Categories done");

  // 2. Products
  console.log("  → Products...");
  for (const p of products) {
    const row = toSnakeCase(p);
    const { error } = await supabaseAdmin.from("products").upsert(row, { onConflict: "slug" });
    if (error) console.error(`  ✗ Product ${p.slug}:`, error.message);
  }
  console.log("  ✓ Products done");

  // 3. Product Images
  console.log("  → Product Images...");
  // Clear existing images first
  await supabaseAdmin.from("product_images").delete().neq("id", "0");
  for (const p of products) {
    const images = imageMap[p.slug] || ["/products/placeholder.jpg"];
    for (let i = 0; i < images.length; i++) {
      const { error } = await supabaseAdmin.from("product_images").insert({
        product_id: p.id,
        url: images[i],
        alt: p.name,
        order: i,
      });
      if (error) console.error(`  ✗ Image ${images[i]}:`, error.message);
    }
  }
  console.log("  ✓ Product Images done");

  // 4. Reviews
  console.log("  → Reviews...");
  // Clear existing reviews first
  await supabaseAdmin.from("reviews").delete().neq("id", "0");
  for (let i = 0; i < reviewsSeed.length; i++) {
    const r = reviewsSeed[i];
    const product = products[i % products.length];
    const { error } = await supabaseAdmin.from("reviews").insert({
      product_id: product.id,
      author_name: r.authorName,
      rating: r.rating,
      title: r.title,
      body: r.body,
      is_approved: r.isApproved,
    });
    if (error) console.error(`  ✗ Review ${i}:`, error.message);
  }
  console.log("  ✓ Reviews done");

  console.log("✅ Seed complete!");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${reviewsSeed.length} reviews`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
