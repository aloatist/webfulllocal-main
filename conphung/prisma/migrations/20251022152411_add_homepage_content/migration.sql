-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "content" JSONB,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageHero" (
    "id" TEXT NOT NULL,
    "mainTitle" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL DEFAULT 'Đặt Tour Ngay',
    "ctaLink" TEXT NOT NULL DEFAULT 'tel:+84918267715',
    "hotline" TEXT NOT NULL DEFAULT '0918 267 715',
    "location" TEXT NOT NULL DEFAULT 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
    "openingHours" TEXT NOT NULL DEFAULT '7:00 - 18:00',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepagePromotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "discount" TEXT,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepagePromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageTicket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "adultPrice" INTEGER NOT NULL,
    "childPrice" INTEGER NOT NULL,
    "includes" JSONB NOT NULL,
    "pickupInfo" TEXT,
    "warningNote" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageTour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalPrice" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "discount" TEXT,
    "duration" TEXT NOT NULL DEFAULT 'Trong ngày',
    "includes" JSONB NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageTour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageRestaurant" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" TEXT,
    "specialties" JSONB NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageGallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" JSONB NOT NULL,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageCompanyInfo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "businessLicense" TEXT,
    "travelLicense" TEXT,
    "foodSafetyCert" TEXT,
    "verificationText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageCompanyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSection_sectionKey_key" ON "HomepageSection"("sectionKey");

-- CreateIndex
CREATE INDEX "HomepageSection_sectionKey_idx" ON "HomepageSection"("sectionKey");

-- CreateIndex
CREATE INDEX "HomepageSection_isActive_idx" ON "HomepageSection"("isActive");

-- CreateIndex
CREATE INDEX "HomepageSection_order_idx" ON "HomepageSection"("order");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageContent_section_key" ON "HomepageContent"("section");
