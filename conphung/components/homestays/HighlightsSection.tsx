'use client';

import { Home, Sparkles, MapPin, Calendar, Shield, Key, Wifi, Users } from 'lucide-react';

interface Highlight {
  icon: 'home' | 'sparkles' | 'mapPin' | 'calendar' | 'shield' | 'key' | 'wifi' | 'users';
  title: string;
  description: string;
}

interface HighlightsSectionProps {
  highlights?: Highlight[];
  type?: string;
  isInstantBook?: boolean;
  hasWifi?: boolean;
  isSelfCheckin?: boolean;
}

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  mapPin: MapPin,
  calendar: Calendar,
  shield: Shield,
  key: Key,
  wifi: Wifi,
  users: Users,
};

export function HighlightsSection({ 
  highlights,
  type,
  isInstantBook,
  hasWifi,
  isSelfCheckin,
}: HighlightsSectionProps) {
  // Auto-generate highlights if not provided
  const defaultHighlights: Highlight[] = [];

  if (type === 'ENTIRE_PLACE') {
    defaultHighlights.push({
      icon: 'home',
      title: 'Toàn bộ nhà',
      description: 'Bạn sẽ có cả không gian cho riêng mình',
    });
  }

  if (isSelfCheckin) {
    defaultHighlights.push({
      icon: 'key',
      title: 'Tự check-in',
      description: 'Nhận phòng dễ dàng với khóa thông minh hoặc hộp khóa',
    });
  }

  if (hasWifi) {
    defaultHighlights.push({
      icon: 'wifi',
      title: 'Wifi tốc độ cao',
      description: 'Kết nối internet nhanh, phù hợp làm việc từ xa',
    });
  }

  if (isInstantBook) {
    defaultHighlights.push({
      icon: 'sparkles',
      title: 'Đặt ngay',
      description: 'Xác nhận đặt phòng tức thì không cần chờ chủ nhà',
    });
  }

  // Always add these
  defaultHighlights.push({
    icon: 'sparkles',
    title: 'Vệ sinh tăng cường',
    description: 'Chủ nhà cam kết vệ sinh 5 bước chuẩn quốc tế',
  });

  defaultHighlights.push({
    icon: 'calendar',
    title: 'Hủy miễn phí',
    description: 'Hủy trước 48h để được hoàn tiền đầy đủ',
  });

  const displayHighlights = highlights || defaultHighlights;

  if (displayHighlights.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 py-8 border-y">
      {displayHighlights.map((highlight, index) => {
        const Icon = iconMap[highlight.icon];
        
        return (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{highlight.title}</h3>
              <p className="text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
