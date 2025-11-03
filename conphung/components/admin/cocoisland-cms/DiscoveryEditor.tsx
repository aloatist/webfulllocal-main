'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Map, Plus, Trash2 } from 'lucide-react';
import type { DiscoverySection } from '@/lib/cocoisland/schema';

interface DiscoveryEditorProps {
  data: DiscoverySection;
  onChange: (data: DiscoverySection) => void;
}

export function DiscoveryEditor({ data, onChange }: DiscoveryEditorProps) {
  const updateField = (field: keyof DiscoverySection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...data.highlights];
    newHighlights[index] = value;
    updateField('highlights', newHighlights);
  };

  const addHighlight = () => {
    updateField('highlights', [...data.highlights, '']);
  };

  const removeHighlight = (index: number) => {
    updateField('highlights', data.highlights.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          Discovery Section
        </CardTitle>
        <CardDescription>
          Khám phá vùng đất Tứ Linh
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow</Label>
          <Input
            value={data.eyebrow}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Chương trình"
          />
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Khám phá vùng đất Tứ Linh..."
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Highlights</Label>
            <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          
          {data.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder="Tham quan cồn Long – Lân – Quy – Phụng"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeHighlight(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={data.image}
            onChange={(e) => updateField('image', e.target.value)}
          />
          {data.image && (
            <img src={data.image} alt="Discovery" className="w-full max-w-md h-48 object-cover rounded-lg border" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}


