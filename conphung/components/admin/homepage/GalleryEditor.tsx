'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Images, Eye, EyeOff } from 'lucide-react';
import type { GallerySection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface GalleryEditorProps {
  data?: GallerySection;
  onChange: (data: GallerySection) => void;
}

const DEFAULT_GALLERY_IMAGES = [
  { url: "/uploads/2024/10/22196236_901710536664938_7027468764014750282_n.webp", alt: "Cồn Phụng - Du lịch sinh thái" },
  { url: "/uploads/2024/10/22405754_905859629583362_7823146011914182650_n-1.webp", alt: "Cồn Phụng - Khung cảnh thiên nhiên" },
  { url: "/uploads/2024/10/bang-tieu-bieu-song-cuu-long-600-x-600-.webp", alt: "Bảng tiêu biểu sông Cửu Long" },
  { url: "/uploads/2024/10/banh-xeo-con-phung.webp", alt: "Bánh xèo Cồn Phụng - Đặc sản miền Tây" },
  { url: "/uploads/2024/10/cabubinhconphungbentre.conphungtourist.com_.webp", alt: "Cà búp bình Cồn Phụng" },
  { url: "/uploads/2024/10/catituongchienxu.conphungtourist.com_-1024x767-1.webp", alt: "Cá tứ tượng chiên xù" },
  { url: "/uploads/2024/10/cocoislandconphugbentre-1024x767-1.webp", alt: "Coco Island Cồn Phụng" },
  { url: "/uploads/2024/10/coco-island-con-phung-ben-tre41-1024x576-1.webp", alt: "Homestay Coco Island Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com8.webp", alt: "Du lịch Cồn Phụng Bến Tre" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com9.webp", alt: "Tham quan Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp", alt: "Cồn Phụng - Điểm du lịch sinh thái" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp", alt: "Vẻ đẹp Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp", alt: "Trải nghiệm du lịch Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp", alt: "Cồn Phụng - Vườn dừa xanh mát" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp", alt: "Cảnh quan Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com15.webp", alt: "Du lịch miền Tây - Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com16.webp", alt: "Khu du lịch Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com17.webp", alt: "Thiên nhiên Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com18.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com19.webp", alt: "Du lịch sinh thái Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com20.webp", alt: "Cồn Phụng Bến Tre" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com21.webp", alt: "Văn hóa miền Tây tại Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com22.webp", alt: "Cồn Phụng - Trải nghiệm độc đáo" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com23.webp", alt: "Cảnh đẹp Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com26.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com27.webp", alt: "Cồn Phụng - Điểm đến hấp dẫn" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com28.webp", alt: "Thiên nhiên hoang sơ Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com29.webp", alt: "Cồn Phụng - Khám phá miền Tây" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com30.webp", alt: "Du lịch Cồn Phụng - Trải nghiệm" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com33.webp", alt: "Cồn Phụng - Vẻ đẹp tự nhiên" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com34.webp", alt: "Khu du lịch sinh thái Cồn Phụng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com35.webp", alt: "Cồn Phụng - Điểm đến du lịch" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com36.webp", alt: "Tham quan Cồn Phụng Bến Tre" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com37.webp", alt: "Cồn Phụng - Cảnh quan đẹp" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com38.webp", alt: "Du lịch Cồn Phụng - Thiên nhiên" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com40.webp", alt: "Cồn Phụng - Vườn dừa" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com41.webp", alt: "Cồn Phụng - Trải nghiệm văn hóa" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com42.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com44.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com45.webp", alt: "Cồn Phụng - Vẻ đẹp miền Tây" },
  { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com46.webp", alt: "Du lịch Cồn Phụng - Khám phá" }
];

const DEFAULT_ECO_FEATURES = [
  { title: 'Du lịch sinh thái', subtitle: 'Không gian sinh thái', icon: 'trees' },
  { title: 'Kiến Trúc Dừa', subtitle: 'Độc đáo miền Tây', icon: 'building' },
  { title: 'Văn Hóa Địa Phương', subtitle: 'Trải nghiệm đích thực', icon: 'leaf' },
];

const DEFAULT_BOTTOM_TEXT = '✨ Hơn 1000+ hình ảnh đẹp về thiên nhiên, văn hóa và con người Cồn Phụng';

export default function GalleryEditor({ data, onChange }: GalleryEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Merge with defaults to ensure ecoFeatures and bottomText are always present
  const gallery: GallerySection = {
    heading: data?.heading || 'MỘT SỐ HÌNH ẢNH',
    description: data?.description || 'Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của Cồn Phụng',
    ecoFeatures: data?.ecoFeatures && data.ecoFeatures.length === 3 
      ? data.ecoFeatures 
      : DEFAULT_ECO_FEATURES,
    bottomText: data?.bottomText || DEFAULT_BOTTOM_TEXT,
    images: data?.images || [],
  };

  const loadDefaultImages = () => {
    if (confirm(`Bạn có chắc muốn thay thế ${gallery.images.length} ảnh hiện tại bằng ${DEFAULT_GALLERY_IMAGES.length} ảnh mặc định?`)) {
      onChange({
        ...gallery,
        images: DEFAULT_GALLERY_IMAGES,
      });
    }
  };

  const addDefaultImages = () => {
    // Add default images to existing ones (avoid duplicates)
    const existingUrls = new Set(gallery.images.map(img => img.url));
    const newImages = DEFAULT_GALLERY_IMAGES.filter(img => !existingUrls.has(img.url));
    
    if (newImages.length === 0) {
      alert('Tất cả ảnh mặc định đã có trong danh sách!');
      return;
    }
    
    onChange({
      ...gallery,
      images: [...gallery.images, ...newImages],
    });
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

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<GallerySection['visibility']>) => {
    const currentVisibility = gallery.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false),
    };
    onChange({ ...gallery, visibility: newVisibility });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<GallerySection['visibility']>) => {
    return gallery.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<GallerySection['visibility']>, label: string) => (
    <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
      <Label htmlFor={`${fieldName}-visibility`} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        {isFieldVisible(fieldName) ? (
          <Eye className="w-4 h-4 text-muted-foreground" />
        ) : (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        )}
        <Switch
          id={`${fieldName}-visibility`}
          checked={isFieldVisible(fieldName)}
          onCheckedChange={() => toggleFieldVisibility(fieldName)}
        />
      </div>
    </div>
  );

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
            {renderVisibilityToggle('heading', 'Hiển thị Heading')}
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={gallery.heading}
                onChange={(e) => updateField('heading', e.target.value)}
                placeholder="MỘT SỐ HÌNH ẢNH"
                disabled={!isFieldVisible('heading')}
              />
            </div>
          </div>

          <div className="space-y-2">
            {renderVisibilityToggle('description', 'Hiển thị Description')}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={gallery.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Khám phá vẻ đẹp..."
                rows={2}
                disabled={!isFieldVisible('description')}
              />
            </div>
          </div>
        </div>

        {/* Eco Tourism Features */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Eco Tourism Features (3 Cards)</Label>
            {renderVisibilityToggle('ecoFeatures', 'Hiển thị Eco Features')}
          </div>
          <div className={`grid md:grid-cols-3 gap-4 ${!isFieldVisible('ecoFeatures') ? 'opacity-50 pointer-events-none' : ''}`}>
            {(gallery.ecoFeatures || []).map((feature, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Card {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...(gallery.ecoFeatures || [])];
                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                        updateField('ecoFeatures', newFeatures);
                      }}
                      placeholder="Du lịch sinh thái"
                      className="h-8 text-sm"
                      disabled={!isFieldVisible('ecoFeatures')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Subtitle</Label>
                    <Input
                      value={feature.subtitle}
                      onChange={(e) => {
                        const newFeatures = [...(gallery.ecoFeatures || [])];
                        newFeatures[index] = { ...newFeatures[index], subtitle: e.target.value };
                        updateField('ecoFeatures', newFeatures);
                      }}
                      placeholder="Không gian sinh thái"
                      className="h-8 text-sm"
                      disabled={!isFieldVisible('ecoFeatures')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Icon</Label>
                    <select
                      value={feature.icon || 'trees'}
                      onChange={(e) => {
                        const newFeatures = [...(gallery.ecoFeatures || [])];
                        newFeatures[index] = { ...newFeatures[index], icon: e.target.value };
                        updateField('ecoFeatures', newFeatures);
                      }}
                      className="w-full h-8 text-sm rounded-md border border-input bg-background px-3 py-1"
                      disabled={!isFieldVisible('ecoFeatures')}
                    >
                      <option value="trees">Trees</option>
                      <option value="building">Building</option>
                      <option value="leaf">Leaf</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
          {renderVisibilityToggle('bottomText', 'Hiển thị Bottom Text')}
          <div className="space-y-2">
            <Label>Bottom Text</Label>
            <Input
              value={gallery.bottomText || ''}
              onChange={(e) => updateField('bottomText', e.target.value)}
              placeholder="✨ Hơn 1000+ hình ảnh đẹp..."
              disabled={!isFieldVisible('bottomText')}
            />
            <p className="text-xs text-muted-foreground">
              Text hiển thị dưới phần Eco Tourism Features
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Hình ảnh ({gallery.images.length})</h3>
            {renderVisibilityToggle('images', 'Hiển thị Images')}
          </div>
            <div className={`flex gap-2 ${!isFieldVisible('images') ? 'opacity-50 pointer-events-none' : ''}`}>
              {gallery.images.length > 0 && (
                <>
                  <Button onClick={loadDefaultImages} variant="outline" size="sm" disabled={!isFieldVisible('images')}>
                    <Images className="w-4 h-4 mr-2" />
                    Thay Thế Bằng Ảnh Mặc Định
                  </Button>
                  <Button onClick={addDefaultImages} variant="outline" size="sm" disabled={!isFieldVisible('images')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Ảnh Mặc Định
                  </Button>
                </>
              )}
              <Button onClick={addImage} size="sm" disabled={!isFieldVisible('images')}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm hình
              </Button>
            </div>
          </div>

          <div className={!isFieldVisible('images') ? 'opacity-50 pointer-events-none' : ''}>
            {gallery.images.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Chưa có hình ảnh nào</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={loadDefaultImages} variant="default" disabled={!isFieldVisible('images')}>
                    <Images className="w-4 h-4 mr-2" />
                    Load Ảnh Mặc Định ({DEFAULT_GALLERY_IMAGES.length} ảnh)
                  </Button>
                  <Button onClick={addImage} variant="outline" disabled={!isFieldVisible('images')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm hình đầu tiên
                  </Button>
                </div>
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
