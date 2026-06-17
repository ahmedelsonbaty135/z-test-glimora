import { db } from "@/lib/db";

// GLIMOKA seed data
const categories = [
  {
    name: "أساور",
    slug: "bracelets",
    description: "أساور شخصية بأسماء مخصصة",
    icon: "Circle",
    order: 1,
  },
  {
    name: "قلائد",
    slug: "necklaces",
    description: "قلائد فاخرة بأسماء وتصاميم مخصصة",
    icon: "Heart",
    order: 2,
  },
  {
    name: "خواتم",
    slug: "rings",
    description: "خواتم شخصية بكل المقاسات",
    icon: "CircleDot",
    order: 3,
  },
  {
    name: "عروض",
    slug: "offers",
    description: "أقوى العروض الموسمية",
    icon: "Tag",
    order: 4,
  },
];

const products = [
  // Bracelets
  {
    name: "سوار الاسم الفضي",
    slug: "silver-name-bracelet",
    shortDesc: "سوار فضي 925 باسمك مخصص",
    description:
      "سوار فضي عيار 925 مُصنّع يدويًا باسمك المخصص. تصميم أنيق وخفيف يناسب الإطلالة اليومية والمناسبات الخاصة. الاسم يُنقش بخط عربي أو إنجليزي حسب رغبتك.",
    categorySlug: "bracelets",
    basePrice: 450,
    comparePrice: 670,
    material: "silver",
    color: "فضي",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 80,
    rating: 4.8,
    reviewCount: 124,
    soldCount: 312,
  },
  {
    name: "سوار الاسم الذهبي 18",
    slug: "gold-18k-name-bracelet",
    shortDesc: "سوار ذهبي 18 باسم مخصص",
    description:
      "سوار ذهبي عيار 18 فاخر باسمك المخصص. لمعان ذهبي دافئ يدوم طويلًا، يأتي في علبة هدية فاخرة. مثالي كهدايا للمناسبات والخطوبة والأعياد.",
    categorySlug: "bracelets",
    basePrice: 1850,
    comparePrice: 2400,
    material: "gold",
    color: "ذهبي",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isOnSale: true,
    stock: 35,
    rating: 4.9,
    reviewCount: 87,
    soldCount: 156,
  },
  {
    name: "سوار الاسم الروديوم",
    slug: "rhodium-name-bracelet",
    shortDesc: "سوار روديوم لامع باسمك",
    description:
      "سوار روديوم عالي اللمعان باسمك المخصص. مقاوم للخدش والبهتان، يحافظ على بريقه لسنوات. تصميم عصري يناسب الرجال والنساء.",
    categorySlug: "bracelets",
    basePrice: 620,
    comparePrice: 820,
    material: "rhodium",
    color: "أبيض",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 60,
    rating: 4.7,
    reviewCount: 64,
    soldCount: 142,
  },
  {
    name: "سوار مزدوج بالاسمين",
    slug: "dual-name-bracelet",
    shortDesc: "سوار باسمين — لك ولشريك حياتك",
    description:
      "سوار فاخر يحمل اسمين — اسمك واسم من تحب. تصميم رومانسي مثالي للخطوبة والذكرى السنوية. متوفر بثلاثة معادن: فضة، ذهب 18، روديوم.",
    categorySlug: "bracelets",
    basePrice: 980,
    comparePrice: 1300,
    material: "rose-gold",
    color: "ذهبي وردي",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 25,
    rating: 4.9,
    reviewCount: 41,
    soldCount: 67,
  },

  // Necklaces
  {
    name: "قلادة الاسم الذهبية",
    slug: "gold-name-necklace",
    shortDesc: "قلادة ذهبية باسم مخصص",
    description:
      "قلادة ذهبية فاخرة عيار 21 باسمك المخصص. سلسلة رفيعة أنيقة وتعليقة بالاسم بخط عربي تقليدي أو حديث. تأتي في علبة هدية فاخرة مع بطاقة إهداء.",
    categorySlug: "necklaces",
    basePrice: 2200,
    comparePrice: 2900,
    material: "gold",
    color: "ذهبي",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 20,
    rating: 5.0,
    reviewCount: 58,
    soldCount: 89,
  },
  {
    name: "قلادة الاسم الفضية",
    slug: "silver-name-necklace",
    shortDesc: "قلادة فضية أنيقة باسمك",
    description:
      "قلادة فضية عيار 925 باسمك المخصص. خفيفة ومريحة للارتداء اليومي. تأتي بثلاثة خطوط للاختيار من بينها.",
    categorySlug: "necklaces",
    basePrice: 520,
    comparePrice: 780,
    material: "silver",
    color: "فضي",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isOnSale: true,
    stock: 70,
    rating: 4.6,
    reviewCount: 92,
    soldCount: 178,
  },
  {
    name: "قلادة القلب بالاسم",
    slug: "heart-name-necklace",
    shortDesc: "قلادة قلب رومانسية بالاسم",
    description:
      "قلادة رومانسية بتعليقة على شكل قلب تحمل اسم من تحب. مثالية كهدية لعيد الحب أو الذكرى السنوية. متوفرة بذهب وردي وفضة وذهب 18.",
    categorySlug: "necklaces",
    basePrice: 760,
    comparePrice: 1100,
    material: "rose-gold",
    color: "ذهبي وردي",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 40,
    rating: 4.8,
    reviewCount: 35,
    soldCount: 52,
  },
  {
    name: "قلادة التاريخ المخصص",
    slug: "date-name-necklace",
    shortDesc: "قلادة تحمل تاريخًا مميزًا",
    description:
      "قلادة فريدة تحمل تاريخًا مميزًا — تاريخ ميلاد، ذكرى زواج، أو لحظة خاصة. تُنقش الأرقام بدقة عالية على المعدن الذي تختاره.",
    categorySlug: "necklaces",
    basePrice: 690,
    comparePrice: 920,
    material: "silver",
    color: "فضي",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: false,
    stock: 30,
    rating: 4.7,
    reviewCount: 28,
    soldCount: 44,
  },

  // Rings
  {
    name: "خاتم الاسم الذهبي",
    slug: "gold-name-ring",
    shortDesc: "خاتم ذهبي باسم مخصص",
    description:
      "خاتم ذهبي عيار 18 باسمك المخصص. تصميم كلاسيكي أنيق يناسب الإطلالة الرسمية واليومية. متوفر بكل المقاسات من 10 إلى 25.",
    categorySlug: "rings",
    basePrice: 1650,
    comparePrice: 2100,
    material: "gold",
    color: "ذهبي",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 45,
    rating: 4.9,
    reviewCount: 73,
    soldCount: 118,
  },
  {
    name: "خاتم الاسم الفضي",
    slug: "silver-name-ring",
    shortDesc: "خاتم فضي باسمك",
    description:
      "خاتم فضي عيار 925 باسمك المخصص. تصميم بسيط وعصري، مريح للارتداء اليومي. نقش دقيق بخطوط متعددة.",
    categorySlug: "rings",
    basePrice: 380,
    comparePrice: 540,
    material: "silver",
    color: "فضي",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    stock: 90,
    rating: 4.6,
    reviewCount: 110,
    soldCount: 234,
  },
  {
    name: "خاتم الخطوبة المخصص",
    slug: "engagement-custom-ring",
    shortDesc: "خاتم خطوبة بأسماء العروسين",
    description:
      "خاتم خطوبة فاخر يحمل اسمي العروسين وتاريخ الخطوبة. تصميم رومانسي بحجر زركون لامع. متوفر بذهب 18 وذهب وردي.",
    categorySlug: "rings",
    basePrice: 2400,
    comparePrice: 3200,
    material: "rose-gold",
    color: "ذهبي وردي",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 15,
    rating: 5.0,
    reviewCount: 22,
    soldCount: 31,
  },
  {
    name: "خاتم التوقيع الروديوم",
    slug: "rhodium-signature-ring",
    shortDesc: "خاتم روديوم بتوقيعك الخاص",
    description:
      "خاتم روديوم فريد بتوقيعك الخاص أو اسمك المخصص. مقاوم للخدش ولامع يدوم. تصميم عصري يناسب الرجال والنساء.",
    categorySlug: "rings",
    basePrice: 540,
    comparePrice: 720,
    material: "rhodium",
    color: "أبيض",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    stock: 50,
    rating: 4.7,
    reviewCount: 19,
    soldCount: 38,
  },
];

