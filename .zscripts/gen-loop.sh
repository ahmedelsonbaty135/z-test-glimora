#!/bin/bash
# Generates each image in its own bun process for robustness
PUB=/home/z/my-project/public
mkdir -p $PUB/products $PUB/categories $PUB/brand

declare -a JOBS=(
"1344x768|$PUB/brand/hero.jpg|Luxury jewelry editorial photo, elegant personalized name bracelets and necklaces displayed on cream silk with rose gold accents, burgundy velvet background, soft studio lighting, premium product photography"
"1024x1024|$PUB/categories/bracelets.jpg|Elegant silver name bracelet on cream background, minimalist luxury product photography, soft shadow, professional studio lighting"
"1024x1024|$PUB/categories/necklaces.jpg|Delicate gold name necklace on cream silk background, luxury jewelry product photography, soft warm light, premium detail"
"1024x1024|$PUB/categories/rings.jpg|Beautiful personalized gold ring on cream background, luxury jewelry close-up, studio lighting, ultra detailed"
"1024x1024|$PUB/categories/offers.jpg|Collection of luxury jewelry pieces on burgundy silk, sale concept, rose gold and cream tones, premium product photography"
"1344x768|$PUB/brand/story.jpg|Artisan hands crafting personalized jewelry, engraving a name on a gold bracelet, warm workshop light, cream and burgundy tones, luxury craftsmanship"
"1344x768|$PUB/brand/personalization.jpg|Personalized name necklace being customized, showing Arabic and English name engraving in progress, luxury jewelry workshop, cream and rose gold tones"
"1024x1024|$PUB/products/bracelet-silver-1.jpg|Elegant silver 925 name bracelet with engraved Arabic name, on cream background, luxury product photography, soft shadow, studio lighting"
"1024x1024|$PUB/products/bracelet-silver-2.jpg|Silver name bracelet close-up showing engraved name detail, on cream silk, luxury jewelry photography, warm light"
"1024x1024|$PUB/products/bracelet-silver-3.jpg|Silver personalized bracelet in luxury gift box, cream background, premium product photography"
"1024x1024|$PUB/products/bracelet-gold-1.jpg|18k gold name bracelet with engraved English name, on cream background, luxury jewelry product photography, warm golden light"
"1024x1024|$PUB/products/bracelet-gold-2.jpg|Gold personalized bracelet close-up, name engraving detail, on cream silk, luxury product photography"
"1024x1024|$PUB/products/bracelet-gold-3.jpg|Gold name bracelet in luxury gift box with rose ribbon, cream background, premium jewelry photography"
"1024x1024|$PUB/products/bracelet-rhodium-1.jpg|Rhodium shiny name bracelet with engraved name, on cream background, luxury jewelry photography, bright reflection"
"1024x1024|$PUB/products/bracelet-rhodium-2.jpg|Rhodium personalized bracelet close-up on cream silk, luxury product photography, silver white tone"
"1024x1024|$PUB/products/bracelet-dual-1.jpg|Rose gold dual name bracelet with two engraved names, romantic couple jewelry, on cream background, luxury product photography"
"1024x1024|$PUB/products/bracelet-dual-2.jpg|Two rose gold name bracelets paired together, couple concept, cream silk background, luxury jewelry photography"
"1024x1024|$PUB/products/necklace-gold-1.jpg|21k gold name necklace with Arabic name pendant, on cream background, luxury jewelry product photography, warm golden glow"
"1024x1024|$PUB/products/necklace-gold-2.jpg|Gold personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography"
"1024x1024|$PUB/products/necklace-gold-3.jpg|Gold name necklace in luxury jewelry gift box, cream background, premium product photography, warm light"
"1024x1024|$PUB/products/necklace-silver-1.jpg|Silver 925 name necklace with English name pendant, on cream background, luxury jewelry photography, soft reflection"
"1024x1024|$PUB/products/necklace-silver-2.jpg|Silver personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography, cool light"
"1024x1024|$PUB/products/necklace-heart-1.jpg|Rose gold heart pendant necklace with engraved name, romantic jewelry, on cream background, luxury product photography, warm light"
"1024x1024|$PUB/products/necklace-heart-2.jpg|Heart pendant personalized necklace close-up with name engraving, cream silk, luxury jewelry photography, romantic mood"
"1024x1024|$PUB/products/necklace-date-1.jpg|Silver date pendant necklace with engraved special date, on cream background, luxury jewelry photography, minimalist elegant"
"1024x1024|$PUB/products/necklace-date-2.jpg|Personalized date necklace close-up, pendant with numbers, cream silk background, luxury product photography"
"1024x1024|$PUB/products/ring-gold-1.jpg|18k gold name ring with engraved name, on cream background, luxury jewelry close-up, warm golden light, ultra detailed"
"1024x1024|$PUB/products/ring-gold-2.jpg|Gold personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, warm glow"
"1024x1024|$PUB/products/ring-silver-1.jpg|Silver 925 name ring with engraved name, on cream background, luxury jewelry close-up, soft reflection"
"1024x1024|$PUB/products/ring-silver-2.jpg|Silver personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, cool light"
"1024x1024|$PUB/products/ring-engagement-1.jpg|Rose gold engagement ring with couple names engraved and zircon stone, romantic luxury jewelry, on cream background"
"1024x1024|$PUB/products/ring-engagement-2.jpg|Engagement personalized ring close-up with names and date engraving, sparkling zircon, cream silk, luxury jewelry photography"
"1024x1024|$PUB/products/ring-rhodium-1.jpg|Rhodium signature ring with engraved signature, on cream background, luxury jewelry close-up, bright reflection"
"1024x1024|$PUB/products/ring-rhodium-2.jpg|Rhodium personalized ring close-up, signature engraving, cream silk background, luxury jewelry photography"
)

cd /home/z/my-project
i=0
total=${#JOBS[@]}
for job in "${JOBS[@]}"; do
  i=$((i+1))
  IFS='|' read -r size out prompt <<< "$job"
  if [ -f "$out" ] && [ $(stat -c%s "$out" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "[$i/$total] skip $(basename $out)"
    continue
  fi
  echo "[$i/$total] $(basename $out) ..."
  timeout 120 bun .zscripts/gen-one.ts "$out" "$prompt" "$size" 2>&1 | tail -1
  sleep 1
done
echo "🎉 ALL DONE"
