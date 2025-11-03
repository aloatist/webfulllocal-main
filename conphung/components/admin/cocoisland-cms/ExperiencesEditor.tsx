'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Compass, Plus, Trash2 } from 'lucide-react';
import type { ExperiencesSection } from '@/lib/cocoisland/schema';

interface ExperiencesEditorProps {
  data: ExperiencesSection;
  onChange: (data: ExperiencesSection) => void;
}

export function ExperiencesEditor({ data, onChange }: ExperiencesEditorProps) {
  const updateExperience = (index: number, field: 'title' | 'description', value: string) => {
    const newExperiences = [...data.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange({ ...data, experiences: newExperiences });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experiences: [...data.experiences, { title: '', description: '' }],
    });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="w-5 h-5" />
          Experiences Section
        </CardTitle>
        <CardDescription>
          Các trải nghiệm độc đáo tại Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow Text</Label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => onChange({ ...data, eyebrow: e.target.value })}
            placeholder="Trải nghiệm"
          />
        </div>

        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Coco Island chính chủ – điểm đến chuẩn miền Tây"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Hành trình tái tạo năng lượng của bạn..."
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={addExperience}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm Experience
          </Button>
        </div>

        <div className="space-y-6">
          {data.experiences.map((exp, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Experience {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Cầu dừa dài nhất miền Tây"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Mô tả trải nghiệm..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


