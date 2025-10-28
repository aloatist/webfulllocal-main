'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface TagFormValues {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

interface TagFormProps {
  initialData?: TagFormValues | null;
  onSubmit: (data: TagFormValues) => Promise<void>;
  onCancel: () => void;
}

export function TagForm({ initialData, onSubmit, onCancel }: TagFormProps) {
  const [formData, setFormData] = useState<TagFormValues>({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    id: initialData?.id,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await onSubmit(formData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu thẻ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tag-name">Tên thẻ</Label>
        <Input
          id="tag-name"
          value={formData.name}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              name: event.target.value,
              slug:
                prev.id || prev.slug
                  ? prev.slug
                  : event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, ''),
            }))
          }
          placeholder="Nhập tên thẻ"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag-slug">Slug</Label>
        <Input
          id="tag-slug"
          value={formData.slug}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              slug: event.target.value,
            }))
          }
          placeholder="tag-slug"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag-description">Mô tả</Label>
        <Textarea
          id="tag-description"
          value={formData.description ?? ''}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Mô tả (không bắt buộc)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Hủy
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
