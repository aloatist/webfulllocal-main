#!/bin/bash

# 🧪 Quick Test Data Checker
# Run this after creating test homestay

echo "🔍 Checking Test Homestay Data..."
echo ""

cd /Users/congtrinh/webfulllocal-main/conphung

# Check if homestay exists
echo "1️⃣ Checking if homestay 'test-homestay' exists..."
npx prisma db execute --schema=./prisma/schema.prisma --stdin <<EOF
SELECT 
  id,
  title,
  slug,
  status,
  "basePrice",
  city
FROM "Homestay" 
WHERE slug = 'test-homestay';
EOF

echo ""
echo "2️⃣ Checking rooms..."
npx prisma db execute --schema=./prisma/schema.prisma --stdin <<EOF
SELECT 
  name,
  "maxGuests",
  "basePrice"
FROM "HomestayRoom" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" WHERE slug = 'test-homestay'
);
EOF

echo ""
echo "3️⃣ Checking availability blocks..."
npx prisma db execute --schema=./prisma/schema.prisma --stdin <<EOF
SELECT 
  date,
  status,
  source
FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" WHERE slug = 'test-homestay'
)
AND status = 'BLOCKED'
ORDER BY date;
EOF

echo ""
echo "4️⃣ Summary..."
npx prisma db execute --schema=./prisma/schema.prisma --stdin <<EOF
SELECT 
  h.title,
  h.slug,
  (SELECT COUNT(*) FROM "HomestayRoom" WHERE "homestayId" = h.id) as room_count,
  (SELECT COUNT(*) FROM "HomestayAvailability" WHERE "homestayId" = h.id AND status = 'BLOCKED') as blocked_days
FROM "Homestay" h
WHERE h.slug = 'test-homestay';
EOF

echo ""
echo "✅ Check complete!"
echo ""
echo "Expected results:"
echo "- Homestay: 1 row"
echo "- Rooms: 1-2 rows"
echo "- Blocked days: 5 rows (Nov 1-5)"
echo ""
echo "If you see the data above, the test PASSED! 🎉"