const metalOptionsMap: Record<string, string> = {
  silver: "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM",
  gold: "GOLD_18K,GOLD_21K,SILVER_925,RHODIUM",
  "rose-gold": "GOLD_18K,RHODIUM,SILVER_925",
  rhodium: "RHODIUM,SILVER_925,GOLD_18K",
};

const imageMap: Record<string, string[]> = {
  "silver-name-bracelet": [
    "/products/bracelet-silver-1.jpg",
    "/products/bracelet-silver-2.jpg",
    "/products/bracelet-silver-3.jpg",
  ],
  "gold-18k-name-bracelet": [
    "/products/bracelet-gold-1.jpg",
    "/products/bracelet-gold-2.jpg",
    "/products/bracelet-gold-3.jpg",
  ],
  "rhodium-name-bracelet": [
    "/products/bracelet-rhodium-1.jpg",
    "/products/bracelet-rhodium-2.jpg",
  ],
  "dual-name-bracelet": [
    "/products/bracelet-dual-1.jpg",
    "/products/bracelet-dual-2.jpg",
  ],
  "gold-name-necklace": [
    "/products/necklace-gold-1.jpg",
    "/products/necklace-gold-2.jpg",
    "/products/necklace-gold-3.jpg",
  ],
  "silver-name-necklace": [
    "/products/necklace-silver-1.jpg",
    "/products/necklace-silver-2.jpg",
  ],
  "heart-name-necklace": [
    "/products/necklace-heart-1.jpg",
    "/products/necklace-heart-2.jpg",
  ],
  "date-name-necklace": [
    "/products/necklace-date-1.jpg",
    "/products/necklace-date-2.jpg",
  ],
  "gold-name-ring": [
    "/products/ring-gold-1.jpg",
    "/products/ring-gold-2.jpg",
  ],
  "silver-name-ring": [
    "/products/ring-silver-1.jpg",
    "/products/ring-silver-2.jpg",
  ],
  "engagement-custom-ring": [
    "/products/ring-engagement-1.jpg",
    "/products/ring-engagement-2.jpg",
  ],
  "rhodium-signature-ring": [
    "/products/ring-rhodium-1.jpg",
    "/products/ring-rhodium-2.jpg",
  ],
};

