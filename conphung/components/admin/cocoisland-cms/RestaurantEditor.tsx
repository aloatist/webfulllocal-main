'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Utensils } from 'lucide-react';
import type { RestaurantSection } from '@/lib/cocoisland/schema';

interface RestaurantEditorProps {
  data: RestaurantSection;
  onChange: (data: RestaurantSection) => void;
}

export function RestaurantEditor({ data, onChange }: RestaurantEditorProps) {
  const updateField = (field: keyof RestaurantSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Restaurant Section
        </CardTitle>
        <CardDescription>
          Nhà hàng và ẩm thực tại Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow</Label>
          <Input
            value={data.eyebrow}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Eat & Drink"
          />
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nhà hàng - Ẩm thực"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Thưởng thức đặc sản miền Tây..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={data.image}
            onChange={(e) => updateField('image', e.target.value)}
            placeholder="/cocoisland/..."
          />
          {data.image && (
            <img src={data.image} alt="Restaurant" className="w-full max-w-md h-48 object-cover rounded-lg border" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}


