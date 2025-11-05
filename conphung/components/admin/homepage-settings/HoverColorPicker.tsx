'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HoverColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// Preset hover colors for social media
const PRESET_COLORS = [
  { value: 'hover:bg-blue-600', label: 'Facebook Blue', preview: 'bg-blue-600' },
  { value: 'hover:bg-pink-600', label: 'Instagram Pink', preview: 'bg-pink-600' },
  { value: 'hover:bg-red-600', label: 'Youtube Red', preview: 'bg-red-600' },
  { value: 'hover:bg-blue-500', label: 'Zalo Blue', preview: 'bg-blue-500' },
  { value: 'hover:bg-emerald-500', label: 'Green', preview: 'bg-emerald-500' },
  { value: 'hover:bg-purple-600', label: 'Purple', preview: 'bg-purple-600' },
  { value: 'hover:bg-orange-500', label: 'Orange', preview: 'bg-orange-500' },
  { value: 'hover:bg-indigo-600', label: 'Indigo', preview: 'bg-indigo-600' },
  { value: 'hover:bg-cyan-500', label: 'Cyan', preview: 'bg-cyan-500' },
  { value: 'hover:bg-rose-500', label: 'Rose', preview: 'bg-rose-500' },
  { value: 'hover:bg-teal-500', label: 'Teal', preview: 'bg-teal-500' },
  { value: 'hover:bg-amber-500', label: 'Amber', preview: 'bg-amber-500' },
];

export function HoverColorPicker({ value, onChange, label = 'Hover Color Class' }: HoverColorPickerProps) {
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePresetSelect = (presetValue: string) => {
    onChange(presetValue);
    setShowCustomInput(false);
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setCustomValue('');
    setShowCustomInput(false);
  };

  const selectedPreset = PRESET_COLORS.find(p => p.value === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Xóa
          </Button>
        )}
      </div>

      {/* Preset Colors Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handlePresetSelect(preset.value)}
            className={cn(
              "relative h-10 rounded-md border-2 transition-all hover:scale-110",
              preset.preview,
              value === preset.value
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-border hover:border-primary/50'
            )}
            title={preset.label}
          >
            {value === preset.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Color Preview */}
      {selectedPreset && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <div className={cn("w-4 h-4 rounded", selectedPreset.preview)}></div>
          <span className="text-sm text-muted-foreground">{selectedPreset.label}</span>
          <code className="ml-auto text-xs bg-background px-2 py-1 rounded">{value}</code>
        </div>
      )}

      {/* Custom Input */}
      <div className="space-y-2">
        {showCustomInput ? (
          <div className="flex gap-2">
            <Input
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="hover:bg-custom-500"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomSubmit();
                } else if (e.key === 'Escape') {
                  setShowCustomInput(false);
                  setCustomValue('');
                }
              }}
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCustomSubmit}
              disabled={!customValue.trim()}
            >
              Áp dụng
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCustomInput(false);
                setCustomValue('');
              }}
            >
              Hủy
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(true)}
            className="w-full"
          >
            <Palette className="w-4 h-4 mr-2" />
            Tùy chỉnh màu
          </Button>
        )}
      </div>

      {/* Current Value Display */}
      {value && !selectedPreset && (
        <div className="p-2 bg-muted rounded-md">
          <code className="text-xs">{value}</code>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Chọn màu có sẵn hoặc nhập Tailwind class tùy chỉnh (ví dụ: hover:bg-blue-600)
      </p>
    </div>
  );
}

