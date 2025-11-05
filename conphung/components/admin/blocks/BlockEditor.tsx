'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Save, X } from 'lucide-react';
import { getBlockSchema, type BlockFieldSchema } from '@/lib/blocks/registry';

interface BlockEditorProps {
  block: {
    id: string;
    type: string;
    title?: string | null;
    fields: any;
    status: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

// Dynamic form field renderer
function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: BlockFieldSchema;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (field.type) {
    case 'text':
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
        />
      );

    case 'url':
      return (
        <Input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          placeholder={field.placeholder}
          required={field.required}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      );

    case 'boolean':
      return (
        <Switch
          checked={value || false}
          onCheckedChange={onChange}
        />
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'https://...'}
            required={field.required}
          />
          {value && (
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md border"
            />
          )}
        </div>
      );

    case 'array':
      // Simple array editor (can be enhanced later)
      return (
        <Textarea
          value={Array.isArray(value) ? JSON.stringify(value, null, 2) : ''}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(Array.isArray(parsed) ? parsed : []);
            } catch {
              onChange([]);
            }
          }}
          placeholder='["item1", "item2"] hoặc []'
          rows={4}
        />
      );

    default:
      return (
        <Textarea
          value={typeof value === 'string' ? value : JSON.stringify(value || {})}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
        />
      );
  }
}

export function BlockEditor({ block, isOpen, onClose, onSave }: BlockEditorProps) {
  const [saving, setSaving] = useState(false);
  const schema = block ? getBlockSchema(block.type) : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: block
      ? {
          title: block.title || '',
          status: block.status,
          ...block.fields,
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    if (!block) return;

    setSaving(true);
    try {
      const { title, status, ...fields } = data;
      await onSave({
        id: block.id,
        title: title || null,
        status,
        fields,
      });
      onClose();
    } catch (error) {
      console.error('Error saving block:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!block || !schema) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Chỉnh sửa: {schema.name} {schema.icon}
          </DialogTitle>
          <DialogDescription>{schema.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Block Title & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Tên block (cho admin)</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Tùy chọn - để dễ quản lý"
              />
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="ACTIVE">Hiển thị</option>
                <option value="DISABLED">Ẩn</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Nội dung block</h3>
            {schema.fields.map((field) => {
              const fieldValue = watch(field.key);
              return (
                <div key={field.key}>
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-gray-500 mb-1">{field.description}</p>
                  )}
                  <FieldRenderer
                    field={field}
                    value={fieldValue}
                    onChange={(value) => setValue(field.key, value)}
                  />
                  {errors[field.key] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[field.key]?.message as string}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

