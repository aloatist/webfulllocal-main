'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { MediaPickerDialog } from '@/components/media/media-picker-dialog';
import type { MediaItem } from '@/components/media/types';

interface TeamMemberImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function TeamMemberImageUpload({ value, onChange, disabled }: TeamMemberImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', 'teamMember');

      const response = await fetch('/api/admin/homepage-settings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Không thể upload ảnh. Vui lòng thử lại.');
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromLibrary = (media: MediaItem | MediaItem[]) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    if (selectedMedia?.url) {
      onChange(selectedMedia.url);
      setShowLibrary(false);
    }
  };

  const displayImage = preview || value;

  return (
    <div className="space-y-2">
      {displayImage && (
        <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border">
          <Image
            src={displayImage}
            alt="Team member"
            fill
            className="object-cover"
          />
          {!uploading && !disabled && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload ảnh
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLibrary(true)}
          disabled={disabled}
          className="flex-1"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Chọn từ thư viện
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </div>

      {/* Media Library Dialog */}
      <MediaPickerDialog
        open={showLibrary}
        onOpenChange={setShowLibrary}
        onSelect={handleSelectFromLibrary}
        multiple={false}
      />

      {value && (
        <p className="text-xs text-muted-foreground truncate" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}

