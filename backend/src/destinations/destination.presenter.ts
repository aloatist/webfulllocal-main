import { DestinationEntity } from './destination.entity';

export const presentDestination = (destination: DestinationEntity) => {
  return {
    id: destination.id,
    name: destination.name,
    slug: destination.slug,
    type: destination.type,
    headline: destination.headline ?? null,
    summary: destination.summary ?? null,
    description: destination.description ?? null,
    heroImageId: destination.heroImageId ?? null,
    galleryImageIds: destination.galleryImageIds ?? [],
    tags: destination.tags ?? [],
    location: {
      latitude: destination.latitude ?? null,
      longitude: destination.longitude ?? null,
    },
    country: destination.country ?? null,
    region: destination.region ?? null,
    climate: destination.climate ?? null,
    travelTips: destination.travelTips ?? null,
    metadata: destination.metadata ?? null,
    isFeatured: destination.isFeatured,
    seo: {
      title: destination.seoTitle ?? null,
      description: destination.seoDescription ?? null,
    },
    statistics: {
      properties: destination.properties?.length ?? 0,
      experiences: destination.experiences?.length ?? 0,
      restaurants: destination.restaurants?.length ?? 0,
      bookings: destination.bookings?.length ?? 0,
    },
    createdAt: destination.createdAt,
    updatedAt: destination.updatedAt,
  };
};
