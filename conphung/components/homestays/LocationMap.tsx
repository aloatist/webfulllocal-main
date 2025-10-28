'use client';

import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  city?: string | null;
  country?: string | null;
}

export function LocationMap({ latitude, longitude, address, city, country }: LocationMapProps) {
  const hasCoordinates = latitude && longitude;
  
  // Format address
  const fullAddress = [address, city, country].filter(Boolean).join(', ');
  
  // Google Maps embed URL
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${latitude},${longitude}&zoom=15`
    : fullAddress
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(fullAddress)}&zoom=13`
    : null;

  if (!mapUrl && !fullAddress) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vị trí</h2>
      
      {/* Address */}
      <div className="flex items-start gap-3 text-muted-foreground">
        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p>{fullAddress || 'Địa chỉ chưa được cung cấp'}</p>
          {hasCoordinates && (
            <p className="text-sm mt-1">
              Tọa độ: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {/* Map */}
      {mapUrl ? (
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>
      ) : (
        <div className="flex h-[400px] w-full items-center justify-center rounded-lg border bg-muted">
          <div className="text-center text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-2" />
            <p>Bản đồ chưa khả dụng</p>
            <p className="text-sm mt-1">Vui lòng thêm tọa độ hoặc địa chỉ đầy đủ</p>
          </div>
        </div>
      )}

      {/* Directions Link */}
      {(hasCoordinates || fullAddress) && (
        <a
          href={
            hasCoordinates
              ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
              : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <MapPin className="h-4 w-4" />
          Chỉ đường đến đây
        </a>
      )}
    </div>
  );
}