const reviewsSeed = [
  { authorName: "نورهان أحمد", rating: 5, title: "تحفة فنية", body: "السوار فاق توقعاتي، التفاصيل دقيقة جدًا والاسم مكتوب بشكل جميل. وصل في علبة فخمة وكأنه هدية.", isApproved: true },
  { authorName: "محمد خالد", rating: 5, title: "هدية مثالية", body: "اشتريته هدية لزوجتي في عيد ميلادها وانبهرت به. الجودة ممتازة والشحن سريع.", isApproved: true },
  { authorName: "سارة محمود", rating: 4, title: "جميل جدًا", body: "القلادة رائعة ولكن تأخر الشحن يومين. غير كده كل حاجة تمام.", isApproved: true },
  { authorName: "أحمد فؤاد", rating: 5, title: "أفضل متجر مجوهرات", body: "تعاملت معاهم أكتر من مرة وكل مرة بيطلعوا فوق الممتاز. التخصيص دقيق والخدمة محترمة.", isApproved: true },
  { authorName: "مريم سعيد", rating: 5, title: "خاتم خطوبة خرافي", body: "الخاتم طلع أحلى من الصور. خطيبتي اتبهيرت بيه. شكرًا GLIMOKA.", isApproved: true },
  { authorName: "Yara M.", rating: 4, title: "Good quality", body: "The necklace is beautiful and the name engraving is precise. Took a bit long to arrive but worth it.", isApproved: true },
];

