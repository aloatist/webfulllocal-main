import { PropertyRoomEntity } from './property-room.entity';

export const presentRoom = (room: PropertyRoomEntity) => ({
  id: room.id,
  propertyId: room.property?.id ?? null,
  propertyName: room.property?.name ?? null,
  name: room.name,
  slug: room.slug ?? null,
  shortDescription: room.shortDescription ?? null,
  description: room.description ?? null,
  maxGuests: room.maxGuests,
  bedType: room.bedType ?? null,
  sizeSquareMeters: room.sizeSquareMeters ?? null,
  pricing: {
    basePrice: Number(room.basePrice),
    currency: room.currency,
    extraPersonFee: room.extraPersonFee ? Number(room.extraPersonFee) : null,
  },
  amenities: room.amenities ?? [],
  imageIds: room.imageIds ?? [],
  status: room.status,
  inventory: {
    total: room.inventoryTotal,
    available: room.inventoryAvailable,
  },
  metadata: room.metadata ?? null,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
});
