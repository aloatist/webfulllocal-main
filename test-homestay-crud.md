# 🧪 Homestay CRUD & Availability Test Checklist

## ✅ Phase 1: Create New Homestay

### 1.1 Navigate to Create Page
```
URL: http://localhost:3000/admin/homestays/new
```

### 1.2 Fill All Fields

#### Basic Info
- [ ] **Title**: "Test Homestay Cồn Phụng"
- [ ] **Slug**: "test-homestay-con-phung" (auto-generated)
- [ ] **Subtitle**: "Homestay sinh thái view sông"
- [ ] **Summary**: "Homestay đẹp giữa thiên nhiên"
- [ ] **Description**: "Mô tả chi tiết về homestay với nhiều tiện nghi hiện đại"
- [ ] **Status**: PUBLISHED
- [ ] **Type**: ENTIRE_PLACE
- [ ] **Category**: VILLA

#### Address
- [ ] **Address Line 1**: "123 Đường Cồn Phụng"
- [ ] **Address Line 2**: "Khu phố 2"
- [ ] **City**: "Bến Tre"
- [ ] **State**: "Bến Tre"
- [ ] **Country**: "Việt Nam"
- [ ] **Postal Code**: "86000"

#### Capacity & Pricing
- [ ] **Max Guests**: 6
- [ ] **Bedrooms**: 3
- [ ] **Bathrooms**: 2
- [ ] **Base Price**: 1500000
- [ ] **Weekend Price**: 2000000
- [ ] **Currency**: VND

#### Policies
- [ ] **Min Nights**: 1
- [ ] **Max Nights**: 30
- [ ] **Check-in Time**: "14:00"
- [ ] **Check-out Time**: "12:00"
- [ ] **Cleaning Fee**: 100000
- [ ] **Security Deposit**: 500000
- [ ] **Cancellation Policy**: FLEXIBLE

#### Features
- [ ] **Instant Book**: ✓
- [ ] **Featured**: ✓
- [ ] **Verified**: ✓
- [ ] **Superhost**: ✗

#### Media
- [ ] **Hero Image**: Select 1 image from media library
- [ ] **Gallery Images**: Select 3-5 images from media library

#### Amenities (Add these)
- [ ] "WiFi miễn phí"
- [ ] "Điều hòa"
- [ ] "Bếp"
- [ ] "Máy giặt"
- [ ] "Tivi"

#### House Rules (Add these)
- [ ] "Không hút thuốc trong nhà"
- [ ] "Không nuôi thú cưng"
- [ ] "Giữ gìn vệ sinh chung"

#### SEO
- [ ] **SEO Title**: "Test Homestay Cồn Phụng - Homestay Sinh Thái"
- [ ] **SEO Description**: "Homestay đẹp view sông tại Cồn Phụng, Bến Tre"
- [ ] **SEO Keywords**: Add "homestay", "ben tre", "con phung"

#### Rooms (Add 2 rooms)
**Room 1:**
- [ ] Name: "Phòng VIP"
- [ ] Max Guests: 4
- [ ] Base Price: 2000000
- [ ] Status: ACTIVE

**Room 2:**
- [ ] Name: "Phòng Standard"
- [ ] Max Guests: 2
- [ ] Base Price: 1200000
- [ ] Status: ACTIVE

#### Availability Blocks (Add 2 blocks)
**Block 1:**
- [ ] Start Date: 2025-11-01
- [ ] End Date: 2025-11-05
- [ ] Notes: "Bảo trì hệ thống"

**Block 2:**
- [ ] Start Date: 2025-12-24
- [ ] End Date: 2025-12-26
- [ ] Notes: "Nghỉ lễ Giáng sinh"

### 1.3 Save
- [ ] Click "Xuất bản" button
- [ ] Wait for success message
- [ ] Should redirect to list page

---

## ✅ Phase 2: Verify in Database

### 2.1 Open Database Tool (Prisma Studio or pgAdmin)
```bash
cd /Users/congtrinh/webfulllocal-main/conphung
npx prisma studio
```

### 2.2 Check Homestay Table
```sql
SELECT * FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';
```

