import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const PUB = "/home/z/my-project/public";

// Prevent crashes from unhandled errors
process.on("uncaughtException", (e) => {
  console.error("[uncaught]", e?.message || e);
});
process.on("unhandledRejection", (e) => {
  console.error("[unhandled]", e instanceof Error ? e.message : e);
});

const jobs: { out: string; prompt: string; size?: string }[] = [
  { out: `${PUB}/brand/hero.jpg`, size: "1344x768", prompt: "Luxury jewelry editorial photo, elegant personalized name bracelets and necklaces displayed on cream silk with rose gold accents, burgundy velvet background, soft studio lighting, premium product photography, high-end fashion magazine style" },
  { out: `${PUB}/categories/bracelets.jpg`, prompt: "Elegant silver name bracelet on cream background, minimalist luxury product photography, soft shadow, professional studio lighting" },
  { out: `${PUB}/categories/necklaces.jpg`, prompt: "Delicate gold name necklace on cream silk background, luxury jewelry product photography, soft warm light, premium detail" },
  { out: `${PUB}/categories/rings.jpg`, prompt: "Beautiful personalized gold ring on cream background, luxury jewelry close-up, studio lighting, ultra detailed" },
  { out: `${PUB}/categories/offers.jpg`, prompt: "Collection of luxury jewelry pieces on burgundy silk, sale concept, rose gold and cream tones, premium product photography" },
  { out: `${PUB}/brand/story.jpg`, size: "1344x768", prompt: "Artisan hands crafting personalized jewelry, engraving a name on a gold bracelet, warm workshop light, cream and burgundy tones, luxury craftsmanship, detailed close up" },
  { out: `${PUB}/brand/personalization.jpg`, size: "1344x768", prompt: "Personalized name necklace being customized, showing Arabic and English name engraving in progress, luxury jewelry workshop, cream and rose gold tones, premium detail" },
  { out: `${PUB}/products/bracelet-silver-1.jpg`, prompt: "Elegant silver 925 name bracelet with engraved Arabic name, on cream background, luxury product photography, soft shadow, studio lighting, ultra detailed" },
  { out: `${PUB}/products/bracelet-silver-2.jpg`, prompt: "Silver name bracelet close-up showing engraved name detail, on cream silk, luxury jewelry photography, warm light" },
  { out: `${PUB}/products/bracelet-silver-3.jpg`, prompt: "Silver personalized bracelet in luxury gift box, cream background, premium product photography" },
  { out: `${PUB}/products/bracelet-gold-1.jpg`, prompt: "18k gold name bracelet with engraved English name, on cream background, luxury jewelry product photography, warm golden light, ultra detailed" },
  { out: `${PUB}/products/bracelet-gold-2.jpg`, prompt: "Gold personalized bracelet close-up, name engraving detail, on cream silk, luxury product photography" },
  { out: `${PUB}/products/bracelet-gold-3.jpg`, prompt: "Gold name bracelet in luxury gift box with rose ribbon, cream background, premium jewelry photography" },
  { out: `${PUB}/products/bracelet-rhodium-1.jpg`, prompt: "Rhodium shiny name bracelet with engraved name, on cream background, luxury jewelry photography, bright reflection, ultra detailed" },
  { out: `${PUB}/products/bracelet-rhodium-2.jpg`, prompt: "Rhodium personalized bracelet close-up on cream silk, luxury product photography, silver white tone" },
  { out: `${PUB}/products/bracelet-dual-1.jpg`, prompt: "Rose gold dual name bracelet with two engraved names, romantic couple jewelry, on cream background, luxury product photography" },
  { out: `${PUB}/products/bracelet-dual-2.jpg`, prompt: "Two rose gold name bracelets paired together, couple concept, cream silk background, luxury jewelry photography, warm light" },
  { out: `${PUB}/products/necklace-gold-1.jpg`, prompt: "21k gold name necklace with Arabic name pendant, on cream background, luxury jewelry product photography, warm golden glow, ultra detailed" },
  { out: `${PUB}/products/necklace-gold-2.jpg`, prompt: "Gold personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography" },
  { out: `${PUB}/products/necklace-gold-3.jpg`, prompt: "Gold name necklace in luxury jewelry gift box, cream background, premium product photography, warm light" },
  { out: `${PUB}/products/necklace-silver-1.jpg`, prompt: "Silver 925 name necklace with English name pendant, on cream background, luxury jewelry photography, soft reflection, ultra detailed" },
  { out: `${PUB}/products/necklace-silver-2.jpg`, prompt: "Silver personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography, cool light" },
  { out: `${PUB}/products/necklace-heart-1.jpg`, prompt: "Rose gold heart pendant necklace with engraved name, romantic jewelry, on cream background, luxury product photography, warm light" },
  { out: `${PUB}/products/necklace-heart-2.jpg`, prompt: "Heart pendant personalized necklace close-up with name engraving, cream silk, luxury jewelry photography, romantic mood" },
  { out: `${PUB}/products/necklace-date-1.jpg`, prompt: "Silver date pendant necklace with engraved special date, on cream background, luxury jewelry photography, minimalist elegant" },
  { out: `${PUB}/products/necklace-date-2.jpg`, prompt: "Personalized date necklace close-up, pendant with numbers, cream silk background, luxury product photography" },
  { out: `${PUB}/products/ring-gold-1.jpg`, prompt: "18k gold name ring with engraved name, on cream background, luxury jewelry close-up, warm golden light, ultra detailed" },
  { out: `${PUB}/products/ring-gold-2.jpg`, prompt: "Gold personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, warm glow" },
  { out: `${PUB}/products/ring-silver-1.jpg`, prompt: "Silver 925 name ring with engraved name, on cream background, luxury jewelry close-up, soft reflection, ultra detailed" },
  { out: `${PUB}/products/ring-silver-2.jpg`, prompt: "Silver personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, cool light" },
  { out: `${PUB}/products/ring-engagement-1.jpg`, prompt: "Rose gold engagement ring with couple names engraved and zircon stone, romantic luxury jewelry, on cream background, ultra detailed" },
  { out: `${PUB}/products/ring-engagement-2.jpg`, prompt: "Engagement personalized ring close-up with names and date engraving, sparkling zircon, cream silk, luxury jewelry photography" },
  { out: `${PUB}/products/ring-rhodium-1.jpg`, prompt: "Rhodium signature ring with engraved signature, on cream background, luxury jewelry close-up, bright reflection, ultra detailed" },
  { out: `${PUB}/products/ring-rhodium-2.jpg`, prompt: "Rhodium personalized ring close-up, signature engraving, cream silk background, luxury jewelry photography, silver white tone" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function genOne(zai: any, job: { out: string; prompt: string; size?: string }, idx: number, total: number) {
  if (fs.existsSync(job.out) && fs.statSync(job.out).size > 5000) {
    console.log(`[${idx}/${total}] skip ${path.basename(job.out)}`);
    return true;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[${idx}/${total}] ${path.basename(job.out)} (try ${attempt})...`);
      const res = await zai.images.generations.create({
        prompt: job.prompt,
        size: (job.size as any) || "1024x1024",
      });
      const b64 = res.data?.[0]?.base64;
      if (!b64) throw new Error("no base64 in response");
      fs.writeFileSync(job.out, Buffer.from(b64, "base64"));
      console.log(`   ✅ ${(fs.statSync(job.out).size / 1024).toFixed(0)}KB`);
      return true;
    } catch (e: any) {
      const msg = e?.message || String(e);
      console.error(`   ❌ try ${attempt}: ${msg.slice(0, 120)}`);
      if (attempt < 3) await sleep(3000 * attempt);
    }
  }
  return false;
}

async function main() {
  for (const d of ["brand", "categories", "products"]) {
    fs.mkdirSync(path.join(PUB, d), { recursive: true });
  }
  console.log(`🖼️  Generating ${jobs.length} images...`);
  const zai = await ZAI.create();
  let ok = 0, fail = 0;
  for (let i = 0; i < jobs.length; i++) {
    const success = await genOne(zai, jobs[i], i + 1, jobs.length);
    if (success) ok++; else fail++;
    await sleep(1000); // small delay to avoid rate limits
  }
  console.log(`\n🎉 Done: ${ok} ok, ${fail} failed`);
}

main().catch((e) => console.error("[fatal]", e));
