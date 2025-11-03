'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import type { ContactSection } from '@/lib/cocoisland/schema';

interface ContactEditorProps {
  data: ContactSection;
  onChange: (data: ContactSection) => void;
}

export function ContactEditor({ data, onChange }: ContactEditorProps) {
  const updateField = (field: keyof ContactSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contact Section
        </CardTitle>
        <CardDescription>
          Thông tin liên hệ Coco Island
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+84 918 267 715"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="conphungtourist87@gmail.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={data.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="89P9+GRW, Tân Thạch..."
          />
        </div>

        <div className="space-y-2">
          <Label>Map URL</Label>
          <Input
            value={data.mapUrl}
            onChange={(e) => updateField('mapUrl', e.target.value)}
            placeholder="https://goo.gl/maps/..."
          />
        </div>

        <div className="space-y-2">
          <Label>Hotline Label</Label>
          <Input
            value={data.hotlineLabel}
            onChange={(e) => updateField('hotlineLabel', e.target.value)}
            placeholder="Liên hệ đặt phòng"
          />
        </div>
      </CardContent>
    </Card>
  );
}


