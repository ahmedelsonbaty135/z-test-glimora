#!/bin/bash
# GLIMOKA jewelry image generation
# Generates hero, categories, brand, and product images via z-ai CLI

set -e

PUB=/home/z/my-project/public

echo "🖼️  Generating GLIMOKA images..."

# Hero — luxury jewelry on burgundy/cream
z-ai image -p "Luxury jewelry editorial photo, elegant personalized name bracelets and necklaces displayed on cream silk with rose gold accents, burgundy velvet background, soft studio lighting, premium product photography, ultra detailed, high-end fashion magazine style" -o "$PUB/brand/hero.jpg" -s 1440x720 &

# Categories
z-ai image -p "Elegant silver name bracelet on cream background, minimalist luxury product photography, soft shadow, professional studio lighting" -o "$PUB/categories/bracelets.jpg" -s 1024x1024 &
z-ai image -p "Delicate gold name necklace on cream silk background, luxury jewelry product photography, soft warm light, premium detail" -o "$PUB/categories/necklaces.jpg" -s 1024x1024 &
z-ai image -p "Beautiful personalized gold ring on cream background, luxury jewelry close-up, studio lighting, ultra detailed" -o "$PUB/categories/rings.jpg" -s 1024x1024 &
z-ai image -p "Collection of luxury jewelry pieces on burgundy silk, sale concept, rose gold and cream tones, premium product photography" -o "$PUB/categories/offers.jpg" -s 1024x1024 &

# Brand story
z-ai image -p "Artisan hands crafting personalized jewelry, engraving a name on a gold bracelet, warm workshop light, cream and burgundy tones, luxury craftsmanship, detailed close up" -o "$PUB/brand/story.jpg" -s 1344x768 &

# Personalization showcase
z-ai image -p "Personalized name necklace being customized, showing Arabic and English name engraving in progress, luxury jewelry workshop, cream and rose gold tones, premium detail" -o "$PUB/brand/personalization.jpg" -s 1344x768 &

wait
echo "✅ Hero + categories + brand done"

# Bracelets
z-ai image -p "Elegant silver 925 name bracelet with engraved Arabic name, on cream background, luxury product photography, soft shadow, studio lighting, ultra detailed" -o "$PUB/products/bracelet-silver-1.jpg" -s 1024x1024 &
z-ai image -p "Silver name bracelet close-up showing engraved name detail, on cream silk, luxury jewelry photography, warm light" -o "$PUB/products/bracelet-silver-2.jpg" -s 1024x1024 &
z-ai image -p "Silver personalized bracelet in luxury gift box, cream background, premium product photography" -o "$PUB/products/bracelet-silver-3.jpg" -s 1024x1024 &

z-ai image -p "18k gold name bracelet with engraved English name, on cream background, luxury jewelry product photography, warm golden light, ultra detailed" -o "$PUB/products/bracelet-gold-1.jpg" -s 1024x1024 &
z-ai image -p "Gold personalized bracelet close-up, name engraving detail, on cream silk, luxury product photography" -o "$PUB/products/bracelet-gold-2.jpg" -s 1024x1024 &
z-ai image -p "Gold name bracelet in luxury gift box with rose ribbon, cream background, premium jewelry photography" -o "$PUB/products/bracelet-gold-3.jpg" -s 1024x1024 &

z-ai image -p "Rhodium shiny name bracelet with engraved name, on cream background, luxury jewelry photography, bright reflection, ultra detailed" -o "$PUB/products/bracelet-rhodium-1.jpg" -s 1024x1024 &
z-ai image -p "Rhodium personalized bracelet close-up on cream silk, luxury product photography, silver white tone" -o "$PUB/products/bracelet-rhodium-2.jpg" -s 1024x1024 &

