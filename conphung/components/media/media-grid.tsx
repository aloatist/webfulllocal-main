'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaItem } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface MediaGridProps {
  items: MediaItem[];
  onSelect?: (media: MediaItem) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: { alt?: string; caption?: string }) => void;
  selectedIds?: string[];
}

export function MediaGrid({ items, onSelect, onDelete, onUpdate, selectedIds }: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ alt: '', caption: '' });

  const handleEdit = (media: MediaItem) => {
    setSelectedMedia(media);
    setEditData({
      alt: media.alt ?? '',
      caption: media.caption ?? '',
    });
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!selectedMedia || !onUpdate) return;
    
    await onUpdate(selectedMedia.id, editData);
    setEditMode(false);
    setSelectedMedia(null);
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (window.confirm('Bạn có chắc muốn xóa hình ảnh này?')) {
      await onDelete(id);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((media) => {
          const isSelected = selectedIds?.includes(media.id);
          return (
          <div
            key={media.id}
            className={`group relative aspect-square overflow-hidden rounded-lg border ${isSelected ? 'border-primary border-2 ring-2 ring-primary/20' : 'border-border'} bg-accent/5`}
          >
            <Image
              src={media.url}
              alt={media.alt ?? media.filename}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />

            {isSelected && (
              <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {onSelect && (
                <Button
                  size="sm"
                  onClick={() => onSelect(media)}
                >
                  Chọn
                </Button>
              )}
              {onUpdate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(media)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(media.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )})}
      </div>

      <Dialog
        open={editMode}
        onOpenChange={(open) => {
          setEditMode(open);
          if (!open) {
            setSelectedMedia(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa media</DialogTitle>
            <DialogDescription>
              Cập nhật văn bản thay thế và chú thích cho hình ảnh.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="alt" className="text-sm font-medium">
                Văn bản thay thế
              </label>
              <input
                id="alt"
                value={editData.alt}
                onChange={(e) => setEditData({ ...editData, alt: e.target.value })}
                className="w-full rounded-md border border-border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="caption" className="text-sm font-medium">
                Chú thích
              </label>
              <textarea
                id="caption"
                value={editData.caption}
                onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                className="w-full rounded-md border border-border px-3 py-2"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                setSelectedMedia(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdate}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
