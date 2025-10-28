import { ExperienceEntity } from './experience.entity';

export const presentExperience = (experience: ExperienceEntity) => {
  return {
    id: experience.id,
    title: experience.title,
    slug: experience.slug,
    category: experience.category,
    difficulty: experience.difficulty,
    summary: experience.summary ?? null,
    description: experience.description ?? null,
    highlightPoints: experience.highlightPoints ?? [],
    heroImageId: experience.heroImageId ?? null,
    galleryImageIds: experience.galleryImageIds ?? [],
    durationHours: experience.durationHours ?? null,
    groupSizeRange: {
      min: experience.groupSizeMin ?? null,
      max: experience.groupSizeMax ?? null,
    },
    pricing: {
      priceFrom: experience.priceFrom ? Number(experience.priceFrom) : null,
      currency: experience.currency,
    },
    availabilitySchedule: experience.availabilitySchedule ?? null,
    itinerary: experience.itinerary ?? [],
    inclusions: experience.inclusions ?? [],
    exclusions: experience.exclusions ?? [],
    meetingPoint: experience.meetingPoint ?? null,
    coordinates: {
      latitude: experience.latitude ?? null,
      longitude: experience.longitude ?? null,
    },
    contact: {
      email: experience.contactEmail ?? null,
      phone: experience.contactPhone ?? null,
    },
    status: experience.status,
    tags: experience.tags ?? [],
    metadata: experience.metadata ?? null,
    seo: {
      title: experience.seoTitle ?? null,
      description: experience.seoDescription ?? null,
      keywords: experience.seoKeywords ?? [],
    },
    destination: experience.destination
      ? {
          id: experience.destination.id,
          name: experience.destination.name,
          slug: experience.destination.slug,
        }
      : null,
    property: experience.property
      ? {
          id: experience.property.id,
          name: experience.property.name,
          slug: experience.property.slug,
        }
      : null,
    createdAt: experience.createdAt,
    updatedAt: experience.updatedAt,
  };
};
