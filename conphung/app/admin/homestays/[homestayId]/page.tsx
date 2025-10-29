'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Compass,
  ExternalLink,
  BedDouble,
  Loader2,
  Image as ImageIcon,
  MapPin,
  Plus,
  Sparkles,
  Target,
  Thermometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { MediaPickerDialog } from '@/components/media/media-picker-dialog';
import type { MediaItem } from '@/components/media/types';

type HomestayEditorRoomStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

type RoomDraft = {
  clientId: string;
  id: string | null;
  name: string;
  slug: string | null;
  maxGuests: number;
  basePrice: number;
  status: HomestayEditorRoomStatus;
};

type AvailabilityBlock = {
  clientId: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type HomestayFormState = {
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  type: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  category:
    | 'APARTMENT'
    | 'HOUSE'
    | 'VILLA'
    | 'CONDO'
    | 'TOWNHOUSE'
    | 'STUDIO'
    | 'LOFT'
    | 'BUNGALOW'
    | 'CABIN'
    | 'TREEHOUSE'
    | 'BOAT'
    | 'CAMPER'
    | 'TENT'
    | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  weekendPrice: string;
  currency: string;
  minNights?: number;
  maxNights?: number;
  checkInTime?: string;
  checkOutTime?: string;
  cleaningFee?: number;
  securityDeposit?: number;
  cancellationPolicy?: string;
  isInstantBook: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isSuperhost?: boolean;
  heroImageUrl: string;
  galleryImageUrls: string[];
  amenities: string[];
  houseRules: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};

type HomestayEditorData = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  summary?: string | null;
  description?: string | null;
  status?: 'DRAFT' | 'PUBLISHED';
  type?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  category?: HomestayFormState['category'];
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  basePrice?: string | null;
  currency?: string | null;
  minNights?: number | null;
  maxNights?: number | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  cleaningFee?: string | null;
  securityDeposit?: string | null;
  cancellationPolicy?: string | null;
  isInstantBook?: boolean | null;
  isFeatured?: boolean | null;
  isVerified?: boolean | null;
  isSuperhost?: boolean | null;
  heroImageUrl?: string | null;
  galleryImageUrls?: string[] | any;
  amenities?: string[];
  houseRules?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  media?: { url: string }[];
  availability?: Array<{
    id: string;
    roomId: string;
    date: string;
    totalUnits: number;
    reservedUnits: number;
    status: string;
    source?: string | null;
    metadata?: any;
  }>;
  rooms?: {
    id: string;
    name: string;
    slug: string;
    maxGuests?: number | null;
    basePrice?: string | null;
    currency?: string | null;
    status: HomestayEditorRoomStatus;
  }[];
};

type HomestayEditorProps = {
  mode: 'create' | 'edit';
  homestayId?: string;
  initialData?: HomestayEditorData | null;
  redirectTo?: string;
};


const QUICK_AMENITIES = [
  'Wifi tốc độ cao',
  'Máy điều hòa',
  'Bể bơi',
  'Bãi đỗ xe riêng',
  'Bếp đầy đủ dụng cụ',
  'Máy giặt',
  'View biển',
  'BBQ ngoài trời',
];

const QUICK_RULES = [
  'Không hút thuốc',
  'Không mang thú cưng',
  'Không tổ chức tiệc',
  'Yên lặng sau 22:00',
  'Check-in sau 14:00',
  'Check-out trước 12:00',
];

const CATEGORY_OPTIONS: HomestayFormState['category'][] = [
  'APARTMENT',
  'HOUSE',
  'VILLA',
  'CONDO',
  'TOWNHOUSE',
  'STUDIO',
  'LOFT',
  'BUNGALOW',
  'CABIN',
  'TREEHOUSE',
  'BOAT',
  'CAMPER',
  'TENT',
  'OTHER',
];

const TYPE_OPTIONS: HomestayFormState['type'][] = [
  'ENTIRE_PLACE',
  'PRIVATE_ROOM',
  'SHARED_ROOM',
];

const STATUS_OPTIONS: HomestayFormState['status'][] = ['DRAFT', 'PUBLISHED'];

const ROOM_STATUS_OPTIONS: HomestayEditorRoomStatus[] = ['ACTIVE', 'INACTIVE', 'MAINTENANCE'];

const STORAGE_KEY_CREATE = 'admin.homestays.new.draft';
const STORAGE_KEY_EDIT_PREFIX = 'admin.homestays.edit.';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 180);

const formatNumber = (value: number | string) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return '';
  }
  return new Intl.NumberFormat('vi-VN').format(numberValue);
};

const formatCategoryLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const formatSavedTime = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return '';
  }
};

const buildInitialFormState = (initial?: HomestayEditorData | null): HomestayFormState => {
  const galleryUrls = Array.isArray(initial?.galleryImageUrls) 
    ? initial.galleryImageUrls 
    : (initial?.galleryImageUrls && typeof initial.galleryImageUrls === 'object')
    ? Object.values(initial.galleryImageUrls).filter(v => typeof v === 'string')
    : [];
  
  return {
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    subtitle: initial?.subtitle ?? undefined,
    summary: initial?.summary ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'DRAFT',
    type: initial?.type ?? 'ENTIRE_PLACE',
    category: initial?.category ?? 'OTHER',
    addressLine1: initial?.addressLine1 ?? '',
    addressLine2: initial?.addressLine2 ?? undefined,
    city: initial?.city ?? '',
    state: initial?.state ?? undefined,
    country: initial?.country ?? '',
    postalCode: initial?.postalCode ?? undefined,
    latitude: initial?.latitude ? Number(initial.latitude) : undefined,
    longitude: initial?.longitude ? Number(initial.longitude) : undefined,
    maxGuests: initial?.maxGuests ?? 2,
    bedrooms: initial?.bedrooms ?? 1,
    bathrooms: initial?.bathrooms ?? 1,
    basePrice: initial?.basePrice ? Number(initial.basePrice) : 1200000,
    weekendPrice: '',
    minNights: initial?.minNights ?? undefined,
    maxNights: initial?.maxNights ?? undefined,
    checkInTime: initial?.checkInTime ?? undefined,
    checkOutTime: initial?.checkOutTime ?? undefined,
    cleaningFee: initial?.cleaningFee ? Number(initial.cleaningFee) : undefined,
    securityDeposit: initial?.securityDeposit ? Number(initial.securityDeposit) : undefined,
    cancellationPolicy: initial?.cancellationPolicy ?? undefined,
    currency: initial?.currency ?? 'VND',
    isInstantBook: initial?.isInstantBook ?? false,
    isFeatured: initial?.isFeatured ?? false,
    isVerified: initial?.isVerified ?? false,
    isSuperhost: initial?.isSuperhost ?? false,
    heroImageUrl: initial?.heroImageUrl ?? '',
    galleryImageUrls: galleryUrls,
    amenities: Array.isArray(initial?.amenities) ? initial.amenities : [],
    houseRules: Array.isArray(initial?.houseRules) ? initial.houseRules : [],
    seoTitle: initial?.seoTitle ?? '',
    seoDescription: initial?.seoDescription ?? '',
    seoKeywords: Array.isArray(initial?.seoKeywords) ? initial.seoKeywords : [],
  };
};

