'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Images } from 'lucide-react';
import type { GallerySection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface GalleryEditorProps {
  data?: GallerySection;
  onChange: (data: GallerySection) => void;
}

export default function GalleryEditor({ data, onChange }: GalleryEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const gallery = data || {
    heading: 'MỘT SỐ HÌNH ẢNH',
    description: 'Khám phá vẻ đẹp thiên nhiên Cồn Phụng',
    images: [],
  };

  const updateField = (field: keyof GallerySection, value: any) => {
    onChange({ ...gallery, [field]: value });
  };

  const addImage = () => {
    onChange({
      ...gallery,
      images: [
        ...gallery.images,
        {
          url: '',
          alt: 'Gallery image',
          caption: 'Mô tả hình ảnh',
        },
      ],
    });
    setExpandedIndex(gallery.images.length);
  };

  const updateImage = (index: number, updates: any) => {
    const newImages = [...gallery.images];
    newImages[index] = { ...newImages[index], ...updates };
    onChange({ ...gallery, images: newImages });
  };

  const deleteImage = (index: number) => {
    if (confirm('Xóa hình ảnh này?')) {
      onChange({
        ...gallery,
        images: gallery.images.filter((_, i) => i !== index),
      });
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...gallery.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange({ ...gallery, images: newImages });
    setExpandedIndex(targetIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="w-5 h-5" />
          Gallery Section
        </CardTitle>
        <CardDescription>
          Quản lý thư viện hình ảnh khu du lịch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={gallery.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="MỘT SỐ HÌNH ẢNH"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={gallery.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Khám phá vẻ đẹp..."
              rows={2}
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Hình ảnh ({gallery.images.length})</h3>
            <Button onClick={addImage} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hình
            </Button>
          </div>

          {gallery.images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có hình ảnh nào</p>
              <Button onClick={addImage} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm hình đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.images.map((image, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 space-y-3">
                    {/* Reorder buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === gallery.images.length - 1}
                          className="h-7 w-7 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground flex-1">#{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="h-7"
                      >
                        {expandedIndex === index ? '▼' : '▶'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteImage(index)}
                        className="text-destructive h-7"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Image Picker */}
                    <ImagePicker
                      value={image.url}
                      onChange={(url) => updateImage(index, { url })}
                      aspectRatio="4/3"
                    />

                    {/* Expanded form */}
                    {expandedIndex === index && (
                      <div className="space-y-3 pt-2 border-t">
                        <div className="space-y-1">
                          <Label className="text-xs">Alt Text</Label>
                          <Input
                            value={image.alt}
                            onChange={(e) => updateImage(index, { alt: e.target.value })}
                            placeholder="Mô tả cho SEO"
                            className="h-8 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Caption (Optional)</Label>
                          <Input
                            value={image.caption || ''}
                            onChange={(e) => updateImage(index, { caption: e.target.value })}
                            placeholder="Chú thích hiển thị"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>{gallery.images.length}</strong> hình ảnh trong gallery
            {gallery.images.length < 6 && (
              <span className="text-orange-600 ml-2">(Khuyến nghị: 6-12 hình)</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
