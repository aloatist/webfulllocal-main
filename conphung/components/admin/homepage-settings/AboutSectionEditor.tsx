'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';
import { FileText, Loader2 } from 'lucide-react';

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

