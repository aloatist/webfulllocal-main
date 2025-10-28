-- CreateEnum
CREATE TYPE "HomestayStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HomestayRoomStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Homestay" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "status" "HomestayStatus" NOT NULL DEFAULT 'DRAFT',
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "basePrice" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "maxGuests" INTEGER,
    "minNights" INTEGER,
    "maxNights" INTEGER,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "heroImageUrl" TEXT,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "houseRules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "structuredData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homestay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomestayRoom" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sizeSqm" DECIMAL(8,2),
    "basePrice" DECIMAL(12,2),
    "currency" TEXT,
    "maxGuests" INTEGER,
    "bedTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "HomestayRoomStatus" NOT NULL DEFAULT 'ACTIVE',
    "heroImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomestayMedia" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomestayBooking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "roomId" TEXT,
    "customerId" TEXT,
    "channel" TEXT,
    "channelReference" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "specialRequests" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Homestay_slug_key" ON "Homestay"("slug");

-- CreateIndex
CREATE INDEX "Homestay_status_city_idx" ON "Homestay"("status", "city");

-- CreateIndex
CREATE INDEX "Homestay_status_country_idx" ON "Homestay"("status", "country");

-- CreateIndex
CREATE INDEX "HomestayRoom_status_idx" ON "HomestayRoom"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HomestayRoom_homestayId_slug_key" ON "HomestayRoom"("homestayId", "slug");

-- CreateIndex
CREATE INDEX "HomestayMedia_homestayId_position_idx" ON "HomestayMedia"("homestayId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "HomestayBooking_reference_key" ON "HomestayBooking"("reference");

-- CreateIndex
CREATE INDEX "HomestayBooking_homestayId_status_idx" ON "HomestayBooking"("homestayId", "status");

-- CreateIndex
CREATE INDEX "HomestayBooking_roomId_checkIn_checkOut_idx" ON "HomestayBooking"("roomId", "checkIn", "checkOut");

-- AddForeignKey
ALTER TABLE "HomestayRoom" ADD CONSTRAINT "HomestayRoom_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayMedia" ADD CONSTRAINT "HomestayMedia_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayMedia" ADD CONSTRAINT "HomestayMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayBooking" ADD CONSTRAINT "HomestayBooking_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayBooking" ADD CONSTRAINT "HomestayBooking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HomestayRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayBooking" ADD CONSTRAINT "HomestayBooking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