**Verify these fields are NOT NULL:**
- [ ] id
- [ ] title = "Test Homestay Cồn Phụng"
- [ ] slug = "test-homestay-con-phung"
- [ ] subtitle = "Homestay sinh thái view sông"
- [ ] summary
- [ ] description
- [ ] status = "PUBLISHED"
- [ ] type = "ENTIRE_PLACE"
- [ ] category = "VILLA"
- [ ] addressLine1 = "123 Đường Cồn Phụng"
- [ ] addressLine2 = "Khu phố 2"
- [ ] city = "Bến Tre"
- [ ] state = "Bến Tre"
- [ ] country = "Việt Nam"
- [ ] postalCode = "86000"
- [ ] maxGuests = 6
- [ ] bedrooms = 3
- [ ] bathrooms = 2
- [ ] basePrice = 1500000
- [ ] currency = "VND"
- [ ] minNights = 1
- [ ] maxNights = 30
- [ ] checkInTime = "14:00"
- [ ] checkOutTime = "12:00"
- [ ] cleaningFee = 100000
- [ ] securityDeposit = 500000
- [ ] isInstantBook = true
- [ ] isFeatured = true
- [ ] isVerified = true
- [ ] heroImageUrl (has value)
- [ ] galleryImageUrls (JSON array with 3-5 URLs)
- [ ] amenities (array with 5 items)
- [ ] houseRules (array with 3 items)
- [ ] seoTitle
- [ ] seoDescription
- [ ] seoKeywords (array with 3 items)

### 2.3 Check HomestayRoom Table
```sql
SELECT * FROM "HomestayRoom" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
);
```

**Expected: 2-3 rows**
- [ ] Row 1: name = "Phòng VIP", maxGuests = 4, basePrice = 2000000
- [ ] Row 2: name = "Phòng Standard", maxGuests = 2, basePrice = 1200000
- [ ] Row 3 (optional): name = "Phòng chính" (default room if created)

### 2.4 Check HomestayAvailability Table
```sql
SELECT * FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND status = 'BLOCKED'
ORDER BY date;
```

**Expected: 8 rows**
- [ ] 2025-11-01, status = BLOCKED, source = "Bảo trì hệ thống"
- [ ] 2025-11-02, status = BLOCKED, source = "Bảo trì hệ thống"
- [ ] 2025-11-03, status = BLOCKED, source = "Bảo trì hệ thống"
- [ ] 2025-11-04, status = BLOCKED, source = "Bảo trì hệ thống"
- [ ] 2025-11-05, status = BLOCKED, source = "Bảo trì hệ thống"
- [ ] 2025-12-24, status = BLOCKED, source = "Nghỉ lễ Giáng sinh"
- [ ] 2025-12-25, status = BLOCKED, source = "Nghỉ lễ Giáng sinh"
- [ ] 2025-12-26, status = BLOCKED, source = "Nghỉ lễ Giáng sinh"

### 2.5 Verify Room IDs Match
```sql
SELECT 
  ha.date,
  ha.status,
  ha.source,
  hr.name as room_name
FROM "HomestayAvailability" ha
JOIN "HomestayRoom" hr ON ha."roomId" = hr.id
WHERE ha."homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
ORDER BY ha.date;
```

**Verify:**
- [ ] All availability records have valid roomId
- [ ] No foreign key errors

---

## ✅ Phase 3: Load & Edit

### 3.1 Navigate to Edit Page
```
Get homestay ID from database, then:
URL: http://localhost:3000/admin/homestays/[ID]
```

### 3.2 Verify All Fields Load Correctly

