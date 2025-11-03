'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Gift, Plus, Trash2 } from 'lucide-react';
import type { StayPerksSection } from '@/lib/cocoisland/schema';

interface StayPerksEditorProps {
  data: StayPerksSection;
  onChange: (data: StayPerksSection) => void;
}

export function StayPerksEditor({ data, onChange }: StayPerksEditorProps) {
  const updateHeading = (heading: string) => {
    onChange({ ...data, heading });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({ ...data, items: [...data.items, ''] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Stay Perks Section
        </CardTitle>
        <CardDescription>
          Các ưu đãi khi nghỉ tại Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heading */}
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={data.heading}
            onChange={(e) => updateHeading(e.target.value)}
            placeholder="Chế độ ưu đãi phòng nghỉ & ăn sáng"
          />
        </div>

        {/* CTA */}
        <div className="grid md:grid-cols-2 gap-4 rounded-lg border p-4">
          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input
              value={data.ctaText || ''}
              onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
              placeholder="Xem toàn bộ phòng"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={data.ctaHref || ''}
              onChange={(e) => onChange({ ...data, ctaHref: e.target.value })}
              placeholder="#rooms"
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm Item
            </Button>
          </div>
          
          {data.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="2 chai nước suối mỗi ngày"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


