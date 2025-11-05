'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import type { HomestaySection } from '@/lib/homepage/schema';
import { ImagePicker } from '@/components/admin/homepage/ImagePicker';

interface HomestaySectionEditorProps {
  data?: HomestaySection;
  onChange: (data: HomestaySection) => void;
}

export function HomestaySectionEditor({ data, onChange }: HomestaySectionEditorProps) {
  const sectionData = data || {
    eyebrow: 'Lưu Trú',
    heading: 'LƯU TRÚ HOMESTAY SINH THÁI',
    subheading: 'COCO ISLAND CỒN PHỤNG',
    description: '🌿 Nghỉ dưỡng giữa thiên nhiên - Trải nghiệm homestay xanh mát',
    amenities: [
      { icon: 'Leaf', label: 'Sinh Thái' },
      { icon: 'Wifi', label: 'Wifi Free' },
      { icon: 'Coffee', label: 'Ăn Sáng' },
      { icon: 'Bed', label: 'Tiện Nghi' },
      { icon: 'Star', label: 'Chất Lượng' },
    ],
    highlights: [
      { icon: 'Leaf', title: 'Không Gian Xanh', description: 'Giữa rừng dừa, gần sông nước, thoáng mát' },
      { icon: 'Home', title: 'Phòng Hiện Đại', description: 'Đầy đủ tiện nghi, sạch sẽ, thoải mái' },
      { icon: 'Star', title: 'Dịch Vụ Tốt', description: 'Phục vụ tận tình, chu đáo 24/7' },
    ],
    bottomNote: '💡 Đặt phòng sớm để nhận giá tốt nhất và chọn phòng đẹp',
    isActive: true,
  };

  const handleChange = (field: keyof HomestaySection, value: any) => {
    onChange({
      ...sectionData,
      [field]: value,
    });
  };

  const updateAmenity = (index: number, field: 'icon' | 'label', value: string) => {
    const newAmenities = [...sectionData.amenities];
    newAmenities[index] = { ...newAmenities[index], [field]: value };
    handleChange('amenities', newAmenities);
  };

  const addAmenity = () => {
    handleChange('amenities', [...sectionData.amenities, { icon: 'Star', label: '' }]);
  };

  const removeAmenity = (index: number) => {
    handleChange('amenities', sectionData.amenities.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newHighlights = [...sectionData.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    handleChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    handleChange('highlights', [...sectionData.highlights, { icon: 'Star', title: '', description: '' }]);
  };

  const removeHighlight = (index: number) => {
    handleChange('highlights', sectionData.highlights.filter((_, i) => i !== index));
  };

  // Coco Island Card handlers
  const updateCocoIslandCard = (field: string, value: any) => {
    const currentCard = sectionData.cocoIslandCard || {
      imageUrl: '/uploads/2024/10/coco-island-con-phung-ben-tre40-1024x768-2-768x576.webp',
      originalPrice: 800000,
      discount: 30,
      finalPrice: 560000,
      currency: '₫',
      includedItems: [
        "🚢 Vé tàu khứ hồi và vé cổng tham quan KDL Cồn Phụng",
        "☕ Phục vụ ăn sáng (Tô + ly)",
        "🎁 Check in phòng tặng kèm: trái cây + dừa tươi/khách, cafe gói + trà gói + nước suối miễn phí",
      ],
      roomAmenities: [
        "⚡ Ấm điện siêu tốc",
        "💨 Máy sấy tóc",
        "📞 Điện thoại bàn",
        "🛁 Khăn tắm",
        "👡 Dép",
        "❄️ Máy lạnh",
        "🧊 Tủ lạnh",
        "📺 Smart TV",
        "📶 Wifi miễn phí",
      ],
    };
    
    const updatedCard = { ...currentCard, [field]: value };
    
    // Auto-calculate finalPrice if originalPrice or discount changed
    if (field === 'originalPrice' || field === 'discount') {
      updatedCard.finalPrice = Math.round(updatedCard.originalPrice * (1 - updatedCard.discount / 100));
    }
    
    handleChange('cocoIslandCard', updatedCard);
  };

  const [newIncludedItem, setNewIncludedItem] = React.useState('');
  const [newRoomAmenity, setNewRoomAmenity] = React.useState('');

  const addIncludedItem = () => {
    if (newIncludedItem.trim()) {
      const currentItems = sectionData.cocoIslandCard?.includedItems || [];
      updateCocoIslandCard('includedItems', [...currentItems, newIncludedItem.trim()]);
      setNewIncludedItem('');
    }
  };

  const removeIncludedItem = (index: number) => {
    const currentItems = sectionData.cocoIslandCard?.includedItems || [];
    updateCocoIslandCard('includedItems', currentItems.filter((_, i) => i !== index));
  };

  const addRoomAmenity = () => {
    if (newRoomAmenity.trim()) {
      const currentAmenities = sectionData.cocoIslandCard?.roomAmenities || [];
      updateCocoIslandCard('roomAmenities', [...currentAmenities, newRoomAmenity.trim()]);
      setNewRoomAmenity('');
    }
  };

  const removeRoomAmenity = (index: number) => {
    const currentAmenities = sectionData.cocoIslandCard?.roomAmenities || [];
    updateCocoIslandCard('roomAmenities', currentAmenities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isActive" className="text-base font-semibold">
            Hiển thị section
          </Label>
          <p className="text-sm text-muted-foreground">
            Bật/tắt section Homestay trên trang chủ
          </p>
        </div>
        <Switch
          id="isActive"
          checked={sectionData.isActive}
          onCheckedChange={(checked) => handleChange('isActive', checked)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eyebrow">Eyebrow Text</Label>
        <Input
          id="eyebrow"
          value={sectionData.eyebrow || ''}
          onChange={(e) => handleChange('eyebrow', e.target.value)}
          placeholder="Lưu Trú"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="heading">Tiêu đề chính</Label>
        <Input
          id="heading"
          value={sectionData.heading}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="LƯU TRÚ HOMESTAY SINH THÁI"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subheading">Tiêu đề phụ</Label>
        <Input
          id="subheading"
          value={sectionData.subheading || ''}
          onChange={(e) => handleChange('subheading', e.target.value)}
          placeholder="COCO ISLAND CỒN PHỤNG"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={sectionData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="🌿 Nghỉ dưỡng giữa thiên nhiên - Trải nghiệm homestay xanh mát"
          rows={3}
        />
      </div>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Tiện ích (Amenities)</CardTitle>
              <CardDescription className="text-xs">
                Các tiện ích hiển thị trong grid
              </CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addAmenity}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sectionData.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={amenity.icon}
                  onChange={(e) => updateAmenity(index, 'icon', e.target.value)}
                  placeholder="Icon (lucide name)"
                />
                <Input
                  value={amenity.label}
                  onChange={(e) => updateAmenity(index, 'label', e.target.value)}
                  placeholder="Label"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeAmenity(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Điểm nổi bật</CardTitle>
              <CardDescription className="text-xs">
                Các highlight cards hiển thị dưới amenities
              </CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addHighlight}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sectionData.highlights.map((highlight, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={highlight.icon}
                  onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                  placeholder="Icon (lucide name)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeHighlight(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={highlight.title}
                onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                placeholder="Title"
              />
              <Textarea
                value={highlight.description}
                onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="bottomNote">Ghi chú cuối</Label>
        <Input
          id="bottomNote"
          value={sectionData.bottomNote || ''}
          onChange={(e) => handleChange('bottomNote', e.target.value)}
          placeholder="💡 Đặt phòng sớm để nhận giá tốt nhất và chọn phòng đẹp"
        />
      </div>

      {/* Coco Island Card Editor */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <CardTitle>Coco Island Card</CardTitle>
          </div>
          <CardDescription>
            Chỉnh sửa thông tin card Homestay Coco Island (giá, hình ảnh, amenities)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image */}
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <ImagePicker
              value={sectionData.cocoIslandCard?.imageUrl || ''}
              onChange={(url) => updateCocoIslandCard('imageUrl', url)}
              label="Hình ảnh Homestay"
              aspectRatio="16/9"
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Giá gốc</Label>
              <Input
                type="number"
                value={sectionData.cocoIslandCard?.originalPrice || 800000}
                onChange={(e) => updateCocoIslandCard('originalPrice', parseInt(e.target.value) || 0)}
                placeholder="800000"
              />
            </div>
            <div className="space-y-2">
              <Label>Giảm giá (%)</Label>
              <Input
                type="number"
                value={sectionData.cocoIslandCard?.discount || 30}
                onChange={(e) => updateCocoIslandCard('discount', parseInt(e.target.value) || 0)}
                placeholder="30"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Giá sau giảm (tự động)</Label>
              <Input
                type="number"
                value={sectionData.cocoIslandCard?.finalPrice || 560000}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Tiền tệ</Label>
              <Input
                value={sectionData.cocoIslandCard?.currency || '₫'}
                onChange={(e) => updateCocoIslandCard('currency', e.target.value)}
                placeholder="₫"
              />
            </div>
          </div>

          {/* Included Items */}
          <div className="space-y-2">
            <Label>Bao gồm trong tour ({sectionData.cocoIslandCard?.includedItems?.length || 0})</Label>
            <div className="flex gap-2">
              <Input
                value={newIncludedItem}
                onChange={(e) => setNewIncludedItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIncludedItem()}
                placeholder="VD: 🚢 Vé tàu khứ hồi và vé cổng tham quan KDL Cồn Phụng"
              />
              <Button onClick={addIncludedItem} size="sm" type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {(sectionData.cocoIslandCard?.includedItems || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-center p-2 bg-muted rounded">
                  <span className="text-sm flex-1">{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIncludedItem(index)}
                    className="h-8"
                    type="button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Room Amenities */}
          <div className="space-y-2">
            <Label>Tiện nghi trong phòng ({sectionData.cocoIslandCard?.roomAmenities?.length || 0})</Label>
            <div className="flex gap-2">
              <Input
                value={newRoomAmenity}
                onChange={(e) => setNewRoomAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRoomAmenity()}
                placeholder="VD: ⚡ Ấm điện siêu tốc"
              />
              <Button onClick={addRoomAmenity} size="sm" type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {(sectionData.cocoIslandCard?.roomAmenities || []).map((amenity, index) => (
                <div key={index} className="flex gap-2 items-center p-2 bg-muted rounded">
                  <span className="text-sm flex-1">{amenity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoomAmenity(index)}
                    className="h-8"
                    type="button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