#### Check Form Fields
- [ ] Title shows: "Test Homestay Cồn Phụng"
- [ ] Slug shows: "test-homestay-con-phung"
- [ ] Subtitle shows: "Homestay sinh thái view sông"
- [ ] Summary shows correctly
- [ ] Description shows correctly
- [ ] Status = PUBLISHED
- [ ] Type = ENTIRE_PLACE
- [ ] Category = VILLA
- [ ] Address Line 1 shows
- [ ] Address Line 2 shows
- [ ] City shows
- [ ] State shows
- [ ] Country shows
- [ ] Postal Code shows
- [ ] Max Guests = 6
- [ ] Bedrooms = 3
- [ ] Bathrooms = 2
- [ ] Base Price = 1500000
- [ ] Weekend Price = 2000000
- [ ] Currency = VND
- [ ] Min Nights = 1
- [ ] Max Nights = 30
- [ ] Check-in Time = "14:00"
- [ ] Check-out Time = "12:00"
- [ ] Cleaning Fee = 100000
- [ ] Security Deposit = 500000
- [ ] Instant Book checkbox is checked
- [ ] Featured checkbox is checked
- [ ] Verified checkbox is checked

#### Check Media
- [ ] Hero image displays
- [ ] Gallery shows 3-5 images

#### Check Lists
- [ ] Amenities list shows 5 items
- [ ] House Rules list shows 3 items
- [ ] SEO Keywords list shows 3 items

#### Check Rooms Section
- [ ] Shows 2-3 rooms in list
- [ ] Room 1: "Phòng VIP" visible
- [ ] Room 2: "Phòng Standard" visible

#### Check Availability Section
- [ ] Shows 2 availability blocks
- [ ] Block 1: Nov 1-5, 2025, "Bảo trì hệ thống"
- [ ] Block 2: Dec 24-26, 2025, "Nghỉ lễ Giáng sinh"

### 3.3 Make Changes

#### Edit Basic Info
- [ ] Change title to: "Updated Test Homestay"
- [ ] Change basePrice to: 1800000

#### Edit Amenities
- [ ] Add new amenity: "Hồ bơi"
- [ ] Remove one existing amenity

#### Edit House Rules
- [ ] Remove one rule

#### Add New Availability Block
- [ ] Click "Thêm khoảng thời gian"
- [ ] Start Date: 2026-01-01
- [ ] End Date: 2026-01-03
- [ ] Notes: "Nghỉ Tết"
- [ ] Click "Thêm"

#### Edit Room
- [ ] Change "Phòng VIP" price to: 2200000

### 3.4 Save Changes
- [ ] Click "Cập nhật" button
- [ ] Wait for success message
- [ ] Page should reload or redirect

---

## ✅ Phase 4: Verify Update in Database

### 4.1 Check Updated Fields
```sql
SELECT 
  title, 
  "basePrice", 
  amenities, 
  "houseRules",
  "updatedAt"
FROM "Homestay" 
WHERE slug = 'test-homestay-con-phung';
```

**Verify:**
- [ ] title = "Updated Test Homestay"
- [ ] basePrice = 1800000
- [ ] amenities includes "Hồ bơi"
- [ ] amenities count = 5 (4 old + 1 new - 1 removed)
- [ ] houseRules count = 2 (3 - 1)
- [ ] updatedAt is recent (within last minute)

### 4.2 Check New Availability Records
```sql
SELECT COUNT(*) as total_blocked
FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND status = 'BLOCKED';
```

**Expected: 11 rows** (8 old + 3 new)

### 4.3 Check Specific New Dates
```sql
SELECT date, source
FROM "HomestayAvailability" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND date >= '2026-01-01'
AND date <= '2026-01-03'
ORDER BY date;
```

**Expected: 3 rows**
- [ ] 2026-01-01, source = "Nghỉ Tết"
- [ ] 2026-01-02, source = "Nghỉ Tết"
- [ ] 2026-01-03, source = "Nghỉ Tết"

### 4.4 Check Updated Room Price
```sql
SELECT name, "basePrice"
FROM "HomestayRoom" 
WHERE "homestayId" = (
  SELECT id FROM "Homestay" 
  WHERE slug = 'test-homestay-con-phung'
)
AND name = 'Phòng VIP';
```

**Verify:**
- [ ] basePrice = 2200000

---

## ✅ Phase 5: Detail Page Display

### 5.1 Navigate to Detail Page
```
URL: http://localhost:3000/homestays/test-homestay-con-phung
```

