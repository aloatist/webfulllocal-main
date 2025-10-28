-- CreateEnum
CREATE TYPE "HomestayType" AS ENUM ('PRIVATE_ROOM', 'ENTIRE_PLACE', 'SHARED_ROOM');

-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT', 'BUNGALOW', 'CABIN', 'TREEHOUSE', 'BOAT', 'CAMPER', 'TENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CancellationPolicy" AS ENUM ('FLEXIBLE', 'MODERATE', 'STRICT', 'SUPER_STRICT', 'LONG_TERM');

-- CreateEnum
CREATE TYPE "CheckInType" AS ENUM ('SELF_CHECKIN', 'HOST_GREETS_YOU', 'BUILDING_STAFF');

-- CreateEnum
CREATE TYPE "PricingRuleType" AS ENUM ('SEASONAL', 'WEEKEND', 'HOLIDAY', 'LONG_STAY', 'LAST_MINUTE', 'EARLY_BIRD', 'GROUP_DISCOUNT', 'LENGTH_OF_STAY', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "PricingRuleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- AlterTable
ALTER TABLE "Homestay" ADD COLUMN     "accessibilityFeatures" JSONB,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "beds" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "bookingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cancellationPolicy" "CancellationPolicy" NOT NULL DEFAULT 'MODERATE',
ADD COLUMN     "category" "PropertyCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "checkInTimeEnd" TEXT NOT NULL DEFAULT '22:00',
ADD COLUMN     "checkInTimeStart" TEXT NOT NULL DEFAULT '15:00',
ADD COLUMN     "checkInType" "CheckInType" NOT NULL DEFAULT 'HOST_GREETS_YOU',
ADD COLUMN     "cleaningFee" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "extraGuestFee" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "galleryImageUrls" JSONB,
ADD COLUMN     "hasAirConditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasElevator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasEventsAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGarden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGym" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPetFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSmokingAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWifi" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInstantBook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSuperhost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyPrice" DECIMAL(12,2),
ADD COLUMN     "ratingAverage" DECIMAL(3,2),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "safetyFeatures" JSONB,
ADD COLUMN     "securityDeposit" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "sizeSquareMeters" DECIMAL(8,2),
ADD COLUMN     "specialAmenities" JSONB,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "type" "HomestayType" NOT NULL DEFAULT 'ENTIRE_PLACE',
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weekendPrice" DECIMAL(12,2);

-- CreateTable
CREATE TABLE "HomestayPricingRule" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PricingRuleType" NOT NULL DEFAULT 'SEASONAL',
    "status" "PricingRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "daysOfWeek" INTEGER[],
    "minimumNights" INTEGER,
    "maximumNights" INTEGER,
    "minimumGuests" INTEGER,
    "maximumGuests" INTEGER,
    "priceAdjustmentType" TEXT NOT NULL DEFAULT 'percentage',
    "priceAdjustmentValue" DECIMAL(10,2) NOT NULL,
    "newBasePrice" DECIMAL(12,2),
    "cleaningFeeAdjustment" DECIMAL(12,2),
    "securityDepositAdjustment" DECIMAL(12,2),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isRecursive" BOOLEAN NOT NULL DEFAULT false,
    "recursionPattern" TEXT,
    "conditions" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayPricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomestayReview" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "bookingId" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "overallRating" DECIMAL(3,2) NOT NULL,
    "cleanlinessRating" DECIMAL(3,2),
    "communicationRating" DECIMAL(3,2),
    "checkinRating" DECIMAL(3,2),
    "accuracyRating" DECIMAL(3,2),
    "locationRating" DECIMAL(3,2),
    "valueRating" DECIMAL(3,2),
    "title" TEXT,
    "content" TEXT,
    "hostResponse" TEXT,
    "hostResponseAt" TIMESTAMP(3),
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomestayPricingRule_homestayId_idx" ON "HomestayPricingRule"("homestayId");

-- CreateIndex
CREATE INDEX "HomestayPricingRule_type_idx" ON "HomestayPricingRule"("type");

-- CreateIndex
CREATE INDEX "HomestayPricingRule_status_idx" ON "HomestayPricingRule"("status");

-- CreateIndex
CREATE INDEX "HomestayPricingRule_startDate_idx" ON "HomestayPricingRule"("startDate");

-- CreateIndex
CREATE INDEX "HomestayPricingRule_endDate_idx" ON "HomestayPricingRule"("endDate");

-- CreateIndex
CREATE INDEX "HomestayPricingRule_priority_idx" ON "HomestayPricingRule"("priority");

-- CreateIndex
CREATE INDEX "HomestayReview_homestayId_idx" ON "HomestayReview"("homestayId");

-- CreateIndex
CREATE INDEX "HomestayReview_reviewerId_idx" ON "HomestayReview"("reviewerId");

-- CreateIndex
CREATE INDEX "HomestayReview_bookingId_idx" ON "HomestayReview"("bookingId");

-- CreateIndex
CREATE INDEX "HomestayReview_status_idx" ON "HomestayReview"("status");

-- CreateIndex
CREATE INDEX "HomestayReview_overallRating_idx" ON "HomestayReview"("overallRating");

-- CreateIndex
CREATE INDEX "HomestayReview_createdAt_idx" ON "HomestayReview"("createdAt");

-- CreateIndex
CREATE INDEX "Homestay_type_idx" ON "Homestay"("type");

-- CreateIndex
CREATE INDEX "Homestay_category_idx" ON "Homestay"("category");

-- CreateIndex
CREATE INDEX "Homestay_bedrooms_idx" ON "Homestay"("bedrooms");

-- CreateIndex
CREATE INDEX "Homestay_bathrooms_idx" ON "Homestay"("bathrooms");

-- CreateIndex
CREATE INDEX "Homestay_basePrice_idx" ON "Homestay"("basePrice");

-- CreateIndex
CREATE INDEX "Homestay_maxGuests_idx" ON "Homestay"("maxGuests");

-- CreateIndex
CREATE INDEX "Homestay_isFeatured_idx" ON "Homestay"("isFeatured");

-- CreateIndex
CREATE INDEX "Homestay_isVerified_idx" ON "Homestay"("isVerified");

-- CreateIndex
CREATE INDEX "Homestay_isInstantBook_idx" ON "Homestay"("isInstantBook");

-- CreateIndex
CREATE INDEX "Homestay_isSuperhost_idx" ON "Homestay"("isSuperhost");

-- CreateIndex
CREATE INDEX "Homestay_ratingAverage_idx" ON "Homestay"("ratingAverage");

-- CreateIndex
CREATE INDEX "Homestay_createdAt_idx" ON "Homestay"("createdAt");

-- AddForeignKey
ALTER TABLE "HomestayPricingRule" ADD CONSTRAINT "HomestayPricingRule_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayReview" ADD CONSTRAINT "HomestayReview_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayReview" ADD CONSTRAINT "HomestayReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayReview" ADD CONSTRAINT "HomestayReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "HomestayBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
