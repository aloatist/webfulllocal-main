-- Add optional admin notes to bookings
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;
