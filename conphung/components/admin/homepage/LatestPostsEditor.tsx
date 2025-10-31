'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
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
          <Label>Heading</Label>
          <Input
            value={posts.heading}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="BÀI VIẾT MỚI NHẤT"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={posts.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Cập nhật tin tức..."
            rows={2}
          />
        </div>

        {/* Post Count */}
        <div className="space-y-2">
          <Label>Số lượng bài viết hiển thị</Label>
          <Input
            type="number"
            min={1}
            max={12}
            value={posts.postCount}
            onChange={(e) => updateField('postCount', parseInt(e.target.value) || 6)}
            className="max-w-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            Min: 1, Max: 12 (khuyến nghị: 6)
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">CTA Button</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={posts.ctaText}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Xem tất cả"
              />
            </div>

            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={posts.ctaLink}
                onChange={(e) => updateField('ctaLink', e.target.value)}
                placeholder="/blog"
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
