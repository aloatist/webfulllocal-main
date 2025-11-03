'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointerClick } from 'lucide-react';

interface CTASectionEditorProps {
  data: {
    ctaTitle?: string | null;
    ctaButtonText?: string | null;
    ctaButtonLink?: string | null;
  };
  onChange: (data: Partial<CTASectionEditorProps['data']>) => void;
}

export function CTASectionEditor({ data, onChange }: CTASectionEditorProps) {
  const updateField = (field: keyof CTASectionEditorProps['data'], value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointerClick className="w-5 h-5" />
          CTA Section
        </CardTitle>
        <CardDescription>
          Call-to-action section - Kêu gọi hành động
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="ctaTitle">Title</Label>
          <Input
            id="ctaTitle"
            value={data.ctaTitle || ''}
            onChange={(e) => updateField('ctaTitle', e.target.value)}
            placeholder="Sẵn sàng bắt đầu hành trình của bạn?"
          />
        </div>

        {/* Button Text */}
        <div className="space-y-2">
          <Label htmlFor="ctaButtonText">Button Text</Label>
          <Input
            id="ctaButtonText"
            value={data.ctaButtonText || ''}
            onChange={(e) => updateField('ctaButtonText', e.target.value)}
            placeholder="Đặt tour ngay"
          />
        </div>

        {/* Button Link */}
        <div className="space-y-2">
          <Label htmlFor="ctaButtonLink">Button Link</Label>
          <Input
            id="ctaButtonLink"
            value={data.ctaButtonLink || ''}
            onChange={(e) => updateField('ctaButtonLink', e.target.value)}
            placeholder="/tours hoặc tel:+84918267715"
          />
          <p className="text-sm text-muted-foreground">
            Có thể là đường dẫn nội bộ (/tours) hoặc liên kết bên ngoài (tel:, mailto:, https://)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

