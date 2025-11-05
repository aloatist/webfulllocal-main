'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from '../homepage-settings/StyleEditor';
import { Sparkles, Palette } from 'lucide-react';
import type { PromotionSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface PromotionSectionEditorProps {
  data?: PromotionSection;
  onChange: (data: PromotionSection) => void;
}

export default function PromotionSectionEditor({ data, onChange }: PromotionSectionEditorProps) {
  const promotion = data || {
    eyebrow: 'Ưu Đãi Đặc Biệt',
    heading: 'COMBO TOUR THÁNG NÀY',
    description: 'Giảm giá lên đến 30% - Số lượng có hạn',
    imageUrl: '',
    discount: '30%',
    isActive: true,
  };

  const updateField = (field: keyof PromotionSection, value: any) => {
    onChange({ ...promotion, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Promotion Section
        </CardTitle>
        <CardDescription>
          Quản lý section khuyến mãi/combo tour đặc biệt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base">Hiển thị Section</Label>
            <p className="text-sm text-muted-foreground">
              Bật/tắt hiển thị section promotion trên trang chủ
            </p>
          </div>
          <Switch
            checked={promotion.isActive}
            onCheckedChange={(checked) => updateField('isActive', checked)}
          />
        </div>

        {/* Content Fields */}
        <div className="grid gap-4">
          {/* Eyebrow Text */}
          <div className="space-y-2">
            <Label>Eyebrow Text</Label>
            <Input
              value={promotion.eyebrow}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="Ưu Đãi Đặc Biệt"
            />
            <p className="text-xs text-muted-foreground">
              Text nhỏ phía trên heading
            </p>
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
                style={promotion.styles?.eyebrow}
                onChange={(style) => {
                  onChange({ ...promotion, styles: { ...promotion.styles, eyebrow: style } });
                }}
                title="Eyebrow Styling"
              />
            </div>
          </Collapsible>

          {/* Heading */}
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={promotion.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="COMBO TOUR THÁNG NÀY"
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
                style={promotion.styles?.heading}
                onChange={(style) => {
                  onChange({ ...promotion, styles: { ...promotion.styles, heading: style } });
                }}
                title="Heading Styling"
              />
            </div>
          </Collapsible>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={promotion.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Giảm giá lên đến 30% - Số lượng có hạn"
              rows={2}
            />
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
                style={promotion.styles?.description}
                onChange={(style) => {
                  onChange({ ...promotion, styles: { ...promotion.styles, description: style } });
                }}
                title="Description Styling"
              />
            </div>
          </Collapsible>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Discount</Label>
            <div className="flex gap-2">
              <Input
                value={promotion.discount}
                onChange={(e) => updateField('discount', e.target.value)}
                placeholder="30%"
                className="max-w-[200px]"
              />
              <div className="flex items-center text-sm text-muted-foreground">
                VD: 30%, 50%, Giảm 500K, v.v.
              </div>
            </div>
          </div>

          {/* Discount Styling */}
          <Collapsible
            title="Discount Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Discount"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={promotion.styles?.discount}
                onChange={(style) => {
                  onChange({ ...promotion, styles: { ...promotion.styles, discount: style } });
                }}
                title="Discount Styling"
              />
            </div>
          </Collapsible>

          {/* Image Picker */}
          <ImagePicker
            value={promotion.imageUrl}
            onChange={(url) => updateField('imageUrl', url)}
            label="Hình ảnh Promotion"
            aspectRatio="1/1"
          />
          <p className="text-xs text-muted-foreground">
            Khuyến nghị: 1:1 ratio, min 800x800px
          </p>
        </div>


        {/* Live Preview Card */}
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div className={`relative overflow-hidden rounded-2xl p-8 shadow-xl ${promotion.isActive ? 'bg-gradient-to-br from-emerald-600 via-green-600 to-lime-600' : 'bg-gray-400'}`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{promotion.eyebrow}</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {promotion.heading}
              </h2>
              
              <p className="text-white/90 text-lg">
                {promotion.description}
              </p>

              {promotion.discount && (
                <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg animate-pulse">
                  🎉 {promotion.discount}
                </div>
              )}
            </div>

            {!promotion.isActive && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                INACTIVE
              </div>
            )}
          </div>
        </div>

        {/* Status Info */}
        <div className={`p-4 rounded-lg ${promotion.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border-2`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${promotion.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <p className="font-semibold">
                {promotion.isActive ? '✅ Đang hiển thị trên trang chủ' : '⏸️ Đang ẩn'}
              </p>
              <p className="text-sm text-muted-foreground">
                {promotion.isActive 
                  ? 'Section promotion đang được hiển thị cho khách hàng'
                  : 'Section promotion đang bị ẩn, khách hàng không thấy'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Container Styling */}
        <Collapsible
          title="Container Styling"
          description="Tùy chỉnh styling cho toàn bộ section container"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
          className="border-t pt-4 mt-4"
        >
          <div className="pt-2">
            <StyleEditor
              style={promotion.styles?.container}
              onChange={(style) => {
                onChange({ ...promotion, styles: { ...promotion.styles, container: style } });
              }}
              title="Container Styling"
            />
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
