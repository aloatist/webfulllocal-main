'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

interface CategoryFormProps {
  initialData?: Category | null;
  categories?: Category[];
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({
  initialData,
  categories = [],
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    parentId: initialData?.parentId,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  // Filter out the current category and its children from parent options
  const availableParents = categories.filter((category) => {
    if (!initialData) return true;
    return category.id !== initialData.id;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Tên danh mục</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
              slug: e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
            }))
          }
          placeholder="Nhập tên danh mục"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Đường dẫn (slug)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          placeholder="danh-muc"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Mô tả danh mục (không bắt buộc)"
        />
      </div>

      <div className="space-y-2">
        <Label>Danh mục cha</Label>
        <Select
          value={formData.parentId || 'none'}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              parentId: value === 'none' ? undefined : value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục cha (không bắt buộc)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không có</SelectItem>
            {availableParents.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
