import { HomestayRoomStatus } from "@prisma/client";
import {
  contactInfo,
  defaultRooms,
  discoverySection,
  experiences,
  heroContent,
  newsletterContent,
  restaurantSection,
  services,
  stayPerks,
  testimonials,
} from "@/lib/cocoisland/data";
import { prisma } from "@/lib/prisma";
import {
  ContactSection,
  DiscoverySection,
  ExperiencesSection,
  Hero,
  NewsletterSection,
  RestaurantSection,
  RoomShowcase,
  ServicesSection,
  StayPerksSection,
  TestimonialsSection,
  type RoomCard,
} from "@/components/cocoisland/page-sections";

type HomestayApiRoom = {
  id: string;
  homestayId: string;
  name: string;
  slug: string;
  description?: string | null;
  amenities: string[];
  heroImageUrl?: string | null;
  maxGuests?: number | null;
  basePrice?: string | null;
  currency?: string | null;
};

type HomestayApiResponse = {
  id: string;
  title: string;
  summary?: string | null;
  media: { url: string }[];
  rooms: HomestayApiRoom[];
};

function resolveBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";
}

async function fetchRoomsViaApi(): Promise<RoomCard[] | null> {
  try {
    const baseUrl = resolveBaseUrl();

    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("127.0.0.1")
    ) {
      return null;
    }

    const response = await fetch(
      `${baseUrl}/api/public/homestays?limit=6`,
      {
        next: { revalidate: 1800 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: HomestayApiResponse[];
    };

    if (!payload.data || payload.data.length === 0) {
      return null;
    }

    const cards: RoomCard[] = [];
    payload.data.forEach((homestay, homestayIndex) => {
      homestay.rooms.forEach((room, roomIndex) => {
        const fallback =
          defaultRooms[(homestayIndex + roomIndex) % defaultRooms.length];
        const thumbnail =
          room.heroImageUrl ??
          homestay.media[0]?.url ??
          fallback.thumbnail;

        cards.push({
          id: room.id,
          title: room.name,
          slug: room.slug,
          summary: room.description ?? homestay.summary ?? fallback.summary,
          thumbnail,
          amenities:
            room.amenities.length > 0 ? room.amenities : fallback.amenities,
          maxGuests: room.maxGuests ?? fallback.maxGuests,
          basePrice:
            room.basePrice && room.currency
              ? `${room.basePrice} ${room.currency}`
              : fallback.basePrice,
        });
      });
    });

    if (cards.length === 0) {
      return null;
    }

    return cards.slice(0, 8);
  } catch (error) {
    console.warn("Failed to fetch homestay rooms via public API:", error);
    return null;
  }
}

async function fetchRoomsViaDatabase(): Promise<RoomCard[]> {
  try {
    const rooms = await prisma.homestayRoom.findMany({
      where: { status: HomestayRoomStatus.ACTIVE },
      include: {
        Homestay: {
          include: {
            HomestayMedia: {
              orderBy: { position: "asc" },
              take: 1,
              include: { Media: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 8,
    });

    if (rooms.length === 0) {
      return defaultRooms;
    }

    return rooms.map((room, index) => {
      const fallback = defaultRooms[index % defaultRooms.length];
      const heroImage =
        room.heroImageUrl ??
        room.Homestay?.heroImageUrl ??
        room.Homestay?.HomestayMedia?.[0]?.Media.url ??
        fallback.thumbnail;

      return {
        id: room.id,
        title: room.name,
        slug: room.slug,
        summary:
          room.description ??
          room.Homestay?.summary ??
          fallback.summary,
        thumbnail: heroImage,
        amenities:
          room.amenities.length > 0 ? room.amenities : fallback.amenities,
        maxGuests: room.maxGuests ?? fallback.maxGuests,
        basePrice: fallback.basePrice,
      };
    });
  } catch (error) {
    console.warn("Failed to load homestay rooms from database:", error);
    return defaultRooms;
  }
}

async function getRoomCards(): Promise<RoomCard[]> {
  const apiRooms = await fetchRoomsViaApi();
  if (apiRooms && apiRooms.length > 0) {
    return apiRooms;
  }
  return fetchRoomsViaDatabase();
}

export const revalidate = 1800;

export default async function CocoIslandPage() {
  const rooms = await getRoomCards();

  return (
    <main>
      <Hero {...heroContent} />
      <StayPerksSection
        heading={stayPerks.heading}
        items={stayPerks.items}
      />
      <RoomShowcase rooms={rooms} />
      <ExperiencesSection experiences={experiences} />
      <RestaurantSection {...restaurantSection} />
      <DiscoverySection {...discoverySection} />
      <TestimonialsSection testimonials={testimonials} />
      <ServicesSection services={services} />
      <ContactSection
        {...contactInfo}
        roomOptions={defaultRooms.map((room) => ({
          slug: room.slug,
          title: room.title,
        }))}
      />
      <NewsletterSection {...newsletterContent} />
    </main>
  );
}
