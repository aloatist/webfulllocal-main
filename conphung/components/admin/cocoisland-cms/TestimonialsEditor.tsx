'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import type { TestimonialsSection } from '@/lib/cocoisland/schema';

interface TestimonialsEditorProps {
  data: TestimonialsSection;
  onChange: (data: TestimonialsSection) => void;
}

export function TestimonialsEditor({ data, onChange }: TestimonialsEditorProps) {
  const updateTestimonial = (index: number, field: 'author' | 'role' | 'quote', value: string) => {
    const newTestimonials = [...data.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onChange({ ...data, testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    onChange({
      ...data,
      testimonials: [...data.testimonials, { author: '', role: '', quote: '' }],
    });
  };

  const removeTestimonial = (index: number) => {
    onChange({
      ...data,
      testimonials: data.testimonials.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Testimonials Section
        </CardTitle>
        <CardDescription>
          Đánh giá từ khách hàng đã trải nghiệm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow Text</Label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => onChange({ ...data, eyebrow: e.target.value })}
            placeholder="Đánh giá"
          />
        </div>

        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Nhận xét từ khách hàng"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm Testimonial
          </Button>
        </div>

        <div className="space-y-6">
          {data.testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Testimonial {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                    placeholder="Nguyễn Minh Hữu"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={testimonial.role}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                    placeholder="Khách đoàn công ty"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quote</Label>
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                  placeholder="Coco Island rất đẹp..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


