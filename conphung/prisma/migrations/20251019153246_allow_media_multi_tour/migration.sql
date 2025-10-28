-- DropIndex
DROP INDEX "public"."TourMedia_mediaId_key";

-- AlterTable
ALTER TABLE "_CategoryToTour" ADD CONSTRAINT "_CategoryToTour_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_CategoryToTour_AB_unique";
