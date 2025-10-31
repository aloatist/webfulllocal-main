'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { StayPerks } from '@/lib/cocoisland/schema';

interface StayPerksEditorProps {
  data: StayPerks;
  onChange: (data: StayPerks) => void;
}

export function StayPerksEditor({ data, onChange }: StayPerksEditorProps) {
  const addItem = () => {
    onChange({ ...data, items: [...data.items, ''] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onChange({ ...data, items: newItems });
  };

  return (
    <SectionEditor 
      title="🎁 Ưu đãi phòng nghỉ" 
      description="Các ưu đãi đi kèm với phòng"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => onChange({ ...data, eyebrow: e.target.value })}
            placeholder="Ở lại"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề</label>
          <Input
            value={data.heading}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Chế độ ưu đãi phòng nghỉ & ăn sáng"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description || ''}
          onChange={(value) => onChange({ ...data, description: value })}
          placeholder="Mỗi du khách lưu trú..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Text CTA</label>
            <Input
              value={data.ctaText || ''}
              onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
              placeholder="Xem toàn bộ phòng"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link CTA</label>
            <Input
              value={data.ctaHref || ''}
              onChange={(e) => onChange({ ...data, ctaHref: e.target.value })}
              placeholder="#rooms"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Danh sách ưu đãi</label>
          {data.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="2 chai nước suối mỗi ngày"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm ưu đãi
        </Button>
      </div>
    </SectionEditor>
  );
}
