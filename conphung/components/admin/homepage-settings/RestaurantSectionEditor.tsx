'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Plus, X } from 'lucide-react';
import type { RestaurantSection } from '@/lib/homepage/schema';

interface RestaurantSectionEditorProps {
  data?: RestaurantSection | null;
  onChange: (data: RestaurantSection) => void;
}

export function RestaurantSectionEditor({ data, onChange }: RestaurantSectionEditorProps) {
  const updateField = (field: keyof RestaurantSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    } as RestaurantSection);
  };

  const addSpecialty = () => {
    const specialties = data?.specialties || [];
    updateField('specialties', [...specialties, '']);
  };

  const updateSpecialty = (index: number, value: string) => {
    const specialties = [...(data?.specialties || [])];
    specialties[index] = value;
    updateField('specialties', specialties);
  };

  const removeSpecialty = (index: number) => {
    const specialties = [...(data?.specialties || [])];
    specialties.splice(index, 1);
    updateField('specialties', specialties);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5" />
          Restaurant Section
        </CardTitle>
        <CardDescription>
          Thông tin nhà hàng và đặc sản
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="restaurantTitle">Title</Label>
          <Input
            id="restaurantTitle"
            value={data?.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="NHÀ HÀNG KHU DU LỊCH CỒN PHỤNG"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="restaurantDescription">Description</Label>
          <Textarea
            id="restaurantDescription"
            value={data?.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Nhà hàng KDL Cồn Phụng với nhiều khu riêng biệt..."
            rows={4}
          />
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label htmlFor="restaurantCapacity">Capacity</Label>
          <Input
            id="restaurantCapacity"
            value={data?.capacity || ''}
            onChange={(e) => updateField('capacity', e.target.value)}
            placeholder="2,000+ khách"
          />
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Đặc sản (Specialties)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecialty}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm món
            </Button>
          </div>
          <div className="space-y-2">
            {(data?.specialties || []).map((specialty, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={specialty}
                  onChange={(e) => updateSpecialty(index, e.target.value)}
                  placeholder="Ví dụ: Cá tai tượng chiên xù"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecialty(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!data?.specialties || data.specialties.length === 0) && (
              <p className="text-sm text-muted-foreground">
                Chưa có đặc sản nào. Click &ldquo;Thêm món&rdquo; để thêm.
              </p>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUpload
            currentImage={data?.image || null}
            currentImageId={data?.imageId || null}
            field="aboutImage" // Reuse upload field
            onUpload={(url, publicId) => {
              updateField('image', url);
              updateField('imageId', publicId);
            }}
            onRemove={() => {
              updateField('image', undefined);
              updateField('imageId', undefined);
            }}
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="restaurantIsActive"
            checked={data?.isActive !== false}
            onChange={(e) => updateField('isActive', e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="restaurantIsActive">Hiển thị section này trên trang chủ</Label>
        </div>
      </CardContent>
    </Card>
  );
}

