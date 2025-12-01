'use client';

import { useState, useEffect } from 'react';
import { MediaUpload } from '@/components/media/media-upload';
import { MediaGrid } from '@/components/media/media-grid';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, CheckSquare, Square } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { MediaItem } from '@/components/media/types';

type MediaListResponse = {
  media: MediaItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function MediaPage() {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadMedia = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      const response = await fetch(`/api/media?page=${pageNum}&limit=12`);
      if (!response.ok) throw new Error('Không thể tải thư viện ảnh');
      
      const data = (await response.json()) as MediaListResponse;
      if (pageNum === 1) {
        setMedia(data.media ?? []);
      } else {
        setMedia((prev) => [...prev, ...(data.media ?? [])]);
      }
      setHasMore(data.pagination.page < data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thư viện ảnh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const handleUpload = (newMedia: MediaItem) => {
    setMedia((prev) => [newMedia, ...prev]);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Không thể xóa media');
      }
      
      setMedia((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa media');
    }
  };

  const handleUpdate = async (id: string, data: { alt?: string; caption?: string }) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Không thể cập nhật media');
      
      const updatedMedia = await response.json();
      setMedia((prev) =>
        prev.map((item) => (item.id === id ? updatedMedia : item))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật media');
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void loadMedia(nextPage);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setBulkDeleting(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/media/${id}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(deletePromises);
      const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok));
      
      // Try to get error details from failed requests
      const failedDetails: string[] = [];
      for (const result of failed) {
        if (result.status === 'fulfilled' && !result.value.ok) {
          try {
            const errorData = await result.value.json().catch(() => ({}));
            failedDetails.push(errorData.details || errorData.error || 'Lỗi không xác định');
          } catch {
            failedDetails.push('Lỗi không xác định');
          }
        } else if (result.status === 'rejected') {
          failedDetails.push(result.reason?.message || 'Lỗi không xác định');
        }
      }

      if (failed.length > 0) {
        const uniqueErrors = Array.from(new Set(failedDetails));
        throw new Error(
          `${failed.length} mục không thể xóa. ${uniqueErrors.length > 0 ? uniqueErrors.join('; ') : ''}`
        );
      }

      setMedia((prev) => prev.filter((item) => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
      setBulkDeleteDialog(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa các mục đã chọn');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Thư viện media</h1>
        <p className="text-muted-foreground">
          Tải lên và quản lý các tệp đa phương tiện.
        </p>
      </div>

      <MediaUpload onUpload={handleUpload} />

      {/* Bulk Operations Bar */}
      {selectMode && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Đã chọn: {selectedIds.size} / {media.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedIds.size === media.length ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Bỏ chọn tất cả
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Chọn tất cả
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectMode}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialog(true)}
              disabled={selectedIds.size === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa ({selectedIds.size})
            </Button>
          </div>
        </div>
      )}

      {/* Normal Mode Toolbar */}
      {!selectMode && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {media.length} mục media
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectMode}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Chọn nhiều
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <MediaGrid
            items={media}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            selectedIds={Array.from(selectedIds)}
            onToggleSelect={handleToggleSelect}
            selectMode={selectMode}
          />

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button onClick={loadMore} variant="outline" disabled={selectMode}>
                Tải thêm
              </Button>
            </div>
          )}
        </>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedIds.size} mục đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
