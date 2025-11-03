'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HeroSection } from '@/lib/cocoisland/schema';

interface HeroEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  const updateField = (field: keyof HeroSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateField('stats', newStats);
  };

  const addStat = () => {
    updateField('stats', [...data.stats, { label: '', value: '' }]);
  };

  const removeStat = (index: number) => {
    updateField('stats', data.stats.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Hero Section
        </CardTitle>
        <CardDescription>
          Banner chính trên đầu trang Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eyebrow */}
        <div className="space-y-2">
          <Label>Eyebrow Text</Label>
          <Input
            value={data.eyebrow}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Homestay Coco Island"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Trải nghiệm lưu trú chính chủ..."
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Mô tả về Coco Island..."
            rows={4}
          />
        </div>

        {/* Primary CTA */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold">Primary CTA</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={data.primaryCta.label}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, label: e.target.value })}
                placeholder="Đặt ngay"
              />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={data.primaryCta.href}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, href: e.target.value })}
                placeholder="#booking"
              />
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold">Secondary CTA</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={data.secondaryCta.label}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, label: e.target.value })}
                placeholder="Xem phòng"
              />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={data.secondaryCta.href}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, href: e.target.value })}
                placeholder="#rooms"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Stats</h3>
            <Button type="button" variant="outline" size="sm" onClick={addStat}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm Stat
            </Button>
          </div>
          
          <div className="space-y-3">
            {data.stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="space-y-2">
          <Label>Hero Image URL</Label>
          <Input
            value={data.heroImage}
            onChange={(e) => updateField('heroImage', e.target.value)}
            placeholder="/cocoisland/..."
          />
          {data.heroImage && (
            <img src={data.heroImage} alt="Hero preview" className="w-full max-w-md h-48 object-cover rounded-lg border" />
          )}
        </div>

        {/* Video */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold">Video</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={data.video.url}
                onChange={(e) => updateField('video', { ...data.video, url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Poster Image</Label>
              <Input
                value={data.video.poster}
                onChange={(e) => updateField('video', { ...data.video, poster: e.target.value })}
                placeholder="/cocoisland/..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


