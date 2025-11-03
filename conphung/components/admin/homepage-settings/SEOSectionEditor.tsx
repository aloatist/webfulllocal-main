'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { SettingField } from '@/components/admin/settings/setting-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Globe, Home } from 'lucide-react';
import { defaultSettings, categoryLabels } from '@/lib/settings/types';

interface SEOSectionEditorProps {
  data: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string[];
    ogImage?: string | null;
    ogImageId?: string | null;
    canonicalUrl?: string | null;
    robotsMeta?: string | null;
  };
  onChange: (data: Partial<SEOSectionEditorProps['data']>) => void;
}

export function SEOSectionEditor({ data, onChange }: SEOSectionEditorProps) {
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  const [loadingSystemSettings, setLoadingSystemSettings] = useState(true);

  useEffect(() => {
    // Load system SEO defaults
    const loadSystemSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const result = await response.json();
          setSystemSettings(result.settings || {});
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
      } finally {
        setLoadingSystemSettings(false);
      }
    };
    loadSystemSettings();
  }, []);

  const updateField = (field: keyof SEOSectionEditorProps['data'], value: any) => {
    onChange({ [field]: value });
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    updateField('metaKeywords', keywords);
  };

  const handleSystemSettingChange = (key: string, value: string) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    // Auto-save system settings
    saveSystemSetting(key, value);
  };

  const saveSystemSetting = async (key: string, value: string) => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { [key]: value } }),
      });
    } catch (error) {
      console.error('Error saving system setting:', error);
    }
  };

  const getSEOFields = () => {
    return defaultSettings.filter(s => s.category === 'seo');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO Settings
        </CardTitle>
        <CardDescription>
          Tối ưu hóa SEO - Homepage specific và Global defaults
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Homepage SEO
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global Defaults
            </TabsTrigger>
          </TabsList>

          {/* Homepage-Specific SEO */}
          <TabsContent value="homepage" className="space-y-4 mt-4">
            <div className="rounded-lg border bg-muted/30 p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                📌 SEO settings riêng cho trang chủ. Các settings này sẽ override global defaults nếu được set.
              </p>
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={data.metaTitle || ''}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                placeholder="Du Lịch Sinh Thái Cồn Phụng - Tour Miền Tây"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {data.metaTitle?.length || 0}/60 ký tự (Khuyến nghị: 50-60)
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={data.metaDescription || ''}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                placeholder="Khám phá thiên nhiên miền Tây với tour Cồn Phụng. Trải nghiệm văn hóa, ẩm thực đặc sắc..."
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {data.metaDescription?.length || 0}/160 ký tự (Khuyến nghị: 150-160)
              </p>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={data.metaKeywords?.join(', ') || ''}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                placeholder="du lịch miền tây, tour cồn phụng, homestay, ẩm thực"
              />
              <p className="text-xs text-muted-foreground">
                Phân cách bằng dấu phẩy (,). Ví dụ: tour, homestay, miền tây
              </p>
            </div>

            {/* OG Image */}
            <div className="space-y-2">
              <Label>Open Graph Image</Label>
              <ImageUpload
                currentImage={data.ogImage || null}
                currentImageId={data.ogImageId || null}
                field="ogImage"
                onUpload={(url, publicId) => {
                  updateField('ogImage', url);
                  updateField('ogImageId', publicId);
                }}
                onRemove={() => {
                  updateField('ogImage', null);
                  updateField('ogImageId', null);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Ảnh hiển thị khi chia sẻ trên Facebook, Twitter, etc. (Khuyến nghị: 1200x630px)
              </p>
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={data.canonicalUrl || ''}
                onChange={(e) => updateField('canonicalUrl', e.target.value)}
                placeholder="https://conphungtourist.com/"
              />
              <p className="text-xs text-muted-foreground">
                URL chuẩn của trang chủ (thường để trống nếu trang chủ là URL gốc)
              </p>
            </div>

            {/* Robots Meta */}
            <div className="space-y-2">
              <Label htmlFor="robotsMeta">Robots Meta</Label>
              <Input
                id="robotsMeta"
                value={data.robotsMeta || 'index, follow'}
                onChange={(e) => updateField('robotsMeta', e.target.value)}
                placeholder="index, follow"
              />
              <p className="text-xs text-muted-foreground">
                Ví dụ: index, follow hoặc noindex, nofollow
              </p>
            </div>
          </TabsContent>

          {/* Global SEO Defaults */}
          <TabsContent value="global" className="space-y-4 mt-4">
            <div className="rounded-lg border bg-muted/30 p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                🌍 Global SEO defaults cho toàn bộ website. Sử dụng làm fallback cho các trang không có SEO riêng.
              </p>
            </div>

            {loadingSystemSettings ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getSEOFields().map(setting => (
                  <SettingField
                    key={setting.key}
                    id={setting.key}
                    label={setting.label}
                    description={setting.description}
                    type={setting.type}
                    value={systemSettings[setting.key] || setting.value}
                    onChange={(value) => handleSystemSettingChange(setting.key, value)}
                    placeholder={setting.placeholder}
                    required={setting.required}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
