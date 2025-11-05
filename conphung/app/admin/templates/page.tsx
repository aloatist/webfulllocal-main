'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette, 
  CheckCircle2, 
  Eye, 
  Save, 
  Loader2,
  Sparkles,
  Leaf,
  Home,
} from 'lucide-react';
import { TemplateType, templateLabels, templates, getAllTemplates } from '@/lib/templates/types';
import Link from 'next/link';

export default function TemplatesManagementPage() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.ECOLOGICAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTemplate();
  }, []);

  async function loadTemplate() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/templates');
      
      if (response.ok) {
        const data = await response.json();
        setActiveTemplate(data.template || TemplateType.ECOLOGICAL);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(template: TemplateType) {
    try {
      setSaving(true);
      setStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeTemplate: template,
        }),
      });

      if (response.ok) {
        setActiveTemplate(template);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Không thể lưu template');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const templateList = getAllTemplates();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="w-8 h-8 text-emerald-600" />
            Quản Lý Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Chọn và áp dụng template cho website
          </p>
        </div>

        <Link href="/" target="_blank">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Xem Trang Chủ
          </Button>
        </Link>
      </div>

      {/* Current Template Badge */}
      <Alert className="border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30">
        <AlertDescription className="flex items-center justify-between">
          <span>
            Template hiện tại: <strong>{templates[activeTemplate].icon} {templates[activeTemplate].name}</strong>
          </span>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Đang hoạt động
          </Badge>
        </AlertDescription>
      </Alert>

      {/* Status Messages */}
      {status === 'success' && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <p className="text-green-800 dark:text-green-200">
              ✅ Đã thay đổi template thành công! Vui lòng reload trang để xem thay đổi.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            <p>{errorMessage}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Template Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {templateList.map((template) => {
          const isActive = activeTemplate === template.id;
          
          return (
            <Card 
              key={template.id}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                isActive 
                  ? 'border-2 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20' 
                  : 'border hover:border-emerald-300'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-emerald-500 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Đang dùng
                  </Badge>
                </div>
              )}

              {/* Template Preview Color Bar */}
              <div 
                className="h-32 w-full"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`,
                }}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl">{template.icon}</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{template.icon}</span>
                  <span>{template.name}</span>
                </CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Color Palette Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Màu sắc:</p>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: template.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: template.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: template.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                {/* Style Info */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Phong cách:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {template.style.borderRadius}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.style.shadows}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.style.spacing}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  {isActive ? (
                    <Button disabled className="w-full bg-emerald-500">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Đang sử dụng
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSave(template.id)}
                      disabled={saving}
                      className="w-full"
                    >
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Áp Dụng Template
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Templates</CardTitle>
          <CardDescription>
            Mỗi template có phong cách và màu sắc riêng biệt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Sinh Thái
                </h3>
                <p className="text-sm text-muted-foreground">
                  Màu xanh lá chủ đạo, gần gũi thiên nhiên, phù hợp cho du lịch sinh thái
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Hiện Đại
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tối giản, clean, màu xanh dương, phù hợp cho thương hiệu hiện đại
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5 text-amber-600" />
                  Truyền Thống
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ấm cúng, truyền thống, màu vàng cam, phù hợp cho văn hóa địa phương
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

