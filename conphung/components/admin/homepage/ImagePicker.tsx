'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export function ImagePicker({ value, onChange, label, aspectRatio = '16/9', className = '' }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File không được vượt quá 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/cocoisland/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setShowDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải lên hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const response = await fetch('/api/admin/cocoisland/images');
      if (response.ok) {
        const data = await response.json();
        setLibraryImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
    loadLibrary();
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setShowDialog(false);
  };

  const handleManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowDialog(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
        {value ? (
          <div className="relative group">
            <div className="relative" style={{ aspectRatio }}>
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage Error%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleOpenDialog}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Thay đổi
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50"
            onClick={handleOpenDialog}
          >
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Nhấn để chọn hình ảnh</p>
            <p className="text-xs text-gray-500">Upload, Library hoặc URL</p>
          </div>
        )}
      </div>

      {/* Image Picker Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn hình ảnh</DialogTitle>
            <DialogDescription>
              Upload ảnh mới, chọn từ thư viện hoặc nhập URL
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="library">
                <FolderOpen className="w-4 h-4 mr-2" />
                Thư viện
              </TabsTrigger>
              <TabsTrigger value="url">
                <ImageIcon className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  {uploading ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500">Đang tải lên...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-base text-gray-600 mb-2">Nhấn để chọn file hoặc kéo thả vào đây</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP (tối đa 5MB)</p>
                    </>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </TabsContent>

            {/* Library Tab */}
            <TabsContent value="library" className="space-y-4">
              {loadingLibrary ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Chưa có hình ảnh trong thư viện</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload ảnh đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                      onClick={() => handleSelectFromLibrary(url)}
                    >
                      <Image
                        src={url}
                        alt={`Library image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          Chọn
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL hình ảnh</Label>
                  <Input
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg hoặc /uploads/image.jpg"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualUrl()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập URL đầy đủ hoặc đường dẫn tương đối
                  </p>
                </div>
                <Button onClick={handleManualUrl} className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Sử dụng URL này
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
