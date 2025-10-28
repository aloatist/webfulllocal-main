'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface HomestayFiltersProps {
  currentFilters: Record<string, any>;
}

export function HomestayFilters({ currentFilters }: HomestayFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    type: currentFilters.type || '',
    category: currentFilters.category || '',
    city: currentFilters.city || '',
    minPrice: currentFilters.minPrice || '',
    maxPrice: currentFilters.maxPrice || '',
    bedrooms: currentFilters.bedrooms || '',
    bathrooms: currentFilters.bathrooms || '',
    hasWifi: currentFilters.hasWifi === 'true',
    hasPool: currentFilters.hasPool === 'true',
    hasParking: currentFilters.hasParking === 'true',
    sortBy: currentFilters.sortBy || 'createdAt',
    sortOrder: currentFilters.sortOrder || 'desc',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });

    router.push(`/homestays?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      hasWifi: false,
      hasPool: false,
      hasParking: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    router.push('/homestays');
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      return value !== '' && value !== false;
    }
  );

  return (
    <div className="space-y-4">
      {/* Search & Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa điểm..."
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full rounded-lg border bg-background px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Bộ lọc</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium">Loại hình</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="">Tất cả</option>
                <option value="ENTIRE_PLACE">Toàn bộ nhà</option>
                <option value="PRIVATE_ROOM">Phòng riêng</option>
                <option value="SHARED_ROOM">Phòng chung</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">Danh mục</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="">Tất cả</option>
                <option value="VILLA">Villa</option>
                <option value="APARTMENT">Căn hộ</option>
                <option value="HOUSE">Nhà</option>
                <option value="STUDIO">Studio</option>
                <option value="BUNGALOW">Bungalow</option>
                <option value="CABIN">Cabin</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="mb-2 block text-sm font-medium">Phòng ngủ</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="">Bất kỳ</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="mb-2 block text-sm font-medium">Phòng tắm</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="">Bất kỳ</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="mb-2 block text-sm font-medium">Giá tối thiểu</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="mb-2 block text-sm font-medium">Giá tối đa</label>
              <input
                type="number"
                placeholder="10000000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              />
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-medium">Tiện nghi</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasWifi}
                  onChange={(e) => handleFilterChange('hasWifi', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>WiFi</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasPool}
                  onChange={(e) => handleFilterChange('hasPool', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>Hồ bơi</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasParking}
                  onChange={(e) => handleFilterChange('hasParking', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>Chỗ đỗ xe</span>
              </label>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Sắp xếp theo</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="createdAt">Mới nhất</option>
                <option value="basePrice">Giá</option>
                <option value="ratingAverage">Đánh giá</option>
                <option value="reviewCount">Số lượng đánh giá</option>
                <option value="bookingCount">Phổ biến</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Thứ tự</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={applyFilters}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Áp dụng
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
