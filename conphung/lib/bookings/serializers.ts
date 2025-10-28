import { Prisma, BookingStatus } from '@prisma/client'

export const bookingInclude = {
  Customer: true,
  Tour: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  TourDeparture: true,
  BookingAddon: {
    include: {
      TourAddon: true,
    },
  },
} satisfies Prisma.BookingInclude

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: typeof bookingInclude
}>

export interface SerializedBooking {
  id: string
  reference: string
  status: BookingStatus
  totalAmount: number
  currency: string
  adults: number
  children: number
  infants: number
  specialRequests?: string | null
  adminNotes?: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    fullName: string
    email: string
    phone?: string | null
  }
  tour: {
    id: string
    title: string
    slug: string
  }
  departure: {
    id: string
    startDate: string | null
    endDate: string | null
    seatsTotal: number
    seatsAvailable: number | null
  }
  addons: Array<{
    id: string
    name: string
    price: number
    perPerson: boolean
    quantity: number
  }>
}

export function serializeBooking(booking: BookingWithRelations): SerializedBooking {
  return {
    id: booking.id,
    reference: booking.reference,
    status: booking.status,
    totalAmount: Number(booking.totalAmount ?? 0),
    currency: booking.currency,
    adults: booking.adults,
    children: booking.children,
    infants: booking.infants,
    specialRequests: booking.specialRequests,
    adminNotes: booking.adminNotes,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    customer: {
      id: booking.customerId,
      fullName: booking.Customer.fullName,
      email: booking.Customer.email,
      phone: booking.Customer.phone,
    },
    tour: {
      id: booking.Tour.id,
      title: booking.Tour.title,
      slug: booking.Tour.slug,
    },
    departure: {
      id: booking.TourDeparture.id,
      startDate: booking.TourDeparture.startDate
        ? booking.TourDeparture.startDate.toISOString()
        : null,
      endDate: booking.TourDeparture.endDate
        ? booking.TourDeparture.endDate.toISOString()
        : null,
      seatsTotal: booking.TourDeparture.seatsTotal,
      seatsAvailable: booking.TourDeparture.seatsAvailable,
    },
    addons:
      booking.BookingAddon?.map((addon) => ({
        id: addon.TourAddon.id,
        name: addon.TourAddon.name,
        price: Number(addon.TourAddon.price ?? 0),
        perPerson: addon.TourAddon.perPerson,
        quantity: addon.quantity,
      })) ?? [],
  }
}
