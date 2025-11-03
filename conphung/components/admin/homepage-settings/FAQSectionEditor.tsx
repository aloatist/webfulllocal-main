'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { HelpCircle, Plus, X } from 'lucide-react';
import type { FAQSection } from '@/lib/homepage/schema';

interface FAQSectionEditorProps {
  data?: FAQSection | null;
  onChange: (data: FAQSection) => void;
}

export function FAQSectionEditor({ data, onChange }: FAQSectionEditorProps) {
  const updateField = (field: keyof FAQSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
      items: data?.items || [],
      isActive: data?.isActive !== false,
    } as FAQSection);
  };

  const addFAQ = () => {
    const items = data?.items || [];
    updateField('items', [...items, { question: '', answer: '' }]);
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const items = [...(data?.items || [])];
    items[index] = {
      ...items[index],
      [field]: value,
    };
    updateField('items', items);
  };

  const removeFAQ = (index: number) => {
    const items = [...(data?.items || [])];
    items.splice(index, 1);
    updateField('items', items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          FAQ Section
        </CardTitle>
        <CardDescription>
          Câu hỏi thường gặp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heading */}
        <div className="space-y-2">
          <Label htmlFor="faqHeading">Heading (Optional)</Label>
          <Input
            id="faqHeading"
            value={data?.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Câu hỏi thường gặp"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>FAQ Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFAQ}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm FAQ
            </Button>
          </div>

          <div className="space-y-4">
            {(data?.items || []).map((faq, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      FAQ #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFAQ(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="Câu hỏi?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="Câu trả lời..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!data?.items || data.items.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có FAQ nào. Click &ldquo;Thêm FAQ&rdquo; để thêm.
              </p>
            )}
          </div>
        </div>

        {/* Is Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="faqIsActive"
            checked={data?.isActive !== false}
            onChange={(e) => updateField('isActive', e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="faqIsActive">Hiển thị FAQ section trên trang chủ</Label>
        </div>
      </CardContent>
    </Card>
  );
}

