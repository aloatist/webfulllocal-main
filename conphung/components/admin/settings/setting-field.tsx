'use client'

import { useState } from 'react'
import { SettingType } from '@/lib/settings/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { MediaPickerDialog } from '@/components/media/media-picker-dialog'
import type { MediaItem } from '@/components/media/types'

interface SettingFieldProps {
  id: string
  label: string
  description?: string
  type: SettingType
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export function SettingField({
  id,
  label,
  description,
  type,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: SettingFieldProps) {
  const renderField = () => {
    switch (type) {
      case 'BOOLEAN':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={id}
              checked={value === 'true'}
              onCheckedChange={(checked) => onChange(checked.toString())}
              disabled={disabled}
            />
            <Label htmlFor={id} className="cursor-pointer">
              {value === 'true' ? 'Bật' : 'Tắt'}
            </Label>
          </div>
        )

      case 'NUMBER':
        return (
          <Input
            id={id}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="max-w-xs"
          />
        )

      case 'EMAIL':
        return (
          <Input
            id={id}
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        )

      case 'URL':
        return (
          <Input
            id={id}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        )

      case 'JSON':
        return (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={6}
            className="font-mono text-sm"
          />
        )

      case 'IMAGE':
        return (
          <ImageUploadField
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        )

      default: // TEXT
        return (
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {renderField()}
    </div>
  )
}

// Image Upload Field Component
function ImageUploadField({
  id,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB')
      return
    }

    setUploading(true)
    setPreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('field', id)

      // Use settings upload endpoint
      const response = await fetch('/api/settings/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
      setPreview(null)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Không thể upload ảnh. Vui lòng thử lại.')
      setPreview(null)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  const handleSelectFromLibrary = (media: MediaItem | MediaItem[]) => {
    // MediaPickerDialog passes single item or array
    const selectedMedia = Array.isArray(media) ? media[0] : media
    if (selectedMedia?.url) {
      onChange(selectedMedia.url)
      setMediaPickerOpen(false)
    }
  }

  const displayImage = preview || value

  return (
    <div className="space-y-4">
      {/* URL Input (for manual entry or after upload) */}
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '/duong-dan/anh.jpg'}
        required={required}
        disabled={disabled || uploading}
      />

      {/* Image Preview & Upload */}
      {displayImage && (
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border">
          <Image
            src={displayImage}
            alt="Preview"
            fill
            className="object-contain bg-gray-50 dark:bg-gray-900"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EKh%C3%B4ng c%C3%B3 %E1%BA%A3nh%3C/text%3E%3C/svg%3E'
            }}
          />
          {!uploading && value && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Upload Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById(`upload-${id}`)?.click()}
          disabled={disabled || uploading}
          type="button"
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {displayImage ? 'Thay đổi ảnh' : 'Upload từ máy tính'}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setMediaPickerOpen(true)}
          disabled={disabled || uploading}
          type="button"
          className="flex-1"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Chọn từ thư viện
        </Button>
        <input
          id={`upload-${id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        JPG, PNG hoặc WebP. Tối đa 5MB. Hoặc nhập URL trực tiếp vào ô trên.
      </p>

      {/* Media Library Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleSelectFromLibrary}
        multiple={false}
      />
    </div>
  )
}
