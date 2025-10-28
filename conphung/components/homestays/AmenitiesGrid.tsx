'use client';

import { useState } from 'react';
import { 
  Wifi, Car, Waves, Wind, Coffee, Tv, Utensils, 
  Refrigerator, Microwave, WashingMachine, AirVent,
  Dumbbell, Baby, PawPrint, Cigarette, Music,
  Shield, Camera, Lock, Flame, Droplet, Zap,
  Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AmenitiesGridProps {
  amenities: string[];
  showAllInitially?: boolean;
}

// Map amenity names to icons
const amenityIconMap: Record<string, any> = {
  'Wifi': Wifi,
  'Bãi đỗ xe': Car,
  'Hồ bơi': Waves,
  'Điều hòa': Wind,
  'Máy pha cà phê': Coffee,
  'TV': Tv,
  'Bếp': Utensils,
  'Tủ lạnh': Refrigerator,
  'Lò vi sóng': Microwave,
  'Máy giặt': WashingMachine,
  'Quạt': AirVent,
  'Phòng gym': Dumbbell,
  'Đồ dùng trẻ em': Baby,
  'Cho phép thú cưng': PawPrint,
  'Cho phép hút thuốc': Cigarette,
  'Loa/Âm thanh': Music,
  'Két an toàn': Shield,
  'Camera an ninh': Camera,
  'Khóa cửa thông minh': Lock,
  'Lò sưởi': Flame,
  'Nước nóng': Droplet,
  'Máy phát điện': Zap,
};

function getAmenityIcon(amenity: string) {
  // Try exact match first
  if (amenityIconMap[amenity]) {
    return amenityIconMap[amenity];
  }
  
  // Try partial match
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (lowerAmenity.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerAmenity)) {
      return icon;
    }
  }
  
  // Default icon
  return Check;
}

export function AmenitiesGrid({ amenities, showAllInitially = false }: AmenitiesGridProps) {
  const [showAll, setShowAll] = useState(showAllInitially);
  
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const displayedAmenities = showAll ? amenities : amenities.slice(0, 10);
  const hasMore = amenities.length > 10;

  return (
    <div className="py-8 border-b">
      <h2 className="text-2xl font-bold mb-6">Tiện nghi</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {displayedAmenities.map((amenity, index) => {
          const Icon = getAmenityIcon(amenity);
          
          return (
            <div 
              key={index} 
              className="flex items-center gap-3 py-2 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{amenity}</span>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Hiện tất cả {amenities.length} tiện nghi
            </>
          )}
        </Button>
      )}
    </div>
  );
}
