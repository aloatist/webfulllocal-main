'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Video, Eye, EyeOff } from 'lucide-react';
import type { VideoGuideSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface VideoGuideEditorProps {
  data?: VideoGuideSection;
  onChange: (data: VideoGuideSection) => void;
}

export default function VideoGuideEditor({ data, onChange }: VideoGuideEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const videoGuide = data || {
    heading: 'VIDEO HƯỚNG DẪN ĐƯỜNG ĐI',
    description: 'Xem video hướng dẫn để dễ dàng tìm đường',
    videos: [],
  };

  const updateField = (field: keyof VideoGuideSection, value: any) => {
    onChange({ ...videoGuide, [field]: value });
  };

  const addVideo = () => {
    onChange({
      ...videoGuide,
      videos: [
        ...videoGuide.videos,
        {
          title: 'Video mới',
          url: 'https://www.youtube.com/watch?v=...',
          thumbnail: '',
          duration: '5:00',
        },
      ],
    });
    setExpandedIndex(videoGuide.videos.length);
  };

  const updateVideo = (index: number, updates: any) => {
    const newVideos = [...videoGuide.videos];
    newVideos[index] = { ...newVideos[index], ...updates };
    onChange({ ...videoGuide, videos: newVideos });
  };

  const deleteVideo = (index: number) => {
    if (confirm('Xóa video này?')) {
      onChange({
        ...videoGuide,
        videos: videoGuide.videos.filter((_, i) => i !== index),
      });
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newVideos = [...videoGuide.videos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newVideos.length) return;
    
    [newVideos[index], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[index]];
    onChange({ ...videoGuide, videos: newVideos });
    setExpandedIndex(targetIndex);
  };

  // Helper to toggle field visibility
  const toggleFieldVisibility = (fieldName: keyof NonNullable<VideoGuideSection['visibility']>) => {
    const currentVisibility = videoGuide.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [fieldName]: !(currentVisibility[fieldName] !== false),
    };
    onChange({ ...videoGuide, visibility: newVisibility });
  };

  // Helper to check if field is visible
  const isFieldVisible = (fieldName: keyof NonNullable<VideoGuideSection['visibility']>) => {
    return videoGuide.visibility?.[fieldName] !== false;
  };

  // Helper to render visibility toggle
  const renderVisibilityToggle = (fieldName: keyof NonNullable<VideoGuideSection['visibility']>, label: string) => (
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
          <Video className="w-5 h-5" />
          Video Guide Section
        </CardTitle>
        <CardDescription>
          Quản lý video hướng dẫn đường đi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            {renderVisibilityToggle('heading', 'Hiển thị Heading')}
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={videoGuide.heading}
                onChange={(e) => updateField('heading', e.target.value)}
                placeholder="VIDEO HƯỚNG DẪN ĐƯỜNG ĐI"
                disabled={!isFieldVisible('heading')}
              />
            </div>
          </div>

          <div className="space-y-2">
            {renderVisibilityToggle('description', 'Hiển thị Description')}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={videoGuide.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Xem video để dễ dàng tìm đường..."
                rows={2}
                disabled={!isFieldVisible('description')}
              />
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Videos ({videoGuide.videos.length})</h3>
            {renderVisibilityToggle('videos', 'Hiển thị Videos')}
          </div>
          <div className={`flex justify-end ${!isFieldVisible('videos') ? 'opacity-50 pointer-events-none' : ''}`}>
            <Button onClick={addVideo} size="sm" disabled={!isFieldVisible('videos')}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Video
            </Button>
          </div>

          <div className={!isFieldVisible('videos') ? 'opacity-50 pointer-events-none' : ''}>
            {videoGuide.videos.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Chưa có video nào</p>
                <Button onClick={addVideo} variant="outline" disabled={!isFieldVisible('videos')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm video đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
              {videoGuide.videos.map((video, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVideo(index, 'up')}
                          disabled={index === 0}
                          className="h-6 px-2"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVideo(index, 'down')}
                          disabled={index === videoGuide.videos.length - 1}
                          className="h-6 px-2"
                        >
                          ↓
                        </Button>
                      </div>

                      <div className="flex-shrink-0">
                        <Video className="w-5 h-5 text-primary" />
                      </div>

                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        <h4 className="font-semibold">{video.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{video.url}</p>
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
                        onClick={() => deleteVideo(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedIndex === index && (
                    <CardContent className="space-y-4 pt-0 border-t">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label>Tiêu đề video</Label>
                        <Input
                          value={video.title}
                          onChange={(e) => updateVideo(index, { title: e.target.value })}
                          placeholder="Hướng dẫn đường đi từ TP.HCM"
                        />
                      </div>

                      {/* URL */}
                      <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input
                          value={video.url}
                          onChange={(e) => updateVideo(index, { url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          type="url"
                        />
                        <p className="text-xs text-muted-foreground">
                          YouTube, Vimeo hoặc link trực tiếp (.mp4)
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="space-y-2">
                        <Label>Duration (Optional)</Label>
                        <Input
                          value={video.duration || ''}
                          onChange={(e) => updateVideo(index, { duration: e.target.value })}
                          placeholder="5:30"
                          className="max-w-[150px]"
                        />
                      </div>

                      {/* Thumbnail */}
                      <ImagePicker
                        value={video.thumbnail || ''}
                        onChange={(url) => updateVideo(index, { thumbnail: url })}
                        label="Thumbnail (Optional)"
                        aspectRatio="16/9"
                      />
                    </CardContent>
                  )}
                </Card>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>{videoGuide.videos.length}</strong> videos
            {videoGuide.videos.length < 2 && (
              <span className="text-orange-600 ml-2">(Khuyến nghị: 2-4 videos)</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
