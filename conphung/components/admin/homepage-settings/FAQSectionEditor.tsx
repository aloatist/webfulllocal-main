'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from './StyleEditor';
import { HelpCircle, Plus, X, Palette } from 'lucide-react';
import type { FAQSection } from '@/lib/homepage/schema';

interface FAQSectionEditorProps {
  data?: FAQSection | null;
  onChange: (data: FAQSection) => void;
}

export function FAQSectionEditor({ data, onChange }: FAQSectionEditorProps) {
  // Initialize default data structure - use useMemo to ensure it updates when data changes
  const currentData: FAQSection = useMemo(() => {
    return data || {
      items: [],
      isActive: true,
      isVisible: true,
    };
  }, [data]);

  const updateField = (field: keyof FAQSection, value: any) => {
    // Always use the latest data from props to ensure we have the most current state
    const baseData: FAQSection = data || {
      items: [],
      isActive: true,
      isVisible: true,
    };
    
    const updatedData: FAQSection = {
      ...baseData,
      [field]: value,
      // Preserve items if not updating items field
      items: field === 'items' ? value : (baseData.items || []),
      // Preserve isActive if not updating isActive field  
      isActive: field === 'isActive' ? value : (baseData.isActive !== false),
      // Preserve isVisible
      isVisible: baseData.isVisible !== false,
    };
    
    onChange(updatedData);
  };

  const addFAQ = () => {
    const baseData: FAQSection = data || { items: [], isActive: true, isVisible: true };
    const items = baseData.items || [];
    const newItems = [...items, { question: '', answer: '' }];
    updateField('items', newItems);
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const baseData: FAQSection = data || { items: [], isActive: true, isVisible: true };
    const items = [...(baseData.items || [])];
    if (items[index]) {
      items[index] = {
        ...items[index],
        [field]: value,
      };
      updateField('items', items);
    }
  };

  const removeFAQ = (index: number) => {
    const baseData: FAQSection = data || { items: [], isActive: true, isVisible: true };
    const items = [...(baseData.items || [])];
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      updateField('items', items);
    }
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
            value={currentData.heading || ''}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="Câu hỏi thường gặp"
          />
        </div>

        {/* Heading Styling */}
        <Collapsible
          title="Heading Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Heading"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={currentData.styles?.heading}
              onChange={(style) => {
                const baseData: FAQSection = data || {
                  items: [],
                  isActive: true,
                  isVisible: true,
                };
                onChange({ 
                  ...baseData, 
                  styles: { 
                    ...baseData.styles, 
                    heading: style 
                  } 
                });
              }}
              title="Heading Styling"
            />
          </div>
        </Collapsible>

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
            {(currentData.items || []).map((faq, index) => (
              <Card key={`faq-${index}-${faq.question?.substring(0, 10) || index}`} className="bg-muted/50">
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
                      aria-label={`Xóa FAQ #${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={faq.question || ''}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="Câu hỏi?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer || ''}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="Câu trả lời..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!currentData.items || currentData.items.length === 0) && (
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
            checked={currentData.isActive !== false}
            onChange={(e) => updateField('isActive', e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="faqIsActive">Hiển thị FAQ section trên trang chủ</Label>
        </div>

        {/* Container Styling */}
        <Collapsible
          title="Container Styling"
          description="Tùy chỉnh styling cho toàn bộ section container"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
          className="border-t pt-4"
        >
          <div className="pt-2">
            <StyleEditor
              style={currentData.styles?.container}
              onChange={(style) => {
                const baseData: FAQSection = data || {
                  items: [],
                  isActive: true,
                  isVisible: true,
                };
                onChange({ 
                  ...baseData, 
                  styles: { 
                    ...baseData.styles, 
                    container: style 
                  } 
                });
              }}
              title="Container Styling"
            />
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