const couponsSeed = [
  {
    code: "WELCOME10",
    type: "PERCENTAGE",
    value: 10,
    minOrder: 0,
    usageLimit: 1000,
    startsAt: new Date("2026-01-01"),
    endsAt: new Date("2027-12-31"),
    isActive: true,
  },
  {
    code: "GLIMOKA50",
    type: "FIXED",
    value: 50,
    minOrder: 500,
    usageLimit: 500,
    startsAt: new Date("2026-01-01"),
    endsAt: new Date("2027-12-31"),
    isActive: true,
  },
  {
    code: "FREESHIP",
    type: "FREE_SHIPPING",
    value: 0,
    minOrder: 0,
    usageLimit: 2000,
    startsAt: new Date("2026-01-01"),
    endsAt: new Date("2027-12-31"),
    isActive: true,
  },
  {
    code: "VALENTINE15",
    type: "PERCENTAGE",
    value: 15,
    minOrder: 800,
    usageLimit: 300,
    startsAt: new Date("2026-01-01"),
    endsAt: new Date("2027-12-31"),
    isActive: true,
  },
];

const bannersSeed = [
  {
    title: "تشكيلة المجوهرات المخصصة",
    subtitle: "أساور وقلائد وخواتم بأسماء من تحب — صُنعت خصيصًا لك",
    ctaText: "تسوق الآن",
    ctaLink: "products",
    isActive: true,
    order: 1,
  },
  {
    title: "عرض الحب — خصم 15%",
    subtitle: "على كل القلائد والأساور المزدوجة لفترة محدودة",
    ctaText: "اكتشف العروض",
    ctaLink: "offers",
    isActive: true,
    order: 2,
  },
];

async function seed() {
  console.log("🌱 Seeding GLIMOKA database...");

  // Categories
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        image: `/categories/${cat.slug}.jpg`,
      },
    });
  }

  // Products
  for (const p of products) {
    const cat = await db.category.findUnique({ where: { slug: p.categorySlug } });
    if (!cat) continue;
    const images = imageMap[p.slug] || ["/products/placeholder.jpg"];
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        description: p.description,
        categoryId: cat.id,
        basePrice: p.basePrice,
        comparePrice: p.comparePrice,
        metalOptions: metalOptionsMap[p.material] || "SILVER_925,GOLD_18K,GOLD_21K,RHODIUM",
        sizeOptions: p.categorySlug === "rings" ? "10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25" : "16,17,18,19,20",
        fontOptions: "خط عربي تقليدي,خط عربي حديث,خط إنجليزي,خط رموز",
        isPersonalizable: true,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        isOnSale: p.isOnSale,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        soldCount: p.soldCount,
        material: p.material,
        color: p.color,
      },
    });
    const created = await db.product.findUnique({ where: { slug: p.slug } });
    if (created && images.length > 0) {
      // clear and recreate images
      await db.productImage.deleteMany({ where: { productId: created.id } });
      for (let i = 0; i < images.length; i++) {
        await db.productImage.create({
          data: {
            productId: created.id,
            url: images[i],
            alt: p.name,
            order: i,
          },
        });
      }
    }
  }

  // Reviews — attach to first few products
  const allProducts = await db.product.findMany();
  for (let i = 0; i < reviewsSeed.length; i++) {
    const r = reviewsSeed[i];
    const product = allProducts[i % allProducts.length];
    await db.review.create({
      data: {
        productId: product.id,
        authorName: r.authorName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isApproved: r.isApproved,
      },
    });
  }

  // Coupons
  for (const c of couponsSeed) {
    await db.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // Banners
  for (const b of bannersSeed) {
    await db.banner.create({ data: b });
  }

  // Admin user
  await db.user.upsert({
    where: { email: "admin@glimoka.com" },
    update: {},
    create: {
      email: "admin@glimoka.com",
      name: "GLIMOKA Admin",
      phone: "+201000000000",
      role: "ADMIN",
    },
  });

  // Settings
  const settings = [
    { key: "storeName", value: "GLIMOKA" },
    { key: "whatsappNumber", value: "201000000000" },
    { key: "freeShippingThreshold", value: "1000" },
    { key: "codEnabled", value: "true" },
    { key: "loyaltyRate", value: "10" }, // 1 point per 10 EGP
    { key: "instagramUrl", value: "https://instagram.com/glimoka" },
    { key: "facebookUrl", value: "https://facebook.com/glimoka" },
    { key: "tiktokUrl", value: "https://tiktok.com/@glimoka" },
  ];
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${reviewsSeed.length} reviews`);
  console.log(`   - ${couponsSeed.length} coupons`);
  console.log(`   - ${bannersSeed.length} banners`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
