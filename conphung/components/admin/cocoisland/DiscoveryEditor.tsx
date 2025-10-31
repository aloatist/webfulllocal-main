'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { DiscoverySection } from '@/lib/cocoisland/schema';

interface DiscoveryEditorProps {
  data: DiscoverySection;
  onChange: (data: DiscoverySection) => void;
}

export function DiscoveryEditor({ data, onChange }: DiscoveryEditorProps) {
  const updateField = <K extends keyof DiscoverySection>(
    field: K,
    value: DiscoverySection[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addHighlight = () => {
    onChange({ ...data, highlights: [...data.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    onChange({ ...data, highlights: data.highlights.filter((_, i) => i !== index) });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...data.highlights];
    newHighlights[index] = value;
    onChange({ ...data, highlights: newHighlights });
  };

  return (
    <SectionEditor 
      title="🗺️ Khám phá" 
      description="Chương trình tour và trải nghiệm"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Chương trình"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề</label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Khám phá vùng đất Tứ Linh..."
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description}
          onChange={(value) => updateField('description', value)}
          placeholder="Lịch trình cano / đò..."
          rows={4}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Điểm nổi bật</label>
          {data.highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder="Tham quan cồn Long – Lân – Quy – Phụng"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeHighlight(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addHighlight}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm điểm nổi bật
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
