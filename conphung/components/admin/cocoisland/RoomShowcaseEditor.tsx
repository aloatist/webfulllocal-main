'use client';

import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { RoomShowcaseSection } from '@/lib/cocoisland/schema';

interface RoomShowcaseEditorProps {
  data: RoomShowcaseSection;
  onChange: (data: RoomShowcaseSection) => void;
}

export function RoomShowcaseEditor({ data, onChange }: RoomShowcaseEditorProps) {
  const updateField = <K extends keyof RoomShowcaseSection>(
    field: K,
    value: RoomShowcaseSection[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionEditor 
      title="🏠 Room Showcase Section" 
      description="Phần giới thiệu phòng nghỉ"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Phòng nghỉ"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề</label>
          <Input
            value={data.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Lựa chọn phòng tại Coco Island"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description || ''}
          onChange={(value) => updateField('description', value)}
          placeholder="Các bungalow gỗ nhìn thẳng ra sông..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Text CTA</label>
            <Input
              value={data.ctaText || ''}
              onChange={(e) => updateField('ctaText', e.target.value)}
              placeholder="Liên hệ đặt phòng"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link CTA</label>
            <Input
              value={data.ctaHref || ''}
              onChange={(e) => updateField('ctaHref', e.target.value)}
              placeholder="#booking"
            />
          </div>
        </div>
      </div>
    </SectionEditor>
  );
}
