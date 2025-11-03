'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import type { ServicesSection } from '@/lib/cocoisland/schema';

interface ServicesEditorProps {
  data: ServicesSection;
  onChange: (data: ServicesSection) => void;
}

export function ServicesEditor({ data, onChange }: ServicesEditorProps) {
  const updateService = (index: number, field: 'title' | 'description', value: string) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], [field]: value };
    onChange({ ...data, services: newServices });
  };

  const addService = () => {
    onChange({
      ...data,
      services: [...data.services, { title: '', description: '' }],
    });
  };

  const removeService = (index: number) => {
    onChange({
      ...data,
      services: data.services.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Services Section
        </CardTitle>
        <CardDescription>
          Các dịch vụ tại Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow Text</Label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => onChange({ ...data, eyebrow: e.target.value })}
            placeholder="Dịch vụ"
          />
        </div>

        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Dịch vụ tại Coco Island"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={addService}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm Service
          </Button>
        </div>

        <div className="space-y-6">
          {data.services.map((service, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Service {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(index, 'title', e.target.value)}
                  placeholder="Đón tiếp tại bến tàu"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(index, 'description', e.target.value)}
                  placeholder="Hướng dẫn viên hỗ trợ..."
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


