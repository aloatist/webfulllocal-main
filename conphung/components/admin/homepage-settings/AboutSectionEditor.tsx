'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from './ImageUpload';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from './StyleEditor';
import { FileText, Loader2, Palette, Eye, EyeOff } from 'lucide-react';
import type { AboutSection } from '@/lib/homepage/schema';

const Editor = dynamic(() => import('@/components/editor'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
});

interface AboutSectionEditorProps {
  data: {
    aboutTitle?: string | null;
    aboutContent?: string | null; // EditorJS JSON string
    aboutImage?: string | null;
    aboutImageId?: string | null;
    visibility?: {
      title?: boolean;
      content?: boolean;
      image?: boolean;
    };
    styles?: any;
  };
  onChange: (data: Partial<AboutSectionEditorProps['data']>) => void;
}

export function AboutSectionEditor({ data, onChange }: AboutSectionEditorProps) {
  const [editorKey, setEditorKey] = useState(0);

  // Re-initialize editor when content changes externally
  useEffect(() => {
    setEditorKey(prev => prev + 1);
  }, [data.aboutContent]);

  const updateField = (field: keyof AboutSectionEditorProps['data'], value: any) => {
    onChange({ [field]: value });
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: 'title' | 'content' | 'image') => {
    const currentVisibility = data.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false), // Default to true if undefined
    };
    onChange({ visibility: newVisibility });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: 'title' | 'content' | 'image') => {
    return data.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: 'title' | 'content' | 'image', label: string) => (
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
          About Section
        </CardTitle>
        <CardDescription>
          Phần giới thiệu về chúng tôi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          {renderVisibilityToggle('title', 'Hiển thị Title')}
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Title</Label>
            <Input
              id="aboutTitle"
              value={data.aboutTitle || ''}
              onChange={(e) => updateField('aboutTitle', e.target.value)}
              placeholder="THÔNG TIN VỀ CHÚNG TÔI"
              disabled={!isFieldVisible('title')}
            />
          </div>
        </div>

        {/* Title Styling */}
        <Collapsible
          title="Title Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Title"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={(data as any).styles?.title}
              onChange={(style) => {
                onChange({ styles: { ...(data as any).styles, title: style } } as any);
              }}
              title="Title Styling"
            />
          </div>
        </Collapsible>

        {/* Rich Text Content */}
        <div className="space-y-2">
          {renderVisibilityToggle('content', 'Hiển thị Content')}
          <div className="space-y-2">
            <Label>Content (Rich Text)</Label>
            <div key={editorKey} className={!isFieldVisible('content') ? 'opacity-50 pointer-events-none' : ''}>
              <Editor
                value={data.aboutContent || ''}
                onChange={(jsonString) => updateField('aboutContent', jsonString)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Sử dụng editor để tạo nội dung phong phú với headings, lists, images, embeds...
            </p>
          </div>
        </div>

        {/* Content Styling */}
        <Collapsible
          title="Content Styling"
          description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Content"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="pt-2">
            <StyleEditor
              style={(data as any).styles?.content}
              onChange={(style) => {
                onChange({ styles: { ...(data as any).styles, content: style } } as any);
              }}
              title="Content Styling"
            />
          </div>
        </Collapsible>

        {/* Image */}
        <div className="space-y-2">
          {renderVisibilityToggle('image', 'Hiển thị Image')}
          <div className="space-y-2">
            <Label>Image</Label>
            <div className={!isFieldVisible('image') ? 'opacity-50 pointer-events-none' : ''}>
              <ImageUpload
                currentImage={data.aboutImage || null}
                currentImageId={data.aboutImageId || null}
                field="aboutImage"
                onUpload={(url, publicId) => {
                  updateField('aboutImage', url);
                  updateField('aboutImageId', publicId);
                }}
                onRemove={() => {
                  updateField('aboutImage', null);
                  updateField('aboutImageId', null);
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

