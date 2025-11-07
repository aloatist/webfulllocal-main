'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileText, Eye, EyeOff } from 'lucide-react';
import type { LatestPostsSection } from '@/lib/homepage/schema';

interface LatestPostsEditorProps {
  data?: LatestPostsSection;
  onChange: (data: LatestPostsSection) => void;
}

export default function LatestPostsEditor({ data, onChange }: LatestPostsEditorProps) {
  const posts = data || {
    heading: 'BÀI VIẾT MỚI NHẤT',
    description: 'Cập nhật tin tức và sự kiện',
    ctaText: 'Xem tất cả',
    ctaLink: '/blog',
    postCount: 6,
  };

  const updateField = (field: keyof LatestPostsSection, value: any) => {
    onChange({ ...posts, [field]: value });
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<LatestPostsSection['visibility']>) => {
    const currentVisibility = posts.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false),
    };
    onChange({ ...posts, visibility: newVisibility });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<LatestPostsSection['visibility']>) => {
    return posts.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<LatestPostsSection['visibility']>, label: string) => (
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
          <FileText className="w-5 h-5" />
          Latest Posts Section
        </CardTitle>
        <CardDescription>
          Quản lý section bài viết mới nhất
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heading */}
        <div className="space-y-2">
          {renderVisibilityToggle('heading', 'Hiển thị Heading')}
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={posts.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="BÀI VIẾT MỚI NHẤT"
              disabled={!isFieldVisible('heading')}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          {renderVisibilityToggle('description', 'Hiển thị Description')}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={posts.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Cập nhật tin tức..."
              rows={2}
              disabled={!isFieldVisible('description')}
            />
          </div>
        </div>

        {/* Post Count */}
        <div className="space-y-2">
          {renderVisibilityToggle('posts', 'Hiển thị Posts')}
          <div className={`space-y-2 ${!isFieldVisible('posts') ? 'opacity-50 pointer-events-none' : ''}`}>
            <Label>Số lượng bài viết hiển thị</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={posts.postCount}
              onChange={(e) => updateField('postCount', parseInt(e.target.value) || 6)}
              className="max-w-[150px]"
              disabled={!isFieldVisible('posts')}
            />
            <p className="text-xs text-muted-foreground">
              Min: 1, Max: 12 (khuyến nghị: 6)
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">CTA Button</h3>
            {renderVisibilityToggle('ctaButton', 'Hiển thị CTA Button')}
          </div>
          <div className={`grid md:grid-cols-2 gap-4 ${!isFieldVisible('ctaButton') ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={posts.ctaText}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Xem tất cả"
                disabled={!isFieldVisible('ctaButton')}
              />
            </div>

            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={posts.ctaLink}
                onChange={(e) => updateField('ctaLink', e.target.value)}
                placeholder="/blog"
                disabled={!isFieldVisible('ctaButton')}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Lưu ý:</strong> Bài viết sẽ được lấy tự động từ blog/posts. Section này chỉ cấu hình heading, description và số lượng hiển thị.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
