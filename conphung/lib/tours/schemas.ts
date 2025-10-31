import { z } from 'zod'
import {
  DepartureStatus,
  TourDifficulty,
  TourStatus,
} from '@prisma/client'

// Max value for Decimal(12, 2): 9,999,999,999.99
const MAX_DECIMAL_VALUE = 9999999999.99

const numericLikeSchema = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return undefined

    const parsed =
      typeof value === 'number'
        ? value
        : Number(value)

    if (Number.isNaN(parsed)) {
      throw new Error(`Giá trị không hợp lệ: ${value}`)
    }

    if (Math.abs(parsed) >= MAX_DECIMAL_VALUE) {
      throw new Error(
        `Giá trị ${parsed.toLocaleString('vi-VN')} vượt quá giới hạn cho phép (${MAX_DECIMAL_VALUE.toLocaleString('vi-VN')}). ` +
        `Vui lòng nhập số nhỏ hơn 10 tỷ.`
      )
    }

    return parsed
  })
  .optional()

const stringArraySchema = z
  .union([
    z.array(z.string()),
    z.string(),
    z.null(),
    z.undefined(),
  ])
  .transform((value) => {
    if (value === undefined) return undefined
    if (value === null) return []
    if (Array.isArray(value)) {
      return value.filter((item) => typeof item === 'string' && item.trim().length > 0)
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  })
  .optional()

const MAX_TOUR_LENGTH_DAYS = 1000
const MAX_SEATS = 10000

const itineraryDaySchema = z.object({
  id: z.string().optional(),
  dayNumber: z
    .coerce.number()
    .int()
    .min(1, { message: 'Day number must be at least 1' })
    .max(MAX_TOUR_LENGTH_DAYS, {
      message: `Day number must be less than or equal to ${MAX_TOUR_LENGTH_DAYS}`,
    }),
  title: z.string().optional(),
  description: z.string().optional(),
  meals: stringArraySchema,
  activities: stringArraySchema,
  stayInfo: z.string().optional(),
})

const departureSchema = z.object({
  id: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  seatsTotal: z
    .coerce.number()
    .int()
    .min(1, { message: 'Total seats must be at least 1' })
    .max(MAX_SEATS, {
      message: `Tổng số chỗ tối đa ${MAX_SEATS}`,
    }),
  seatsAvailable: z
    .coerce.number()
    .int()
    .min(0, { message: 'Available seats cannot be negative' })
    .max(MAX_SEATS, {
      message: `Số chỗ còn trống không được vượt quá ${MAX_SEATS}`,
    })
    .optional(),
  priceAdult: numericLikeSchema,
  priceChild: numericLikeSchema,
  priceInfant: numericLikeSchema,
  status: z.nativeEnum(DepartureStatus).optional(),
  notes: z.string().optional(),
})

const addonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  perPerson: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
})

const mediaSchema = z.object({
  mediaId: z.string(),
  type: z.string().optional(),
  position: z.coerce.number().int().min(0).optional(),
})

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: stringArraySchema,
  })
  .partial()
  .optional()

const baseTourObject = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  summary: z.string().optional(),
  heroImageUrl: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined
      const trimmed = value.trim()
      if (trimmed.length === 0) return undefined
      if (trimmed.startsWith('uploads/')) {
        return `/${trimmed}`
      }
      return trimmed
    }),
  durationDays: z
    .coerce.number()
    .int()
    .min(1, { message: 'Thời lượng tour phải nhiều hơn 0 ngày' })
    .max(MAX_TOUR_LENGTH_DAYS, {
      message: `Thời lượng tour tối đa ${MAX_TOUR_LENGTH_DAYS} ngày`,
    }),
  durationNights: z
    .coerce.number()
    .int()
    .min(0, { message: 'Số đêm không được âm' })
    .max(MAX_TOUR_LENGTH_DAYS, {
      message: `Số đêm tối đa ${MAX_TOUR_LENGTH_DAYS}`,
    })
    .optional(),
  difficulty: z.nativeEnum(TourDifficulty).optional(),
  basePrice: numericLikeSchema,
  currency: z.string().min(2).max(10).optional(),
  maxGuests: z
    .coerce.number()
    .int()
    .min(1, { message: 'Số khách tối đa phải lớn hơn 0' })
    .max(MAX_SEATS, {
      message: `Số khách tối đa không được vượt quá ${MAX_SEATS}`,
    })
    .optional(),
  meetingPoint: z.string().optional(),
  departureCity: z.string().optional(),
  arrivalCity: z.string().optional(),
  status: z.nativeEnum(TourStatus).optional(),
  isFeatured: z.coerce.boolean().optional(),
  highlights: stringArraySchema,
  inclusions: stringArraySchema,
  exclusions: stringArraySchema,
  seo: seoSchema,
  itineraryDays: z.array(itineraryDaySchema).optional(),
  departures: z.array(departureSchema).optional(),
  addons: z.array(addonSchema).optional(),
  categoryIds: z.array(z.string().min(1)).optional(),
  promotionIds: z.array(z.string().min(1)).optional(),
  media: z.array(mediaSchema).optional(),
})

const refineTourDurations = (
  value: { durationDays: number; durationNights?: number | null },
  ctx: z.RefinementCtx
) => {
  if (
    value.durationNights !== undefined &&
    value.durationNights !== null &&
    value.durationNights > value.durationDays
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Số đêm không được lớn hơn số ngày',
      path: ['durationNights'],
    })
  }
}

const baseTourSchema = baseTourObject.superRefine(refineTourDurations)

export const createTourSchema = baseTourSchema

export const updateTourSchema = baseTourObject
  .extend({
    title: z.string().min(1).optional(),
  })
  .superRefine(refineTourDurations)

export type CreateTourInput = z.infer<typeof createTourSchema>
export type UpdateTourInput = z.infer<typeof updateTourSchema>
