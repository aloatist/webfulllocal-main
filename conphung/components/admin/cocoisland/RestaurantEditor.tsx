'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { RestaurantSection } from '@/lib/cocoisland/schema';

interface RestaurantEditorProps {
  data: RestaurantSection;
  onChange: (data: RestaurantSection) => void;
}

export function RestaurantEditor({ data, onChange }: RestaurantEditorProps) {
  const updateField = <K extends keyof RestaurantSection>(
    field: K,
    value: RestaurantSection[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionEditor 
      title="🍽️ Nhà hàng - Ẩm thực" 
      description="Giới thiệu về nhà hàng và ẩm thực"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Eat & Drink"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề</label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nhà hàng - Ẩm thực"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description}
          onChange={(value) => updateField('description', value)}
          placeholder="Thưởng thức đặc sản miền Tây..."
          rows={4}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Đặc điểm nổi bật</label>
          {(data.features || []).map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(data.features || [])];
                  newFeatures[index] = e.target.value;
                  updateField('features', newFeatures);
                }}
                placeholder="Thực đơn đặc sản miền Tây"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => {
                  updateField('features', (data.features || []).filter((_, i) => i !== index));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => updateField('features', [...(data.features || []), ''])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm đặc điểm
          </Button>
        </div>

        <ImageUploader
          label="Hình ảnh"
          value={data.image}
          onChange={(url) => updateField('image', url)}
          aspectRatio="16/9"
        />
      </div>
    </SectionEditor>
  );
}
