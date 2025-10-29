'use client';

import { useState, useEffect } from 'react';
import { MediaUpload } from '@/components/media/media-upload';
import { MediaGrid } from '@/components/media/media-grid';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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

      if (!response.ok) throw new Error('Không thể xóa media');
      
      setMedia((prev) => prev.filter((item) => item.id !== id));
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Thư viện media</h1>
        <p className="text-muted-foreground">
          Tải lên và quản lý các tệp đa phương tiện.
        </p>
      </div>

      <MediaUpload onUpload={handleUpload} />

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
          />

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button onClick={loadMore} variant="outline">
                Tải thêm
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
