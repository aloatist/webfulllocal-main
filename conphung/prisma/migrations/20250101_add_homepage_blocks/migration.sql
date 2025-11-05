-- CreateEnum
CREATE TYPE "BlockStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "homepage_blocks" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "fields" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "BlockStatus" NOT NULL DEFAULT 'ACTIVE',
    "themeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "homepage_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "homepage_blocks_sortOrder_idx" ON "homepage_blocks"("sortOrder");

-- CreateIndex
CREATE INDEX "homepage_blocks_status_idx" ON "homepage_blocks"("status");

-- CreateIndex
CREATE INDEX "homepage_blocks_type_idx" ON "homepage_blocks"("type");

-- CreateIndex
CREATE INDEX "homepage_blocks_themeId_idx" ON "homepage_blocks"("themeId");

