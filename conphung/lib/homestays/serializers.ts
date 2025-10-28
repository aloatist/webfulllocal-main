import { Prisma } from '@prisma/client'

export const homestayInclude = {
  HomestayRoom: {
    orderBy: { name: 'asc' as const },
  },
  HomestayMedia: {
    orderBy: { position: 'asc' as const },
    include: {
      Media: true,
    },
  },
  HomestayAvailability: {
    orderBy: { date: 'asc' as const },
  },
  _count: {
    select: {
      HomestayRoom: true,
      HomestayBooking: true,
    },
  },
} satisfies Prisma.HomestayInclude

export type HomestayWithRelations = Prisma.HomestayGetPayload<{
  include: typeof homestayInclude
}>

function decimalToString(value: Prisma.Decimal | null | undefined) {
  if (!value) return null
  return value.toFixed(2)
}

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  if (!value) return null
  return Number(value.toString())
}

export function serializeHomestay(homestay: HomestayWithRelations) {
  return {
    id: homestay.id,
    title: homestay.title,
    slug: homestay.slug,
    summary: homestay.summary,
    description: homestay.description,
    status: homestay.status,
    addressLine1: homestay.addressLine1,
    addressLine2: homestay.addressLine2,
    city: homestay.city,
    state: homestay.state,
    country: homestay.country,
    postalCode: homestay.postalCode,
    latitude: decimalToNumber(homestay.latitude),
    longitude: decimalToNumber(homestay.longitude),
    basePrice: decimalToString(homestay.basePrice),
    currency: homestay.currency,
    maxGuests: homestay.maxGuests,
    minNights: homestay.minNights,
    maxNights: homestay.maxNights,
    checkInTime: homestay.checkInTime,
    checkOutTime: homestay.checkOutTime,
    heroImageUrl: homestay.heroImageUrl,
    galleryImageUrls: homestay.galleryImageUrls,
    amenities: homestay.amenities,
    houseRules: homestay.houseRules,
    seoTitle: homestay.seoTitle,
    seoDescription: homestay.seoDescription,
    seoKeywords: homestay.seoKeywords,
    structuredData: homestay.structuredData,
    rooms: homestay.HomestayRoom.map((room) => serializeRoom(room)),
    media: homestay.HomestayMedia.map((item) => ({
      id: item.id,
      type: item.type,
      position: item.position,
      mediaId: item.mediaId,
      url: item.Media.url,
      alt: item.Media.alt,
      mimeType: item.Media.mimeType,
      width: item.Media.width,
      height: item.Media.height,
    })),
    availability: homestay.HomestayAvailability.map((block) => ({
      id: block.id,
      roomId: block.roomId,
      date: block.date.toISOString(),
      totalUnits: block.totalUnits,
      reservedUnits: block.reservedUnits,
      status: block.status,
      source: block.source,
      metadata: block.metadata,
    })),
    metrics: {
      roomCount: homestay._count.HomestayRoom,
      bookingCount: homestay._count.HomestayBooking,
    },
    createdAt: homestay.createdAt.toISOString(),
    updatedAt: homestay.updatedAt.toISOString(),
  }
}

type HomestayRoomWithRelations = Prisma.HomestayRoomGetPayload<{
  include?: Record<string, never>
}>

export function serializeRoom(room: HomestayRoomWithRelations) {
  return {
    id: room.id,
    homestayId: room.homestayId,
    name: room.name,
    slug: room.slug,
    description: room.description,
    sizeSqm: decimalToNumber(room.sizeSqm),
    basePrice: decimalToString(room.basePrice),
    currency: room.currency,
    maxGuests: room.maxGuests,
    bedTypes: room.bedTypes,
    amenities: room.amenities,
    status: room.status,
    heroImageUrl: room.heroImageUrl,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  }
}
