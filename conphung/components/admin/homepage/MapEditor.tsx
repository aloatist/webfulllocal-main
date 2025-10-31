'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Map } from 'lucide-react';
import type { MapSection } from '@/lib/homepage/schema';

interface MapEditorProps {
  data?: MapSection;
  onChange: (data: MapSection) => void;
}

export default function MapEditor({ data, onChange }: MapEditorProps) {
  const mapData = data || {
    heading: 'BẢN ĐỒ KHU DU LỊCH SINH THÁI CỒN PHỤNG',
    description: 'Hướng dẫn đường đi đến khu du lịch',
    embedUrl: 'https://www.google.com/maps/embed?...',
    address: 'Cồn Phụng, Bến Tre',
    coordinates: { lat: 10.2415, lng: 106.3758 },
  };

  const updateField = (field: keyof MapSection, value: any) => {
    onChange({ ...mapData, [field]: value });
  };

  const updateCoordinates = (field: 'lat' | 'lng', value: number) => {
    const currentCoords = mapData.coordinates || { lat: 0, lng: 0 };
    onChange({
      ...mapData,
      coordinates: { ...currentCoords, [field]: value },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          Map Section
        </CardTitle>
        <CardDescription>
          Quản lý bản đồ và hướng dẫn đường đi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heading */}
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={mapData.heading}
            onChange={(e) => updateField('heading', e.target.value)}
            placeholder="BẢN ĐỒ KHU DU LỊCH"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={mapData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Hướng dẫn đường đi..."
            rows={2}
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>📍 Address</Label>
          <Input
            value={mapData.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Cồn Phụng, Bến Tre"
          />
        </div>

        {/* Coordinates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={mapData.coordinates?.lat || 0}
              onChange={(e) => updateCoordinates('lat', parseFloat(e.target.value) || 0)}
              placeholder="10.2415"
            />
          </div>

          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={mapData.coordinates?.lng || 0}
              onChange={(e) => updateCoordinates('lng', parseFloat(e.target.value) || 0)}
              placeholder="106.3758"
            />
          </div>
        </div>

        {/* Google Maps Embed URL */}
        <div className="space-y-2">
          <Label>🗺️ Google Maps Embed URL</Label>
          <Textarea
            value={mapData.embedUrl}
            onChange={(e) => updateField('embedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=!1m18..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Lấy từ Google Maps → Share → Embed a map → Copy HTML (chỉ lấy URL trong src=&quot;...&quot;)
          </p>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border-2 rounded-lg overflow-hidden">
            <iframe
              src={mapData.embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map Preview"
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Hướng dẫn:</strong> Vào Google Maps, tìm địa điểm → Share → Embed a map → Copy toàn bộ code HTML, sau đó paste vào trường &quot;Embed URL&quot; ở trên (chỉ cần URL trong src=&quot;...&quot;)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
