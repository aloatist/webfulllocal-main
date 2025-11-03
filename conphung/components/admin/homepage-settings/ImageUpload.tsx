'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage: string | null;
  currentImageId: string | null;
  field: 'heroBackgroundImage' | 'aboutImage' | 'ogImage';
  onUpload: (url: string, publicId: string) => void;
  onRemove: () => void;
}

export function ImageUpload({
  currentImage,
  currentImageId,
  field,
  onUpload,
  onRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
      formData.append('field', field);
      if (currentImageId) {
        formData.append('oldPublicId', currentImageId);
      }

      const response = await fetch('/api/admin/homepage-settings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.url, data.publicId);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Không thể upload ảnh. Vui lòng thử lại.');
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemove = async () => {
    if (currentImageId) {
      try {
        await fetch(`/api/admin/homepage-settings/upload?publicId=${currentImageId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    onRemove();
  };

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-4">
      {displayImage && (
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border">
          <Image
            src={displayImage}
            alt="Preview"
            fill
            className="object-cover"
          />
          {!uploading && (
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById(`upload-${field}`)?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {displayImage ? 'Thay đổi ảnh' : 'Chọn ảnh'}
            </>
          )}
        </Button>
        <input
          id={`upload-${field}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        JPG, PNG hoặc WebP. Tối đa 5MB. Ảnh sẽ được upload lên Cloudinary.
      </p>
    </div>
  );
}

