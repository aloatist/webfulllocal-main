'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Home } from 'lucide-react';
import type { RoomShowcaseSection } from '@/lib/cocoisland/schema';

interface RoomShowcaseEditorProps {
  data: RoomShowcaseSection;
  onChange: (data: RoomShowcaseSection) => void;
}

export function RoomShowcaseEditor({ data, onChange }: RoomShowcaseEditorProps) {
  const updateField = (field: keyof RoomShowcaseSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Room Showcase Section
        </CardTitle>
        <CardDescription>
          Phần giới thiệu và showcase phòng nghỉ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow Text</Label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Phòng nghỉ"
          />
        </div>

        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={data.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Lựa chọn phòng tại Coco Island"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Các bungalow gỗ nhìn thẳng ra sông..."
            rows={4}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input
              value={data.ctaText || ''}
              onChange={(e) => updateField('ctaText', e.target.value)}
              placeholder="Liên hệ đặt phòng"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={data.ctaHref || ''}
              onChange={(e) => updateField('ctaHref', e.target.value)}
              placeholder="#booking"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

