'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical, Sparkles, Zap, Shield, Star, Heart, Award, Palette } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from '../homepage-settings/StyleEditor';
import type { FeatureItem, FeaturesSection } from '@/lib/homepage/schema';

interface FeaturesEditorProps {
  data: FeaturesSection;
  onChange: (data: FeaturesSection) => void;
}

const ICON_OPTIONS = [
  { value: '⚡', label: 'Lightning', icon: Zap },
  { value: '🛡️', label: 'Shield', icon: Shield },
  { value: '⭐', label: 'Star', icon: Star },
  { value: '❤️', label: 'Heart', icon: Heart },
  { value: '🏆', label: 'Award', icon: Award },
  { value: '✨', label: 'Sparkles', icon: Sparkles },
  { value: '🎯', label: 'Target' },
  { value: '🚀', label: 'Rocket' },
  { value: '💎', label: 'Diamond' },
  { value: '🌟', label: 'Glowing Star' },
  { value: '🔥', label: 'Fire' },
  { value: '💪', label: 'Strong' },
];

const COLOR_OPTIONS = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue Cyan', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { value: 'from-green-500 to-emerald-500', label: 'Green Emerald', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  { value: 'from-orange-500 to-red-500', label: 'Orange Red', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow Orange', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo Purple', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
];

export default function FeaturesEditor({ data, onChange }: FeaturesEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const addFeature = () => {
    const newFeature: FeatureItem = {
      icon: '⚡',
      title: 'Tính năng mới',
      description: 'Mô tả tính năng',
      color: 'from-blue-500 to-cyan-500',
    };

    onChange({
      features: [...data.features, newFeature],
    });
    setExpandedIndex(data.features.length);
  };

  const updateFeature = (index: number, updates: Partial<FeatureItem>) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    onChange({ features: newFeatures });
  };

  const deleteFeature = (index: number) => {
    if (confirm('Xóa tính năng này?')) {
      const newFeatures = data.features.filter((_, i) => i !== index);
      onChange({ features: newFeatures });
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
    }
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...data.features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newFeatures.length) return;
    
    [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
    onChange({ features: newFeatures });
    setExpandedIndex(targetIndex);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Features Section
            </CardTitle>
            <CardDescription>
              Quản lý các đặc điểm nổi bật của dịch vụ (tối thiểu 3 features)
            </CardDescription>
          </div>
          <Button onClick={addFeature} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Feature
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.features.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Chưa có feature nào</p>
            <Button onClick={addFeature} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Feature Đầu Tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeature(index, 'up')}
                        disabled={index === 0}
                        className="h-6 px-2"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeature(index, 'down')}
                        disabled={index === data.features.length - 1}
                        className="h-6 px-2"
                      >
                        ↓
                      </Button>
                    </div>
                    
                    <div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl cursor-pointer`}
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      {feature.icon}
                    </div>
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {feature.description}
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
                      onClick={() => deleteFeature(index)}
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
                      <div className="grid grid-cols-6 gap-2">
                        {ICON_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFeature(index, { icon: option.value })}
                            className={`p-3 rounded-lg border-2 text-2xl hover:border-primary transition-colors ${
                              feature.icon === option.value ? 'border-primary bg-primary/10' : 'border-border'
                            }`}
                            title={option.label}
                          >
                            {option.value}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, { icon: e.target.value })}
                          placeholder="Hoặc nhập emoji/icon"
                          className="flex-1"
                        />
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-2">
                      <Label>Màu gradient</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {COLOR_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFeature(index, { color: option.value })}
                            className={`h-12 rounded-lg ${option.preview} border-2 ${
                              feature.color === option.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                            }`}
                            title={option.label}
                          />
                        ))}
                      </div>
                      <Input
                        value={feature.color}
                        onChange={(e) => updateFeature(index, { color: e.target.value })}
                        placeholder="Hoặc nhập Tailwind gradient classes"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label>Tiêu đề</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(index, { title: e.target.value })}
                        placeholder="VD: Dịch vụ chuyên nghiệp"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, { description: e.target.value })}
                        placeholder="Mô tả chi tiết về tính năng này..."
                        rows={3}
                      />
                    </div>

                    {/* Feature Item Styling */}
                    <Collapsible
                      title={`${feature.title} Styling`}
                      description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho feature này"
                      icon={<Palette className="w-4 h-4" />}
                      defaultOpen={false}
                    >
                      <div className="pt-2">
                        <StyleEditor
                          style={feature.style}
                          onChange={(style) => {
                            updateFeature(index, { style });
                          }}
                          title={`${feature.title} Styling`}
                        />
                      </div>
                    </Collapsible>

                    {/* Preview */}
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl shadow-lg`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
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

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="text-sm">
            <strong>{data.features.length}</strong> features
            {data.features.length < 3 && (
              <span className="text-orange-600 ml-2">
                (Khuyến nghị tối thiểu 3 features)
              </span>
            )}
          </div>
          {data.features.length < 3 && (
            <Button onClick={addFeature} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Feature
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
