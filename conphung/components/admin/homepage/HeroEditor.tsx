'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, Palette, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible } from '@/components/ui/collapsible';
import type { HeroSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';
import { StyleEditor } from '../homepage-settings/StyleEditor';
import type { Style } from '@/lib/homepage/style-schema';

interface HeroEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export default function HeroEditor({ data, onChange }: HeroEditorProps) {
  const updateField = (field: keyof HeroSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<HeroSection['visibility']>) => {
    const currentVisibility = data.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false), // Default to true if undefined
    };
    onChange({
      ...data,
      visibility: newVisibility,
    });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<HeroSection['visibility']>) => {
    return data.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<HeroSection['visibility']>, label: string) => (
    <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
      <Label htmlFor={`${fieldName}-visibility`} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        {isFieldVisible(fieldName) ? (
          <Eye className="w-4 h-4 text-muted-foreground" />
        ) : (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        )}
        <Switch
          id={`${fieldName}-visibility`}
          checked={isFieldVisible(fieldName)}
          onCheckedChange={() => toggleFieldVisibility(fieldName)}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Hero Section
        </CardTitle>
        <CardDescription>
          Banner chính trên đầu trang chủ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eyebrow / Badge Text */}
        <div className="space-y-2">
          {renderVisibilityToggle('eyebrow', 'Hiển thị Eyebrow')}
          <div className="space-y-2">
            <Label>Eyebrow / Badge Text</Label>
            <Input
              value={data.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="🌿 Du lịch Sinh Thái Chính Chủ"
              disabled={!isFieldVisible('eyebrow')}
            />
            <p className="text-xs text-muted-foreground">
              Text hiển thị trong badge phía trên tiêu đề chính
            </p>
          </div>
        </div>

        {/* Eyebrow Styling */}
        <Collapsible
          title="Eyebrow Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Eyebrow"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.styles?.eyebrow}
              onChange={(style) => {
                onChange({
                  ...data,
                  styles: { ...data.styles, eyebrow: style },
                });
              }}
              title="Eyebrow / Badge Styling"
            />
          </div>
        </Collapsible>

        {/* Main Title */}
        <div className="space-y-2">
          {renderVisibilityToggle('mainTitle', 'Hiển thị Main Title')}
          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input
              value={data.mainTitle}
              onChange={(e) => updateField('mainTitle', e.target.value)}
              placeholder="Thiên Nhiên Miền Tây"
              disabled={!isFieldVisible('mainTitle')}
            />
            <p className="text-xs text-muted-foreground">
              Tiêu đề chính hiển thị lớn nhất trong hero section
            </p>
          </div>
        </div>

        {/* Main Title Styling */}
        <Collapsible
          title="Main Title Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Main Title"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.styles?.mainTitle}
              onChange={(style) => {
                onChange({
                  ...data,
                  styles: { ...data.styles, mainTitle: style },
                });
              }}
              title="Main Title Styling"
            />
          </div>
        </Collapsible>

        {/* Subtitle */}
        <div className="space-y-2">
          {renderVisibilityToggle('subtitle', 'Hiển thị Subtitle')}
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={data.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Công Trình Kiến Trúc Đạo Dừa"
              disabled={!isFieldVisible('subtitle')}
            />
            <p className="text-xs text-muted-foreground">
              Phụ đề hiển thị dưới tiêu đề chính
            </p>
          </div>
        </div>

        {/* Subtitle Styling */}
        <Collapsible
          title="Subtitle Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Subtitle"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.styles?.subtitle}
              onChange={(style) => {
                onChange({
                  ...data,
                  styles: { ...data.styles, subtitle: style },
                });
              }}
              title="Subtitle Styling"
            />
          </div>
        </Collapsible>

        {/* Description */}
        <div className="space-y-2">
          {renderVisibilityToggle('description', 'Hiển thị Description')}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={data.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Trải nghiệm thiên nhiên xanh mát..."
              rows={3}
              disabled={!isFieldVisible('description')}
            />
          </div>
        </div>

        {/* Description Styling */}
        <Collapsible
          title="Description Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Description"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.styles?.description}
              onChange={(style) => {
                onChange({
                  ...data,
                  styles: { ...data.styles, description: style },
                });
              }}
              title="Description Styling"
            />
          </div>
        </Collapsible>

        {/* Contact Info */}
        <div className="space-y-4">
          {renderVisibilityToggle('phone', 'Hiển thị Phone')}
          {renderVisibilityToggle('openingHours', 'Hiển thị Opening Hours')}
          {renderVisibilityToggle('address', 'Hiển thị Address')}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>📞 Phone</Label>
              <Input
                value={data.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="0123 456 789"
                disabled={!isFieldVisible('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label>🕐 Opening Hours</Label>
              <Input
                value={data.openingHours}
                onChange={(e) => updateField('openingHours', e.target.value)}
                placeholder="7:00 - 18:00"
                disabled={!isFieldVisible('openingHours')}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>📍 Address</Label>
            <Input
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Cồn Phụng, Bến Tre"
              disabled={!isFieldVisible('address')}
            />
          </div>
        </div>

        {/* Background Image */}
        <div className="space-y-2">
          {renderVisibilityToggle('backgroundImage', 'Hiển thị Background Image')}
          <ImagePicker
            value={data.backgroundImage}
            onChange={(url) => updateField('backgroundImage', url)}
            label="🖼️ Background Image"
            aspectRatio="16/9"
            disabled={!isFieldVisible('backgroundImage')}
          />
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Call-to-Action Buttons</h3>
          
          <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md">
            <Label htmlFor="primaryCta-visibility" className="text-sm font-medium cursor-pointer">
              {data.primaryCta?.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Label>
            <Label htmlFor="primaryCta-visibility" className="text-sm font-medium cursor-pointer flex-1">
              Hiển thị Primary CTA
            </Label>
            <Switch
              id="primaryCta-visibility"
              checked={data.primaryCta?.isVisible !== false}
              onCheckedChange={(checked) => updateField('primaryCta', { ...data.primaryCta, isVisible: checked })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA Text</Label>
              <Input
                value={data.primaryCta.text}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, text: e.target.value })}
                placeholder="ĐẶT TOUR NGAY"
                disabled={data.primaryCta?.isVisible === false}
              />
            </div>

            <div className="space-y-2">
              <Label>Primary CTA Link</Label>
              <Input
                value={data.primaryCta.link}
                onChange={(e) => updateField('primaryCta', { ...data.primaryCta, link: e.target.value })}
                placeholder="/dat-tour"
                disabled={data.primaryCta?.isVisible === false}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md">
            <Label htmlFor="secondaryCta-visibility" className="text-sm font-medium cursor-pointer">
              {data.secondaryCta?.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Label>
            <Label htmlFor="secondaryCta-visibility" className="text-sm font-medium cursor-pointer flex-1">
              Hiển thị Secondary CTA
            </Label>
            <Switch
              id="secondaryCta-visibility"
              checked={data.secondaryCta?.isVisible !== false}
              onCheckedChange={(checked) => updateField('secondaryCta', { ...data.secondaryCta, isVisible: checked })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Secondary CTA Text</Label>
              <Input
                value={data.secondaryCta.text}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, text: e.target.value })}
                placeholder="XEM CHI TIẾT"
                disabled={data.secondaryCta?.isVisible === false}
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary CTA Link</Label>
              <Input
                value={data.secondaryCta.link}
                onChange={(e) => updateField('secondaryCta', { ...data.secondaryCta, link: e.target.value })}
                placeholder="/gioi-thieu"
                disabled={data.secondaryCta?.isVisible === false}
              />
            </div>
          </div>
        </div>

        {/* Primary CTA Button Styling */}
        <Collapsible
          title="Primary CTA Button Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Primary Button"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.primaryCta?.style}
              onChange={(style) => {
                onChange({
                  ...data,
                  primaryCta: { ...data.primaryCta, style },
                });
              }}
              title="Primary Button Styling"
            />
          </div>
        </Collapsible>

                {/* Secondary CTA Button Styling */}
        <Collapsible
          title="Secondary CTA Button Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Secondary Button"                                                                             
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={data.secondaryCta?.style}
              onChange={(style) => {
                onChange({
                  ...data,
                  secondaryCta: { ...data.secondaryCta, style },
                });
              }}
              title="Secondary Button Styling"
            />
          </div>
        </Collapsible>

        {/* USPs (Unique Selling Points) */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          {renderVisibilityToggle('usps', 'Hiển thị USPs')}
          <div className="space-y-2">
            <Label>USPs - Điểm Nổi Bật (Thân Thiện Môi Trường • Trải Nghiệm Xanh • Chính Chủ)</Label>
            <p className="text-xs text-muted-foreground">
              Các badge hiển thị dưới CTAs. Mỗi dòng là một USP.
            </p>
          </div>
          
          {(data.usps || []).map((usp, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={usp}
                onChange={(e) => {
                  const newUsps = [...(data.usps || [])];
                  newUsps[index] = e.target.value;
                  updateField('usps', newUsps);
                }}
                placeholder="🌿 Thân Thiện Môi Trường"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const newUsps = (data.usps || []).filter((_, i) => i !== index);
                  updateField('usps', newUsps);
                }}
              >
                ×
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newUsps = [...(data.usps || []), ''];
              updateField('usps', newUsps);
            }}
          >
            + Thêm USP
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-2 border-t pt-4">
          <Label>Preview</Label>
          <div 
            className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center text-white"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center space-y-4 p-8">
              {data.eyebrow && (
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-emerald-700 border border-emerald-400">
                  <span className="text-sm font-bold">{data.eyebrow}</span>
                </div>
              )}
              <h1 className="text-4xl font-bold">{data.mainTitle}</h1>
              <h2 className="text-2xl">{data.subtitle}</h2>
              <p className="text-lg max-w-2xl mx-auto">{data.description}</p>
              <div className="flex gap-4 justify-center mt-6">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">
                  {data.primaryCta.text}
                </button>
                <button className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold">
                  {data.secondaryCta.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
