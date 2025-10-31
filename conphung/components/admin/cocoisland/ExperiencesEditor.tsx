'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { Experience } from '@/lib/cocoisland/schema';

interface ExperiencesEditorProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  experiences: Experience[];
  onChange: (eyebrow: string | undefined, heading: string | undefined, description: string | undefined, experiences: Experience[]) => void;
}

export function ExperiencesEditor({ eyebrow, heading, description, experiences, onChange }: ExperiencesEditorProps) {
  const addExperience = () => {
    onChange(eyebrow, heading, description, [
      ...experiences,
      { title: '', description: '', image: '' },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(eyebrow, heading, description, experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange(eyebrow, heading, description, newExperiences);
  };

  return (
    <SectionEditor 
      title="✨ Trải nghiệm" 
      description="Các trải nghiệm đặc biệt tại Coco Island"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={eyebrow || ''}
            onChange={(e) => onChange(e.target.value, heading, description, experiences)}
            placeholder="Trải nghiệm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề chính</label>
          <Input
            value={heading || ''}
            onChange={(e) => onChange(eyebrow, e.target.value, description, experiences)}
            placeholder="Coco Island chính chủ – điểm đến chuẩn miền Tây"
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={description || ''}
          onChange={(value) => onChange(eyebrow, heading, value, experiences)}
          placeholder="Hành trình tái tạo năng lượng..."
          rows={3}
        />

        <div className="space-y-4">
          <label className="text-sm font-medium">Danh sách trải nghiệm</label>
          {experiences.map((experience, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input
                  value={experience.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Cầu dừa dài nhất miền Tây"
                />
              </div>

              <RichTextEditor
                label="Mô tả"
                value={experience.description}
                onChange={(value) => updateExperience(index, 'description', value)}
                placeholder="Cây cầu dừa dài 300 m..."
                rows={3}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm trải nghiệm
        </Button>
      </div>
    </SectionEditor>
  );
}
