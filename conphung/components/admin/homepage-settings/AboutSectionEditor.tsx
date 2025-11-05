'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from './StyleEditor';
import { FileText, Loader2, Palette } from 'lucide-react';

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
          <Label htmlFor="aboutTitle">Title</Label>
          <Input
            id="aboutTitle"
            value={data.aboutTitle || ''}
            onChange={(e) => updateField('aboutTitle', e.target.value)}
            placeholder="THÔNG TIN VỀ CHÚNG TÔI"
          />
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
          <Label>Content (Rich Text)</Label>
          <div key={editorKey}>
            <Editor
              value={data.aboutContent || ''}
              onChange={(jsonString) => updateField('aboutContent', jsonString)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Sử dụng editor để tạo nội dung phong phú với headings, lists, images, embeds...
          </p>
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
          <Label>Image</Label>
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
      </CardContent>
    </Card>
  );
}

