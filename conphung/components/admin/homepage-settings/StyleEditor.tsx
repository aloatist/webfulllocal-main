'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Sparkles, MoveHorizontal } from 'lucide-react';
import type { Style, Typography, Color, Effects, Spacing as SpacingType } from '@/lib/homepage/style-schema';

interface StyleEditorProps {
  style?: Style;
  onChange: (style: Style) => void;
  title?: string;
  description?: string;
}

const FONT_SIZE_OPTIONS = [
  { value: 'sm', label: 'Small (0.875rem)' },
  { value: 'base', label: 'Base (1rem)' },
  { value: 'lg', label: 'Large (1.125rem)' },
  { value: 'xl', label: 'XL (1.25rem)' },
  { value: '2xl', label: '2XL (1.5rem)' },
  { value: '3xl', label: '3XL (1.875rem)' },
  { value: '4xl', label: '4XL (2.25rem)' },
  { value: '5xl', label: '5XL (3rem)' },
  { value: '6xl', label: '6XL (3.75rem)' },
  { value: '7xl', label: '7XL (4.5rem)' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal (400)' },
  { value: 'medium', label: 'Medium (500)' },
  { value: 'semibold', label: 'Semibold (600)' },
  { value: 'bold', label: 'Bold (700)' },
  { value: 'extrabold', label: 'Extrabold (800)' },
];

const COLOR_PRESETS = [
  { value: 'text-white', label: 'White', preview: 'bg-white' },
  { value: 'text-gray-900', label: 'Dark Gray', preview: 'bg-gray-900' },
  { value: 'text-emerald-600', label: 'Emerald', preview: 'bg-emerald-600' },
  { value: 'text-blue-600', label: 'Blue', preview: 'bg-blue-600' },
  { value: 'text-purple-600', label: 'Purple', preview: 'bg-purple-600' },
  { value: 'text-orange-600', label: 'Orange', preview: 'bg-orange-600' },
];

const GRADIENT_PRESETS = [
  { value: 'from-emerald-500 to-green-500', label: 'Emerald Green' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple Pink' },
  { value: 'from-orange-500 to-red-500', label: 'Orange Red' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow Orange' },
];

export function StyleEditor({ style, onChange, title = 'Styling', description }: StyleEditorProps) {
  const currentStyle = style || {};
  const typography = currentStyle.typography || {};
  const colors = currentStyle.colors || {};
  const effects = currentStyle.effects || {};
  const spacing = currentStyle.spacing || {};

  const updateTypography = (field: keyof Typography, value: any) => {
    onChange({
      ...currentStyle,
      typography: { ...typography, [field]: value },
    });
  };

  const updateColors = (field: keyof Color, value: any) => {
    onChange({
      ...currentStyle,
      colors: { ...colors, [field]: value },
    });
  };

  const updateEffects = (field: keyof Effects, value: any) => {
    onChange({
      ...currentStyle,
      effects: { ...effects, [field]: value },
    });
  };

  const updateSpacing = (field: keyof SpacingType, value: any) => {
    onChange({
      ...currentStyle,
      spacing: { ...spacing, [field]: value },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="typography" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-1" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="effects">
              <Sparkles className="w-4 h-4 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="spacing">
              <MoveHorizontal className="w-4 h-4 mr-1" />
              Spacing
            </TabsTrigger>
          </TabsList>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={typography.fontSize || 'base'}
                  onValueChange={(value) => updateTypography('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={typography.fontWeight || 'normal'}
                  onValueChange={(value) => updateTypography('fontWeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Align</Label>
                <Select
                  value={typography.textAlign || 'left'}
                  onValueChange={(value) => updateTypography('textAlign', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Transform</Label>
                <Select
                  value={typography.textTransform || 'none'}
                  onValueChange={(value) => updateTypography('textTransform', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">Uppercase</SelectItem>
                    <SelectItem value="lowercase">Lowercase</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => updateColors('textColor', preset.value)}
                    className={`h-10 rounded-lg ${preset.preview} border-2 ${
                      colors.textColor === preset.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                    }`}
                    title={preset.label}
                  />
                ))}
              </div>
              <Input
                value={colors.textColor || ''}
                onChange={(e) => updateColors('textColor', e.target.value)}
                placeholder="text-white, text-gray-900, #ffffff..."
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                value={colors.bgColor || ''}
                onChange={(e) => updateColors('bgColor', e.target.value)}
                placeholder="bg-white, bg-gray-900, #ffffff..."
              />
            </div>

            <div className="space-y-2">
              <Label>Gradient</Label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => updateColors('gradient', preset.value)}
                    className={`h-10 rounded-lg bg-gradient-to-r ${preset.value} border-2 ${
                      colors.gradient === preset.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                    }`}
                    title={preset.label}
                  />
                ))}
              </div>
              <Input
                value={colors.gradient || ''}
                onChange={(e) => updateColors('gradient', e.target.value)}
                placeholder="from-emerald-500 to-green-500..."
              />
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <Input
                value={colors.borderColor || ''}
                onChange={(e) => updateColors('borderColor', e.target.value)}
                placeholder="border-gray-200, border-emerald-500..."
              />
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shadow</Label>
                <Select
                  value={effects.shadow || 'none'}
                  onValueChange={(value) => updateEffects('shadow', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="2xl">2XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Animation</Label>
                <Select
                  value={effects.animation || 'none'}
                  onValueChange={(value) => updateEffects('animation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="spin">Spin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hover Effect</Label>
                <Select
                  value={effects.hoverEffect || 'none'}
                  onValueChange={(value) => updateEffects('hoverEffect', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="lift">Lift</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                    <SelectItem value="shimmer">Shimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Opacity: {effects.opacity || 100}%</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={effects.opacity || 100}
                    onChange={(e) => updateEffects('opacity', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {effects.opacity || 100}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={spacing.padding || ''}
                  onChange={(e) => updateSpacing('padding', e.target.value)}
                  placeholder="p-4, px-6 py-4..."
                />
              </div>

              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  value={spacing.margin || ''}
                  onChange={(e) => updateSpacing('margin', e.target.value)}
                  placeholder="m-4, mx-6 my-4..."
                />
              </div>

              <div className="space-y-2">
                <Label>Gap</Label>
                <Input
                  value={spacing.gap || ''}
                  onChange={(e) => updateSpacing('gap', e.target.value)}
                  placeholder="gap-4, gap-x-6 gap-y-4..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

