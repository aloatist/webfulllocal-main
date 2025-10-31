-- requires: HomestayPricingRule (part of add_homestay_core)
ALTER TABLE "HomestayPricingRule"
  ALTER COLUMN "priceAdjustmentValue" TYPE numeric(12, 2);

-- requires: Promotion (part of add_homestay_core or earlier)
ALTER TABLE "Promotion"
  ALTER COLUMN "discountValue" TYPE numeric(12, 2),
  ALTER COLUMN "maxDiscount" TYPE numeric(12, 2),
  ALTER COLUMN "minimumOrder" TYPE numeric(12, 2);

-- requires: Tour base structure (add_tour_domain)
ALTER TABLE "Tour"
  ALTER COLUMN "basePrice" TYPE numeric(12, 2);

-- requires: TourAddon (add_tour_domain)
ALTER TABLE "TourAddon"
  ALTER COLUMN "price" TYPE numeric(12, 2);

-- requires: TourDeparture (add_tour_domain)
ALTER TABLE "TourDeparture"
  ALTER COLUMN "priceAdult" TYPE numeric(12, 2),
  ALTER COLUMN "priceChild" TYPE numeric(12, 2),
  ALTER COLUMN "priceInfant" TYPE numeric(12, 2);
