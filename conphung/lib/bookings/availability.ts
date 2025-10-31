import {
  BookingStatus,
  DepartureStatus,
  Prisma,
} from '@prisma/client'

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.COMPLETED,
]

export const activeBookingStatuses = ACTIVE_BOOKING_STATUSES

export function countGuests(
  adults?: number | null,
  children?: number | null,
  infants?: number | null
) {
  return (
    Number(adults ?? 0) +
    Number(children ?? 0) +
    Number(infants ?? 0)
  )
}

export function deriveDepartureStatus(
  currentStatus: DepartureStatus,
  seatsRemaining: number,
  seatsTotal: number
) {
  if (
    currentStatus === DepartureStatus.CANCELLED ||
    currentStatus === DepartureStatus.COMPLETED
  ) {
    return currentStatus
  }

  if (seatsRemaining <= 0) {
    return DepartureStatus.SOLD_OUT
  }

  const lowAvailabilityThreshold = Math.max(
    1,
    Math.floor(seatsTotal * 0.2)
  )

  if (seatsRemaining <= lowAvailabilityThreshold) {
    return DepartureStatus.LOW_AVAILABILITY
  }

  return DepartureStatus.SCHEDULED
}

export async function getActiveGuestCount(
  tx: Prisma.TransactionClient,
  departureId: string
) {
  const totals = await tx.booking.aggregate({
    where: {
      departureId,
      status: { in: ACTIVE_BOOKING_STATUSES },
    },
    _sum: {
      adults: true,
      children: true,
      infants: true,
    },
  })

  return countGuests(
    totals._sum.adults,
    totals._sum.children,
    totals._sum.infants
  )
}

export async function recalculateDepartureAvailability(
  tx: Prisma.TransactionClient,
  departureId: string
) {
  const departure = await tx.tourDeparture.findUnique({
    where: { id: departureId },
    select: {
      id: true,
      seatsTotal: true,
      status: true,
    },
  })

  if (!departure) {
    return null
  }

  const bookedGuests = await getActiveGuestCount(tx, departureId)
  const seatsRemaining = Math.max(
    departure.seatsTotal - bookedGuests,
    0
  )
  const nextStatus = deriveDepartureStatus(
    departure.status,
    seatsRemaining,
    departure.seatsTotal
  )

  const updatedDeparture = await tx.tourDeparture.update({
    where: { id: departureId },
    data: {
      seatsAvailable: seatsRemaining,
      status: nextStatus,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      seatsAvailable: true,
      seatsTotal: true,
      status: true,
    },
  })

  return {
    departure: updatedDeparture,
    seatsRemaining: updatedDeparture.seatsAvailable,
    bookedGuests,
  }
}
