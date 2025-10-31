'use client';

import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { ContactSection } from '@/lib/cocoisland/schema';

interface ContactEditorProps {
  data: ContactSection;
  onChange: (data: ContactSection) => void;
}

export function ContactEditor({ data, onChange }: ContactEditorProps) {
  const updateField = <K extends keyof ContactSection>(field: K, value: ContactSection[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionEditor 
      title="📞 Thông tin liên hệ" 
      description="Địa chỉ, điện thoại, email"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Liên hệ"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề hotline</label>
          <Input
            value={data.hotlineLabel || ''}
            onChange={(e) => updateField('hotlineLabel', e.target.value)}
            placeholder="Liên hệ đặt phòng"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description || ''}
          onChange={(value) => updateField('description', value)}
          placeholder="Đội ngũ tư vấn của Coco Island..."
          rows={3}
        />

        <div>
          <label className="text-sm font-medium">Số điện thoại</label>
          <Input
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+84 918 267 715"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="info@cocoisland.vn"
            type="email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Địa chỉ</label>
          <Input
            value={data.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="89P9+GRW, Tân Thạch, Châu Thành, Bến Tre"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Google Maps URL</label>
          <Input
            value={data.mapUrl || ''}
            onChange={(e) => updateField('mapUrl', e.target.value)}
            placeholder="https://goo.gl/maps/..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề form</label>
          <Input
            value={data.formHeading || ''}
            onChange={(e) => updateField('formHeading', e.target.value)}
            placeholder="Gửi yêu cầu tư vấn"
          />
        </div>

        <RichTextEditor
          label="Mô tả form"
          value={data.formDescription || ''}
          onChange={(value) => updateField('formDescription', value)}
          placeholder="Điền thông tin để nhận báo giá..."
          rows={2}
        />
      </div>
    </SectionEditor>
  );
}
