# 🌟 Reviews System Implementation

## Overview
Hệ thống đánh giá cho Tours và Homestays với các tính năng:
- ⭐ Rating 1-5 sao
- 💬 Comment/Review text
- 👤 User information
- 📅 Review date
- ✅ Admin approval workflow
- 📊 Average rating calculation
- 🔒 Chỉ user đã booking mới được review

## Database Schema

### Existing Tables (Already in schema.prisma):
```prisma
model TourReview {
  id          String   @id
  tourId      String
  reviewerId  String
  rating      Int      // 1-5
  comment     String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime
  
  Tour     Tour @relation(fields: [tourId], references: [id], onDelete: Cascade)
  Reviewer User @relation(fields: [reviewerId], references: [id])
}

model HomestayReview {
  id                  String           @id
  homestayId          String
  reviewerId          String
  bookingReference    String?
  rating              Int              // 1-5
  comment             String?
  cleanlinessRating   Int?
  accuracyRating      Int?
  communicationRating Int?
  locationRating      Int?
  valueRating         Int?
  status              ReviewStatus     @default(PENDING)
  isPublished         Boolean          @default(false)
  createdAt           DateTime         @default(now())
  updatedAt           DateTime
  
  Homestay Homestay @relation(fields: [homestayId], references: [id], onDelete: Cascade)
  User     User     @relation(fields: [reviewerId], references: [id])
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## Features to Implement

### 1. Public Review Display
- [x] Show reviews on tour/homestay detail pages
- [x] Display average rating
- [x] Show review count
- [ ] Pagination for reviews
- [ ] Filter by rating

### 2. User Review Submission
- [ ] Review form on detail page
- [ ] Check if user has booked
- [ ] Prevent duplicate reviews
- [ ] Star rating component
- [ ] Text comment field
- [ ] Submit to API

### 3. Admin Review Management
- [ ] List all reviews (pending/approved/rejected)
- [ ] Approve/reject reviews
- [ ] Edit review content
- [ ] Delete reviews
- [ ] Bulk actions

### 4. API Endpoints

#### Tours:
- [ ] `POST /api/tours/[tourId]/reviews` - Submit review
- [ ] `GET /api/tours/[tourId]/reviews` - Get reviews
- [ ] `PUT /api/admin/reviews/tours/[reviewId]` - Update review
- [ ] `DELETE /api/admin/reviews/tours/[reviewId]` - Delete review

#### Homestays:
- [ ] `POST /api/homestays/[homestayId]/reviews` - Submit review
- [ ] `GET /api/homestays/[homestayId]/reviews` - Get reviews
- [ ] `PUT /api/admin/reviews/homestays/[reviewId]` - Update review
- [ ] `DELETE /api/admin/reviews/homestays/[reviewId]` - Delete review

## Implementation Plan

### Phase 1: Review Display (Already Done)
✅ Tours detail page shows reviews
✅ Homestays detail page shows reviews
✅ Average rating calculation
✅ Review count display

### Phase 2: User Review Form (To Do)
1. Create StarRating component
2. Create ReviewForm component
3. Add form to detail pages
4. Check booking eligibility
5. Submit API integration

### Phase 3: API Routes (To Do)
1. Create POST endpoints for submission
2. Validate user has booking
3. Check for duplicate reviews
4. Save to database
5. Update average rating

### Phase 4: Admin Management (To Do)
1. Create admin reviews page
2. List all reviews with filters
3. Approve/reject actions
4. Edit functionality
5. Delete functionality

### Phase 5: Notifications (Optional)
1. Email to admin on new review
2. Email to user on approval
3. In-app notifications

## File Structure

```
/components/reviews/
  ├── StarRating.tsx          # Star rating display/input
  ├── ReviewCard.tsx          # Single review display
  ├── ReviewList.tsx          # List of reviews
  ├── ReviewForm.tsx          # Submit review form
  └── ReviewStats.tsx         # Rating statistics

/app/api/tours/[tourId]/reviews/
  └── route.ts                # GET/POST tour reviews

/app/api/homestays/[homestayId]/reviews/
  └── route.ts                # GET/POST homestay reviews

/app/api/admin/reviews/
  ├── tours/[reviewId]/route.ts
  └── homestays/[reviewId]/route.ts

/app/admin/reviews/
  ├── page.tsx                # Admin reviews list
  ├── tours/page.tsx          # Tour reviews management
  └── homestays/page.tsx      # Homestay reviews management
```

## Next Steps

1. ✅ Check current review display on detail pages
2. 🔄 Create StarRating component
3. 🔄 Create ReviewForm component
4. 🔄 Create API routes
5. 🔄 Create admin management pages

---

**Status:** 🚧 In Progress
**Priority:** High
**Estimated Time:** 4-6 hours
