'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Home } from 'lucide-react';
import type { HeroSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface HeroEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export default function HeroEditor({ data, onChange }: HeroEditorProps) {
  const updateField = (field: keyof HeroSection, value: any) => {
    onChange({ ...data, [field]: value });
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
        {/* Main Title */}
        <div className="space-y-2">
          <Label>Main Title</Label>
          <Input
            value={data.mainTitle}
            onChange={(e) => updateField('mainTitle', e.target.value)}
            placeholder="DU LỊCH SINH THÁI CỒN PHỤNG"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={data.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="KHÁM PHÁ THIÊN NHIÊN MIỀN TÂY"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Trải nghiệm thiên nhiên xanh mát..."
            rows={3}
          />
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>📞 Phone</Label>
            <Input
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="0123 456 789"
            />
          </div>

          <div className="space-y-2">
            <Label>🕐 Opening Hours</Label>
            <Input
              value={data.openingHours}
              onChange={(e) => updateField('openingHours', e.target.value)}
              placeholder="7:00 - 18:00"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>📍 Address</Label>
          <Input
            value={data.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Cồn Phụng, Bến Tre"
          />
        </div>

        {/* Background Image */}
        <ImagePicker
          value={data.backgroundImage}
          onChange={(url) => updateField('backgroundImage', url)}
          label="🖼️ Background Image"
          aspectRatio="16/9"
        />

        {/* CTA Buttons */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Call-to-Action Buttons</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA Text</Label>
              <Input
                value={data.primaryCta.text}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, text: e.target.value })}
                placeholder="ĐẶT TOUR NGAY"
              />
            </div>

            <div className="space-y-2">
              <Label>Primary CTA Link</Label>
              <Input
                value={data.primaryCta.link}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, link: e.target.value })}
                placeholder="/dat-tour"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Secondary CTA Text</Label>
              <Input
                value={data.secondaryCta.text}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, text: e.target.value })}
                placeholder="XEM CHI TIẾT"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary CTA Link</Label>
              <Input
                value={data.secondaryCta.link}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, link: e.target.value })}
                placeholder="/gioi-thieu"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div 
            className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center text-white"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center space-y-4 p-8">
              <h1 className="text-4xl font-bold">{data.mainTitle}</h1>
              <h2 className="text-2xl">{data.subtitle}</h2>
              <p className="text-lg max-w-2xl mx-auto">{data.description}</p>
              <div className="flex gap-4 justify-center mt-6">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">
                  {data.primaryCta.text}
                </button>
                <button className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold">
                  {data.secondaryCta.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
