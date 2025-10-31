'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  PlusCircle,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  DepartureStatus,
  DiscountType,
  TourDifficulty,
  TourStatus,
} from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MediaPickerDialog } from '@/components/media/media-picker-dialog';
import type { MediaItem } from '@/components/media/types';
import type { CreateTourInput, UpdateTourInput } from '@/lib/tours/schemas';

const TOUR_LIMITS = {
  durationDays: 1000,
  durationNights: 1000,
  maxGuests: 10000,
  seats: 10000,
};

type SubmissionPayload = CreateTourInput | UpdateTourInput

interface TourItinerary {
  id?: string
  dayNumber: number
  title?: string | null
  description?: string | null
  meals: string[]
  activities: string[]
  stayInfo?: string | null
}

interface TourDeparture {
  id?: string
  startDate: string
  endDate?: string | null
  seatsTotal: number
  seatsAvailable: number
  priceAdult?: string | null
  priceChild?: string | null
  priceInfant?: string | null
  status: DepartureStatus
  notes?: string | null
}

interface TourAddon {
  id?: string
  name: string
  description?: string | null
  price: string
  perPerson: boolean
  isActive: boolean
}

interface TourMedia {
  id?: string
  mediaId: string
  type: string
  position: number
  media?: {
    id: string
    url: string
    alt?: string | null
  } | null
}

interface PromotionOption {
  id: string
  code: string
  name: string
  discountType: DiscountType
  discountValue: string
  isActive: boolean
  description?: string | null
  startDate?: string | null
  endDate?: string | null
}

interface PromotionApiResponse {
  id: string
  code: string
  name: string
  description?: string | null
  discountType: DiscountType
  discountValue: string | number
  isActive: boolean
  startDate?: string | null
  endDate?: string | null
}

interface PromotionListResponse {
  data?: PromotionApiResponse[]
}

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface CategoryListResponse {
  categories?: CategoryOption[]
}

interface NewPromotionFormState {
  code: string
  name: string
  discountType: DiscountType
  discountValue: string
  description: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface TourWithRelations {
  id: string
  title: string
  slug: string
  summary?: string | null
  heroImageUrl?: string | null
  durationDays: number
  durationNights?: number | null
  difficulty: TourDifficulty
  basePrice?: string | null
  currency: string
  maxGuests?: number | null
  meetingPoint?: string | null
  departureCity?: string | null
  arrivalCity?: string | null
  status: TourStatus
  isFeatured: boolean
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords: string[]
  itineraryDays: TourItinerary[]
  departures: TourDeparture[]
  addons: TourAddon[]
  categories: CategoryOption[]
  promotions: Array<{
    id: string
    code: string
    name: string
    discountType: DiscountType
    discountValue: string
    isActive: boolean
    description?: string | null
    startDate?: string | null
    endDate?: string | null
  }>
  mediaItems: TourMedia[]
  createdAt: string
  updatedAt: string
}

interface TourFormProps {
  mode: 'create' | 'edit'
  initialData?: TourWithRelations | null
  onSubmit: (payload: SubmissionPayload) => Promise<void>
  onCancel: () => void
}

interface ItineraryFormState {
  id?: string
  dayNumber: string
  title: string
  description: string
  meals: string
  activities: string
  stayInfo: string
}

interface DepartureFormState {
  id?: string
  startDate: string
  endDate: string
  seatsTotal: string
  seatsAvailable: string
  priceAdult: string
  priceChild: string
  priceInfant: string
  status: DepartureStatus
  notes: string
}

interface AddonFormState {
  id?: string
  name: string
  description: string
  price: string
  perPerson: boolean
  isActive: boolean
}

interface MediaSelection {
  mediaId: string
  url: string
  alt?: string | null
  type: string
  position: number
}

interface TourFormState {
  title: string
  slug: string
  summary: string
  heroImageUrl: string
  durationDays: string
  durationNights: string
  difficulty: TourDifficulty
  basePrice: string
  currency: string
  maxGuests: string
  meetingPoint: string
  departureCity: string
  arrivalCity: string
  status: TourStatus
  isFeatured: boolean
  highlights: string
  inclusions: string
  exclusions: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  itineraryDays: ItineraryFormState[]
  departures: DepartureFormState[]
  addons: AddonFormState[]
  categoryIds: string[]
  promotionIds: string[]
}

function listToTextarea(values: string[] | undefined | null) {
  if (!values || values.length === 0) return ''
  return values.join('\n')
}

function parseList(input: string) {
  return input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function emptyItineraryDay(dayNumber: number): ItineraryFormState {
  return {
    dayNumber: String(dayNumber),
    title: '',
    description: '',
    meals: '',
    activities: '',
    stayInfo: '',
  }
}

function emptyDeparture(): DepartureFormState {
  return {
    startDate: '',
    endDate: '',
    seatsTotal: '',
    seatsAvailable: '',
    priceAdult: '',
    priceChild: '',
    priceInfant: '',
    status: DepartureStatus.SCHEDULED,
    notes: '',
  }
}

function emptyAddon(): AddonFormState {
  return {
    name: '',
    description: '',
    price: '',
    perPerson: true,
    isActive: true,
  }
}

function toItineraryState(days: TourItinerary[]): ItineraryFormState[] {
  return days
    .slice()
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((day) => ({
      id: day.id,
      dayNumber: String(day.dayNumber),
      title: day.title ?? '',
      description: day.description ?? '',
      meals: listToTextarea(day.meals),
      activities: listToTextarea(day.activities),
      stayInfo: day.stayInfo ?? '',
    }))
}

function toDepartureState(departures: TourDeparture[]): DepartureFormState[] {
  return departures
    .slice()
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .map((departure) => ({
      id: departure.id,
      startDate: departure.startDate
        ? new Date(departure.startDate).toISOString().slice(0, 10)
        : '',
      endDate: departure.endDate
        ? new Date(departure.endDate).toISOString().slice(0, 10)
        : '',
      seatsTotal: String(departure.seatsTotal ?? ''),
      seatsAvailable: String(departure.seatsAvailable ?? ''),
      priceAdult: departure.priceAdult ?? '',
      priceChild: departure.priceChild ?? '',
      priceInfant: departure.priceInfant ?? '',
      status: departure.status ?? DepartureStatus.SCHEDULED,
      notes: departure.notes ?? '',
    }))
}

function toAddonState(addons: TourAddon[]): AddonFormState[] {
  return addons.map((addon) => ({
    id: addon.id,
    name: addon.name,
    description: addon.description ?? '',
    price: addon.price ?? '',
    perPerson: addon.perPerson,
    isActive: addon.isActive,
  }))
}

function buildInitialMedia(initial?: TourWithRelations | null): MediaSelection[] {
  if (!initial?.mediaItems) {
    return []
  }

  return initial.mediaItems
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item, index) => ({
      mediaId: item.mediaId,
      url: item.media?.url ?? '',
      alt: item.media?.alt ?? null,
      type: item.type ?? 'IMAGE',
      position: item.position ?? index,
    }))
    .filter((item) => item.mediaId && item.url)
}