### 5.2 Check Header Section
- [ ] Title shows: "Updated Test Homestay"
- [ ] Subtitle shows: "Homestay sinh thái view sông"
- [ ] Type badge shows: "Toàn bộ nhà"
- [ ] Category badge shows: "Villa"
- [ ] Location shows: "Bến Tre, Việt Nam" with map pin icon
- [ ] Verified badge shows (blue with checkmark)
- [ ] Featured badge shows (if applicable)

### 5.3 Check Quick Info Cards
- [ ] Card 1: "6" with "Khách" label
- [ ] Card 2: "3" with "Phòng ngủ" label
- [ ] Card 3: "2" with "Phòng tắm" label
- [ ] Cards have gradient background
- [ ] Cards have icons (Users, Bed, Bath)

### 5.4 Check Description Section
- [ ] Description card displays
- [ ] Has accent line before title
- [ ] Full description text shows
- [ ] Text is readable with good spacing

### 5.5 Check Amenities Section
- [ ] Amenities card displays
- [ ] Has accent line before title
- [ ] Shows 5 amenities in grid (3 columns)
- [ ] "Hồ bơi" is in the list
- [ ] Each amenity has an icon
- [ ] Icons are colored (text-primary)

### 5.6 Check House Rules Section
- [ ] House rules section displays
- [ ] Shows 2 rules
- [ ] Each rule has a checkmark icon

### 5.7 Check Gallery
- [ ] Gallery section displays
- [ ] Shows hero image
- [ ] Shows 3-5 gallery images
- [ ] Click on image opens lightbox
- [ ] Can navigate between images in lightbox
- [ ] Close button works

### 5.8 Check Calendar Section
- [ ] "Lịch Trống" heading displays
- [ ] Counter shows: "11 ngày đã chặn"
- [ ] Calendar displays current month
- [ ] Previous/Next month buttons work

#### Check Blocked Dates (November 2025)
- [ ] Nov 1: RED background, diagonal line
- [ ] Nov 2: RED background, diagonal line
- [ ] Nov 3: RED background, diagonal line
- [ ] Nov 4: RED background, diagonal line
- [ ] Nov 5: RED background, diagonal line
- [ ] Hover shows: "Đã chặn - Không thể đặt"

#### Check Blocked Dates (December 2025)
- [ ] Navigate to December
- [ ] Dec 24: RED background, diagonal line
- [ ] Dec 25: RED background, diagonal line
- [ ] Dec 26: RED background, diagonal line

#### Check Blocked Dates (January 2026)
- [ ] Navigate to January 2026
- [ ] Jan 1: RED background, diagonal line
- [ ] Jan 2: RED background, diagonal line
- [ ] Jan 3: RED background, diagonal line

#### Check Available Dates
- [ ] Other dates: GREEN background
- [ ] Hover shows: "Còn trống - Có thể đặt"
- [ ] Hover effect works

#### Check Legend
- [ ] Legend displays below calendar
- [ ] "Còn trống" with green box
- [ ] "Đã chặn" with red box + diagonal line
- [ ] "Đã qua" with gray box

### 5.9 Check Rooms Section
- [ ] Rooms list displays
- [ ] Shows 2-3 rooms
- [ ] "Phòng VIP": 2,200,000 VND
- [ ] "Phòng Standard": 1,200,000 VND
- [ ] Each room shows max guests
- [ ] Each room has booking button

### 5.10 Check Booking Form
- [ ] Booking form displays in sidebar
- [ ] Shows base price: 1,800,000 VND
- [ ] Date picker displays
- [ ] Guest selector displays
- [ ] "Đặt ngay" button displays

---

## ✅ Phase 6: Test Booking with Blocked Dates

### 6.1 Try to Select Blocked Dates
- [ ] Click on date picker
- [ ] Try to select Nov 1
- [ ] Date should be disabled/unselectable
- [ ] Try to select Nov 2-5
- [ ] All should be disabled
- [ ] Try to select Dec 24-26
- [ ] All should be disabled
- [ ] Error message or visual feedback shows

### 6.2 Select Available Dates
- [ ] Select Nov 10 (check-in)
- [ ] Select Nov 12 (check-out)
- [ ] Dates should be selectable
- [ ] Price calculation shows
- [ ] Can proceed to next step

