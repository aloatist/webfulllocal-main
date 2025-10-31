'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { Service } from '@/lib/cocoisland/schema';

interface ServicesEditorProps {
  eyebrow?: string;
  heading?: string;
  services: Service[];
  onChange: (data: { eyebrow?: string; heading?: string; services: Service[] }) => void;
}

export function ServicesEditor({ eyebrow, heading, services, onChange }: ServicesEditorProps) {
  const addService = () => {
    onChange({ eyebrow, heading, services: [
      ...services,
      { title: '', description: '', icon: '⭐', image: '' },
    ] });
  };

  const removeService = (index: number) => {
    onChange({ eyebrow, heading, services: services.filter((_, i) => i !== index) });
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    onChange({ eyebrow, heading, services: newServices });
  };

  return (
    <SectionEditor 
      title="🛎️ Dịch vụ" 
      description="Các dịch vụ và tiện ích của homestay"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={eyebrow || ''}
            onChange={(e) => onChange({ eyebrow: e.target.value, heading, services })}
            placeholder="Dịch vụ"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề phần</label>
          <Input
            value={heading || ''}
            onChange={(e) => onChange({ eyebrow, heading: e.target.value, services })}
            placeholder="Những tiện ích khi đồng hành cùng Coco Island"
          />
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeService(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tên dịch vụ</label>
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    placeholder="Nhà hàng"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Icon (emoji)</label>
                  <Input
                    value={service.icon || ''}
                    onChange={(e) => updateService(index, 'icon', e.target.value)}
                    placeholder="🍽️"
                    maxLength={2}
                  />
                </div>
              </div>

              <RichTextEditor
                label="Mô tả"
                value={service.description}
                onChange={(value) => updateService(index, 'description', value)}
                placeholder="Thưởng thức ẩm thực..."
                rows={3}
              />

              <ImageUploader
                label="Hình ảnh"
                value={service.image}
                onChange={(url) => updateService(index, 'image', url)}
                aspectRatio="4/3"
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addService}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm dịch vụ
        </Button>
      </div>
    </SectionEditor>
  );
}
