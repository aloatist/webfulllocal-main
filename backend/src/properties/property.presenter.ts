import { PropertyEntity } from './property.entity';

export const presentProperty = (property: PropertyEntity) => {
  return {
    id: property.id,
    name: property.name,
    slug: property.slug,
    type: property.type,
    status: property.status,
    headline: property.headline ?? null,
    summary: property.summary ?? null,
    description: property.description ?? null,
    heroImageId: property.heroImageId ?? null,
    galleryImageIds: property.galleryImageIds ?? [],
    rating: property.rating ?? null,
    reviewCount: property.reviewCount ?? 0,
    amenities: property.amenities ?? [],
    highlightFeatures: property.highlightFeatures ?? [],
    policies: property.policies ?? null,
    metadata: property.metadata ?? null,
    seo: {
      title: property.seoTitle ?? null,
      description: property.seoDescription ?? null,
      keywords: property.seoKeywords ?? [],
    },
    coordinates: {
      latitude: property.latitude ?? null,
      longitude: property.longitude ?? null,
    },
    address: {
      line1: property.addressLine1,
      line2: property.addressLine2 ?? null,
      city: property.city ?? null,
      region: property.region ?? null,
      country: property.country,
      postalCode: property.postalCode ?? null,
    },
    contact: {
      email: property.contactEmail ?? null,
      phone: property.contactPhone ?? null,
      websiteUrl: property.websiteUrl ?? null,
      bookingUrl: property.bookingUrl ?? null,
      checkInTime: property.checkInTime ?? null,
      checkOutTime: property.checkOutTime ?? null,
    },
    destination: property.destination
      ? {
          id: property.destination.id,
          name: property.destination.name,
          slug: property.destination.slug,
        }
      : null,
    tags:
      property.tags?.map((tag) => ({
        id: tag.id,
        label: tag.label,
        slug: tag.slug,
        type: tag.type,
      })) ?? [],
    rooms:
      property.rooms?.map((room) => ({
        id: room.id,
        name: room.name,
        slug: room.slug ?? null,
        status: room.status,
        maxGuests: room.maxGuests,
        basePrice: Number(room.basePrice),
        currency: room.currency,
        amenities: room.amenities ?? [],
        imageIds: room.imageIds ?? [],
        sizeSquareMeters: room.sizeSquareMeters ?? null,
      })) ?? [],
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
};
