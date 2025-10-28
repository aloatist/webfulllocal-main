import { HomestayAvailabilityEntity } from './homestay-availability.entity';
import { HomestayEntity } from './homestay.entity';
import { HomestayPricingRuleEntity } from './homestay-pricing-rule.entity';
import { HomestayReviewEntity } from './homestay-review.entity';
import { HomestayRoomEntity } from './homestay-room.entity';

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const toArray = <T>(value?: T[] | null): T[] => {
  if (!value || value.length === 0) {
    return [];
  }
  return [...value];
};

export const presentHomestayRoom = (room: HomestayRoomEntity) => ({
  id: room.id,
  name: room.name,
  slug: room.slug,
  description: room.description ?? null,
  status: room.status,
  sizeSqm: toNumber(room.sizeSqm),
  basePrice: toNumber(room.basePrice),
  currency: room.currency,
  maxGuests: room.maxGuests ?? null,
  bedTypes: toArray(room.bedTypes),
  amenities: toArray(room.amenities),
  heroImageUrl: room.heroImageUrl ?? null,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
});

export const presentHomestayAvailability = (
  availability: HomestayAvailabilityEntity,
) => ({
  id: availability.id,
  startDate: availability.startDate,
  endDate: availability.endDate ?? null,
  availableUnits: availability.availableUnits,
  bookedUnits: availability.bookedUnits,
  status: availability.status,
  notes: availability.notes ?? null,
  room: availability.room
    ? {
        id: availability.room.id,
        name: availability.room.name,
        slug: availability.room.slug,
      }
    : null,
  createdAt: availability.createdAt,
  updatedAt: availability.updatedAt,
});

export const presentHomestayPricingRule = (
  rule: HomestayPricingRuleEntity,
) => ({
  id: rule.id,
  name: rule.name,
  type: rule.type,
  status: rule.status,
  description: rule.description ?? null,
  startDate: rule.startDate,
  endDate: rule.endDate,
  startTime: rule.startTime ?? null,
  endTime: rule.endTime ?? null,
  daysOfWeek: toArray(rule.daysOfWeek),
  minimumNights: rule.minimumNights ?? null,
  maximumNights: rule.maximumNights ?? null,
  minimumGuests: rule.minimumGuests ?? null,
  maximumGuests: rule.maximumGuests ?? null,
  priceAdjustmentType: rule.priceAdjustmentType,
  priceAdjustmentValue: toNumber(rule.priceAdjustmentValue),
  newBasePrice: toNumber(rule.newBasePrice),
  conditions: rule.conditions ?? null,
  metadata: rule.metadata ?? null,
  priority: rule.priority,
  createdAt: rule.createdAt,
  updatedAt: rule.updatedAt,
});

export const presentHomestayReview = (review: HomestayReviewEntity) => ({
  id: review.id,
  status: review.status,
  overallRating: toNumber(review.overallRating),
  comment: review.comment ?? null,
  isAnonymous: review.isAnonymous,
  reviewer: review.reviewer
    ? {
        id: review.reviewer.id,
        email: review.reviewer.email,
        fullName: review.reviewer.fullName,
      }
    : null,
  booking: review.booking
    ? {
        id: review.booking.id,
        reference: review.booking.reference,
        checkInDate: review.booking.checkInDate,
        checkOutDate: review.booking.checkOutDate,
      }
    : null,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const presentHomestaySummary = (homestay: HomestayEntity) => ({
  id: homestay.id,
  title: homestay.name,
  slug: homestay.slug,
  headline: homestay.headline ?? null,
  summary: homestay.summary ?? null,
  status: homestay.status,
  type: homestay.type,
  category: homestay.category,
  city: homestay.city ?? null,
  country: homestay.country ?? null,
  basePrice: toNumber(homestay.basePrice),
  currency: homestay.currency,
  maxGuests: homestay.maxGuests ?? null,
  bedrooms: homestay.bedrooms ?? null,
  bathrooms: homestay.bathrooms ?? null,
  heroImageUrl: homestay.heroImageUrl ?? null,
  isFeatured: homestay.isFeatured,
  isVerified: homestay.isVerified,
  isInstantBook: homestay.isInstantBook,
  isSuperhost: homestay.isSuperhost,
  ratingAverage: toNumber(homestay.ratingAverage),
  reviewCount: homestay.reviewCount ?? 0,
  destination: homestay.destination
    ? {
        id: homestay.destination.id,
        name: homestay.destination.name,
        slug: homestay.destination.slug,
      }
    : null,
  host: homestay.host
    ? {
        id: homestay.host.id,
        email: homestay.host.email,
        fullName: homestay.host.fullName,
      }
    : null,
  tags:
    homestay.tags?.map((tag) => ({
      id: tag.id,
      label: tag.label,
      slug: tag.slug,
      type: tag.type ?? null,
    })) ?? [],
  rooms: homestay.rooms?.map(presentHomestayRoom) ?? [],
  createdAt: homestay.createdAt,
  updatedAt: homestay.updatedAt,
});

export const presentHomestayDetail = (homestay: HomestayEntity) => ({
  ...presentHomestaySummary(homestay),
  description: homestay.description ?? null,
  address: {
    line1: homestay.addressLine1 ?? null,
    line2: homestay.addressLine2 ?? null,
    city: homestay.city ?? null,
    country: homestay.country ?? null,
    latitude: toNumber(homestay.latitude),
    longitude: toNumber(homestay.longitude),
  },
  galleryImageUrls: toArray(homestay.galleryImageUrls),
  amenities: toArray(homestay.amenities),
  houseRules: toArray(homestay.houseRules),
  seo: {
    title: homestay.seoTitle ?? null,
    description: homestay.seoDescription ?? null,
    keywords: toArray(homestay.seoKeywords),
  },
  availability:
    homestay.availability?.map(presentHomestayAvailability) ?? [],
  pricingRules:
    homestay.pricingRules?.map(presentHomestayPricingRule) ?? [],
  reviews: homestay.reviews?.map(presentHomestayReview) ?? [],
});
