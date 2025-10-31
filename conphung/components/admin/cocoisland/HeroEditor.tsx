'use client';

import { Input } from '@/components/ui/input';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { SectionEditor } from './SectionEditor';
import type { HeroSection } from '@/lib/cocoisland/schema';

interface HeroEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  const updateField = <K extends keyof HeroSection>(field: K, value: HeroSection[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionEditor 
      title="🎯 Hero Section" 
      description="Phần giới thiệu chính ở đầu trang"
      defaultExpanded
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Eyebrow Text</label>
          <Input
            value={data.eyebrow || ''}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Homestay Coco Island"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tiêu đề chính</label>
          <Input
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Trải nghiệm lưu trú..."
          />
        </div>

        <RichTextEditor
          label="Mô tả"
          value={data.description || ''}
          onChange={(value) => updateField('description', value)}
          placeholder="Khu nghỉ dưỡng Homestay Coco Island..."
          rows={4}
        />

        <ImageUploader
          label="Hình ảnh Hero"
          value={data.heroImage}
          onChange={(url) => updateField('heroImage', url)}
          aspectRatio="16/9"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Text CTA Chính</label>
            <Input
              value={data.primaryCta?.label || ''}
              onChange={(e) => updateField('primaryCta', { 
                label: e.target.value, 
                href: data.primaryCta?.href || '#' 
              })}
              placeholder="Đặt ngay"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link CTA Chính</label>
            <Input
              value={data.primaryCta?.href || ''}
              onChange={(e) => updateField('primaryCta', { 
                label: data.primaryCta?.label || 'Đặt ngay', 
                href: e.target.value 
              })}
              placeholder="#booking"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Text CTA Phụ</label>
            <Input
              value={data.secondaryCta?.label || ''}
              onChange={(e) => updateField('secondaryCta', { 
                label: e.target.value, 
                href: data.secondaryCta?.href || '#' 
              })}
              placeholder="Xem phòng"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link CTA Phụ</label>
            <Input
              value={data.secondaryCta?.href || ''}
              onChange={(e) => updateField('secondaryCta', { 
                label: data.secondaryCta?.label || 'Xem phòng', 
                href: e.target.value 
              })}
              placeholder="#rooms"
            />
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="text-sm font-medium mb-2 block">Thống kê nhanh</label>
          <div className="space-y-2">
            {(data.stats || []).map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...(data.stats || [])];
                    newStats[index] = { ...stat, label: e.target.value };
                    updateField('stats', newStats);
                  }}
                  placeholder="Label"
                />
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...(data.stats || [])];
                    newStats[index] = { ...stat, value: e.target.value };
                    updateField('stats', newStats);
                  }}
                  placeholder="Value"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Video */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Video (tùy chọn)</label>
          <Input
            value={data.video?.url || ''}
            onChange={(e) => updateField('video', { 
              url: e.target.value,
              poster: data.video?.poster || '',
              overlayTitle: data.video?.overlayTitle || '',
              overlaySubtitle: data.video?.overlaySubtitle || ''
            })}
            placeholder="https://youtube.com/..."
          />
          <Input
            value={data.video?.overlayTitle || ''}
            onChange={(e) => updateField('video', { 
              url: data.video?.url || '',
              poster: data.video?.poster || '',
              overlayTitle: e.target.value,
              overlaySubtitle: data.video?.overlaySubtitle || ''
            })}
            placeholder="Video trải nghiệm Coco Island"
          />
          <Input
            value={data.video?.overlaySubtitle || ''}
            onChange={(e) => updateField('video', { 
              url: data.video?.url || '',
              poster: data.video?.poster || '',
              overlayTitle: data.video?.overlayTitle || '',
              overlaySubtitle: e.target.value
            })}
            placeholder="Cồn Phụng nhìn từ trên cao"
          />
        </div>
      </div>
    </SectionEditor>
  );
}
