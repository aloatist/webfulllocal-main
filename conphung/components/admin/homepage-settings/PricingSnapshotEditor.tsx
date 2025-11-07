'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Sparkles, Eye, EyeOff } from 'lucide-react';
import type { PricingSnapshotSection } from '@/lib/homepage/schema';

interface PricingSnapshotEditorProps {
  data?: PricingSnapshotSection;
  onChange: (data: PricingSnapshotSection) => void;
}

export function PricingSnapshotEditor({ data, onChange }: PricingSnapshotEditorProps) {
  const sectionData = data || {
    eyebrow: 'Giá Ưu Đãi',
    heading: 'Bảng Giá Tham Khảo',
    description: 'Giá ưu đãi - Minh bạch - Không phí ẩn - Cam kết giá tốt nhất',
    paymentInfo: '💳 Thanh toán: Tiền mặt • Chuyển khoản • Ví điện tử • Miễn phí hủy trong 24h',
    isActive: true,
    isVisible: true,
  };

  const handleChange = (field: keyof PricingSnapshotSection, value: any) => {
    onChange({
      ...sectionData,
      [field]: value,
    });
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<PricingSnapshotSection['visibility']>) => {
    const currentVisibility = sectionData.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false),
    };
    onChange({ ...sectionData, visibility: newVisibility });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<PricingSnapshotSection['visibility']>) => {
    return sectionData.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<PricingSnapshotSection['visibility']>, label: string) => (
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
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Section này tự động tổng hợp dữ liệu từ <strong>Vé tham quan</strong> và <strong>Tour & Trải nghiệm</strong>.
          Đảm bảo bạn đã cấu hình đầy đủ 2 sections đó để hiển thị đúng nội dung.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isActive" className="text-base font-semibold">
            Hiển thị section
          </Label>
          <p className="text-sm text-muted-foreground">
            Bật/tắt section Bảng Giá Tham Khảo trên trang chủ
          </p>
        </div>
        <Switch
          id="isActive"
          checked={sectionData.isActive}
          onCheckedChange={(checked) => handleChange('isActive', checked)}
        />
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('eyebrow', 'Hiển thị Eyebrow')}
        <div className="space-y-2">
          <Label htmlFor="eyebrow">Eyebrow Text</Label>
          <Input
            id="eyebrow"
            value={sectionData.eyebrow || ''}
            onChange={(e) => handleChange('eyebrow', e.target.value)}
            placeholder="Giá Ưu Đãi"
            disabled={!isFieldVisible('eyebrow')}
          />
          <p className="text-xs text-muted-foreground">
            Text nhỏ phía trên tiêu đề chính (badge)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('heading', 'Hiển thị Heading')}
        <div className="space-y-2">
          <Label htmlFor="heading">Tiêu đề chính</Label>
          <Input
            id="heading"
            value={sectionData.heading || ''}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="Bảng Giá Tham Khảo"
            disabled={!isFieldVisible('heading')}
          />
          <p className="text-xs text-muted-foreground">
            Tiêu đề lớn của section
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('description', 'Hiển thị Description')}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={sectionData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Giá ưu đãi - Minh bạch - Không phí ẩn - Cam kết giá tốt nhất"
            rows={3}
            disabled={!isFieldVisible('description')}
          />
          <p className="text-xs text-muted-foreground">
            Mô tả ngắn gọn phía dưới tiêu đề
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('pricingCards', 'Hiển thị Pricing Cards')}
        <p className="text-xs text-muted-foreground">
          Hiển thị 3 cards: Vé Tham Quan, Tour Khám Phá, Lưu Trú Homestay
        </p>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('paymentInfo', 'Hiển thị Payment Info')}
        <div className="space-y-2">
          <Label htmlFor="paymentInfo">💳 Thông tin thanh toán (Payment Info)</Label>
          <Input
            id="paymentInfo"
            value={sectionData.paymentInfo || ''}
            onChange={(e) => handleChange('paymentInfo', e.target.value)}
            placeholder="💳 Thanh toán: Tiền mặt • Chuyển khoản • Ví điện tử • Miễn phí hủy trong 24h"
            disabled={!isFieldVisible('paymentInfo')}
          />
          <p className="text-xs text-muted-foreground">
            Thông tin về phương thức thanh toán và chính sách hủy hiển thị dưới cùng section
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Dữ liệu tự động
          </CardTitle>
          <CardDescription className="text-xs">
            Section này sẽ tự động lấy dữ liệu từ:
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-semibold">1. Vé tham quan:</span>
            <span className="text-muted-foreground">
              Giá vé, mô tả, các dịch vụ bao gồm
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold">2. Tour & Trải nghiệm:</span>
            <span className="text-muted-foreground">
              Tour đầu tiên active, giá, mô tả tour
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold">3. Homestay:</span>
            <span className="text-muted-foreground">
              Thông tin mặc định (có thể cập nhật sau)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




