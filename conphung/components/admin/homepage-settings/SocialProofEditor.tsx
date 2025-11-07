'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import type { SocialProofSection } from '@/lib/homepage/schema';

interface SocialProofEditorProps {
  data?: SocialProofSection;
  onChange: (data: SocialProofSection) => void;
}

export function SocialProofEditor({ data, onChange }: SocialProofEditorProps) {
  const sectionData = data || {
    eyebrow: 'Đánh Giá Từ Khách Hàng',
    heading: 'Khách Hàng Nói Gì Về Chúng Tôi',
    description: 'Hơn 2,000+ đánh giá 5 sao từ khách hàng đã trải nghiệm',
    overallRating: 4.8,
    ratingText: '4.8/5',
    testimonials: [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        avatar: '',
        rating: 5,
        date: '15/01/2025',
        content: 'Trải nghiệm tuyệt vời! Cảnh đẹp, nhân viên nhiệt tình, ăn uống ngon. Gia đình tôi rất hài lòng và sẽ quay lại.',
        tourType: 'Tour 1 ngày',
        verified: true,
      },
    ],
    trustStats: [
      { value: '2,000+', label: 'Khách Hàng', icon: 'User', gradient: 'from-emerald-500 to-green-500' },
      { value: '15+', label: 'Năm Kinh Nghiệm', icon: 'Calendar', gradient: 'from-blue-500 to-cyan-500' },
      { value: '98%', label: 'Hài Lòng', icon: 'ThumbsUp', gradient: 'from-amber-500 to-orange-500' },
    ],
    bottomCTAText: '🌟 Trở thành khách hàng hài lòng tiếp theo!',
    bottomCTADescription: 'Đặt tour ngay để nhận ưu đãi tốt nhất và trải nghiệm dịch vụ 5 sao',
    isActive: true,
  };

  const handleChange = (field: keyof SocialProofSection, value: any) => {
    onChange({
      ...sectionData,
      [field]: value,
    });
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...sectionData.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    handleChange('testimonials', newTestimonials);
  };

  const addTestimonial = () => {
    handleChange('testimonials', [
      ...sectionData.testimonials,
      {
        id: Date.now().toString(),
        name: '',
        avatar: '',
        rating: 5,
        date: new Date().toLocaleDateString('vi-VN'),
        content: '',
        tourType: '',
        verified: false,
      },
    ]);
  };

  const removeTestimonial = (index: number) => {
    handleChange('testimonials', sectionData.testimonials.filter((_, i) => i !== index));
  };

  const updateTrustStat = (index: number, field: 'value' | 'label' | 'icon' | 'gradient', value: string) => {
    const newStats = [...sectionData.trustStats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleChange('trustStats', newStats);
  };

  const addTrustStat = () => {
    handleChange('trustStats', [
      ...sectionData.trustStats,
      { value: '', label: '', icon: 'Star', gradient: 'from-gray-500 to-gray-600' },
    ]);
  };

  const removeTrustStat = (index: number) => {
    handleChange('trustStats', sectionData.trustStats.filter((_, i) => i !== index));
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<SocialProofSection['visibility']>) => {
    const currentVisibility = sectionData.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false),
    };
    handleChange('visibility', newVisibility);
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<SocialProofSection['visibility']>) => {
    return sectionData.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<SocialProofSection['visibility']>, label: string) => (
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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isActive" className="text-base font-semibold">
            Hiển thị section
          </Label>
          <p className="text-sm text-muted-foreground">
            Bật/tắt section Social Proof trên trang chủ
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
            placeholder="Đánh Giá Từ Khách Hàng"
            disabled={!isFieldVisible('eyebrow')}
          />
        </div>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('heading', 'Hiển thị Heading')}
        <div className="space-y-2">
          <Label htmlFor="heading">Tiêu đề chính</Label>
          <Input
            id="heading"
            value={sectionData.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="Khách Hàng Nói Gì Về Chúng Tôi"
            disabled={!isFieldVisible('heading')}
          />
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
            placeholder="Hơn 2,000+ đánh giá 5 sao từ khách hàng đã trải nghiệm"
            rows={2}
            disabled={!isFieldVisible('description')}
          />
        </div>
      </div>

      <div className="space-y-2">
        {renderVisibilityToggle('overallRating', 'Hiển thị Overall Rating')}
        <div className={`grid grid-cols-2 gap-4 ${!isFieldVisible('overallRating') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-2">
            <Label htmlFor="overallRating">Đánh giá tổng thể</Label>
            <Input
              id="overallRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={sectionData.overallRating || ''}
              onChange={(e) => handleChange('overallRating', parseFloat(e.target.value) || 0)}
              placeholder="4.8"
              disabled={!isFieldVisible('overallRating')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ratingText">Text đánh giá</Label>
            <Input
              id="ratingText"
              value={sectionData.ratingText || ''}
              onChange={(e) => handleChange('ratingText', e.target.value)}
              placeholder="4.8/5"
              disabled={!isFieldVisible('overallRating')}
            />
          </div>
        </div>
      </div>

      {/* Trust Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Trust Stats</CardTitle>
              <CardDescription className="text-xs">
                Thống kê tin cậy hiển thị trên đầu section
              </CardDescription>
            </div>
            {renderVisibilityToggle('trustStats', 'Hiển thị Trust Stats')}
          </div>
        </CardHeader>
        <CardContent className={`space-y-3 ${!isFieldVisible('trustStats') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="outline" onClick={addTrustStat} disabled={!isFieldVisible('trustStats')}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          {sectionData.trustStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input
                  value={stat.value}
                  onChange={(e) => updateTrustStat(index, 'value', e.target.value)}
                  placeholder="Value"
                  disabled={!isFieldVisible('trustStats')}
                />
                <Input
                  value={stat.label}
                  onChange={(e) => updateTrustStat(index, 'label', e.target.value)}
                  placeholder="Label"
                  disabled={!isFieldVisible('trustStats')}
                />
                <Input
                  value={stat.icon}
                  onChange={(e) => updateTrustStat(index, 'icon', e.target.value)}
                  placeholder="Icon"
                  disabled={!isFieldVisible('trustStats')}
                />
                <Input
                  value={stat.gradient}
                  onChange={(e) => updateTrustStat(index, 'gradient', e.target.value)}
                  placeholder="Gradient"
                  disabled={!isFieldVisible('trustStats')}
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeTrustStat(index)}
                disabled={!isFieldVisible('trustStats')}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Đánh giá khách hàng</CardTitle>
              <CardDescription className="text-xs">
                Các đánh giá/testimonials từ khách hàng
              </CardDescription>
            </div>
            {renderVisibilityToggle('testimonials', 'Hiển thị Testimonials')}
          </div>
        </CardHeader>
        <CardContent className={`space-y-4 ${!isFieldVisible('testimonials') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="outline" onClick={addTestimonial} disabled={!isFieldVisible('testimonials')}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          {sectionData.testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    placeholder="Tên khách hàng"
                    disabled={!isFieldVisible('testimonials')}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                      placeholder="Rating"
                      className="w-20"
                      disabled={!isFieldVisible('testimonials')}
                    />
                    <Label className="text-xs">Sao</Label>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTestimonial(index)}
                  disabled={!isFieldVisible('testimonials')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={testimonial.date}
                  onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                  placeholder="Ngày (15/01/2025)"
                  disabled={!isFieldVisible('testimonials')}
                />
                <Input
                  value={testimonial.tourType || ''}
                  onChange={(e) => updateTestimonial(index, 'tourType', e.target.value)}
                  placeholder="Loại tour (Tour 1 ngày)"
                  disabled={!isFieldVisible('testimonials')}
                />
              </div>
              <Textarea
                value={testimonial.content}
                onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                placeholder="Nội dung đánh giá"
                rows={3}
                disabled={!isFieldVisible('testimonials')}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={testimonial.verified}
                    onChange={(e) => updateTestimonial(index, 'verified', e.target.checked)}
                    className="rounded"
                  />
                  <Label className="text-sm">Đã xác thực</Label>
                </div>
                <Input
                  value={testimonial.avatar || ''}
                  onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                  placeholder="URL avatar (optional)"
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        {renderVisibilityToggle('bottomCTA', 'Hiển thị Bottom CTA')}
        <div className={`space-y-4 ${!isFieldVisible('bottomCTA') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-2">
            <Label htmlFor="bottomCTAText">Bottom CTA Text</Label>
            <Input
              id="bottomCTAText"
              value={sectionData.bottomCTAText || ''}
              onChange={(e) => handleChange('bottomCTAText', e.target.value)}
              placeholder="🌟 Trở thành khách hàng hài lòng tiếp theo!"
              disabled={!isFieldVisible('bottomCTA')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bottomCTADescription">Bottom CTA Description</Label>
            <Textarea
              id="bottomCTADescription"
              value={sectionData.bottomCTADescription || ''}
              onChange={(e) => handleChange('bottomCTADescription', e.target.value)}
              placeholder="Đặt tour ngay để nhận ưu đãi tốt nhất và trải nghiệm dịch vụ 5 sao"
              rows={2}
              disabled={!isFieldVisible('bottomCTA')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