const buildInitialRooms = (initial?: HomestayEditorData | null): RoomDraft[] => {
  if (!initial?.rooms || initial.rooms.length === 0) {
    return [];
  }
  return initial.rooms.map((room) => ({
    clientId: room.id,
    id: room.id,
    name: room.name,
    slug: room.slug,
    maxGuests: room.maxGuests ?? 2,
    basePrice: room.basePrice ? Number(room.basePrice) : 500000,
    status: room.status,
  }));
};

const buildInitialAvailability = (initial?: HomestayEditorData | null): AvailabilityBlock[] => {
  if (!initial?.availability || initial.availability.length === 0) {
    return [];
  }
  
  // Group availability by date ranges (consecutive dates with same status)
  const blocks: AvailabilityBlock[] = [];
  const sortedAvail = [...initial.availability].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let currentBlock: { startDate: string; endDate: string; notes: string } | null = null;
  
  for (const avail of sortedAvail) {
    if (avail.status === 'BLOCKED') {
      const dateStr = avail.date.split('T')[0];
      const notes = avail.source || '';
      
      if (!currentBlock) {
        currentBlock = { startDate: dateStr, endDate: dateStr, notes };
      } else if (
        new Date(dateStr).getTime() - new Date(currentBlock.endDate).getTime() === 86400000 &&
        currentBlock.notes === notes
      ) {
        // Consecutive date with same notes - extend block
        currentBlock.endDate = dateStr;
      } else {
        // New block
        blocks.push({
          clientId: generateId(),
          startDate: currentBlock.startDate,
          endDate: currentBlock.endDate,
          notes: currentBlock.notes,
        });
        currentBlock = { startDate: dateStr, endDate: dateStr, notes };
      }
    }
  }
  
  // Add last block
  if (currentBlock) {
    blocks.push({
      clientId: generateId(),
      startDate: currentBlock.startDate,
      endDate: currentBlock.endDate,
      notes: currentBlock.notes,
    });
  }
  
  return blocks;
};

