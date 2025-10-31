'use client';

import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { NewsletterSection } from '@/lib/cocoisland/schema';

interface NewsletterEditorProps {
  data: NewsletterSection;
  onChange: (data: NewsletterSection) => void;
}

export function NewsletterEditor({ data, onChange }: NewsletterEditorProps) {
  const updateField = <K extends keyof NewsletterSection>(
    field: K,
    value: NewsletterSection[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionEditor 
      title="✉️ Newsletter" 
      description="Đăng ký nhận tin"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Tiêu đề</label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nhận khuyến mãi từ chúng tôi"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description}
          onChange={(value) => updateField('description', value)}
          placeholder="Đăng ký để nhận tin ưu đãi..."
          rows={3}
        />
      </div>
    </SectionEditor>
  );
}
