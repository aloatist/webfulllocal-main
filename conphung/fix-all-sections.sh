#!/bin/bash

# Script to make all section data props optional

cd /Users/congtrinh/webfulllocal-main/conphung/components/home

for file in *-section.tsx; do
  if [ "$file" != "hero-section.tsx" ]; then
    echo "Fixing $file..."
    # Replace "data:" with "data?:" in interface definitions
    sed -i '' 's/\(interface.*Props.*\n.*\)data:/\1data?:/g' "$file" 2>/dev/null || true
    #Alternative: use perl for more reliable replacement
    perl -i -p0e 's/(interface\s+\w+Props\s*\{[^}]*\s+)data:/\1data?:/gs' "$file"
  fi
done

echo "✅ Done! All section components now have optional data props"