function buildInitialState(initial?: TourWithRelations | null): TourFormState {
  if (!initial) {
    return {
      title: '',
      slug: '',
      summary: '',
      heroImageUrl: '',
      durationDays: '1',
      durationNights: '',
      difficulty: TourDifficulty.EASY,
      basePrice: '',
      currency: 'VND',
      maxGuests: '',
      meetingPoint: '',
      departureCity: '',
      arrivalCity: '',
      status: TourStatus.DRAFT,
      isFeatured: false,
      highlights: '',
      inclusions: '',
      exclusions: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      itineraryDays: [],
      departures: [],
      addons: [],
      categoryIds: [],
      promotionIds: [],
    }
  }

  return {
    title: initial.title,
    slug: initial.slug,
    summary: initial.summary ?? '',
    heroImageUrl: initial.heroImageUrl ?? '',
    durationDays: String(initial.durationDays ?? 1),
    durationNights:
      initial.durationNights !== null && initial.durationNights !== undefined
        ? String(initial.durationNights)
        : '',
    difficulty: initial.difficulty ?? TourDifficulty.EASY,
    basePrice: initial.basePrice ?? '',
    currency: initial.currency ?? 'VND',
    maxGuests:
      initial.maxGuests !== null && initial.maxGuests !== undefined
        ? String(initial.maxGuests)
        : '',
    meetingPoint: initial.meetingPoint ?? '',
    departureCity: initial.departureCity ?? '',
    arrivalCity: initial.arrivalCity ?? '',
    status: initial.status ?? TourStatus.DRAFT,
    isFeatured: Boolean(initial.isFeatured),
    highlights: listToTextarea(initial.highlights),
    inclusions: listToTextarea(initial.inclusions),
    exclusions: listToTextarea(initial.exclusions),
    seoTitle: initial.seoTitle ?? '',
    seoDescription: initial.seoDescription ?? '',
    seoKeywords: listToTextarea(initial.seoKeywords),
    itineraryDays: toItineraryState(initial.itineraryDays ?? []),
    departures: toDepartureState(initial.departures ?? []),
    addons: toAddonState(initial.addons ?? []),
    categoryIds: initial.categories?.map((category) => category.id) ?? [],
    promotionIds: initial.promotions?.map((promo) => promo.id) ?? [],
  }
}

function normalizePromotion(
  promotion: PromotionApiResponse | TourWithRelations['promotions'][number]
): PromotionOption {
  return {
    id: promotion.id,
    code: promotion.code,
    name: promotion.name,
    discountType: promotion.discountType,
    discountValue:
      typeof promotion.discountValue === 'string'
        ? promotion.discountValue
        : String(promotion.discountValue),
    isActive: promotion.isActive,
    description:
      'description' in promotion ? promotion.description ?? null : null,
    startDate: promotion.startDate ?? null,
    endDate: promotion.endDate ?? null,
  }
}

function dedupePromotions(promotions: PromotionOption[]): PromotionOption[] {
  const map = new Map<string, PromotionOption>()
  for (const promotion of promotions) {
    map.set(promotion.id, {
      ...(map.get(promotion.id) ?? promotion),
      ...promotion,
    })
  }
  return Array.from(map.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  )
}

