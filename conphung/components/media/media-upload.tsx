'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaItem } from './types';

interface MediaUploadProps {
  onUpload: (media: MediaItem) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export function MediaUpload({ onUpload, maxFiles = 1, acceptedTypes = ['image/*'] }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Tải lên thất bại');
      }

      const media = (await response.json()) as MediaItem;
      onUpload(media);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lên tệp');
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onUpload, preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  });

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
  }, [preview]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/5 transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-accent/10' : 'border-border'}
          ${error ? 'border-destructive/50 bg-destructive/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Đang tải lên...</p>
          </div>
        ) : preview ? (
          <div className="relative mx-auto h-48 w-full max-w-xs">
            <Image
              src={preview}
              alt="Xem trước"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Thả tệp vào đây'
                : 'Kéo thả tệp vào đây hoặc bấm để chọn'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
