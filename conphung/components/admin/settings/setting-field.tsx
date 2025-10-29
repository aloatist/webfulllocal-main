'use client'

import { SettingType } from '@/lib/settings/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

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
          <div className="space-y-2">
            <Input
              id={id}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || '/duong-dan/anh.jpg'}
              required={required}
              disabled={disabled}
            />
            {value && (
              <div className="relative w-32 h-32 border rounded overflow-hidden">
                <Image
                  src={value}
                  alt="Ảnh cấu hình"
                  width={100}
                  height={100}
                  className="rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EKh%C3%B4ng c%C3%B3 %E1%BA%A3nh%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </div>
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