function HomestayEditor({
  mode,
  homestayId,
  initialData,
  redirectTo = '/admin/homestays',
}: HomestayEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [amenityInput, setAmenityInput] = useState('');
  const [houseRuleInput, setHouseRuleInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);
  const [rooms, setRooms] = useState<RoomDraft[]>(() => buildInitialRooms(initialData));
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>(
    () => buildInitialAvailability(initialData),
  );
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'conflict'>('idle');
  const [slugMessage, setSlugMessage] = useState<string>('');
  const [autoSaveBadge, setAutoSaveBadge] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [roomDraft, setRoomDraft] = useState<RoomDraft>({
    clientId: generateId(),
    id: null,
    name: '',
    slug: null,
    maxGuests: 2,
    basePrice: 500000,
    status: 'ACTIVE',
  });
  const [availabilityDraft, setAvailabilityDraft] = useState<{
    clientId: string;
    startDate: string;
    endDate: string;
    notes: string;
  }>({ clientId: generateId(), startDate: '', endDate: '', notes: '' });

  const [form, setForm] = useState<HomestayFormState>(() => buildInitialFormState(initialData));

  const draftLoadedRef = useRef(false);
  const autosaveClearTimeoutRef = useRef<number | undefined>(undefined);
  const serverDataAppliedRef = useRef(false);
  const storageKey =
    mode === 'create'
      ? STORAGE_KEY_CREATE
      : `${STORAGE_KEY_EDIT_PREFIX}${homestayId ?? 'unknown'}`;

  useEffect(() => {
    if (mode === 'edit' && initialData && !serverDataAppliedRef.current) {
      setForm(buildInitialFormState(initialData));
      setRooms(buildInitialRooms(initialData));
      setSlugTouched(Boolean(initialData.slug));
      serverDataAppliedRef.current = true;
    }
  }, [initialData, mode]);

  const title = form.title;

  useEffect(() => {
    if (typeof window === 'undefined' || draftLoadedRef.current) {
      return;
    }
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          form?: Partial<HomestayFormState>;
          rooms?: RoomDraft[];
          availabilityBlocks?: AvailabilityBlock[];
          savedAt?: string;
        };
        if (parsed.form) {
          setForm((prev) => ({ ...prev, ...parsed.form }));
          if (parsed.form.slug) {
            setSlugTouched(true);
          }
        }
        if (parsed.rooms) {
          setRooms(
            parsed.rooms.map((room: any) => ({
              clientId: room.clientId ?? room.id ?? generateId(),
              id: room.id ?? null,
              name: room.name ?? '',
              slug: room.slug ?? null,
              maxGuests: Number.isFinite(room.maxGuests) ? room.maxGuests : 1,
              basePrice: Number.isFinite(room.basePrice) ? room.basePrice : 0,
              status: (room.status ?? 'ACTIVE') as HomestayEditorRoomStatus,
            })),
          );
        }
        if (parsed.availabilityBlocks) {
          setAvailabilityBlocks(
            parsed.availabilityBlocks.map((block: any) => ({
              clientId: block.clientId ?? generateId(),
              startDate: block.startDate ?? '',
              endDate: block.endDate ?? '',
              notes: block.notes ?? '',
            })),
          );
        }
        if (parsed.savedAt) {
          const label = formatSavedTime(parsed.savedAt);
          if (label) {
            setAutoSaveBadge(`Khôi phục bản nháp lúc ${label}`);
            window.setTimeout(() => setAutoSaveBadge(null), 3500);
          }
        }
      } catch (error) {
        console.warn('Không thể đọc bản nháp homestay:', error);
      }
    }
    draftLoadedRef.current = true;
  }, [storageKey]);

  useEffect(() => {
    // In edit mode, don't auto-generate slug from title
    // User must manually change slug if they want to
    if (mode === 'edit') {
      return;
    }
    
    if (slugTouched) {
      return;
    }
    
    setForm((prev) => {
      if (!title) {
        return prev.slug ? { ...prev, slug: '' } : prev;
      }
      const nextSlug = slugify(title);
      if (!nextSlug || prev.slug === nextSlug) {
        return prev;
      }
      return { ...prev, slug: nextSlug };
    });
  }, [title, slugTouched, mode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !draftLoadedRef.current) {
      return;
    }
    const handler = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      const payload = {
        form,
        rooms,
        availabilityBlocks,
        savedAt,
      };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
        const label = formatSavedTime(savedAt);
        if (autosaveClearTimeoutRef.current) {
          window.clearTimeout(autosaveClearTimeoutRef.current);
        }
        setAutoSaveBadge(label ? `Đã lưu lúc ${label}` : 'Đã lưu bản nháp');
        autosaveClearTimeoutRef.current = window.setTimeout(
          () => setAutoSaveBadge(null),
          2500,
        );
      } catch (error) {
        console.warn('Không thể lưu bản nháp homestay:', error);
      }
    }, 800);

    return () => {
      window.clearTimeout(handler);
    };
  }, [form, rooms, availabilityBlocks, storageKey]);

  useEffect(() => () => {
    if (typeof window === 'undefined') {
      return;
    }
    if (autosaveClearTimeoutRef.current) {
      window.clearTimeout(autosaveClearTimeoutRef.current);
    }
  }, []);

  const handleFieldChange = useCallback(
    <K extends keyof HomestayFormState>(key: K, value: HomestayFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleNumericChange = (key: keyof HomestayFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsed = Number(value);
    handleFieldChange(key as any, Number.isFinite(parsed) ? parsed : (0 as any));
  };

  useEffect(() => {
    if (!form.slug.trim()) {
      setSlugStatus('idle');
      setSlugMessage('');
      return;
    }
    
    // In edit mode, if slug hasn't changed, skip validation
    if (mode === 'edit' && initialData?.slug === form.slug.trim()) {
      setSlugStatus('idle');
      setSlugMessage('');
      return;
    }
    
    const controller = new AbortController();
    setSlugStatus('checking');
    setSlugMessage('Đang kiểm tra tính duy nhất...');

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/homestays?search=${encodeURIComponent(form.slug)}&limit=5`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Không thể kiểm tra slug');
        }
        const data = await response.json();
        const results = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        // In edit mode, exclude current homestay from conflict check
        const conflict = results.some((item: any) => 
          item?.slug === form.slug && item?.id !== homestayId
        );
        if (conflict) {
          setSlugStatus('conflict');
          setSlugMessage('Slug đã tồn tại. Vui lòng chọn slug khác.');
        } else {
          setSlugStatus('available');
          setSlugMessage('Slug khả dụng.');
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setSlugStatus('idle');
        setSlugMessage('');
      }
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [form.slug, mode, initialData?.slug, homestayId]);

  const handleAddToList = (
    key: 'amenities' | 'houseRules' | 'galleryImageUrls' | 'seoKeywords',
    inputValue: string,
  ) => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }
    setForm((prev) => {
      if (prev[key].includes(trimmed)) {
        return prev;
      }
      return {
        ...prev,
        [key]: [...prev[key], trimmed],
      };
    });
  };

  const handleRemoveFromList = (
    key: 'amenities' | 'houseRules' | 'galleryImageUrls' | 'seoKeywords',
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));
  };

  const handleHeroSelect = (media: MediaItem | MediaItem[]) => {
    // Hero image is always single selection
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    if (selectedMedia?.url) {
      handleFieldChange('heroImageUrl', selectedMedia.url);
    }
  };

  const handleGallerySelect = (media: MediaItem | MediaItem[]) => {
    // Gallery supports multiple selection
    const mediaArray = Array.isArray(media) ? media : [media];
    const validUrls = mediaArray.filter(m => m?.url).map(m => m.url);
    
    if (validUrls.length === 0) {
      return;
    }
    
    setForm((prev) => ({
      ...prev,
      galleryImageUrls: [...prev.galleryImageUrls, ...validUrls],
    }));
  };

  const resetRoomDraft = () =>
    setRoomDraft({
      clientId: generateId(),
      id: null,
      name: '',
      slug: null,
      maxGuests: 2,
      basePrice: 500000,
      status: 'ACTIVE',
    });

  const handleAddRoom = () => {
    if (!roomDraft.name.trim()) {
      return;
    }
    const newRoom: RoomDraft = {
      clientId: roomDraft.clientId,
      id: null,
      name: roomDraft.name.trim(),
      slug: slugify(roomDraft.name.trim()),
      maxGuests: Number.isFinite(roomDraft.maxGuests) ? roomDraft.maxGuests : 1,
      basePrice: Number.isFinite(roomDraft.basePrice) ? roomDraft.basePrice : 0,
      status: roomDraft.status,
    };
    setRooms((prev) => [...prev, newRoom]);
    resetRoomDraft();
  };

  const handleRoomFieldChange = (
    clientId: string,
    key: 'name' | 'maxGuests' | 'basePrice',
    value: string | number,
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.clientId === clientId
          ? {
              ...room,
              [key]: key === 'name' ? String(value) : Number(value),
              ...(key === 'name' && room.id === null
                ? { slug: slugify(String(value)) }
                : {}),
            }
          : room,
      ),
    );
  };

  const handleRoomStatusChange = (clientId: string, status: HomestayEditorRoomStatus) => {
    setRooms((prev) => prev.map((room) => (room.clientId === clientId ? { ...room, status } : room)));
  };

  const handleRemoveRoom = (clientId: string) => {
    setRooms((prev) => prev.filter((room) => room.clientId !== clientId));
  };

  const handleAddAvailability = () => {
    if (!availabilityDraft.startDate || !availabilityDraft.endDate) {
      return;
    }
    if (availabilityDraft.startDate > availabilityDraft.endDate) {
      return;
    }
    const block: AvailabilityBlock = {
      clientId: availabilityDraft.clientId,
      startDate: availabilityDraft.startDate,
      endDate: availabilityDraft.endDate,
      notes: availabilityDraft.notes.trim(),
    };
    setAvailabilityBlocks((prev) => [...prev, block]);
    setAvailabilityDraft({ clientId: generateId(), startDate: '', endDate: '', notes: '' });
  };

  const handleRemoveAvailability = (clientId: string) => {
    setAvailabilityBlocks((prev) => prev.filter((block) => block.clientId !== clientId));
  };

  const requiredFields = useMemo(
    () => [
      form.title,
      form.slug,
      form.summary,
      form.basePrice,
      form.maxGuests,
      form.heroImageUrl,
    ],
    [form.basePrice, form.heroImageUrl, form.maxGuests, form.slug, form.summary, form.title],
  );

  const completion = useMemo(() => {
    const filled = requiredFields.filter((value) => {
      if (typeof value === 'number') {
        return Number.isFinite(value) && value > 0;
      }
      return Boolean(value && String(value).trim());
    }).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [requiredFields]);

  const stepProgress = useMemo(() => {
    const steps = [
      {
        label: 'Thông tin',
        complete: Boolean(form.title && form.slug && form.summary),
      },
      {
        label: 'Vị trí',
        complete: Boolean(form.maxGuests && (form.city || form.country)),
      },
      {
        label: 'Giá & lịch',
        complete: Boolean(form.basePrice && form.heroImageUrl),
      },
      {
        label: 'Tiện ích & media',
        complete: form.amenities.length > 0 && form.galleryImageUrls.length > 0,
      },
      {
        label: 'SEO',
        complete: Boolean(form.seoTitle || form.seoDescription || form.seoKeywords.length),
      },
    ];
    const completed = steps.filter((step) => step.complete).length;
    const current = steps.findIndex((step) => !step.complete);
    return {
      steps,
      completed,
      activeIndex: current === -1 ? steps.length - 1 : current,
    };
  }, [form]);

  const summaryStats = useMemo(
    () => [
      {
        label: 'Tiện ích',
        value: form.amenities.length,
      },
      {
        label: 'Nội quy',
        value: form.houseRules.length,
      },
      {
        label: 'Ảnh gallery',
        value: form.galleryImageUrls.length,
      },
      {
        label: 'Phòng',
        value: rooms.length,
      },
      {
        label: 'Khoảng chặn lịch',
        value: availabilityBlocks.length,
      },
    ],
    [
      form.amenities.length,
      form.galleryImageUrls.length,
      form.houseRules.length,
      rooms.length,
      availabilityBlocks.length,
    ],
  );

  const previewUrl = useMemo(() => (form.slug ? `/homestays/${form.slug}` : ''), [form.slug]);
  const publishDisabled =
    saving || slugStatus === 'conflict' || !form.title.trim() || !form.slug.trim() || !form.heroImageUrl.trim();
  const draftDisabled = saving;

  const handlePreview = () => {
    if (!previewUrl) {
      setError('Vui lòng nhập slug trước khi xem trước.');
      return;
    }
    window.open(previewUrl, '_blank', 'noopener');
  };

  const handleDuplicate = () => {
    if (!form.title.trim()) {
      return;
    }
    const nextSlug = slugify(`${form.slug || slugify(form.title)}-copy`);
    handleFieldChange('slug', nextSlug);
    setSlugTouched(true);
  };

  const handlePricingShortcut = () => {
    if (typeof window !== 'undefined') {
      window.alert('Sau khi tạo homestay, bạn có thể thiết lập quy tắc giá động trong trang chi tiết.');
    }
  };

  const handleSubmit = async (targetStatus: 'DRAFT' | 'PUBLISHED') => {
    setSaving(true);
    setError(null);
    handleFieldChange('status', targetStatus);

    // In edit mode, only send slug if it's explicitly set
    // In create mode, generate from title if not set
    const slugValue = mode === 'edit' 
      ? (form.slug?.trim() || undefined)  // Edit: only if explicitly set
      : (form.slug || slugify(form.title)); // Create: auto-generate
    
    const weekendPriceValue = Number(form.weekendPrice);

    const payload = {
      title: form.title.trim(),
      slug: slugValue,
      subtitle: form.subtitle?.trim() || undefined,
      summary: form.summary.trim() || undefined,
      description: form.description.trim() || undefined,
      status: targetStatus,
      type: form.type,
      category: form.category,
      addressLine1: form.addressLine1.trim() || undefined,
      addressLine2: form.addressLine2?.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state?.trim() || undefined,
      country: form.country.trim() || undefined,
      postalCode: form.postalCode?.trim() || undefined,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
      maxGuests: Number.isFinite(form.maxGuests) ? form.maxGuests : undefined,
      bedrooms: Number.isFinite(form.bedrooms) ? form.bedrooms : undefined,
      bathrooms: Number.isFinite(form.bathrooms) ? form.bathrooms : undefined,
      basePrice: Number.isFinite(form.basePrice) ? form.basePrice : undefined,
      weekendPrice: Number.isFinite(weekendPriceValue) && weekendPriceValue > 0 ? weekendPriceValue : undefined,
      currency: form.currency.trim() || undefined,
      minNights: form.minNights || undefined,
      maxNights: form.maxNights || undefined,
      checkInTime: form.checkInTime?.trim() || undefined,
      checkOutTime: form.checkOutTime?.trim() || undefined,
      cleaningFee: form.cleaningFee || undefined,
      securityDeposit: form.securityDeposit || undefined,
      cancellationPolicy: form.cancellationPolicy || undefined,
      isInstantBook: form.isInstantBook,
      isFeatured: form.isFeatured,
      isVerified: form.isVerified,
      isSuperhost: form.isSuperhost || false,
      heroImageUrl: form.heroImageUrl.trim() || undefined,
      galleryImageUrls: form.galleryImageUrls,
      amenities: form.amenities,
      houseRules: form.houseRules,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      seoKeywords: form.seoKeywords,
      rooms:
        rooms.length > 0
          ? rooms.map((room, index) => ({
              name: room.name,
              slug: slugify(`${room.name}-${index + 1}`),
              maxGuests: room.maxGuests,
              basePrice: room.basePrice,
              status: room.status,
            }))
          : undefined,
      availabilityBlocks:
        availabilityBlocks.length > 0
          ? availabilityBlocks.map((block) => ({
              startDate: block.startDate,
              endDate: block.endDate,
              notes: block.notes || '',
            }))
          : undefined,
    };

    // 🔍 DEBUG: Check payload before sending
    console.log('🔍 PAYLOAD DEBUG:', {
      hasAvailabilityBlocks: !!payload.availabilityBlocks,
      blockCount: payload.availabilityBlocks?.length || 0,
      blocks: payload.availabilityBlocks,
      availabilityBlocksState: availabilityBlocks,
    });

    try {
      // Determine API endpoint and method based on mode
      const url = mode === 'edit' && homestayId 
        ? `/api/homestays/${homestayId}`
        : '/api/homestays';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        const action = mode === 'edit' ? 'cập nhật' : 'tạo';
        throw new Error(json.error || `Không thể ${action} homestay`);
      }
      
      // Success! Redirect to list page
      const result = await response.json();
      const action = mode === 'edit' ? 'Updated' : 'Created';
      console.log(`✅ ${action} homestay:`, result.id);
      
      // Clear localStorage draft
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
      
      // Force reload with timestamp to bypass cache
      const timestamp = Date.now();
      router.replace(`${redirectTo}?_t=${timestamp}`);
      
      // Small delay to ensure navigation completes
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (submitError) {
      const action = mode === 'edit' ? 'cập nhật' : 'tạo';
      setError(submitError instanceof Error ? submitError.message : `Lỗi ${action} dữ liệu`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-4 pb-16 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Homestay · {mode === 'edit' ? 'Chỉnh sửa' : 'Tạo mới'}
              </p>
              <h1 className="text-2xl font-semibold">
                {mode === 'edit' ? `Chỉnh sửa: ${form.title || 'Homestay'}` : 'Thiết lập homestay mới'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit' 
                  ? 'Cập nhật thông tin, hình ảnh, tiện ích và SEO cho homestay.'
                  : 'Điền thông tin cơ bản, hình ảnh, tiện ích và SEO để sẵn sàng xuất bản.'
                }
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {stepProgress.steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = index === stepProgress.activeIndex;
                const isComplete = step.complete;
                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                      isComplete
                        ? 'bg-emerald-50 text-emerald-700'
                        : isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                      {stepNumber}
                    </span>
                    <span className="text-xs font-medium">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 lg:items-end">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {autoSaveBadge && <Badge variant="secondary">{autoSaveBadge}</Badge>}
              <Sheet open={showHelp} onOpenChange={setShowHelp}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Xem ví dụ
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Checklist nhanh trước khi xuất bản</SheetTitle>
                    <SheetDescription>
                      Đảm bảo homestay của bạn đầy đủ thông tin quan trọng và sẵn sàng cho khách đặt.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">1. Nội dung & hình ảnh</h4>
                      <ul className="space-y-1">
                        <li>• Tiêu đề nêu bật điểm mạnh homestay.</li>
                        <li>• Mô tả rõ vị trí, tiện ích và trải nghiệm.</li>
                        <li>• Ảnh đại diện sắc nét, tối thiểu 6 ảnh gallery.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">2. Giá & chính sách</h4>
                      <ul className="space-y-1">
                        <li>• Giá cơ bản được thiết lập theo mùa.</li>
                        <li>• Tùy chọn “Đặt ngay” khi đủ điều kiện kiểm duyệt.</li>
                        <li>• Thêm quy tắc giá động cho dịp lễ, cuối tuần.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">3. Trải nghiệm khách</h4>
                      <ul className="space-y-1">
                        <li>• Thêm tiện ích quan trọng: wifi, bếp, máy lạnh.</li>
                        <li>• Liệt kê rõ nội quy, giờ check-in/out.</li>
                        <li>• Cung cấp hướng dẫn di chuyển hoặc số liên hệ.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">4. Tối ưu SEO</h4>
                      <ul className="space-y-1">
                        <li>• Tiêu đề SEO 60 ký tự, description dưới 160 ký tự.</li>
                        <li>• Từ khóa phù hợp với sở thích khách mục tiêu.</li>
                        <li>• Gắn thẻ homestay vào danh mục phù hợp.</li>
                      </ul>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview} disabled={!previewUrl}>
                <ExternalLink className="mr-2 h-4 w-4" /> Xem trước
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <Plus className="mr-2 h-4 w-4" /> Nhân bản slug
              </Button>
            </div>
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Hoàn thiện {completion}%</span>
            </div>
          </div>
        </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(form.status);
          }}
        >
          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Thông tin cơ bản</h2>
                <p className="text-sm text-muted-foreground">
                  Tiêu đề, slug và mô tả giúp khách hiểu rõ homestay của bạn.
                </p>
              </div>
              <Target className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Tiêu đề *</label>
                <input
                  value={form.title}
                  onChange={(event) => handleFieldChange('title', event.target.value)}
                  placeholder="Ví dụ: Villa biển Đà Nẵng - 4 phòng ngủ"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(event) => {
                    handleFieldChange('slug', event.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="villa-bien-da-nang"
                  className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    slugStatus === 'conflict'
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                      : 'border-border focus:border-primary focus:ring-primary/40'
                  }`}
                  required
                />
                {slugMessage && (
                  <div
                    className={`mt-1 flex items-center gap-1 text-xs ${
                      slugStatus === 'conflict'
                        ? 'text-red-600'
                        : slugStatus === 'available'
                        ? 'text-emerald-600'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {slugStatus === 'conflict' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : slugStatus === 'available' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : slugStatus === 'checking' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : null}
                    <span>{slugMessage}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    handleFieldChange('status', event.target.value as HomestayFormState['status'])
                  }
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status === 'DRAFT' ? 'Nháp' : 'Xuất bản'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Loại homestay</label>
                <select
                  value={form.type}
                  onChange={(event) =>
                    handleFieldChange('type', event.target.value as HomestayFormState['type'])
                  }
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                >
                  <option value="ENTIRE_PLACE">Nguyên căn</option>
                  <option value="PRIVATE_ROOM">Phòng riêng</option>
                  <option value="SHARED_ROOM">Phòng chung</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    handleFieldChange('category', event.target.value as HomestayFormState['category'])
                  }
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tóm tắt *</label>
              <textarea
                value={form.summary}
                onChange={(event) => handleFieldChange('summary', event.target.value)}
                rows={3}
                placeholder="Mô tả ngắn gọn về điểm mạnh của homestay..."
                className="w-full rounded border border-border px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Chi tiết mô tả</label>
              <textarea
                value={form.description}
                onChange={(event) => handleFieldChange('description', event.target.value)}
                rows={5}
                placeholder="Chia sẻ trải nghiệm, tiện ích, vị trí và lưu ý nổi bật."
                className="w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Vị trí & sức chứa</h2>
                <p className="text-sm text-muted-foreground">
                  Cung cấp địa chỉ và số lượng phòng để khách lập kế hoạch phù hợp.
                </p>
              </div>
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
                <input
                  value={form.addressLine1}
                  onChange={(event) => handleFieldChange('addressLine1', event.target.value)}
                  placeholder="Số nhà, đường..."
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Thành phố</label>
                <input
                  value={form.city}
                  onChange={(event) => handleFieldChange('city', event.target.value)}
                  placeholder="Đà Nẵng, Hà Nội..."
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Quốc gia</label>
                <input
                  value={form.country}
                  onChange={(event) => handleFieldChange('country', event.target.value)}
                  placeholder="Việt Nam"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Khách tối đa *</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxGuests}
                  onChange={handleNumericChange('maxGuests')}
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 md:col-span-2 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Phòng ngủ</label>
                  <input
                    type="number"
                    min={0}
                    value={form.bedrooms}
                    onChange={handleNumericChange('bedrooms')}
                    className="w-full rounded border border-border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phòng tắm</label>
                  <input
                    type="number"
                    min={0}
                    value={form.bathrooms}
                    onChange={handleNumericChange('bathrooms')}
                    className="w-full rounded border border-border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="instant-book"
                    type="checkbox"
                    checked={form.isInstantBook}
                    onChange={(event) => handleFieldChange('isInstantBook', event.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-0"
                  />
                  <label htmlFor="instant-book" className="text-sm font-medium">
                    Đặt ngay (Instant book)
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Giá & hiển thị</h2>
                <p className="text-sm text-muted-foreground">
                  Thiết lập giá chính, cuối tuần và các tùy chọn làm nổi bật.
                </p>
              </div>
              <Thermometer className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Giá cơ bản *</label>
                <div className="flex items-center gap-2 rounded border border-border px-3 py-2">
                  <span className="text-sm text-muted-foreground">{form.currency}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.basePrice}
                    onChange={handleNumericChange('basePrice')}
                    className="w-full border-none bg-transparent text-sm focus:outline-none"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  ~ {formatNumber(form.basePrice)} {form.currency}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Giá cuối tuần</label>
                <input
                  type="number"
                  min={0}
                  value={form.weekendPrice}
                  onChange={(event) => handleFieldChange('weekendPrice', event.target.value)}
                  placeholder="Không bắt buộc"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tiền tệ</label>
                <input
                  value={form.currency}
                  onChange={(event) => handleFieldChange('currency', event.target.value)}
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => handleFieldChange('isFeatured', event.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-0"
                />
                <span>Nổi bật trên trang chủ</span>
              </label>
              <label className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isVerified}
                  onChange={(event) => handleFieldChange('isVerified', event.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-0"
                />
                <span>Đã kiểm duyệt</span>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Muốn thiết lập giá linh hoạt theo mùa/lễ?</span>
              <Button type="button" size="sm" variant="ghost" className="px-2 py-1 text-xs" onClick={handlePricingShortcut}>
                Tạo quy tắc giá động
              </Button>
            </div>
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Lịch & chặn phòng</h2>
                <p className="text-sm text-muted-foreground">
                  Thiết lập khoảng thời gian không sẵn sàng hoặc thông tin ghi chú cho lịch đặt phòng.
                </p>
              </div>
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={availabilityDraft.startDate}
                  onChange={(event) => setAvailabilityDraft((prev) => ({ ...prev, startDate: event.target.value }))}
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Ngày kết thúc</label>
                <input
                  type="date"
                  value={availabilityDraft.endDate}
                  onChange={(event) => setAvailabilityDraft((prev) => ({ ...prev, endDate: event.target.value }))}
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Ghi chú</label>
                <input
                  value={availabilityDraft.notes}
                  onChange={(event) => setAvailabilityDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Ví dụ: Bảo trì hồ bơi"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAvailability}
                disabled={
                  !availabilityDraft.startDate ||
                  !availabilityDraft.endDate ||
                  availabilityDraft.startDate > availabilityDraft.endDate
                }
              >
                Thêm khoảng chặn
              </Button>
            </div>
            {availabilityBlocks.length > 0 ? (
              <div className="space-y-2 text-sm">
                {availabilityBlocks.map((block) => (
                  <div
                    key={block.clientId}
                    className="flex items-center justify-between rounded border border-dashed border-border px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {block.startDate} → {block.endDate}
                      </p>
                      {block.notes && <p className="text-xs text-muted-foreground">{block.notes}</p>}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAvailability(block.clientId)}
                    >
                      Gỡ
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có khoảng chặn lịch nào.</p>
            )}
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Tiện ích & nội quy</h2>
                <p className="text-sm text-muted-foreground">
                  Chọn các tiện ích nổi bật và quy định giúp khách chuẩn bị tốt hơn.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </header>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tiện ích</label>
              <div className="flex gap-2">
                <input
                  value={amenityInput}
                  onChange={(event) => setAmenityInput(event.target.value)}
                  placeholder="Thêm tiện ích..."
                  className="flex-1 rounded border border-border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="rounded border border-border px-3 py-2 text-sm"
                  onClick={() => {
                    handleAddToList('amenities', amenityInput);
                    setAmenityInput('');
                  }}
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                  >
                    {amenity}
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-foreground"
                      onClick={() => handleRemoveFromList('amenities', amenity)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMENITIES.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    onClick={() => handleAddToList('amenities', amenity)}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nội quy</label>
              <div className="flex gap-2">
                <input
                  value={houseRuleInput}
                  onChange={(event) => setHouseRuleInput(event.target.value)}
                  placeholder="Thêm nội quy..."
                  className="flex-1 rounded border border-border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="rounded border border-border px-3 py-2 text-sm"
                  onClick={() => {
                    handleAddToList('houseRules', houseRuleInput);
                    setHouseRuleInput('');
                  }}
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.houseRules.map((rule) => (
                  <span
                    key={rule}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                  >
                    {rule}
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-foreground"
                      onClick={() => handleRemoveFromList('houseRules', rule)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_RULES.map((rule) => (
                  <button
                    key={rule}
                    type="button"
                    className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    onClick={() => handleAddToList('houseRules', rule)}
                  >
                    {rule}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Quản lý phòng</h2>
                <p className="text-sm text-muted-foreground">
                  Tạo các loại phòng với sức chứa và giá riêng để quản lý chi tiết hơn.
                </p>
              </div>
              <BedDouble className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Tên phòng</label>
                <input
                  value={roomDraft.name}
                  onChange={(event) => setRoomDraft((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Phòng master view biển"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Khách tối đa</label>
                <input
                  type="number"
                  min={1}
                  value={roomDraft.maxGuests}
                  onChange={(event) =>
                    setRoomDraft((prev) => ({ ...prev, maxGuests: Number(event.target.value) || 1 }))
                  }
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Giá cơ bản</label>
                <input
                  type="number"
                  min={0}
                  value={roomDraft.basePrice}
                  onChange={(event) =>
                    setRoomDraft((prev) => ({ ...prev, basePrice: Number(event.target.value) || 0 }))
                  }
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                <select
                  value={roomDraft.status}
                  onChange={(event) =>
                    setRoomDraft((prev) => ({
                      ...prev,
                      status: event.target.value as HomestayEditorRoomStatus,
                    }))
                  }
                  className="rounded border border-border px-3 py-2 text-sm"
                >
                  {ROOM_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {formatCategoryLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRoom}
                disabled={!roomDraft.name.trim()}
              >
                Thêm phòng
              </Button>
            </div>
            {rooms.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Tên</th>
                      <th className="px-3 py-2 text-left font-medium">Khách</th>
                      <th className="px-3 py-2 text-left font-medium">Giá</th>
                      <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
                      <th className="px-3 py-2 text-right font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.clientId} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <input
                            value={room.name}
                            onChange={(event) =>
                              handleRoomFieldChange(room.clientId, 'name', event.target.value)
                            }
                            className="w-full rounded border border-border px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={1}
                            value={room.maxGuests}
                            onChange={(event) =>
                              handleRoomFieldChange(
                                room.clientId,
                                'maxGuests',
                                Number(event.target.value) || 1,
                              )
                            }
                            className="w-24 rounded border border-border px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            value={room.basePrice}
                            onChange={(event) =>
                              handleRoomFieldChange(
                                room.clientId,
                                'basePrice',
                                Number(event.target.value) || 0,
                              )
                            }
                            className="w-28 rounded border border-border px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={room.status}
                            onChange={(event) =>
                              handleRoomStatusChange(
                                room.clientId,
                                event.target.value as HomestayEditorRoomStatus,
                              )
                            }
                            className="rounded border border-border px-2 py-1 text-sm"
                          >
                            {ROOM_STATUS_OPTIONS.map((status) => (
                              <option key={`${room.id}-${status}`} value={status}>
                                {formatCategoryLabel(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(room.clientId)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có phòng nào. Hãy thêm phòng để quản lý giá chi tiết.</p>
            )}
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Hình ảnh & media</h2>
                <p className="text-sm text-muted-foreground">
                  Hình ảnh chất lượng cao giúp khách hàng tin tưởng hơn.
                </p>
              </div>
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium">Ảnh đại diện *</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={form.heroImageUrl}
                    onChange={(event) => handleFieldChange('heroImageUrl', event.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded border border-border px-3 py-2 text-sm"
                    required
                  />
                  <button
                    type="button"
                    className="rounded border border-border px-3 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
                    onClick={() => setHeroPickerOpen(true)}
                  >
                    Chọn từ thư viện
                  </button>
                </div>
                {form.heroImageUrl && (
                  <div className="overflow-hidden rounded border border-dashed border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.heroImageUrl}
                      alt="Ảnh đại diện homestay"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load hero image:', form.heroImageUrl);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="flex h-40 items-center justify-center text-sm text-muted-foreground">Không thể tải ảnh. Vui lòng kiểm tra URL.</div>';
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-medium">Thư viện ảnh</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={galleryInput}
                      onChange={(event) => setGalleryInput(event.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded border border-border px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      className="rounded border border-border px-3 py-2 text-sm transition hover:border-primary hover:text-primary"
                      onClick={() => {
                        handleAddToList('galleryImageUrls', galleryInput);
                        setGalleryInput('');
                      }}
                    >
                      Thêm URL
                    </button>
                  </div>
                  <button
                    type="button"
                    className="rounded border border-dashed border-border px-3 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
                    onClick={() => setGalleryPickerOpen(true)}
                  >
                    Chọn từ thư viện
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.galleryImageUrls.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Chưa có ảnh nào. Thêm URL hoặc chọn từ thư viện.</p>
                  ) : (
                    form.galleryImageUrls.map((imageUrl, index) => (
                      <span
                        key={`${imageUrl}-${index}`}
                        className="group relative flex h-20 w-28 items-center justify-center overflow-hidden rounded border border-border bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imageUrl} 
                          alt={`Gallery ${index + 1}`} 
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            console.error('Failed to load image:', imageUrl);
                            e.currentTarget.src = '/placeholder-image.png';
                            e.currentTarget.alt = 'Failed to load';
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                          onClick={() => handleRemoveFromList('galleryImageUrls', imageUrl)}
                          title="Xóa ảnh"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">SEO & tìm kiếm</h2>
                <p className="text-sm text-muted-foreground">
                  Tối ưu hóa để homestay của bạn xuất hiện nổi bật trên kết quả tìm kiếm.
                </p>
              </div>
              <Compass className="h-5 w-5 text-muted-foreground" />
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Title</label>
                <input
                  value={form.seoTitle}
                  onChange={(event) => handleFieldChange('seoTitle', event.target.value)}
                  placeholder="Tiêu đề thân thiện với Google"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Description</label>
                <input
                  value={form.seoDescription}
                  onChange={(event) => handleFieldChange('seoDescription', event.target.value)}
                  placeholder="Mô tả ngắn trong kết quả tìm kiếm"
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ khóa</label>
              <div className="flex gap-2">
                <input
                  value={seoKeywordInput}
                  onChange={(event) => setSeoKeywordInput(event.target.value)}
                  placeholder="homestay da nang, villa bien..."
                  className="flex-1 rounded border border-border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="rounded border border-border px-3 py-2 text-sm"
                  onClick={() => {
                    handleAddToList('seoKeywords', seoKeywordInput);
                    setSeoKeywordInput('');
                  }}
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.seoKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                  >
                    {keyword}
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-foreground"
                      onClick={() => handleRemoveFromList('seoKeywords', keyword)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Link href="/admin/homestays" className="text-sm text-muted-foreground underline">
              Hủy
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={draftDisabled}
                onClick={() => void handleSubmit('DRAFT')}
                className="rounded border border-border px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving && form.status === 'DRAFT' ? 'Đang lưu...' : (mode === 'edit' ? 'Cập nhật nháp' : 'Lưu nháp')}
              </button>
              <button
                type="button"
                disabled={publishDisabled}
                onClick={() => void handleSubmit('PUBLISHED')}
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving && form.status === 'PUBLISHED' ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang xuất bản...') : (mode === 'edit' ? 'Cập nhật' : 'Xuất bản')}
              </button>
            </div>
          </div>
        </form>

        <aside className="flex flex-col gap-4 rounded border border-border bg-muted/40 p-4 lg:sticky lg:top-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Tổng quan tiến độ</h3>
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(10, completion)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Hoàn thành tối thiểu 5 trường bắt buộc để xuất bản homestay.
              </p>
            </div>
          </div>
          <div className="space-y-3 rounded border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Thông tin cơ bản</span>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tiêu đề</span>
                <span>{form.title ? '✓' : 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug</span>
                <span>{form.slug ? '✓' : 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span>Mức giá</span>
                <span>{form.basePrice > 0 ? '✓' : 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span>Ảnh đại diện</span>
                <span>{form.heroImageUrl ? '✓' : 'Chưa có'}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Tóm tắt nhanh</span>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {summaryStats.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded border border-border bg-background p-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">Gợi ý kiểm tra</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Kiểm tra lại mô tả và chính tả.</li>
              <li>• Cập nhật đầy đủ tiện ích quan trọng.</li>
              <li>• Đảm bảo hình ảnh có độ phân giải cao.</li>
              <li>• Thử xem trước trước khi xuất bản.</li>
            </ul>
          </div>
          <div className="space-y-2 rounded border border-dashed border-border bg-background p-3">
            <p className="text-xs text-muted-foreground">
              Sau khi tạo, bạn có thể thêm phòng, lịch và quy tắc giá động ở chi tiết homestay.
            </p>
            <Link
              href="/admin/homestays"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary underline"
            >
              Xem danh sách homestay
            </Link>
          </div>
        </aside>
      </div>
      </div>
      <MediaPickerDialog
        open={heroPickerOpen}
        onOpenChange={setHeroPickerOpen}
        onSelect={handleHeroSelect}
      />
      <MediaPickerDialog
        open={galleryPickerOpen}
        onOpenChange={setGalleryPickerOpen}
        onSelect={handleGallerySelect}
        multiple={true}
      />
    </>
  );
}

export default function EditHomestayPage() {
  const params = useParams<{ homestayId: string }>();
  const homestayId = params?.homestayId;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HomestayEditorData | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    async function loadHomestay() {
      if (!homestayId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/homestays/${homestayId}?_t=${Date.now()}`);
        
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error || 'Không tìm thấy homestay');
        }
        
        const homestay = await res.json();
        
        if (!cancelled) {
          setData(homestay);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    void loadHomestay();
    
    return () => {
      cancelled = true;
    };
  }, [homestayId]);

  if (!homestayId) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Thiếu mã homestay hợp lệ.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-red-600">{error ?? 'Không tìm thấy homestay.'}</p>
      </div>
    );
  }

  return (
    <HomestayEditor 
      mode="edit" 
      homestayId={homestayId}
      initialData={data}
      redirectTo="/admin/homestays" 
    />
  );
}