z-ai image -p "Rose gold dual name bracelet with two engraved names, romantic couple jewelry, on cream background, luxury product photography" -o "$PUB/products/bracelet-dual-1.jpg" -s 1024x1024 &
z-ai image -p "Two rose gold name bracelets paired together, couple concept, cream silk background, luxury jewelry photography, warm light" -o "$PUB/products/bracelet-dual-2.jpg" -s 1024x1024 &

wait
echo "✅ Bracelets done"

# Necklaces
z-ai image -p "21k gold name necklace with Arabic name pendant, on cream background, luxury jewelry product photography, warm golden glow, ultra detailed" -o "$PUB/products/necklace-gold-1.jpg" -s 1024x1024 &
z-ai image -p "Gold personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography" -o "$PUB/products/necklace-gold-2.jpg" -s 1024x1024 &
z-ai image -p "Gold name necklace in luxury jewelry gift box, cream background, premium product photography, warm light" -o "$PUB/products/necklace-gold-3.jpg" -s 1024x1024 &

z-ai image -p "Silver 925 name necklace with English name pendant, on cream background, luxury jewelry photography, soft reflection, ultra detailed" -o "$PUB/products/necklace-silver-1.jpg" -s 1024x1024 &
z-ai image -p "Silver personalized name necklace close-up, pendant detail, on cream silk, luxury jewelry photography, cool light" -o "$PUB/products/necklace-silver-2.jpg" -s 1024x1024 &

z-ai image -p "Rose gold heart pendant necklace with engraved name, romantic jewelry, on cream background, luxury product photography, warm light" -o "$PUB/products/necklace-heart-1.jpg" -s 1024x1024 &
z-ai image -p "Heart pendant personalized necklace close-up with name engraving, cream silk, luxury jewelry photography, romantic mood" -o "$PUB/products/necklace-heart-2.jpg" -s 1024x1024 &

z-ai image -p "Silver date pendant necklace with engraved special date, on cream background, luxury jewelry photography, minimalist elegant" -o "$PUB/products/necklace-date-1.jpg" -s 1024x1024 &
z-ai image -p "Personalized date necklace close-up, pendant with numbers, cream silk background, luxury product photography" -o "$PUB/products/necklace-date-2.jpg" -s 1024x1024 &

wait
echo "✅ Necklaces done"

# Rings
z-ai image -p "18k gold name ring with engraved name, on cream background, luxury jewelry close-up, warm golden light, ultra detailed" -o "$PUB/products/ring-gold-1.jpg" -s 1024x1024 &
z-ai image -p "Gold personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, warm glow" -o "$PUB/products/ring-gold-2.jpg" -s 1024x1024 &

z-ai image -p "Silver 925 name ring with engraved name, on cream background, luxury jewelry close-up, soft reflection, ultra detailed" -o "$PUB/products/ring-silver-1.jpg" -s 1024x1024 &
z-ai image -p "Silver personalized name ring close-up, engraving detail, on cream silk, luxury jewelry photography, cool light" -o "$PUB/products/ring-silver-2.jpg" -s 1024x1024 &

z-ai image -p "Rose gold engagement ring with couple names engraved and zircon stone, romantic luxury jewelry, on cream background, ultra detailed" -o "$PUB/products/ring-engagement-1.jpg" -s 1024x1024 &
z-ai image -p "Engagement personalized ring close-up with names and date engraving, sparkling zircon, cream silk, luxury jewelry photography" -o "$PUB/products/ring-engagement-2.jpg" -s 1024x1024 &

z-ai image -p "Rhodium signature ring with engraved signature, on cream background, luxury jewelry close-up, bright reflection, ultra detailed" -o "$PUB/products/ring-rhodium-1.jpg" -s 1024x1024 &
z-ai image -p "Rhodium personalized ring close-up, signature engraving, cream silk background, luxury jewelry photography, silver white tone" -o "$PUB/products/ring-rhodium-2.jpg" -s 1024x1024 &

wait
echo "✅ Rings done"
echo "🎉 All GLIMOKA images generated!"
ls -la $PUB/products/ $PUB/categories/ $PUB/brand/
