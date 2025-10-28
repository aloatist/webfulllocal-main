#!/bin/bash

# Script to add 'export const dynamic = "force-dynamic"' to API routes
# that use searchParams

echo "🔧 Adding dynamic export to API routes..."

# List of files to fix
files=(
  "app/api/homestays/[homestayId]/rooms/route.ts"
  "app/api/homestays/route.ts"
  "app/api/media/route.ts"
  "app/api/posts/route.ts"
  "app/api/promotions/route.ts"
  "app/api/public/tours/route.ts"
  "app/api/categories/route.ts"
  "app/api/tags/route.ts"
  "app/api/tours/route.ts"
)

for file in "${files[@]}"; do
  filepath="/Users/congtrinh/webfulllocal-main/conphung/$file"
  
  if [ -f "$filepath" ]; then
    # Check if already has dynamic export
    if grep -q "export const dynamic" "$filepath"; then
      echo "✓ $file already has dynamic export"
    else
      # Find the line after imports (before first export function or const)
      # Add dynamic export after imports
      sed -i '' '/^import/! {/^$/! {/^export const dynamic/! {/^export async function/i\
export const dynamic = '\''force-dynamic'\'\';\
\

      }; }; }' "$filepath"
      
      echo "✅ Added dynamic export to $file"
    fi
  else
    echo "❌ File not found: $file"
  fi
done

echo ""
echo "🎉 Done! All API routes updated."
