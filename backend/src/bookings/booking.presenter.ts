import { BookingEntity } from './booking.entity';

const toNumber = (value?: string | null) =>
  value !== undefined && value !== null ? Number(value) : null;

export const presentBooking = (booking: BookingEntity) => ({
  id: booking.id,
  referenceCode: booking.referenceCode,
  type: booking.type,
  status: booking.status,
  source: booking.source,
  customer: {
    name: booking.customerName,
    email: booking.customerEmail ?? null,
    phone: booking.customerPhone ?? null,
    country: booking.customerCountry ?? null,
    id: booking.customer?.id ?? null,
  },
  schedule: {
    checkInDate: booking.checkInDate ?? null,
    checkOutDate: booking.checkOutDate ?? null,
    startTime: booking.startTime ?? null,
    endTime: booking.endTime ?? null,
  },
  party: {
    adults: booking.adultCount,
    children: booking.childCount,
    infants: booking.infantCount,
  },
  pricing: {
    totalAmount: Number(booking.totalAmount),
    depositAmount: toNumber(booking.depositAmount),
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
  },
  specialRequests: booking.specialRequests ?? null,
  internalNotes: booking.internalNotes ?? null,
  assignedStaffId: booking.assignedStaffId ?? null,
  metadata: booking.metadata ?? null,
  destination: booking.destination
    ? {
        id: booking.destination.id,
        name: booking.destination.name,
        slug: booking.destination.slug,
      }
    : null,
  property: booking.property
    ? {
        id: booking.property.id,
        name: booking.property.name,
        slug: booking.property.slug,
      }
    : null,
  room: booking.room
    ? {
        id: booking.room.id,
        name: booking.room.name,
      }
    : null,
  experience: booking.experience
    ? {
        id: booking.experience.id,
        title: booking.experience.title,
      }
    : null,
  restaurant: booking.restaurant
    ? {
        id: booking.restaurant.id,
        name: booking.restaurant.name,
      }
    : null,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});
