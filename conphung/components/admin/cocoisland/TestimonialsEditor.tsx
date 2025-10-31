'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { Testimonial } from '@/lib/cocoisland/schema';

interface TestimonialsEditorProps {
  eyebrow?: string;
  heading?: string;
  testimonials: Testimonial[];
  onChange: (data: { eyebrow?: string; heading?: string; testimonials: Testimonial[] }) => void;
}

export function TestimonialsEditor({ eyebrow, heading, testimonials, onChange }: TestimonialsEditorProps) {
  const addTestimonial = () => {
    onChange({ eyebrow, heading, testimonials: [
      ...testimonials,
      { author: '', role: '', quote: '', avatar: '' },
    ] });
  };

  const removeTestimonial = (index: number) => {
    onChange({ eyebrow, heading, testimonials: testimonials.filter((_, i) => i !== index) });
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onChange({ eyebrow, heading, testimonials: newTestimonials });
  };

  return (
    <SectionEditor 
      title="💬 Đánh giá khách hàng" 
      description="Nhận xét từ khách đã trải nghiệm"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={eyebrow || ''}
            onChange={(e) => onChange({ eyebrow: e.target.value, heading, testimonials })}
            placeholder="Khách hàng nói gì"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề phần</label>
          <Input
            value={heading || ''}
            onChange={(e) => onChange({ eyebrow, heading: e.target.value, testimonials })}
            placeholder="Những lời yêu thương dành cho Coco Island"
          />
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeTestimonial(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tên khách hàng</label>
                  <Input
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vai trò</label>
                  <Input
                    value={testimonial.role || ''}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                    placeholder="Khách đoàn công ty"
                  />
                </div>
              </div>

              <RichTextEditor
                label="Nhận xét"
                value={testimonial.quote}
                onChange={(value) => updateTestimonial(index, 'quote', value)}
                placeholder="Homestay rất đẹp..."
                rows={3}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addTestimonial}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm đánh giá
        </Button>
      </div>
    </SectionEditor>
  );
}
