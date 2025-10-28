import { RestaurantEntity } from './restaurant.entity';

export const presentRestaurant = (restaurant: RestaurantEntity) => {
  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    type: restaurant.type,
    cuisineTypes: restaurant.cuisineTypes ?? [],
    summary: restaurant.summary ?? null,
    description: restaurant.description ?? null,
    heroImageId: restaurant.heroImageId ?? null,
    galleryImageIds: restaurant.galleryImageIds ?? [],
    averagePrice: restaurant.averagePrice
      ? Number(restaurant.averagePrice)
      : null,
    currency: restaurant.currency,
    priceLevel: restaurant.priceLevel ?? null,
    contact: {
      email: restaurant.contactEmail ?? null,
      phone: restaurant.contactPhone ?? null,
      websiteUrl: restaurant.websiteUrl ?? null,
      reservationUrl: restaurant.reservationUrl ?? null,
    },
    address: {
      line1: restaurant.addressLine1,
      line2: restaurant.addressLine2 ?? null,
      city: restaurant.city ?? null,
      region: restaurant.region ?? null,
      country: restaurant.country,
      postalCode: restaurant.postalCode ?? null,
    },
    openingHours: restaurant.openingHours ?? null,
    menu: restaurant.menu ?? [],
    amenities: restaurant.amenities ?? [],
    dietaryOptions: restaurant.dietaryOptions ?? [],
    coordinates: {
      latitude: restaurant.latitude ?? null,
      longitude: restaurant.longitude ?? null,
    },
    metadata: restaurant.metadata ?? null,
    seo: {
      title: restaurant.seoTitle ?? null,
      description: restaurant.seoDescription ?? null,
      keywords: restaurant.seoKeywords ?? [],
    },
    status: restaurant.status,
    destination: restaurant.destination
      ? {
          id: restaurant.destination.id,
          name: restaurant.destination.name,
          slug: restaurant.destination.slug,
        }
      : null,
    property: restaurant.property
      ? {
          id: restaurant.property.id,
          name: restaurant.property.name,
          slug: restaurant.property.slug,
        }
      : null,
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  };
};
