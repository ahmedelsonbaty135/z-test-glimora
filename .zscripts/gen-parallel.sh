#!/bin/bash
# Parallel image generation with concurrency 2 + retry logic
PUB=/home/z/my-project/public
mkdir -p $PUB/products $PUB/categories $PUB/brand
LOG=/home/z/my-project/.zscripts/gen-parallel.log
> "$LOG"

declare -a JOBS=(
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
CONCURRENCY=2
running=0
total=${#JOBS[@]}
i=0

for job in "${JOBS[@]}"; do
  i=$((i+1))
  IFS='|' read -r size out prompt <<< "$job"
  if [ -f "$out" ] && [ $(stat -c%s "$out" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "[$i/$total] skip $(basename $out)" >> "$LOG"
    continue
  fi
  echo "[$i/$total] start $(basename $out)" >> "$LOG"
  (
    timeout 180 bun .zscripts/gen-one-retry.ts "$out" "$prompt" "$size" >> "$LOG" 2>&1
    echo "[$i/$total] done $(basename $out) rc=$?" >> "$LOG"
  ) &
  running=$((running+1))
  if [ $running -ge $CONCURRENCY ]; then
    wait -n
    running=$((running-1))
  fi
  sleep 2
done
wait
echo "🎉 ALL DONE - $(ls $PUB/products/*.jpg 2>/dev/null | wc -l) product images" >> "$LOG"