function dedupeCategories(categories: CategoryOption[]): CategoryOption[] {
  const map = new Map<string, CategoryOption>()
  for (const category of categories) {
    map.set(category.id, {
      ...(map.get(category.id) ?? category),
      ...category,
    })
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

function emptyPromotionForm(): NewPromotionFormState {
  return {
    code: '',
    name: '',
    discountType: DiscountType.PERCENTAGE,
    discountValue: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  }
}

function toIsoDate(value: string, endOfDay = false) {
  if (!value) return undefined
  const date = endOfDay
    ? new Date(`${value}T23:59:59.999Z`)
    : new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return date.toISOString()
}

function toNumber(value: string, fallback?: number) {
  if (!value) return fallback
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return fallback
  return numeric
}

function parseDecimal(value: string) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const numeric = Number.parseFloat(value)
  if (Number.isNaN(numeric)) {
    return undefined
  }
  return numeric
}

export function TourForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
}: TourFormProps) {
  const [formData, setFormData] = useState<TourFormState>(() =>
    buildInitialState(initialData)
  )
  const [mediaSelections, setMediaSelections] = useState<MediaSelection[]>(() =>
    buildInitialMedia(initialData)
  )
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promotionOptions, setPromotionOptions] = useState<PromotionOption[]>(
    []
  )
  const [promotionLoading, setPromotionLoading] = useState(false)
  const [promotionError, setPromotionError] = useState<string | null>(null)
  const [promotionSelectValue, setPromotionSelectValue] = useState('')
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [createPromotionLoading, setCreatePromotionLoading] = useState(false)
  const [createPromotionError, setCreatePromotionError] = useState<
    string | null
  >(null)
  const [newPromotionData, setNewPromotionData] =
    useState<NewPromotionFormState>(() => emptyPromotionForm())
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categorySelectValue, setCategorySelectValue] = useState('')

  const parseNumericString = (value: string | undefined | null): number | undefined => {
    if (typeof value !== 'string') return undefined
    const trimmed = value.trim()
    if (trimmed.length === 0) return undefined
    const numeric = Number(trimmed)
    if (Number.isNaN(numeric)) return undefined
    return numeric
  }

  const formatLimit = (limit: number) => limit.toLocaleString('vi-VN')

  useEffect(() => {
    if (initialData) {
      setMediaSelections(buildInitialMedia(initialData))
    }
  }, [initialData])

  useEffect(() => {
    let active = true

    const loadPromotions = async () => {
      setPromotionLoading(true)
      setPromotionError(null)

      try {
        const response = await fetch('/api/promotions?limit=100', {
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error('Không thể tải danh sách khuyến mãi')
        }
        const payload = (await response.json()) as PromotionListResponse
        const promotionList = Array.isArray(payload.data)
          ? payload.data.map((item) => normalizePromotion(item))
          : []
        if (active) {
          setPromotionOptions(dedupePromotions(promotionList))
        }
      } catch (loadError) {
        if (active) {
          setPromotionError(
            loadError instanceof Error
              ? loadError.message
              : 'Không thể tải danh sách khuyến mãi'
          )
        }
      } finally {
        if (active) {
          setPromotionLoading(false)
        }
      }
    }

    void loadPromotions()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadCategories = async () => {
      setCategoryLoading(true)
      setCategoryError(null)

      try {
        const response = await fetch('/api/categories?limit=100', {
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error('Không thể tải danh mục tour')
        }
        const payload = (await response.json()) as CategoryListResponse
        const categories = Array.isArray(payload.categories)
          ? payload.categories
          : []
        if (active) {
          setCategoryOptions(categories)
        }
      } catch (loadError) {
        if (active) {
          setCategoryError(
            loadError instanceof Error
              ? loadError.message
              : 'Không thể tải danh mục tour'
          )
        }
      } finally {
        if (active) {
          setCategoryLoading(false)
        }
      }
    }

    void loadCategories()

    return () => {
      active = false
    }
  }, [])

  const durationDaysNumeric = parseNumericString(formData.durationDays)
  const durationNightsNumeric = parseNumericString(formData.durationNights)
  const maxGuestsNumeric = parseNumericString(formData.maxGuests)

  const exceedsDurationDaysLimit =
    durationDaysNumeric !== undefined &&
    durationDaysNumeric > TOUR_LIMITS.durationDays

  const durationNightsMessage = (() => {
    if (durationNightsNumeric === undefined) return null
    if (durationNightsNumeric > TOUR_LIMITS.durationNights) {
      return `Số đêm tối đa ${formatLimit(TOUR_LIMITS.durationNights)} đêm.`
    }
    if (
      durationDaysNumeric !== undefined &&
      durationNightsNumeric > durationDaysNumeric
    ) {
      return 'Số đêm không được lớn hơn số ngày.'
    }
    return null
  })()

  const durationNightsAdjustmentTarget =
    durationNightsMessage !== null
      ? Math.min(
          TOUR_LIMITS.durationNights,
          durationDaysNumeric ?? TOUR_LIMITS.durationNights
        )
      : null

  const exceedsMaxGuestsLimit =
    maxGuestsNumeric !== undefined &&
    maxGuestsNumeric > TOUR_LIMITS.maxGuests

  const durationNightsClampTarget =
    durationNightsAdjustmentTarget ?? TOUR_LIMITS.durationNights

  const initialCategoryOptions = useMemo(
    () => initialData?.categories ?? [],
    [initialData]
  )

  const allCategoryOptions = useMemo(
    () => dedupeCategories([...categoryOptions, ...initialCategoryOptions]),
    [categoryOptions, initialCategoryOptions]
  )

  const categoryLookup = useMemo(() => {
    const map = new Map<string, CategoryOption>()
    for (const option of allCategoryOptions) {
      map.set(option.id, option)
    }
    return map
  }, [allCategoryOptions])

  const selectedCategories = useMemo(
    () =>
      formData.categoryIds
        .map((id) => categoryLookup.get(id))
        .filter((item): item is CategoryOption => Boolean(item)),
    [formData.categoryIds, categoryLookup]
  )

  const initialPromotionOptions = useMemo(
    () =>
      initialData?.promotions
        ? initialData.promotions.map((promotion) =>
            normalizePromotion(promotion)
          )
        : [],
    [initialData]
  )

  const allPromotionOptions = useMemo(
    () =>
      dedupePromotions([...promotionOptions, ...initialPromotionOptions]),
    [promotionOptions, initialPromotionOptions]
  )

  const promotionLookup = useMemo(() => {
    const map = new Map<string, PromotionOption>()
    for (const option of allPromotionOptions) {
      map.set(option.id, option)
    }
    return map
  }, [allPromotionOptions])

  const selectedPromotions = useMemo(
    () =>
      formData.promotionIds
        .map((id) => promotionLookup.get(id))
        .filter((item): item is PromotionOption => Boolean(item)),
    [formData.promotionIds, promotionLookup]
  )

  const hasItinerary = formData.itineraryDays.length > 0
  const hasDepartures = formData.departures.length > 0
  const hasAddons = formData.addons.length > 0
  const hasMedia = mediaSelections.length > 0

  const title = mode === 'create' ? 'Thêm tour' : 'Chỉnh sửa tour'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (
        hasDepartures &&
        formData.departures.some((departure) => !departure.startDate)
      ) {
        throw new Error('Vui lòng chọn ngày khởi hành cho tất cả lịch trình.')
      }

      const uniqueCategoryIds = Array.from(new Set(formData.categoryIds))
      const uniquePromotionIds = Array.from(new Set(formData.promotionIds))

      const payload: SubmissionPayload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        summary: formData.summary.trim() || undefined,
        heroImageUrl: formData.heroImageUrl.trim() || undefined,
        durationDays: Math.max(1, toNumber(formData.durationDays, 1) ?? 1),
        durationNights:
          formData.durationNights !== ''
            ? toNumber(formData.durationNights) ?? undefined
            : undefined,
        difficulty: formData.difficulty,
        basePrice: parseDecimal(formData.basePrice) ?? undefined,
        currency: formData.currency.trim() || undefined,
        maxGuests:
          formData.maxGuests !== ''
            ? toNumber(formData.maxGuests) ?? undefined
            : undefined,
        meetingPoint: formData.meetingPoint.trim() || undefined,
        departureCity: formData.departureCity.trim() || undefined,
        arrivalCity: formData.arrivalCity.trim() || undefined,
        status: formData.status,
        isFeatured: formData.isFeatured,
        highlights: parseList(formData.highlights),
        inclusions: parseList(formData.inclusions),
        exclusions: parseList(formData.exclusions),
        seo: {
          title: formData.seoTitle.trim() || undefined,
          description: formData.seoDescription.trim() || undefined,
          keywords: parseList(formData.seoKeywords),
        },
        itineraryDays: hasItinerary
          ? formData.itineraryDays.map((day) => ({
              id: day.id,
              dayNumber: Math.max(1, toNumber(day.dayNumber, 1) ?? 1),
              title: day.title.trim() || undefined,
              description: day.description.trim() || undefined,
              meals: parseList(day.meals),
              activities: parseList(day.activities),
              stayInfo: day.stayInfo.trim() || undefined,
            }))
          : undefined,
        departures: hasDepartures
          ? formData.departures.map((departure) => ({
              id: departure.id,
              startDate: new Date(departure.startDate),
              endDate: departure.endDate ? new Date(departure.endDate) : undefined,
              seatsTotal: Math.max(
                1,
                toNumber(departure.seatsTotal, 1) ?? 1
              ),
              seatsAvailable:
                departure.seatsAvailable !== ''
                  ? Math.max(0, toNumber(departure.seatsAvailable, 0) ?? 0)
                  : undefined,
              priceAdult: parseDecimal(departure.priceAdult),
              priceChild: parseDecimal(departure.priceChild),
              priceInfant: parseDecimal(departure.priceInfant),
              status: departure.status,
              notes: departure.notes.trim() || undefined,
            }))
          : undefined,
        addons: hasAddons
          ? formData.addons.map((addon) => ({
              id: addon.id,
              name: addon.name.trim(),
              description: addon.description.trim() || undefined,
              price: parseDecimal(addon.price) ?? 0,
              perPerson: addon.perPerson,
              isActive: addon.isActive,
            }))
          : undefined,
        categoryIds: uniqueCategoryIds,
        promotionIds: uniquePromotionIds,
        media: hasMedia
          ? mediaSelections.map((item, index) => ({
              mediaId: item.mediaId,
              type: item.type || 'IMAGE',
              position: index,
            }))
          : undefined,
      }

      await onSubmit(payload)
      onCancel()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Không thể lưu tour'
      )
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = () =>
    setFormData((prev) => ({
      ...prev,
      isFeatured: !prev.isFeatured,
    }))

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => {
      if (prev.categoryIds.includes(categoryId)) {
        return prev
      }
      return {
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId],
      }
    })
    setCategorySelectValue('')
  }

  const handleCategoryRemove = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
    }))
  }

  const handlePromotionSelect = (promotionId: string) => {
    setFormData((prev) => {
      if (prev.promotionIds.includes(promotionId)) {
        return prev
      }
      return {
        ...prev,
        promotionIds: [...prev.promotionIds, promotionId],
      }
    })
    setPromotionSelectValue('')
  }

  const handlePromotionRemove = (promotionId: string) => {
    setFormData((prev) => ({
      ...prev,
      promotionIds: prev.promotionIds.filter((id) => id !== promotionId),
    }))
  }

  const resetNewPromotionForm = () => {
    setNewPromotionData(emptyPromotionForm())
    setCreatePromotionError(null)
  }

  const handlePromotionDialogChange = (open: boolean) => {
    setPromotionDialogOpen(open)
    if (!open) {
      resetNewPromotionForm()
      setCreatePromotionLoading(false)
    }
  }

  const handleCreatePromotion = async () => {
    const code = newPromotionData.code.trim()
    const name = newPromotionData.name.trim()
    const discountValue = Number(newPromotionData.discountValue)

    if (!code || !name) {
      setCreatePromotionError('Vui lòng nhập mã và tên khuyến mãi')
      return
    }

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setCreatePromotionError('Giá trị giảm không hợp lệ')
      return
    }

    const startIso = newPromotionData.startDate
      ? toIsoDate(newPromotionData.startDate)
      : undefined
    if (newPromotionData.startDate && !startIso) {
      setCreatePromotionError('Ngày bắt đầu không hợp lệ')
      return
    }

    const endIso = newPromotionData.endDate
      ? toIsoDate(newPromotionData.endDate, true)
      : undefined
    if (newPromotionData.endDate && !endIso) {
      setCreatePromotionError('Ngày kết thúc không hợp lệ')
      return
    }

    if (startIso && endIso && new Date(startIso) > new Date(endIso)) {
      setCreatePromotionError('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    setCreatePromotionLoading(true)
    setCreatePromotionError(null)

    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          name,
          discountType: newPromotionData.discountType,
          discountValue,
          description: newPromotionData.description.trim() || undefined,
          startDate: startIso,
          endDate: endIso,
          isActive: newPromotionData.isActive,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message =
          typeof payload?.error === 'string'
            ? payload.error
            : 'Không thể tạo khuyến mãi'
        throw new Error(message)
      }

      const created = (await response.json()) as PromotionApiResponse
      const normalized = normalizePromotion(created)

      setPromotionOptions((prev) =>
        dedupePromotions([normalized, ...prev])
      )
      setFormData((prev) => ({
        ...prev,
        promotionIds: prev.promotionIds.includes(normalized.id)
          ? prev.promotionIds
          : [...prev.promotionIds, normalized.id],
      }))
      handlePromotionDialogChange(false)
    } catch (createError) {
      setCreatePromotionError(
        createError instanceof Error
          ? createError.message
          : 'Không thể tạo khuyến mãi'
      )
    } finally {
      setCreatePromotionLoading(false)
    }
  }

  const difficultyOptions = useMemo(
    () =>
      Object.values(TourDifficulty).map((value) => ({
        value,
        label: value.charAt(0) + value.slice(1).toLowerCase(),
      })),
    []
  )

  const statusOptions = useMemo(
    () =>
      Object.values(TourStatus).map((value) => ({
        value,
        label: value.charAt(0) + value.slice(1).toLowerCase(),
      })),
    []
  )

  const departureStatusOptions = useMemo(
    () =>
      Object.values(DepartureStatus).map((value) => ({
        value,
        label: value
          .toLowerCase()
          .split('_')
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(' '),
      })),
    []
  )

  const handleMediaSelect = (media: MediaItem) => {
    setMediaSelections((prev) => {
      if (prev.some((item) => item.mediaId === media.id)) {
        return prev
      }
      const next = [
        ...prev,
        {
          mediaId: media.id,
          url: media.url,
          alt: media.alt ?? null,
          type: 'IMAGE',
          position: prev.length,
        },
      ]
      return next
    })

    setFormData((prev) => ({
      ...prev,
      heroImageUrl: prev.heroImageUrl || media.url,
    }))
  }

  const handleRemoveMedia = (index: number) => {
    const removed = mediaSelections[index]
    const next = mediaSelections
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, position: idx }))
    setMediaSelections(next)

    if (removed && formData.heroImageUrl === removed.url) {
      setFormData((prev) => ({
        ...prev,
        heroImageUrl: '',
      }))
    }
  }

  const handleMoveMedia = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= mediaSelections.length) {
      return
    }
    const next = [...mediaSelections]
    const [current] = next.splice(index, 1)
    next.splice(target, 0, current)
    setMediaSelections(next.map((item, idx) => ({ ...item, position: idx })))
  }

  const handleSetHeroImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      heroImageUrl: url,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin tour, lịch trình, chuyến khởi hành và giá bán.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <ScrollArea className="max-h-[70vh] pr-4">
        <div className="flex flex-col gap-8 pb-4">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề tour</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Khám phá miền Tây trong 3 ngày"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Đường dẫn (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: event.target.value,
                    }))
                  }
                  placeholder="tour-mien-tay-3-ngay"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary: event.target.value,
                  }))
                }
                placeholder="Mô tả ngắn hiển thị trên danh sách tour và thẻ meta."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="durationDays">Thời lượng (ngày)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min={1}
                  value={formData.durationDays}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      durationDays: event.target.value,
                    }))
                  }
                  required
                />
                {exceedsDurationDaysLimit ? (
                  <div className="flex items-center justify-between gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <span>
                      Thời lượng tối đa {formatLimit(TOUR_LIMITS.durationDays)} ngày.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        setFormData((prev) => {
                          const clampedDays = TOUR_LIMITS.durationDays
                          const currentNights = parseNumericString(
                            prev.durationNights
                          )
                          const adjustedNights =
                            currentNights !== undefined &&
                            currentNights > clampedDays
                              ? String(clampedDays)
                              : prev.durationNights
                          return {
                            ...prev,
                            durationDays: String(clampedDays),
                            durationNights: adjustedNights,
                          }
                        })
                      }
                    >
                      Giảm về {formatLimit(TOUR_LIMITS.durationDays)} ngày
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationNights">Thời lượng (đêm)</Label>
                <Input
                  id="durationNights"
                  type="number"
                  min={0}
                  value={formData.durationNights}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      durationNights: event.target.value,
                    }))
                  }
                />
                {durationNightsMessage ? (
                  <div className="flex items-center justify-between gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <span>{durationNightsMessage}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        setFormData((prev) => {
                          const dayNumeric =
                            parseNumericString(prev.durationDays) ??
                            durationNightsClampTarget
                          const clamped = Math.min(
                            durationNightsClampTarget,
                            dayNumeric
                          )
                          return {
                            ...prev,
                            durationNights: String(Math.max(0, clamped)),
                          }
                        })
                      }
                    >
                      Giảm về {formatLimit(durationNightsClampTarget)} đêm
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Độ khó</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: TourDifficulty) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Giá cơ bản</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      basePrice: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      currency: event.target.value,
                    }))
                  }
                  placeholder="VND"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Số khách tối đa</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min={1}
                  value={formData.maxGuests}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxGuests: event.target.value,
                    }))
                  }
                />
                {exceedsMaxGuestsLimit ? (
                  <div className="flex items-center justify-between gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <span>
                      Số khách tối đa {formatLimit(TOUR_LIMITS.maxGuests)}.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          maxGuests: String(TOUR_LIMITS.maxGuests),
                        }))
                      }
                    >
                      Giảm về {formatLimit(TOUR_LIMITS.maxGuests)} khách
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingPoint">Điểm tập trung</Label>
                <Input
                  id="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      meetingPoint: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImageUrl">Đường dẫn ảnh chính</Label>
                <Input
                  id="heroImageUrl"
                  value={formData.heroImageUrl}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      heroImageUrl: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="departureCity">Thành phố khởi hành</Label>
                <Input
                  id="departureCity"
                  value={formData.departureCity}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureCity: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalCity">Điểm đến</Label>
                <Input
                  id="arrivalCity"
                  value={formData.arrivalCity}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalCity: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TourStatus) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tour nổi bật</Label>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={toggleFeatured}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="isFeatured"
                    className="cursor-pointer font-normal"
                  >
                    Hiển thị tour này ở các khu vực nổi bật và trang chủ
                  </Label>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Điểm nổi bật & Nội dung</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Điểm nổi bật (mỗi dòng một ý)</Label>
                <Textarea
                  value={formData.highlights}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      highlights: event.target.value,
                    }))
                  }
                  placeholder="Homestay ven sông đích thực&#10;Du ngoạn ghe qua rừng dừa nước"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Bao gồm</Label>
                <Textarea
                  value={formData.inclusions}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      inclusions: event.target.value,
                    }))
                  }
                  placeholder="Bữa ăn&#10;Lưu trú&#10;Hướng dẫn viên địa phương"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Không bao gồm</Label>
                <Textarea
                  value={formData.exclusions}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      exclusions: event.target.value,
                    }))
                  }
                  placeholder="Vé máy bay&#10;Bảo hiểm du lịch"
                  rows={5}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lịch trình chi tiết</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    itineraryDays: [
                      ...prev.itineraryDays,
                      emptyItineraryDay(prev.itineraryDays.length + 1),
                    ],
                  }))
                }
              >
                Thêm ngày
              </Button>
            </div>

            {formData.itineraryDays.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Chưa có ngày nào trong lịch trình. Nhấn &quot;Thêm ngày&quot; để bắt đầu mô tả hành trình.
              </p>
            )}

            <div className="space-y-4">
              {formData.itineraryDays.map((day, index) => (
                <div
                  key={day.id ?? index}
                  className="rounded-md border p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <div className="space-y-2">
                        <Label>Ngày</Label>
                        <Input
                          type="number"
                          min={1}
                          value={day.dayNumber}
                          onChange={(event) =>
                            setFormData((prev) => {
                              const next = [...prev.itineraryDays]
                              next[index] = {
                                ...next[index],
                                dayNumber: event.target.value,
                              }
                              return { ...prev, itineraryDays: next }
                            })
                          }
                          className="w-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tiêu đề</Label>
                        <Input
                          value={day.title}
                          onChange={(event) =>
                            setFormData((prev) => {
                              const next = [...prev.itineraryDays]
                              next[index] = {
                                ...next[index],
                                title: event.target.value,
                              }
                              return { ...prev, itineraryDays: next }
                            })
                          }
                          placeholder="Chợ nổi & nghỉ tại homestay"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          itineraryDays: prev.itineraryDays.filter(
                            (_, dayIndex) => dayIndex !== index
                          ),
                        }))
                      }
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={day.description}
                        onChange={(event) =>
                          setFormData((prev) => {
                            const next = [...prev.itineraryDays]
                            next[index] = {
                              ...next[index],
                              description: event.target.value,
                            }
                            return { ...prev, itineraryDays: next }
                          })
                        }
                        placeholder="Buổi sáng tham quan chợ nổi Cái Răng..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thông tin lưu trú</Label>
                      <Textarea
                        value={day.stayInfo}
                        onChange={(event) =>
                          setFormData((prev) => {
                            const next = [...prev.itineraryDays]
                            next[index] = {
                              ...next[index],
                              stayInfo: event.target.value,
                            }
                            return { ...prev, itineraryDays: next }
                          })
                        }
                        placeholder="Nghỉ đêm tại homestay địa phương kèm bữa tối"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Bữa ăn (mỗi dòng một món)</Label>
                      <Textarea
                        value={day.meals}
                        onChange={(event) =>
                          setFormData((prev) => {
                            const next = [...prev.itineraryDays]
                            next[index] = {
                              ...next[index],
                              meals: event.target.value,
                            }
                            return { ...prev, itineraryDays: next }
                          })
                        }
                        placeholder="Bữa sáng&#10;Bữa trưa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hoạt động (mỗi dòng một hoạt động)</Label>
                      <Textarea
                        value={day.activities}
                        onChange={(event) =>
                          setFormData((prev) => {
                            const next = [...prev.itineraryDays]
                            next[index] = {
                              ...next[index],
                              activities: event.target.value,
                            }
                            return { ...prev, itineraryDays: next }
                          })
                        }
                        placeholder="Đi ghe&#10;Đạp xe qua vườn dừa"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lịch khởi hành & Giá bán</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    departures: [...prev.departures, emptyDeparture()],
                  }))
                }
              >
                Thêm lịch khởi hành
              </Button>
            </div>

            {formData.departures.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Thêm các đợt khởi hành kèm số chỗ và mức giá tương ứng.
              </p>
            )}

            <div className="space-y-4">
              {formData.departures.map((departure, index) => {
                const seatsTotalNumeric = parseNumericString(departure.seatsTotal)
                const seatsAvailableNumeric = parseNumericString(
                  departure.seatsAvailable
                )
                const seatsTotalShouldClamp =
                  seatsTotalNumeric !== undefined &&
                  seatsTotalNumeric > TOUR_LIMITS.seats
                const seatsAvailableLimit = Math.min(
                  TOUR_LIMITS.seats,
                  seatsTotalNumeric ?? TOUR_LIMITS.seats
                )
                const seatsAvailableShouldClamp =
                  seatsAvailableNumeric !== undefined &&
                  seatsAvailableNumeric > seatsAvailableLimit

                const updateDepartureField = (
                  field: keyof DepartureFormState,
                  value: string
                ) => {
                  setFormData((prev) => {
                    const next = [...prev.departures]
                    next[index] = {
                      ...next[index],
                      [field]: value,
                    }
                    return { ...prev, departures: next }
                  })
                }

                const applySeatsTotalLimit = () => {
                  const clampValue = Math.min(
                    TOUR_LIMITS.seats,
                    seatsTotalNumeric ?? TOUR_LIMITS.seats
                  )
                  setFormData((prev) => {
                    const next = [...prev.departures]
                    const current = next[index]
                    const currentAvailable = parseNumericString(
                      current.seatsAvailable
                    )
                    next[index] = {
                      ...current,
                      seatsTotal: String(clampValue),
                      seatsAvailable:
                        currentAvailable !== undefined &&
                        currentAvailable > clampValue
                          ? String(clampValue)
                          : current.seatsAvailable,
                    }
                    return { ...prev, departures: next }
                  })
                }

                const applySeatsAvailableLimit = () => {
                  const clampValue = Math.min(
                    TOUR_LIMITS.seats,
                    seatsTotalNumeric ?? TOUR_LIMITS.seats
                  )
                  setFormData((prev) => {
                    const next = [...prev.departures]
                    next[index] = {
                      ...next[index],
                      seatsAvailable: String(Math.max(0, clampValue)),
                    }
                    return { ...prev, departures: next }
                  })
                }

                return (
                  <div
                    key={departure.id ?? index}
                    className="rounded-md border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="grid flex-1 gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>Ngày bắt đầu</Label>
                          <Input
                            type="date"
                            value={departure.startDate}
                            onChange={(event) =>
                              updateDepartureField('startDate', event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ngày kết thúc</Label>
                          <Input
                            type="date"
                            value={departure.endDate}
                            onChange={(event) =>
                              updateDepartureField('endDate', event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tổng số chỗ</Label>
                          <Input
                            type="number"
                            min={1}
                            value={departure.seatsTotal}
                            onChange={(event) =>
                              updateDepartureField('seatsTotal', event.target.value)
                            }
                          />
                          {seatsTotalShouldClamp ? (
                            <div className="flex items-center justify-between gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                              <span>
                                Tổng số chỗ tối đa {formatLimit(TOUR_LIMITS.seats)}.
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={applySeatsTotalLimit}
                              >
                                Giảm về {formatLimit(TOUR_LIMITS.seats)} chỗ
                              </Button>
                            </div>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label>Số chỗ còn trống</Label>
                          <Input
                            type="number"
                            min={0}
                            value={departure.seatsAvailable}
                            onChange={(event) =>
                              updateDepartureField(
                                'seatsAvailable',
                                event.target.value
                              )
                            }
                          />
                          {seatsAvailableShouldClamp ? (
                            <div className="flex items-center justify-between gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                              <span>
                                Số chỗ còn trống tối đa {formatLimit(seatsAvailableLimit)}.
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={applySeatsAvailableLimit}
                              >
                                Giảm về {formatLimit(seatsAvailableLimit)} chỗ
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            departures: prev.departures.filter(
                              (_, depIndex) => depIndex !== index
                            ),
                          }))
                        }
                      >
                        Xóa
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Giá người lớn</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={departure.priceAdult}
                          onChange={(event) =>
                            updateDepartureField('priceAdult', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Giá trẻ em</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={departure.priceChild}
                          onChange={(event) =>
                            updateDepartureField('priceChild', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Giá em bé</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={departure.priceInfant}
                          onChange={(event) =>
                            updateDepartureField('priceInfant', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <Select
                          value={departure.status}
                          onValueChange={(value: DepartureStatus) =>
                            updateDepartureField('status', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            {departureStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ghi chú</Label>
                        <Textarea
                          value={departure.notes}
                          onChange={(event) =>
                            updateDepartureField('notes', event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Dịch vụ bổ sung tùy chọn</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    addons: [...prev.addons, emptyAddon()],
                  }))
                }
              >
                Thêm dịch vụ
              </Button>
            </div>

            {formData.addons.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Thêm các dịch vụ bán kèm như đưa đón, bữa ăn hoặc phòng cao cấp.
              </p>
            )}

            <div className="space-y-4">
              {formData.addons.map((addon, index) => (
                <div
                  key={addon.id ?? index}
                  className="rounded-md border p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid flex-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Tên dịch vụ</Label>
                        <Input
                          value={addon.name}
                          onChange={(event) =>
                            setFormData((prev) => {
                              const next = [...prev.addons]
                              next[index] = {
                                ...next[index],
                                name: event.target.value,
                              }
                              return { ...prev, addons: next }
                            })
                          }
                          placeholder="Đưa đón sân bay riêng"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Giá</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={addon.price}
                          onChange={(event) =>
                            setFormData((prev) => {
                              const next = [...prev.addons]
                              next[index] = {
                                ...next[index],
                                price: event.target.value,
                              }
                              return { ...prev, addons: next }
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          addons: prev.addons.filter(
                            (_, addonIndex) => addonIndex !== index
                          ),
                        }))
                      }
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={addon.description}
                        onChange={(event) =>
                          setFormData((prev) => {
                            const next = [...prev.addons]
                            next[index] = {
                              ...next[index],
                              description: event.target.value,
                            }
                            return { ...prev, addons: next }
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tùy chọn</Label>
                      <div className="flex flex-col gap-3 rounded-md border p-3">
                        <label className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={addon.perPerson}
                            onChange={(event) =>
                              setFormData((prev) => {
                                const next = [...prev.addons]
                                next[index] = {
                                  ...next[index],
                                  perPerson: event.target.checked,
                                }
                                return { ...prev, addons: next }
                              })
                            }
                            className="h-4 w-4"
                          />
                          Tính theo đầu người
                        </label>
                        <label className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={addon.isActive}
                            onChange={(event) =>
                              setFormData((prev) => {
                                const next = [...prev.addons]
                                next[index] = {
                                  ...next[index],
                                  isActive: event.target.checked,
                                }
                                return { ...prev, addons: next }
                              })
                            }
                            className="h-4 w-4"
                          />
                          Cho phép khách chọn
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Hình ảnh & Media</h3>
                <p className="text-sm text-muted-foreground">
                  Chọn hình ảnh từ thư viện để hiển thị cho tour. Bạn có thể sắp xếp thứ tự và đặt ảnh đại diện.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => setMediaDialogOpen(true)}>
                Chọn từ thư viện
              </Button>
            </div>

            {!hasMedia ? (
              <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Chưa có hình ảnh nào. Nhấn “Chọn từ thư viện” để thêm.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {mediaSelections.map((item, index) => {
                  const isHero = formData.heroImageUrl && formData.heroImageUrl === item.url
                  return (
                    <div
                      key={item.mediaId}
                      className="overflow-hidden rounded-md border border-border bg-background/60 shadow-sm"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={item.url}
                          alt={item.alt ?? `Hình ảnh ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="space-y-3 p-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">Vị trí #{index + 1}</span>
                          {isHero ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              <Star className="h-3 w-3 fill-primary" />
                              Ảnh hero
                            </span>
                          ) : null}
                        </div>
                        {item.alt ? (
                          <p className="text-muted-foreground line-clamp-2">{item.alt}</p>
                        ) : (
                          <p className="text-muted-foreground italic">Chưa có alt text</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveMedia(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="mr-2 h-3.5 w-3.5" />
                            Lên
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveMedia(index, 'down')}
                            disabled={index === mediaSelections.length - 1}
                          >
                            <ArrowDown className="mr-2 h-3.5 w-3.5" />
                            Xuống
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetHeroImage(item.url)}
                          >
                            <Star className="mr-2 h-3.5 w-3.5" />
                            Đặt làm hero
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMedia(index)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">SEO & Khuyến mãi</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seoTitle: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seoDescription">Mô tả SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seoDescription: event.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Từ khóa SEO (mỗi dòng một từ khóa)</Label>
                <Textarea
                  value={formData.seoKeywords}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seoKeywords: event.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Danh mục tour</Label>
                  <div className="space-y-3 rounded-lg border border-dashed border-border/80 p-3">
                    <Select
                      value={categorySelectValue || undefined}
                      onValueChange={(value) => handleCategorySelect(value)}
                      disabled={
                        categoryLoading || allCategoryOptions.length === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            categoryLoading
                              ? 'Đang tải danh mục tour...'
                              : 'Chọn danh mục liên quan'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategoryOptions.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categoryError ? (
                      <p className="text-sm text-destructive">{categoryError}</p>
                    ) : null}
                    {!categoryLoading && allCategoryOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Chưa có danh mục nào. Tạo tại trang quản lý danh mục rồi quay lại chọn.
                      </p>
                    ) : null}
                    {categoryLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    ) : null}
                    {selectedCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1 text-xs"
                          >
                            <span>{category.name}</span>
                            <button
                              type="button"
                              onClick={() => handleCategoryRemove(category.id)}
                              className="text-muted-foreground transition hover:text-foreground"
                              aria-label={`Gỡ ${category.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Chọn một hoặc nhiều danh mục để tổ chức tour theo chủ đề.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chương trình khuyến mãi</Label>
                  <div className="space-y-3 rounded-lg border border-dashed border-border/80 p-3">
                    <Select
                      value={promotionSelectValue || undefined}
                      onValueChange={handlePromotionSelect}
                      disabled={
                        promotionLoading || allPromotionOptions.length === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            promotionLoading
                              ? 'Đang tải danh sách khuyến mãi...'
                              : 'Chọn khuyến mãi từ thư viện'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {allPromotionOptions.map((promotion) => (
                          <SelectItem key={promotion.id} value={promotion.id}>
                            {promotion.code} — {promotion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {promotionError ? (
                      <p className="text-sm text-destructive">{promotionError}</p>
                    ) : null}
                    {!promotionLoading && allPromotionOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Chưa có khuyến mãi nào trong thư viện. Hãy tạo mới để gắn với tour.
                      </p>
                    ) : null}
                    {promotionLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    ) : null}
                    {selectedPromotions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPromotions.map((promotion) => (
                          <Badge
                            key={promotion.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1 text-xs"
                            title={`${promotion.code} • ${promotion.name}`}
                          >
                            <span className="font-medium">{promotion.code}</span>
                            <span className="hidden text-[10px] text-muted-foreground sm:inline">
                              {promotion.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handlePromotionRemove(promotion.id)}
                              className="text-muted-foreground transition hover:text-foreground"
                              aria-label={`Gỡ ${promotion.code}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Chưa có khuyến mãi nào được gắn với tour.
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromotionDialogChange(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tạo khuyến mãi mới
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      <Dialog
        open={promotionDialogOpen}
        onOpenChange={handlePromotionDialogChange}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
            <DialogDescription>
              Tạo chương trình khuyến mãi và gắn trực tiếp cho tour này.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promotionCode">Mã khuyến mãi</Label>
                <Input
                  id="promotionCode"
                  value={newPromotionData.code}
                  onChange={(event) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      code: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="UUDAI2025"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionName">Tên chương trình</Label>
                <Input
                  id="promotionName"
                  value={newPromotionData.name}
                  onChange={(event) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ưu đãi mùa hè"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại giảm giá</Label>
                <Select
                  value={newPromotionData.discountType}
                  onValueChange={(value) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      discountType: value as DiscountType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại giảm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DiscountType.PERCENTAGE}>
                      Giảm theo %
                    </SelectItem>
                    <SelectItem value={DiscountType.AMOUNT}>
                      Giảm theo số tiền
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionValue">
                  Giá trị giảm{' '}
                  {newPromotionData.discountType === DiscountType.PERCENTAGE
                    ? '(%)'
                    : '(VNĐ)'}
                </Label>
                <Input
                  id="promotionValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPromotionData.discountValue}
                  onChange={(event) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      discountValue: event.target.value,
                    }))
                  }
                  placeholder={
                    newPromotionData.discountType === DiscountType.PERCENTAGE
                      ? '10'
                      : '500000'
                  }
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promotionStart">Ngày bắt đầu</Label>
                <Input
                  id="promotionStart"
                  type="date"
                  value={newPromotionData.startDate}
                  onChange={(event) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionEnd">Ngày kết thúc</Label>
                <Input
                  id="promotionEnd"
                  type="date"
                  value={newPromotionData.endDate}
                  onChange={(event) =>
                    setNewPromotionData((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionDescription">Mô tả</Label>
              <Textarea
                id="promotionDescription"
                value={newPromotionData.description}
                onChange={(event) =>
                  setNewPromotionData((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Thông tin mô tả ngắn gọn về chương trình khuyến mãi..."
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={newPromotionData.isActive ? 'active' : 'inactive'}
                onValueChange={(value) =>
                  setNewPromotionData((prev) => ({
                    ...prev,
                    isActive: value === 'active',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang áp dụng</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createPromotionError ? (
              <p className="text-sm text-destructive">
                {createPromotionError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePromotionDialogChange(false)}
              disabled={createPromotionLoading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleCreatePromotion}
              disabled={createPromotionLoading}
            >
              {createPromotionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo khuyến mãi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
        onSelect={handleMediaSelect}
      />

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Hủy
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo tour' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  )
}
