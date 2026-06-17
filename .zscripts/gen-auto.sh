#!/bin/bash
# Auto-restart wrapper for image generation
cd /home/z/my-project
for round in 1 2 3 4 5 6 7 8 9 10; do
  echo "=== Round $round ==="
  bash .zscripts/gen-loop.sh
  REMAINING=$(grep -c "^\[" .zscripts/gen-loop-auto.log 2>/dev/null || echo 0)
  COUNT=$(ls public/products/ public/categories/ public/brand/ 2>/dev/null | wc -l)
  echo "Total images so far: $COUNT/34"
  if [ "$COUNT" -ge 34 ]; then
    echo "ALL DONE"
    break
  fi
  sleep 2
done
