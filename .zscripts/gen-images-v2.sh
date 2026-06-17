#!/bin/bash
PUB=/home/z/my-project/public
mkdir -p $PUB/products $PUB/categories $PUB/brand

gen() {
  local prompt="$1"; local out="$2"; local size="${3:-1024x1024}"
  if [ -f "$out" ] && [ -s "$out" ]; then echo "skip $out"; return; fi
  echo ">>> $out"
  timeout 150 z-ai image -p "$prompt" -o "$out" -s "$size" 2>&1 | tail -1
}

# Batch 1: hero + 2 categories
gen "Luxury jewelry editorial photo, elegant personalized name bracelets and necklaces displayed on cream silk with rose gold accents, burgundy velvet background, soft studio lighting, premium product photography, high-end fashion magazine style" "$PUB/brand/hero.jpg" 1440x720 &
gen "Elegant silver name bracelet on cream background, minimalist luxury product photography, soft shadow, professional studio lighting" "$PUB/categories/bracelets.jpg" &
gen "Delicate gold name necklace on cream silk background, luxury jewelry product photography, soft warm light, premium detail" "$PUB/categories/necklaces.jpg" &
wait

# Batch 2: 2 categories + story
gen "Beautiful personalized gold ring on cream background, luxury jewelry close-up, studio lighting, ultra detailed" "$PUB/categories/rings.jpg" &
gen "Collection of luxury jewelry pieces on burgundy silk, sale concept, rose gold and cream tones, premium product photography" "$PUB/categories/offers.jpg" &
gen "Artisan hands crafting personalized jewelry, engraving a name on a gold bracelet, warm workshop light, cream and burgundy tones, luxury craftsmanship, detailed close up" "$PUB/brand/story.jpg" 1344x768 &
wait

# Batch 3: personalization + 2 bracelets
gen "Personalized name necklace being customized, showing Arabic and English name engraving in progress, luxury jewelry workshop, cream and rose gold tones, premium detail" "$PUB/brand/personalization.jpg" 1344x768 &
gen "Elegant silver 925 name bracelet with engraved Arabic name, on cream background, luxury product photography, soft shadow, studio lighting, ultra detailed" "$PUB/products/bracelet-silver-1.jpg" &
gen "18k gold name bracelet with engraved English name, on cream background, luxury jewelry product photography, warm golden light, ultra detailed" "$PUB/products/bracelet-gold-1.jpg" &
wait

# Batch 4: bracelets
gen "Silver name bracelet close-up showing engraved name detail, on cream silk, luxury jewelry photography, warm light" "$PUB/products/bracelet-silver-2.jpg" &
gen "Silver personalized bracelet in luxury gift box, cream background, premium product photography" "$PUB/products/bracelet-silver-3.jpg" &
gen "Gold personalized bracelet close-up, name engraving detail, on cream silk, luxury product photography" "$PUB/products/bracelet-gold-2.jpg" &
wait

# Batch 5: bracelets
gen "Gold name bracelet in luxury gift box with rose ribbon, cream background, premium jewelry photography" "$PUB/products/bracelet-gold-3.jpg" &
gen "Rhodium shiny name bracelet with engraved name, on cream background, luxury jewelry photography, bright reflection, ultra detailed" "$PUB/products/bracelet-rhodium-1.jpg" &
gen "Rhodium personalized bracelet close-up on cream silk, luxury product photography, silver white tone" "$PUB/products/bracelet-rhodium-2.jpg" &
wait

# Batch 6: dual bracelet + 2 necklaces
gen "Rose gold dual name bracelet with two engraved names, romantic couple jewelry, on cream background, luxury product photography" "$PUB/products/bracelet-dual-1.jpg" &
gen "Two rose gold name bracelets paired together, couple concept, cream silk background, luxury jewelry photography, warm light" "$PUB/products/bracelet-dual-2.jpg" &
gen "21k gold name necklace with Arabic name pendant, on cream background, luxury jewelry product photography, warm golden glow, ultra detailed" "$PUB/products/necklace-gold-1.jpg" &
wait

# Batch 7: necklaces
gen "Gold personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography" "$PUB/products/necklace-gold-2.jpg" &
gen "Gold name necklace in luxury jewelry gift box, cream background, premium product photography, warm light" "$PUB/products/necklace-gold-3.jpg" &
gen "Silver 925 name necklace with English name pendant, on cream background, luxury jewelry photography, soft reflection, ultra detailed" "$PUB/products/necklace-silver-1.jpg" &
wait

# Batch 8: necklaces
gen "Silver personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography, cool light" "$PUB/products/necklace-silver-2.jpg" &
gen "Rose gold heart pendant necklace with engraved name, romantic jewelry, on cream background, luxury product photography, warm light" "$PUB/products/necklace-heart-1.jpg" &
gen "Heart pendant personalized necklace close-up with name engraving, cream silk, luxury jewelry photography, romantic mood" "$PUB/products/necklace-heart-2.jpg" &
wait

# Batch 9: date necklace + 2 rings
gen "Silver date pendant necklace with engraved special date, on cream background, luxury jewelry photography, minimalist elegant" "$PUB/products/necklace-date-1.jpg" &
gen "Personalized date necklace close-up, pendant with numbers, cream silk background, luxury product photography" "$PUB/products/necklace-date-2.jpg" &
gen "18k gold name ring with engraved name, on cream background, luxury jewelry close-up, warm golden light, ultra detailed" "$PUB/products/ring-gold-1.jpg" &
wait

# Batch 10: rings
gen "Gold personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, warm glow" "$PUB/products/ring-gold-2.jpg" &
gen "Silver 925 name ring with engraved name, on cream background, luxury jewelry close-up, soft reflection, ultra detailed" "$PUB/products/ring-silver-1.jpg" &
gen "Silver personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, cool light" "$PUB/products/ring-silver-2.jpg" &
wait

# Batch 11: rings
gen "Rose gold engagement ring with couple names engraved and zircon stone, romantic luxury jewelry, on cream background, ultra detailed" "$PUB/products/ring-engagement-1.jpg" &
gen "Engagement personalized ring close-up with names and date engraving, sparkling zircon, cream silk, luxury jewelry photography" "$PUB/products/ring-engagement-2.jpg" &
gen "Rhodium signature ring with engraved signature, on cream background, luxury jewelry close-up, bright reflection, ultra detailed" "$PUB/products/ring-rhodium-1.jpg" &
wait

# Batch 12: last ring
gen "Rhodium personalized ring close-up, signature engraving, cream silk background, luxury jewelry photography, silver white tone" "$PUB/products/ring-rhodium-2.jpg" &

wait
echo "🎉 ALL DONE"
ls -la $PUB/products/ | wc -l
ls -la $PUB/categories/
ls -la $PUB/brand/
