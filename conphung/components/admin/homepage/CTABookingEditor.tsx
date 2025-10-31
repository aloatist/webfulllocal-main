'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Phone } from 'lucide-react';
import type { CTABookingSection } from '@/lib/homepage/schema';

interface CTABookingEditorProps {
  data?: CTABookingSection;
  onChange: (data: CTABookingSection) => void;
}

export default function CTABookingEditor({ data, onChange }: CTABookingEditorProps) {
  const [newFeature, setNewFeature] = useState('');

  const cta = data || {
    heading: 'LIÊN HỆ ĐẶT TOUR NGAY',
    description: 'Đội ngũ hỗ trợ 24/7 sẵn sàng phục vụ bạn',
    ctaText: 'ĐẶT TOUR NGAY',
    ctaLink: '/dat-tour',
    phone: '0987 654 321',
    features: [
      '✓ Tư vấn miễn phí',
      '✓ Hỗ trợ 24/7',
      '✓ Giá tốt nhất',
    ],
  };

  const updateField = (field: keyof CTABookingSection, value: any) => {
    onChange({ ...cta, [field]: value });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      onChange({
        ...cta,
        features: [...cta.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    onChange({
      ...cta,
      features: cta.features.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          CTA Booking Section
        </CardTitle>
        <CardDescription>
          Quản lý section kêu gọi hành động đặt tour
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={cta.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="LIÊN HỆ ĐẶT TOUR NGAY"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={cta.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Hỗ trợ 24/7..."
              rows={2}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <Label>📞 Hotline</Label>
          <Input
            value={cta.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="0987 654 321"
          />
        </div>

        {/* CTA Button */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={cta.ctaText}
              onChange={(e) => updateField('ctaText', e.target.value)}
              placeholder="ĐẶT TOUR NGAY"
            />
          </div>

          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={cta.ctaLink}
              onChange={(e) => updateField('ctaLink', e.target.value)}
              placeholder="/dat-tour"
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Đặc điểm nổi bật ({cta.features.length})</Label>
          </div>

          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              placeholder="VD: ✓ Tư vấn miễn phí"
            />
            <Button onClick={addFeature} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </div>

          <div className="space-y-2">
            {cta.features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-center p-3 bg-muted rounded-lg">
                <span className="text-sm flex-1">{feature}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="p-8 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-white text-center space-y-4">
            <h2 className="text-3xl font-bold">{cta.heading}</h2>
            <p className="text-lg opacity-90">{cta.description}</p>
            
            <div className="space-y-2">
              {cta.features.map((feature, i) => (
                <p key={i} className="text-sm">{feature}</p>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 pt-4">
              <a href={`tel:${cta.phone.replace(/\s/g, '')}`} className="text-2xl font-bold">
                📞 {cta.phone}
              </a>
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
                {cta.ctaText}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
