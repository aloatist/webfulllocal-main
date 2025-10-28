import { z } from 'zod'
import { 
  HomestayRoomStatus, 
  HomestayStatus, 
  HomestayType, 
  PropertyCategory, 
  CancellationPolicy, 
  CheckInType 
} from '@prisma/client'

const stringArraySchema = z
  .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === undefined) return undefined
    if (value === null) return []
    if (Array.isArray(value)) {
      return value
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  })
  .optional()

const optionalSlugSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  },
  z
    .string()
    .min(1, 'Slug không hợp lệ')
    .optional()
)

const numericLikeSchema = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return undefined
    if (typeof value === 'number') return value
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid numeric value: ${value}`)
    }
    return parsed
  })
  .optional()

const baseRoomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống'),
  slug: optionalSlugSchema,
  description: z.string().optional(),
  sizeSqm: numericLikeSchema,
  basePrice: numericLikeSchema,
  currency: z.string().min(2).max(10).optional(),
  maxGuests: z.coerce.number().int().min(1).optional(),
  bedTypes: stringArraySchema,
  amenities: stringArraySchema,
  status: z.nativeEnum(HomestayRoomStatus).optional(),
  heroImageUrl: z.string().optional(),
})

export const homestayRoomSchema = baseRoomSchema.extend({
  id: z.string().cuid().optional(),
})

export const createHomestayRoomSchema = baseRoomSchema

export const updateHomestayRoomSchema = baseRoomSchema.partial()

const mediaSchema = z.object({
  mediaId: z.string().cuid(),
  type: z.string().optional(),
  position: z.coerce.number().int().min(0).optional(),
})

export const createHomestaySchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: optionalSlugSchema,
  subtitle: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(HomestayStatus).optional(),
  type: z.nativeEnum(HomestayType).optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: numericLikeSchema,
  longitude: numericLikeSchema,
  basePrice: numericLikeSchema,
  currency: z.string().min(2).max(10).optional(),
  maxGuests: z.coerce.number().int().min(1).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  beds: z.coerce.number().int().min(1).optional(),
  sizeSquareMeters: numericLikeSchema,
  floor: z.coerce.number().int().min(0).optional(),
  hasElevator: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasWifi: z.boolean().optional(),
  hasKitchen: z.boolean().optional(),
  hasAirConditioning: z.boolean().optional(),
  hasBalcony: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  hasPool: z.boolean().optional(),
  hasGym: z.boolean().optional(),
  hasPetFriendly: z.boolean().optional(),
  hasSmokingAllowed: z.boolean().optional(),
  hasEventsAllowed: z.boolean().optional(),
  minNights: z.coerce.number().int().min(1).optional(),
  maxNights: z.coerce.number().int().min(1).optional(),
  cancellationPolicy: z.nativeEnum(CancellationPolicy).optional(),
  checkInType: z.nativeEnum(CheckInType).optional(),
  checkInTime: z.string().optional(),
  checkInTimeStart: z.string().optional(),
  checkInTimeEnd: z.string().optional(),
  checkOutTime: z.string().optional(),
  weekendPrice: numericLikeSchema,
  monthlyPrice: numericLikeSchema,
  cleaningFee: numericLikeSchema,
  securityDeposit: numericLikeSchema,
  extraGuestFee: numericLikeSchema,
  heroImageUrl: z.string().optional(),
  galleryImageUrls: z.any().optional(),
  amenities: stringArraySchema,
  houseRules: stringArraySchema,
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  specialAmenities: z.any().optional(),
  safetyFeatures: z.any().optional(),
  accessibilityFeatures: z.any().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: stringArraySchema,
  structuredData: z.any().optional(),
  isFeatured: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isInstantBook: z.boolean().optional(),
  isSuperhost: z.boolean().optional(),
  rooms: z.array(homestayRoomSchema).optional(),
  media: z.array(mediaSchema).optional(),
})

export const updateHomestaySchema = createHomestaySchema.extend({
  title: z.string().min(1).optional(),
})

export const listHomestayQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(HomestayStatus).optional(),
  type: z.nativeEnum(HomestayType).optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minGuests: z.coerce.number().int().min(1).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  hasWifi: z.coerce.boolean().optional(),
  hasKitchen: z.coerce.boolean().optional(),
  hasPool: z.coerce.boolean().optional(),
  hasParking: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  isInstantBook: z.coerce.boolean().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'basePrice', 'ratingAverage', 'bookingCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const listHomestayRoomsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(HomestayRoomStatus).optional(),
})

export type CreateHomestayInput = z.infer<typeof createHomestaySchema>
export type UpdateHomestayInput = z.infer<typeof updateHomestaySchema>
export type HomestayRoomInput = z.infer<typeof homestayRoomSchema>
export type CreateHomestayRoomInput = z.infer<typeof createHomestayRoomSchema>
export type UpdateHomestayRoomInput = z.infer<typeof updateHomestayRoomSchema>
export type ListHomestayRoomsQuery = z.infer<typeof listHomestayRoomsQuerySchema>
