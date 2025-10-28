-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('OPEN', 'CLOSED', 'BLOCKED');

-- CreateTable
CREATE TABLE "HomestayAvailability" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalUnits" INTEGER NOT NULL DEFAULT 1,
    "reservedUnits" INTEGER NOT NULL DEFAULT 0,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'OPEN',
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomestayAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomestayAvailability_homestayId_date_idx" ON "HomestayAvailability"("homestayId", "date");

-- CreateIndex
CREATE INDEX "HomestayAvailability_status_idx" ON "HomestayAvailability"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HomestayAvailability_roomId_date_key" ON "HomestayAvailability"("roomId", "date");

-- AddForeignKey
ALTER TABLE "HomestayAvailability" ADD CONSTRAINT "HomestayAvailability_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HomestayRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayAvailability" ADD CONSTRAINT "HomestayAvailability_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
