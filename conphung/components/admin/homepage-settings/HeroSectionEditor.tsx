'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';
import { Home } from 'lucide-react';

interface HeroSectionEditorProps {
  data: {
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    heroBackgroundImage?: string | null;
    heroBackgroundImageId?: string | null;
  };
  onChange: (data: Partial<HeroSectionEditorProps['data']>) => void;
}

export function HeroSectionEditor({ data, onChange }: HeroSectionEditorProps) {
  const updateField = (field: keyof HeroSectionEditorProps['data'], value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Hero Section
        </CardTitle>
        <CardDescription>
          Banner chính trên đầu trang chủ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="heroTitle">Title</Label>
          <Input
            id="heroTitle"
            value={data.heroTitle || ''}
            onChange={(e) => updateField('heroTitle', e.target.value)}
            placeholder="DU LỊCH SINH THÁI CỒN PHỤNG"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Subtitle</Label>
          <Input
            id="heroSubtitle"
            value={data.heroSubtitle || ''}
            onChange={(e) => updateField('heroSubtitle', e.target.value)}
            placeholder="KHÁM PHÁ THIÊN NHIÊN MIỀN TÂY"
          />
        </div>

        {/* Background Image */}
        <div className="space-y-2">
          <Label>Background Image</Label>
          <ImageUpload
            currentImage={data.heroBackgroundImage || null}
            currentImageId={data.heroBackgroundImageId || null}
            field="heroBackgroundImage"
            onUpload={(url, publicId) => {
              updateField('heroBackgroundImage', url);
              updateField('heroBackgroundImageId', publicId);
            }}
            onRemove={() => {
              updateField('heroBackgroundImage', null);
              updateField('heroBackgroundImageId', null);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

