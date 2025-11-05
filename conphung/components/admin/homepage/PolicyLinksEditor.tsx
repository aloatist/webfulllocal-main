'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Link2, Shield, CreditCard, XCircle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { PolicyLink, PolicyLinksSection } from '@/lib/homepage/schema';

interface PolicyLinksEditorProps {
  data?: PolicyLinksSection;
  onChange: (data: PolicyLinksSection) => void;
}

const DEFAULT_TITLE = 'Chính Sách & Điều Khoản';
const DEFAULT_SUBTITLE = 'Minh bạch, rõ ràng, bảo vệ quyền lợi khách hàng';
const DEFAULT_BOTTOM_TEXT = '📄 Tất cả chính sách tuân thủ theo quy định của pháp luật Việt Nam';

const ICON_OPTIONS = [
  { value: '🔒', label: 'Privacy', icon: Shield },
  { value: '💳', label: 'Payment', icon: CreditCard },
  { value: '❌', label: 'Cancellation', icon: XCircle },
  { value: '📋', label: 'Terms', icon: FileText },
  { value: '✓', label: 'Check' },
  { value: '📄', label: 'Document' },
  { value: '🛡️', label: 'Shield' },
  { value: '⚖️', label: 'Balance' },
];

export default function PolicyLinksEditor({ data, onChange }: PolicyLinksEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Merge with defaults to ensure title, subtitle, bottomText are always present
  const policyData: PolicyLinksSection = {
    title: data?.title || DEFAULT_TITLE,
    subtitle: data?.subtitle || DEFAULT_SUBTITLE,
    bottomText: data?.bottomText || DEFAULT_BOTTOM_TEXT,
    links: data?.links || [],
  };

  const updateSection = (updates: Partial<PolicyLinksSection>) => {
    onChange({
      ...policyData,
      ...updates,
    });
  };

  const addLink = () => {
    const newLink: PolicyLink = {
      title: 'Chính sách mới',
      href: '/chinh-sach',
      icon: '📋',
    };
    updateSection({
      links: [...policyData.links, newLink],
    });
    setExpandedIndex(policyData.links.length);
  };

  const updateLink = (index: number, updates: Partial<PolicyLink>) => {
    const newLinks = [...policyData.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateSection({ links: newLinks });
  };

  const deleteLink = (index: number) => {
    if (confirm('Xóa link này?')) {
      const newLinks = policyData.links.filter((_, i) => i !== index);
      updateSection({ links: newLinks });
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
    }
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...policyData.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    updateSection({ links: newLinks });
    setExpandedIndex(targetIndex);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Policy Links Section
            </CardTitle>
            <CardDescription>
              Quản lý các link chính sách, điều khoản (4 links thường dùng)
            </CardDescription>
          </div>
          <Button onClick={addLink} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Link
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section Title */}
        <div className="space-y-2">
          <Label>Tiêu đề Section</Label>
          <Input
            value={policyData.title}
            onChange={(e) => updateSection({ title: e.target.value })}
            placeholder={DEFAULT_TITLE}
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label>Phụ đề (Subtitle)</Label>
          <Input
            value={policyData.subtitle}
            onChange={(e) => updateSection({ subtitle: e.target.value })}
            placeholder={DEFAULT_SUBTITLE}
          />
        </div>

        {/* Bottom Text */}
        <div className="space-y-2">
          <Label>Text dưới cùng (Bottom Text)</Label>
          <Textarea
            value={policyData.bottomText}
            onChange={(e) => updateSection({ bottomText: e.target.value })}
            placeholder={DEFAULT_BOTTOM_TEXT}
            rows={2}
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4">Danh sách Policy Links</h4>
        </div>

        {policyData.links.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Chưa có policy link nào</p>
            <Button onClick={addLink} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Link Đầu Tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {policyData.links.map((link, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLink(index, 'up')}
                        disabled={index === 0}
                        className="h-6 px-2"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLink(index, 'down')}
                        disabled={index === policyData.links.length - 1}
                        className="h-6 px-2"
                      >
                        ↓
                      </Button>
                    </div>
                    
                    <div className="text-2xl">{link.icon}</div>
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <h4 className="font-semibold">{link.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {link.href}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      {expandedIndex === index ? '▼' : '▶'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLink(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {expandedIndex === index && (
                  <CardContent className="space-y-4 pt-0 border-t">
                    {/* Icon Selection */}
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="grid grid-cols-8 gap-2">
                        {ICON_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateLink(index, { icon: option.value })}
                            className={`p-3 rounded-lg border-2 text-2xl hover:border-primary transition-colors ${
                              link.icon === option.value ? 'border-primary bg-primary/10' : 'border-border'
                            }`}
                            title={option.label}
                          >
                            {option.value}
                          </button>
                        ))}
                      </div>
                      <Input
                        value={link.icon}
                        onChange={(e) => updateLink(index, { icon: e.target.value })}
                        placeholder="Hoặc nhập emoji"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label>Tiêu đề</Label>
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(index, { title: e.target.value })}
                        placeholder="CHÍNH SÁCH BẢO MẬT"
                      />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                      <Label>URL (href)</Label>
                      <Input
                        value={link.href}
                        onChange={(e) => updateLink(index, { href: e.target.value })}
                        placeholder="/chinh-sach-bao-mat"
                        type="url"
                      />
                      <p className="text-xs text-muted-foreground">
                        Có thể dùng relative URL (/page) hoặc absolute URL (https://...)
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow">
                        <a 
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center text-center no-underline"
                        >
                          <div className="text-2xl mb-2">{link.icon}</div>
                          <span className="font-semibold text-sm">{link.title}</span>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="text-sm">
            <strong>{policyData.links.length}</strong> policy links
            {policyData.links.length !== 4 && (
              <span className="text-orange-600 ml-2">
                (Khuyến nghị: 4 links)
              </span>
            )}
          </div>
          {policyData.links.length < 4 && (
            <Button onClick={addLink} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
