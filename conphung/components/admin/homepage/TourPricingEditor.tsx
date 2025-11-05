'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Ship, Eye, EyeOff, Palette, Leaf, MapPin, Star } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from '../homepage-settings/StyleEditor';
import type { TourItem, TourPricingSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface TourPricingEditorProps {
  data?: TourPricingSection;
  onChange: (data: TourPricingSection) => void;
}

export default function TourPricingEditor({ data, onChange }: TourPricingEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [newIncludedItem, setNewIncludedItem] = useState('');

  const tourPricing = data || {
    eyebrow: 'Tour Du Lịch',
    heading: 'BẢNG GIÁ VÉ TOUR',
    description: '🌿 Tour khám phá sinh thái miền Tây - Trải nghiệm đích thực',
    tours: [],
    bottomNote: '💡 Bao gồm: Xe đưa đón + Du thuyền + Ăn trưa + Hướng dẫn viên',
  };

  const updateField = (field: keyof TourPricingSection, value: any) => {
    onChange({ ...tourPricing, [field]: value });
  };

  const addTour = () => {
    const newTour: TourItem = {
      id: `tour-${Date.now()}`,
      name: 'Tour mới',
      description: 'Mô tả tour...',
      originalPrice: 300000,
      discount: 50,
      finalPrice: 150000,
      currency: '₫',
      imageUrl: '',
      includedItems: ['Item 1', 'Item 2'],
      duration: 'Trong ngày',
      isActive: true,
      order: tourPricing.tours.length,
    };
    onChange({
      ...tourPricing,
      tours: [...tourPricing.tours, newTour],
    });
    setExpandedIndex(tourPricing.tours.length);
  };

  const updateTour = (index: number, updates: Partial<TourItem>) => {
    const newTours = [...tourPricing.tours];
    newTours[index] = { ...newTours[index], ...updates };
    
    // Auto-calculate final price if originalPrice or discount changed
    if (updates.originalPrice !== undefined || updates.discount !== undefined) {
      const tour = newTours[index];
      tour.finalPrice = Math.round(tour.originalPrice * (1 - tour.discount / 100));
    }
    
    onChange({ ...tourPricing, tours: newTours });
  };

  const deleteTour = (index: number) => {
    if (confirm('Xóa tour này?')) {
      const newTours = tourPricing.tours.filter((_, i) => i !== index);
      onChange({ ...tourPricing, tours: newTours });
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
    }
  };

  const moveTour = (index: number, direction: 'up' | 'down') => {
    const newTours = [...tourPricing.tours];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newTours.length) return;
    
    [newTours[index], newTours[targetIndex]] = [newTours[targetIndex], newTours[index]];
    
    // Update order
    newTours.forEach((tour, i) => {
      tour.order = i;
    });
    
    onChange({ ...tourPricing, tours: newTours });
    setExpandedIndex(targetIndex);
  };

  const addIncludedItem = (tourIndex: number) => {
    if (newIncludedItem.trim()) {
      const tour = tourPricing.tours[tourIndex];
      updateTour(tourIndex, {
        includedItems: [...tour.includedItems, newIncludedItem.trim()],
      });
      setNewIncludedItem('');
    }
  };

  const removeIncludedItem = (tourIndex: number, itemIndex: number) => {
    const tour = tourPricing.tours[tourIndex];
    const newItems = tour.includedItems.filter((_, i) => i !== itemIndex);
    updateTour(tourIndex, { includedItems: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5" />
          Tour Pricing Section
        </CardTitle>
        <CardDescription>
          Quản lý bảng giá các tour du lịch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Fields */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid gap-2">
            <Label>Eyebrow Text</Label>
            <Input
              value={tourPricing.eyebrow}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="Tour Du Lịch"
            />
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
                style={tourPricing.styles?.eyebrow}
                onChange={(style) => {
                  onChange({ ...tourPricing, styles: { ...tourPricing.styles, eyebrow: style } });
                }}
                title="Eyebrow Styling"
              />
            </div>
          </Collapsible>

          <div className="grid gap-2">
            <Label>Heading</Label>
            <Input
              value={tourPricing.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="BẢNG GIÁ VÉ TOUR"
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
                style={tourPricing.styles?.heading}
                onChange={(style) => {
                  onChange({ ...tourPricing, styles: { ...tourPricing.styles, heading: style } });
                }}
                title="Heading Styling"
              />
            </div>
          </Collapsible>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={tourPricing.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="🌿 Tour khám phá sinh thái..."
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
                style={tourPricing.styles?.description}
                onChange={(style) => {
                  onChange({ ...tourPricing, styles: { ...tourPricing.styles, description: style } });                                                          
                }}
                title="Description Styling"
              />
            </div>
          </Collapsible>

          {/* Tour Highlights */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label>Tour Highlights (4 highlights)</Label>
                <p className="text-xs text-muted-foreground">
                  Các điểm nổi bật hiển thị dưới description
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentHighlights = tourPricing.highlights || [];
                  if (currentHighlights.length < 4) {
                    onChange({
                      ...tourPricing,
                      highlights: [
                        ...currentHighlights,
                        { title: '', description: '', icon: 'Ship' as const },
                      ],
                    });
                  }
                }}
                disabled={(tourPricing.highlights || []).length >= 4}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm Highlight
              </Button>
            </div>

            {(tourPricing.highlights || []).map((highlight, index) => (
              <div key={index} className="grid gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Highlight #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newHighlights = (tourPricing.highlights || []).filter((_, i) => i !== index);
                      onChange({ ...tourPricing, highlights: newHighlights });
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={highlight.title}
                    onChange={(e) => {
                      const newHighlights = [...(tourPricing.highlights || [])];
                      newHighlights[index] = { ...highlight, title: e.target.value };
                      onChange({ ...tourPricing, highlights: newHighlights });
                    }}
                    placeholder="Du Thuyền"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={highlight.description}
                    onChange={(e) => {
                      const newHighlights = [...(tourPricing.highlights || [])];
                      newHighlights[index] = { ...highlight, description: e.target.value };
                      onChange({ ...tourPricing, highlights: newHighlights });
                    }}
                    placeholder="Tham quan sông nước"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-xs">Icon</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'Ship', icon: Ship, label: 'Du Thuyền' },
                      { value: 'Leaf', icon: Leaf, label: 'Sinh Thái' },
                      { value: 'MapPin', icon: MapPin, label: 'Địa Điểm' },
                      { value: 'Star', icon: Star, label: 'Đặc Sản' },
                    ].map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={highlight.icon === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newHighlights = [...(tourPricing.highlights || [])];
                          newHighlights[index] = { ...highlight, icon: value as 'Ship' | 'Leaf' | 'MapPin' | 'Star' };
                          onChange({ ...tourPricing, highlights: newHighlights });
                        }}
                        className="flex-1"
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {(!tourPricing.highlights || tourPricing.highlights.length === 0) && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Chưa có highlights. Nhấn "Thêm Highlight" để thêm.
              </div>
            )}
          </div>

                    <div className="grid gap-2">
            <Label>Ghi chú dưới cùng (Bottom Note)</Label>
            <Input
              value={tourPricing.bottomNote || ''}
              onChange={(e) => updateField('bottomNote', e.target.value)}
              placeholder="💡 Bao gồm: Xe đưa đón + Du thuyền + Ăn trưa + Hướng dẫn viên"                                                                       
            />
            <p className="text-sm text-muted-foreground">
              Ghi chú hiển thị dưới cùng của section tour pricing
            </p>
          </div>

          {/* Included Items Styling */}
          <Collapsible
            title="Bao gồm (Included Items) Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho danh sách 'Bao gồm' trong tour"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={tourPricing.styles?.includedItems}
                onChange={(style) => {
                  onChange({ ...tourPricing, styles: { ...tourPricing.styles, includedItems: style } });
                }}
                title="Bao gồm Styling"
              />
            </div>
          </Collapsible>
        </div>

        {/* Tours List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tours ({tourPricing.tours.length})</h3>
            <Button onClick={addTour} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Tour
            </Button>
          </div>

          {tourPricing.tours.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Ship className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có tour nào</p>
              <Button onClick={addTour} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Tour Đầu Tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tourPricing.tours.map((tour, index) => (
                <Card key={tour.id} className={`border-2 ${tour.isActive ? 'border-green-200' : 'border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTour(index, 'up')}
                          disabled={index === 0}
                          className="h-6 px-2"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTour(index, 'down')}
                          disabled={index === tourPricing.tours.length - 1}
                          className="h-6 px-2"
                        >
                          ↓
                        </Button>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {tour.isActive ? (
                          <Eye className="w-5 h-5 text-green-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        <h4 className="font-semibold">{tour.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="line-through">{tour.originalPrice.toLocaleString()}{tour.currency}</span>
                          <span className="font-bold text-green-600">{tour.finalPrice.toLocaleString()}{tour.currency}</span>
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">-{tour.discount}%</span>
                        </div>
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
                        onClick={() => deleteTour(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedIndex === index && (
                    <CardContent className="space-y-4 pt-0 border-t">
                      {/* Active Toggle */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <Label>Hiển thị tour</Label>
                        <Switch
                          checked={tour.isActive}
                          onCheckedChange={(checked) => updateTour(index, { isActive: checked })}
                        />
                      </div>

                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tên tour</Label>
                          <Input
                            value={tour.name}
                            onChange={(e) => updateTour(index, { name: e.target.value })}
                            placeholder="Tour Cồn Thới Sơn - Cồn Phụng"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Thời lượng</Label>
                          <Input
                            value={tour.duration}
                            onChange={(e) => updateTour(index, { duration: e.target.value })}
                            placeholder="Trong ngày"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Textarea
                          value={tour.description}
                          onChange={(e) => updateTour(index, { description: e.target.value })}
                          placeholder="Mô tả chi tiết tour..."
                          rows={2}
                        />
                      </div>

                      {/* Pricing */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Giá gốc</Label>
                          <Input
                            type="number"
                            value={tour.originalPrice}
                            onChange={(e) => updateTour(index, { originalPrice: parseInt(e.target.value) || 0 })}
                            placeholder="300000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Giảm giá (%)</Label>
                          <Input
                            type="number"
                            value={tour.discount}
                            onChange={(e) => updateTour(index, { discount: parseInt(e.target.value) || 0 })}
                            placeholder="50"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Giá sau giảm (auto)</Label>
                          <Input
                            type="number"
                            value={tour.finalPrice}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      {/* Image Picker */}
                      <ImagePicker
                        value={tour.imageUrl}
                        onChange={(url) => updateTour(index, { imageUrl: url })}
                        label="Hình ảnh Tour"
                        aspectRatio="16/9"
                      />

                      {/* Included Items */}
                      <div className="space-y-2">
                        <Label>Bao gồm trong tour ({tour.includedItems.length})</Label>
                        
                        <div className="flex gap-2">
                          <Input
                            value={newIncludedItem}
                            onChange={(e) => setNewIncludedItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addIncludedItem(index)}
                            placeholder="VD: 🚢 Vé tàu khứ hồi"
                          />
                          <Button onClick={() => addIncludedItem(index)} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-1">
                          {tour.includedItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2 items-center p-2 bg-muted rounded">
                              <span className="text-sm flex-1">{item}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeIncludedItem(index, itemIndex)}
                                className="h-8"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className={`p-6 rounded-xl border-2 ${tour.isActive ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' : 'bg-gray-100 border-gray-300'}`}>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-lg">{tour.name}</h4>
                                <p className="text-sm text-muted-foreground">{tour.duration}</p>
                              </div>
                              {!tour.isActive && (
                                <span className="bg-gray-500 text-white px-3 py-1 rounded text-xs">INACTIVE</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-lg text-gray-400 line-through">{tour.originalPrice.toLocaleString()}{tour.currency}</span>
                              <span className="text-3xl font-bold text-green-600">{tour.finalPrice.toLocaleString()}{tour.currency}</span>
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{tour.discount}%</span>
                            </div>

                            <div className="text-sm text-gray-600">
                              Bao gồm {tour.includedItems.length} dịch vụ
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
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
              style={tourPricing.styles?.container}
              onChange={(style) => {
                onChange({ ...tourPricing, styles: { ...tourPricing.styles, container: style } });
              }}
              title="Container Styling"
            />
          </div>
        </Collapsible>

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="text-sm">
            <strong>{tourPricing.tours.length}</strong> tours |{' '}
            <strong>{tourPricing.tours.filter(t => t.isActive).length}</strong> active
          </div>
          {tourPricing.tours.length === 0 && (
            <Button onClick={addTour} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Tour
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
