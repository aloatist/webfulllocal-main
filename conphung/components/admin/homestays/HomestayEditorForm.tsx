'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// Types
export type HomestayEditorMode = 'create' | 'edit';

export type HomestayEditorData = {
  id?: string;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  status?: 'DRAFT' | 'PUBLISHED';
  type?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  category?: string;
  addressLine1?: string | null;
  city?: string | null;
  country?: string | null;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  basePrice?: string | number | null;
  currency?: string | null;
  isInstantBook?: boolean | null;
  isFeatured?: boolean | null;
  isVerified?: boolean | null;
  heroImageUrl?: string | null;
  amenities?: string[];
  houseRules?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  media?: { url: string }[];
  rooms?: Array<{
    id?: string;
    name: string;
    slug: string;
    maxGuests?: number | null;
    basePrice?: string | number | null;
    status: string;
  }>;
};

export interface HomestayEditorFormProps {
  mode: HomestayEditorMode;
  initialData?: HomestayEditorData;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  redirectTo?: string;
}

/**
 * Shared form component for creating and editing homestays
 * This component contains all the form logic and UI
 */
export function HomestayEditorForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  redirectTo = '/admin/homestays',
}: HomestayEditorFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    description: initialData?.description || '',
    status: initialData?.status || 'DRAFT',
    type: initialData?.type || 'ENTIRE_PLACE',
    category: initialData?.category || 'HOUSE',
    city: initialData?.city || '',
    country: initialData?.country || 'Việt Nam',
    maxGuests: initialData?.maxGuests || 2,
    bedrooms: initialData?.bedrooms || 1,
    bathrooms: initialData?.bathrooms || 1,
    basePrice: initialData?.basePrice || 500000,
    currency: initialData?.currency || 'VND',
    heroImageUrl: initialData?.heroImageUrl || '',
    amenities: initialData?.amenities || [],
    houseRules: initialData?.houseRules || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSubmit(formData);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Thông tin cơ bản</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tóm tắt</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              rows={6}
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Chi tiết bất động sản</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Loại hình</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="ENTIRE_PLACE">Toàn bộ nhà</option>
              <option value="PRIVATE_ROOM">Phòng riêng</option>
              <option value="SHARED_ROOM">Phòng chung</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Danh mục</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="VILLA">Villa</option>
              <option value="APARTMENT">Căn hộ</option>
              <option value="HOUSE">Nhà</option>
              <option value="STUDIO">Studio</option>
              <option value="BUNGALOW">Bungalow</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số khách tối đa</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số phòng ngủ</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số phòng tắm</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giá cơ bản (VND)</label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Vị trí</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Thành phố</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quốc gia</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border px-6 py-2 hover:bg-muted"
          disabled={saving}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </button>
      </div>
    </form>
  );
}
