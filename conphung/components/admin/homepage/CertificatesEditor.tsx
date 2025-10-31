'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Award, Shield, FileCheck, CheckCircle2 } from 'lucide-react';
import type { CertificateItem, CertificatesSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface CertificatesEditorProps {
  data: CertificatesSection;
  onChange: (data: CertificatesSection) => void;
}

const ICON_OPTIONS = [
  { value: '🏆', label: 'Award', icon: Award },
  { value: '🛡️', label: 'Shield', icon: Shield },
  { value: '📜', label: 'Certificate', icon: FileCheck },
  { value: '✅', label: 'Check', icon: CheckCircle2 },
  { value: '⭐', label: 'Star' },
  { value: '🎖️', label: 'Medal' },
  { value: '📋', label: 'Clipboard' },
  { value: '✓', label: 'Checkmark' },
];

export default function CertificatesEditor({ data, onChange }: CertificatesEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateField = (field: keyof CertificatesSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addCertificate = () => {
    const newCert: CertificateItem = {
      name: 'Giấy phép mới',
      description: 'Mô tả giấy phép',
      imageUrl: '',
      icon: '🏆',
    };
    onChange({
      ...data,
      certificates: [...data.certificates, newCert],
    });
    setExpandedIndex(data.certificates.length);
  };

  const updateCertificate = (index: number, updates: Partial<CertificateItem>) => {
    const newCerts = [...data.certificates];
    newCerts[index] = { ...newCerts[index], ...updates };
    onChange({ ...data, certificates: newCerts });
  };

  const deleteCertificate = (index: number) => {
    if (confirm('Xóa giấy phép này?')) {
      const newCerts = data.certificates.filter((_, i) => i !== index);
      onChange({ ...data, certificates: newCerts });
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
    }
  };

  const moveCertificate = (index: number, direction: 'up' | 'down') => {
    const newCerts = [...data.certificates];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCerts.length) return;
    
    [newCerts[index], newCerts[targetIndex]] = [newCerts[targetIndex], newCerts[index]];
    onChange({ ...data, certificates: newCerts });
    setExpandedIndex(targetIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certificates & Licenses Section
        </CardTitle>
        <CardDescription>
          Quản lý giấy phép, chứng nhận của doanh nghiệp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Fields */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid gap-2">
            <Label>Eyebrow Text</Label>
            <Input
              value={data.eyebrow}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="Giấy Phép & Chứng Nhận"
            />
          </div>

          <div className="grid gap-2">
            <Label>Heading</Label>
            <Input
              value={data.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="THÔNG TIN VỀ CHÚNG TÔI"
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={data.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="🏛️ Được cấp phép và công nhận bởi các cơ quan chức năng"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label>Bottom Note</Label>
            <Input
              value={data.bottomNote}
              onChange={(e) => updateField('bottomNote', e.target.value)}
              placeholder="✅ Được Bộ Công Thương xác nhận - Đơn vị du lịch uy tín"
            />
          </div>
        </div>

        {/* Certificates List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Giấy phép & Chứng nhận ({data.certificates.length})</h3>
            <Button onClick={addCertificate} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm chứng nhận
            </Button>
          </div>

          {data.certificates.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có chứng nhận nào</p>
              <Button onClick={addCertificate} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm chứng nhận đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.certificates.map((cert, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveCertificate(index, 'up')}
                          disabled={index === 0}
                          className="h-6 px-2"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveCertificate(index, 'down')}
                          disabled={index === data.certificates.length - 1}
                          className="h-6 px-2"
                        >
                          ↓
                        </Button>
                      </div>
                      
                      <div className="text-2xl">{cert.icon}</div>
                      
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {cert.description}
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
                        onClick={() => deleteCertificate(index)}
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
                        <div className="grid grid-cols-8 gap-2">
                          {ICON_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateCertificate(index, { icon: option.value })}
                              className={`p-3 rounded-lg border-2 text-2xl hover:border-primary transition-colors ${
                                cert.icon === option.value ? 'border-primary bg-primary/10' : 'border-border'
                              }`}
                              title={option.label}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                        <Input
                          value={cert.icon}
                          onChange={(e) => updateCertificate(index, { icon: e.target.value })}
                          placeholder="Hoặc nhập emoji"
                        />
                      </div>

                      {/* Name */}
                      <div className="space-y-2">
                        <Label>Tên giấy phép</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertificate(index, { name: e.target.value })}
                          placeholder="VD: Giấy Phép Lữ Hành"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Textarea
                          value={cert.description}
                          onChange={(e) => updateCertificate(index, { description: e.target.value })}
                          placeholder="Mô tả chi tiết..."
                          rows={2}
                        />
                      </div>

                      {/* Image Picker */}
                      <ImagePicker
                        value={cert.imageUrl}
                        onChange={(url) => updateCertificate(index, { imageUrl: url })}
                        label="Hình ảnh giấy phép"
                        aspectRatio="1/1"
                      />

                      {/* Preview */}
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{cert.icon}</div>
                            <div>
                              <p className="font-semibold">{cert.name}</p>
                              <p className="text-sm text-muted-foreground">{cert.description}</p>
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
      </CardContent>
    </Card>
  );
}
