'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, ImagePlus, RefreshCw, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MediaGrid } from './media-grid';
import { MediaUpload } from './media-upload';
import type { MediaItem } from './types';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem | MediaItem[]) => void;
  multiple?: boolean;
}

interface MediaResponse {
  media: MediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const PAGE_LIMIT = 12;

export function MediaPickerDialog({ open, onOpenChange, onSelect, multiple = false }: MediaPickerDialogProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = useCallback(
    async (targetPage: number, currentQuery: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(targetPage),
          limit: String(PAGE_LIMIT),
        });
        if (currentQuery.trim().length > 0) {
          params.set('search', currentQuery.trim());
        }
        const response = await fetch(`/api/media?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Không thể tải thư viện media');
        }
        const data = (await response.json()) as MediaResponse;
        setItems(data.media ?? []);
        setTotalPages(data.pagination?.totalPages ?? 0);
        setPage(data.pagination?.page ?? targetPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thư viện media');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open) {
      void loadMedia(1, query);
      setSelectedItems([]);
    }
  }, [open, query, loadMedia]);

  const handleSelect = (media: MediaItem) => {
    if (multiple) {
      // Toggle selection
      setSelectedItems(prev => {
        const exists = prev.find(item => item.id === media.id);
        if (exists) {
          return prev.filter(item => item.id !== media.id);
        }
        return [...prev, media];
      });
    } else {
      // Single selection - close immediately
      onSelect(media);
      onOpenChange(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
      onOpenChange(false);
    }
  };

  const handleUpload = (media: MediaItem) => {
    setItems((prev) => [media, ...prev]);
    setTotalPages((prev) => (prev === 0 ? 1 : prev));
    if (multiple) {
      setSelectedItems(prev => [...prev, media]);
    } else {
      onSelect(media);
      onOpenChange(false);
    }
  };

  const handleChangePage = (direction: 'prev' | 'next') => {
    const nextPage = direction === 'prev' ? Math.max(page - 1, 1) : Math.min(page + 1, Math.max(totalPages, 1));
    void loadMedia(nextPage, query);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchTerm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
        <DialogTitle>Thư viện media</DialogTitle>
          <DialogDescription>
            Chọn hình ảnh hoặc file từ thư viện media của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          <div className="grid gap-4 md:grid-cols-[1.5fr,1fr]">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên, alt text hoặc caption..."
              />
              <Button type="submit" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setQuery('');
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Đặt lại
              </Button>
            </form>

            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Tải hình ảnh mới</p>
                  <p>Chọn tệp từ máy tính để thêm ngay vào thư viện.</p>
                </div>
              </div>
              <div className="mt-4">
                <MediaUpload onUpload={handleUpload} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang tải hình ảnh...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Chưa có media nào. Hãy tải lên hình ảnh mới.
            </div>
          ) : (
            <MediaGrid 
              items={items} 
              onSelect={handleSelect}
              selectedIds={multiple ? selectedItems.map(item => item.id) : undefined}
            />
          )}

          {multiple && selectedItems.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">
                Đã chọn {selectedItems.length} ảnh
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedItems([])}
                >
                  Bỏ chọn tất cả
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmSelection}
                >
                  Xác nhận ({selectedItems.length})
                </Button>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleChangePage('prev')}
                disabled={page <= 1 || loading}
              >
                Trang trước
              </Button>
              <span>
                Trang {page}/{totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleChangePage('next')}
                disabled={page >= totalPages || loading}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