### 6.3 Try to Span Blocked Dates
- [ ] Try to select Oct 30 (check-in)
- [ ] Try to select Nov 3 (check-out)
- [ ] Should show error or prevent selection
- [ ] Cannot proceed with booking

---

## ✅ Phase 7: Browser Console Checks

### 7.1 Check Network Tab (During Save)
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Cập nhật" button
4. Find PUT request to /api/homestays/[id]
```

**Verify Request Payload includes:**
- [ ] title
- [ ] subtitle
- [ ] all address fields
- [ ] all pricing fields
- [ ] all policy fields
- [ ] amenities array
- [ ] houseRules array
- [ ] availabilityBlocks array with 3 blocks
- [ ] rooms array

### 7.2 Check Console Logs
```
Look for:
```
- [ ] "AvailabilityCalendar - bookedDates: 11 [...]"
- [ ] No errors in console
- [ ] No warning messages

### 7.3 Check Response
```
Response should be 200 OK with:
```
- [ ] Updated homestay object
- [ ] All fields present
- [ ] No error messages

---

## ✅ Phase 8: Edge Cases

### 8.1 Test Without Rooms
- [ ] Create new homestay without adding rooms
- [ ] Add availability blocks
- [ ] Save
- [ ] Should auto-create "Phòng chính"
- [ ] Availability should save successfully

### 8.2 Test Without Availability
- [ ] Create/edit homestay
- [ ] Don't add any availability blocks
- [ ] Save
- [ ] Should save successfully
- [ ] No availability records created

### 8.3 Test Overlapping Blocks
- [ ] Add block: Nov 1-5
- [ ] Add block: Nov 3-7 (overlaps)
- [ ] Save
- [ ] Should handle gracefully (skipDuplicates)
- [ ] Nov 1-7 all blocked

### 8.4 Test Delete Block
- [ ] Load homestay with blocks
- [ ] Remove one block
- [ ] Save
- [ ] Old dates should be removed from DB
- [ ] Only new blocks remain

---

## 📊 Final Summary

### Success Criteria
- [ ] All fields save to database
- [ ] All fields load correctly on edit
- [ ] Availability blocks save as daily records
- [ ] Calendar displays blocked dates correctly
- [ ] Blocked dates cannot be booked
- [ ] Available dates can be booked
- [ ] No console errors
- [ ] No database errors
- [ ] UI is responsive and looks good
- [ ] Dark mode works (if applicable)

### Performance Checks
- [ ] Page loads in < 2 seconds
- [ ] Save operation completes in < 5 seconds
- [ ] Calendar renders smoothly
- [ ] No lag when navigating months

### Browser Compatibility
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile: Responsive layout works

---

## 🐛 If Something Fails

### Debugging Steps

1. **Check Server Logs**
```bash
# Look for errors in terminal where dev server is running
```

2. **Check Database**
```sql
-- See if data was saved
SELECT * FROM "Homestay" ORDER BY "createdAt" DESC LIMIT 1;
```

3. **Check Browser Console**
```
Look for:
- Network errors (red in Network tab)
- JavaScript errors (red in Console tab)
- Failed requests
```

4. **Check Payload**
```javascript
// In Network tab, check Request Payload
// Should include all fields + availabilityBlocks
```

5. **Check Response**
```javascript
// In Network tab, check Response
// Should be 200 OK with updated data
```

### Common Issues

**Issue: Availability not saving**
- Check: availabilityBlocks in payload
- Check: Server logs for "Processing availability blocks"
- Check: Foreign key constraint errors

**Issue: Fields not loading**
- Check: HomestayEditorData type includes field
- Check: buildInitialFormState includes field
- Check: Serializer includes field

**Issue: Calendar not showing blocks**
- Check: bookedDates prop passed to component
- Check: Console log shows correct count
- Check: DB has records with status = 'BLOCKED'

**Issue: Cannot save**
- Check: Validation errors in console
- Check: Required fields filled
- Check: Network errors

---

## ✅ Test Complete!

If all checkboxes are checked, the implementation is working correctly! 🎉

**Date Tested**: _______________
**Tested By**: _______________
**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________
