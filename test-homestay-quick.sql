-- 🧪 Quick Database Test Queries for Homestay CRUD
-- Run these queries to verify data after testing

-- ============================================
-- 1. CHECK IF HOMESTAY WAS CREATED
-- ============================================
SELECT 
  id,
  title,
  slug,
  subtitle,
  status,
  "basePrice",
  city,
  country,
  "maxGuests",
  bedrooms,
  bathrooms,
  "isInstantBook",
  "isFeatured",
  "isVerified",
  "createdAt",
  "updatedAt"
FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';

-- Expected: 1 row with all fields populated


-- ============================================
-- 2. CHECK ALL FIELDS INCLUDING JSON
-- ============================================
SELECT 
  title,
  "galleryImageUrls",
  amenities,
  "houseRules",
  "seoKeywords"
FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';

-- Expected: 
-- galleryImageUrls: JSON array with 3-5 URLs
-- amenities: Array with 5+ items
-- houseRules: Array with 2-3 items
-- seoKeywords: Array with 3 items


-- ============================================
-- 3. CHECK ROOMS CREATED
-- ============================================
SELECT 
  id,
  name,
  slug,
  "maxGuests",
  "basePrice",
  status,
  "createdAt"
FROM "HomestayRoom" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
ORDER BY "createdAt";

-- Expected: 2-3 rows
-- Row 1: "Phòng VIP", maxGuests = 4, basePrice = 2000000 (or 2200000 after update)
-- Row 2: "Phòng Standard", maxGuests = 2, basePrice = 1200000
-- Row 3 (optional): "Phòng chính" (default room)


-- ============================================
-- 4. CHECK AVAILABILITY BLOCKS
-- ============================================
SELECT 
  date,
  status,
  source,
  "totalUnits",
  "reservedUnits",
  "createdAt"
FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND status = 'BLOCKED'
ORDER BY date;

-- Expected: 8 rows initially (5 for Nov + 3 for Dec)
-- After update: 11 rows (8 + 3 for Jan)
-- Nov 1-5: source = "Bảo trì hệ thống"
-- Dec 24-26: source = "Nghỉ lễ Giáng sinh"
-- Jan 1-3: source = "Nghỉ Tết" (after update)


-- ============================================
-- 5. COUNT BLOCKED DATES BY MONTH
-- ============================================
SELECT 
  TO_CHAR(date, 'YYYY-MM') as month,
  COUNT(*) as blocked_days,
  STRING_AGG(DISTINCT source, ', ') as reasons
FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND status = 'BLOCKED'
GROUP BY TO_CHAR(date, 'YYYY-MM')
ORDER BY month;

-- Expected:
-- 2025-11: 5 days, "Bảo trì hệ thống"
-- 2025-12: 3 days, "Nghỉ lễ Giáng sinh"
-- 2026-01: 3 days, "Nghỉ Tết" (after update)


-- ============================================
-- 6. VERIFY ROOM-AVAILABILITY RELATIONSHIP
-- ============================================
SELECT 
  ha.date,
  ha.status,
  ha.source,
  hr.name as room_name,
  hr."basePrice" as room_price
FROM "HomestayAvailability" ha
JOIN "HomestayRoom" hr ON ha."roomId" = hr.id
WHERE ha."homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND ha.status = 'BLOCKED'
ORDER BY ha.date
LIMIT 10;

-- Expected: All rows have valid room_name
-- No NULL values
-- No foreign key errors


-- ============================================
-- 7. SUMMARY REPORT
-- ============================================
SELECT 
  h.title,
  h.slug,
  h.status,
  h."basePrice",
  h.city,
  h."maxGuests",
  (SELECT COUNT(*) FROM "HomestayRoom" WHERE "homestayId" = h.id) as room_count,
  (SELECT COUNT(*) FROM "HomestayAvailability" WHERE "homestayId" = h.id AND status = 'BLOCKED') as blocked_days,
  ARRAY_LENGTH(h.amenities, 1) as amenity_count,
  ARRAY_LENGTH(h."houseRules", 1) as rule_count,
  h."createdAt",
  h."updatedAt"
FROM "Homestay" h
WHERE h.slug = 'test-homestay-con-phung';

-- Expected:
-- room_count: 2-3
-- blocked_days: 8 initially, 11 after update
-- amenity_count: 5+
-- rule_count: 2-3
-- updatedAt > createdAt (after update)


-- ============================================
-- 8. CHECK IF UPDATE WORKED
-- ============================================
SELECT 
  title,
  "basePrice",
  amenities,
  "updatedAt"
FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';

-- After update, verify:
-- title = "Updated Test Homestay"
-- basePrice = 1800000
-- amenities includes "Hồ bơi"
-- updatedAt is recent


-- ============================================
-- 9. CHECK SPECIFIC BLOCKED DATES
-- ============================================
-- November 2025
SELECT date, source 
FROM "HomestayAvailability" 
WHERE "homestayId" = (SELECT id FROM "Homestay" WHERE slug = 'test-homestay-con-phung')
AND date >= '2025-11-01' AND date <= '2025-11-05'
ORDER BY date;

-- December 2025
SELECT date, source 
FROM "HomestayAvailability" 
WHERE "homestayId" = (SELECT id FROM "Homestay" WHERE slug = 'test-homestay-con-phung')
AND date >= '2025-12-24' AND date <= '2025-12-26'
ORDER BY date;

-- January 2026 (after update)
SELECT date, source 
FROM "HomestayAvailability" 
WHERE "homestayId" = (SELECT id FROM "Homestay" WHERE slug = 'test-homestay-con-phung')
AND date >= '2026-01-01' AND date <= '2026-01-03'
ORDER BY date;


-- ============================================
-- 10. CLEANUP (Run after testing complete)
-- ============================================
-- CAUTION: This will delete all test data!
-- Uncomment to run:

/*
DELETE FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
);

DELETE FROM "HomestayRoom" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
);

DELETE FROM "HomestayMedia" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
);

DELETE FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';
*/


-- ============================================
-- 11. VERIFY CLEANUP
-- ============================================
-- Run after cleanup to confirm deletion
SELECT COUNT(*) as remaining_records
FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';

-- Expected: 0
