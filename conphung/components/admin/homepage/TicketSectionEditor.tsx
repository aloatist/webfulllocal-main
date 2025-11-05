'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Ticket, AlertTriangle, Palette } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from '../homepage-settings/StyleEditor';
import type { TicketSection } from '@/lib/homepage/schema';
import { ImagePicker } from './ImagePicker';

interface TicketSectionEditorProps {
  data?: TicketSection;
  onChange: (data: TicketSection) => void;
}

export default function TicketSectionEditor({ data, onChange }: TicketSectionEditorProps) {
  const [newItem, setNewItem] = useState('');

  const ticket = data || {
    eyebrow: 'Vé Tham Quan',
    heading: 'VÉ THAM QUAN KHU DU LỊCH SINH THÁI',
    subheading: 'CỒN PHỤNG BẾN TRE',
    description: '🌿 Trải nghiệm thiên nhiên xanh mát - Giá vé ưu đãi cho mọi lứa tuổi',
    prices: {
      adult: 50000,
      child: 30000,
      currency: '₫',
    },
    includedItems: [
      '🚢 Miễn phí vé tàu khứ hồi',
      '🐊 Tham quan trại nuôi cá sấu',
      '🍬 Tham quan sản xuất kẹo Dừa',
      '🥥 Thủ công mỹ nghệ từ Dừa',
      '🏛️ Tham quan di tích Đạo Dừa',
      '🏛️ Bảo tàng Dừa',
    ],
    pickupLocation: 'Bến phà Rạch Miễu cũ, thuộc xã Tân Thạch, huyện Châu Thành, tỉnh Bến Tre.',
    warningNote: 'Đến bến phà, vui lòng gọi Hotline để được hỗ trợ tàu đón, tránh nhầm lẫn không phải chính chủ khu du lịch Cồn Phụng.',
    imageUrl: '',
  };

  const updateField = (field: keyof TicketSection, value: any) => {
    onChange({ ...ticket, [field]: value });
  };

  const updatePrice = (type: 'adult' | 'child', value: number) => {
    onChange({
      ...ticket,
      prices: { ...ticket.prices, [type]: value },
    });
  };

  const addIncludedItem = () => {
    if (newItem.trim()) {
      onChange({
        ...ticket,
        includedItems: [...ticket.includedItems, newItem.trim()],
      });
      setNewItem('');
    }
  };

  const removeIncludedItem = (index: number) => {
    const newItems = ticket.includedItems.filter((_, i) => i !== index);
    onChange({ ...ticket, includedItems: newItems });
  };

  const updateIncludedItem = (index: number, value: string) => {
    const newItems = [...ticket.includedItems];
    newItems[index] = value;
    onChange({ ...ticket, includedItems: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Ticket Section
        </CardTitle>
        <CardDescription>
          Quản lý thông tin vé tham quan khu du lịch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Fields */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid gap-2">
            <Label>Eyebrow Text</Label>
            <Input
              value={ticket.eyebrow}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="Vé Tham Quan"
            />
          </div>

          {/* Eyebrow Styling */}
          <Collapsible
            title="Eyebrow Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Eyebrow"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={ticket.styles?.eyebrow}
                onChange={(style) => {
                  onChange({ ...ticket, styles: { ...ticket.styles, eyebrow: style } });
                }}
                title="Eyebrow Styling"
              />
            </div>
          </Collapsible>

          <div className="grid gap-2">
            <Label>Heading</Label>
            <Input
              value={ticket.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              placeholder="VÉ THAM QUAN KHU DU LỊCH SINH THÁI"
            />
          </div>

          {/* Heading Styling */}
          <Collapsible
            title="Heading Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Heading"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={ticket.styles?.heading}
                onChange={(style) => {
                  onChange({ ...ticket, styles: { ...ticket.styles, heading: style } });
                }}
                title="Heading Styling"
              />
            </div>
          </Collapsible>

          <div className="grid gap-2">
            <Label>Subheading</Label>
            <Input
              value={ticket.subheading}
              onChange={(e) => updateField('subheading', e.target.value)}
              placeholder="CỒN PHỤNG BẾN TRE"
            />
          </div>

          {/* Subheading Styling */}
          <Collapsible
            title="Subheading Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Subheading"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={ticket.styles?.subheading}
                onChange={(style) => {
                  onChange({ ...ticket, styles: { ...ticket.styles, subheading: style } });
                }}
                title="Subheading Styling"
              />
            </div>
          </Collapsible>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={ticket.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="🌿 Trải nghiệm thiên nhiên..."
              rows={2}
            />
          </div>

          {/* Description Styling */}
          <Collapsible
            title="Description Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Description"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={ticket.styles?.description}
                onChange={(style) => {
                  onChange({ ...ticket, styles: { ...ticket.styles, description: style } });
                }}
                title="Description Styling"
              />
            </div>
          </Collapsible>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Giá vé</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Adult Price */}
            <div className="space-y-2">
              <Label>Giá vé Người lớn</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={ticket.prices.adult}
                  onChange={(e) => updatePrice('adult', parseInt(e.target.value) || 0)}
                  placeholder="50000"
                />
                <div className="flex items-center px-3 bg-muted rounded-md">
                  {ticket.prices.currency}
                </div>
              </div>
            </div>

            {/* Child Price */}
            <div className="space-y-2">
              <Label>Giá vé Trẻ em</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={ticket.prices.child}
                  onChange={(e) => updatePrice('child', parseInt(e.target.value) || 0)}
                  placeholder="30000"
                />
                <div className="flex items-center px-3 bg-muted rounded-md">
                  {ticket.prices.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Đơn vị tiền tệ</Label>
            <Input
              value={ticket.prices.currency}
              onChange={(e) => onChange({ ...ticket, prices: { ...ticket.prices, currency: e.target.value }})}
              placeholder="₫"
              className="max-w-[100px]"
            />
          </div>
        </div>

        {/* Included Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bao gồm trong vé ({ticket.includedItems.length})</h3>
          </div>

          {/* Add New Item */}
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIncludedItem()}
              placeholder="VD: 🚢 Miễn phí vé tàu khứ hồi"
            />
            <Button onClick={addIncludedItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {ticket.includedItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-center p-3 bg-muted rounded-lg">
                <span className="text-sm flex-1">{item}</span>
                <Input
                  value={item}
                  onChange={(e) => updateIncludedItem(index, e.target.value)}
                  className="hidden group-hover:block"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIncludedItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Included Items Styling */}
          <Collapsible
            title="Bao gồm (Included Items) Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho danh sách 'Bao gồm' trong vé"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={ticket.styles?.includedItems}
                onChange={(style) => {
                  onChange({ ...ticket, styles: { ...ticket.styles, includedItems: style } });
                }}
                title="Bao gồm Styling"
              />
            </div>
          </Collapsible>
        </div>

        {/* Location & Warning */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>📍 Điểm đón khách</Label>
            <Textarea
              value={ticket.pickupLocation}
              onChange={(e) => updateField('pickupLocation', e.target.value)}
              placeholder="Địa chỉ điểm đón..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Lưu ý quan trọng
            </Label>
            <Textarea
              value={ticket.warningNote}
              onChange={(e) => updateField('warningNote', e.target.value)}
              placeholder="Lưu ý cho khách..."
              rows={3}
            />
          </div>
        </div>

        {/* Image Picker (Optional) */}
        <ImagePicker
          value={ticket.imageUrl || ''}
          onChange={(url) => updateField('imageUrl', url)}
          label="Hình ảnh (Optional)"
          aspectRatio="16/9"
        />

        {/* Container Styling */}
        <Collapsible
          title="Container Styling"
          description="Tùy chỉnh styling cho toàn bộ section container"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
          className="border-t pt-4"
        >
          <div className="pt-2">
            <StyleEditor
              style={ticket.styles?.container}
              onChange={(style) => {
                onChange({ ...ticket, styles: { ...ticket.styles, container: style } });
              }}
              title="Container Styling"
            />
          </div>
        </Collapsible>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-block bg-emerald-100 px-4 py-1 rounded-full text-sm font-semibold text-emerald-700">
                {ticket.eyebrow}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {ticket.heading}
              </h2>
              <h3 className="text-xl font-bold text-gray-800">
                {ticket.subheading}
              </h3>
              <p className="text-gray-600">{ticket.description}</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
                <p className="font-bold text-red-800 mb-1">Người lớn</p>
                <p className="text-3xl font-bold text-red-600">
                  {ticket.prices.adult.toLocaleString()}{ticket.prices.currency}
                </p>
                <p className="text-sm text-gray-600">/ vé</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <p className="font-bold text-green-800 mb-1">Trẻ em</p>
                <p className="text-3xl font-bold text-green-600">
                  {ticket.prices.child.toLocaleString()}{ticket.prices.currency}
                </p>
                <p className="text-sm text-gray-600">/ vé</p>
              </div>
            </div>

            {/* Included Items */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="font-bold text-emerald-800 mb-3">Bao gồm:</p>
              <ul className="space-y-2">
                {ticket.includedItems.slice(0, 3).map((item, i) => (
                  <li key={i} className="text-sm text-gray-700">✓ {item}</li>
                ))}
                {ticket.includedItems.length > 3 && (
                  <li className="text-sm text-gray-500">+ {ticket.includedItems.length - 3} mục khác...</li>
                )}
              </ul>
            </div>

            {/* Warning */}
            {ticket.warningNote && (
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-sm text-yellow-800 flex gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span><strong>Lưu ý:</strong> {ticket.warningNote.slice(0, 100)}...</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
