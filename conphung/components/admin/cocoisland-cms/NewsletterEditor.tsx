'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import type { NewsletterSection } from '@/lib/cocoisland/schema';

interface NewsletterEditorProps {
  data: NewsletterSection;
  onChange: (data: NewsletterSection) => void;
}

export function NewsletterEditor({ data, onChange }: NewsletterEditorProps) {
  const updateField = (field: keyof NewsletterSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Newsletter Section
        </CardTitle>
        <CardDescription>
          Form đăng ký nhận tin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nhận khuyến mãi từ chúng tôi"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Đăng ký để nhận tin ưu đãi..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}


