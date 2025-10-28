'use client';

import { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  label: string;
  value: string;
}

interface AdvancedFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  selectedStatus?: string;
  selectedCategory?: string;
  onStatusChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  sortOptions?: FilterOption[];
  selectedSort?: string;
  onSortChange?: (value: string) => void;
  onClearFilters?: () => void;
  showDateFilter?: boolean;
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
}

export function AdvancedFilters({
  searchValue,
  onSearchChange,
  statusOptions,
  categoryOptions,
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
  sortOptions,
  selectedSort,
  onSortChange,
  onClearFilters,
  showDateFilter = false,
}: AdvancedFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    selectedStatus && selectedStatus !== 'all',
    selectedCategory && selectedCategory !== 'all',
    selectedSort && selectedSort !== 'default',
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusChange?.('all');
    onCategoryChange?.('all');
    onSortChange?.('default');
    onClearFilters?.();
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Bộ lọc nâng cao</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-auto p-0 text-xs"
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>

                {statusOptions && onStatusChange && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trạng thái</label>
                    <Select value={selectedStatus} onValueChange={onStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {categoryOptions && onCategoryChange && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={onCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {sortOptions && onSortChange && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sắp xếp</label>
                    <Select value={selectedSort} onValueChange={onSortChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cách sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearFilters}
              title="Xóa bộ lọc"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStatus && selectedStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              Trạng thái: {statusOptions?.find((o) => o.value === selectedStatus)?.label}
              <button
                onClick={() => onStatusChange?.('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <FolderTree className="h-3 w-3" />
              Danh mục: {categoryOptions?.find((o) => o.value === selectedCategory)?.label}
              <button
                onClick={() => onCategoryChange?.('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
