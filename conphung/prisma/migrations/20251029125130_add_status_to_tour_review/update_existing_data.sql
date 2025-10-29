-- Update existing approved reviews
UPDATE "TourReview" 
SET "status" = 'APPROVED' 
WHERE "isPublished" = true;
