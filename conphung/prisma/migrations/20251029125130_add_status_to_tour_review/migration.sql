-- AlterTable
ALTER TABLE "TourReview" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "TourReview_status_idx" ON "TourReview"("status");
