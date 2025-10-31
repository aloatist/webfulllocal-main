#!/bin/bash

# Script tự động tích hợp Bản đồ hành chính Việt Nam
# Chạy: bash setup-ban-do.sh

echo "🚀 Bắt đầu tích hợp Bản đồ hành chính Việt Nam..."

# Tạo thư mục
echo "📁 Tạo thư mục..."
mkdir -p app/ban-do-hanh-chinh-viet-nam
mkdir -p data

# Download ảnh bản đồ
echo "🖼️ Download ảnh bản đồ..."
curl -s -o public/bando.webp https://raw.githubusercontent.com/aloatist/Bandohanhchinhvietnam/master/public/bando.webp

# Download data areas
echo "📊 Download dữ liệu areas..."
curl -s -o data/vinhlong-areas.ts https://raw.githubusercontent.com/aloatist/Bandohanhchinhvietnam/master/src/data/vinhlong-areas.ts

# Tạo component VinhLongMap
echo "🗺️ Tạo component VinhLongMap..."
cat > components/vinh-long-map.tsx << 'ENDOFFILE'
"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Area } from '@/data/vinhlong-areas';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';

type VinhLongMapProps = {
  areas: Area[];
  onAreaHover: (area: Area | null) => void;
  onMouseMove: (position: { x: number; y: number }) => void;
};

export function VinhLongMap({ areas, onAreaHover, onMouseMove }: VinhLongMapProps) {
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = event.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    onMouseMove({
      x: event.clientX - parentRect.left,
      y: event.clientY - parentRect.top,
    });
  };

  const handleAreaInteraction = (area: Area | null, isTouch = false) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    
    onAreaHover(area);

    if (area && isTouch) {
      tooltipTimeoutRef.current = setTimeout(() => {
        onAreaHover(null);
      }, 30000);
    }
  }

  const handleAreaClick = (e: React.MouseEvent<SVGPolygonElement> | React.TouchEvent<SVGPolygonElement>, area: Area) => {
    e.preventDefault();
    const isTouchEvent = 'touches' in e.nativeEvent;
    
    const rect = e.currentTarget.closest('div.relative')?.getBoundingClientRect();
    if(rect && isTouchEvent) {
        const touch = (e as React.TouchEvent<SVGPolygonElement>).touches[0];
        const parentRect = e.currentTarget.closest('main')?.getBoundingClientRect();
        if(!parentRect) return;
        
        onMouseMove({
            x: touch.clientX - parentRect.left,
            y: touch.clientY - parentRect.top
        });
    }

    handleAreaInteraction(area, isTouchEvent);
  };

  return (
    <div 
      className="relative w-full aspect-[1163/839] bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onAreaHover(null)}
    >
      <Image
        src="/bando.webp"
        alt="Bản đồ Vĩnh Long"
        fill
        priority
        className="object-contain"
      />
      
      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary/80 text-primary-foreground p-2 md:p-3 rounded-lg shadow-lg text-left text-xs md:text-sm">
        <p className="font-bold whitespace-nowrap">DU LỊCH CỒN PHỤNG</p>
        <div className="flex items-center justify-start gap-1 mt-1">
          <Phone className="w-3 h-3" />
          <span className="whitespace-nowrap">Hotline: 0918 267 715 Mr Thông</span>
        </div>
      </div>

      <svg
        viewBox="0 0 1163 839"
        className="absolute top-10 left-0.5 w-full h-full"
      >
        <g>
          {areas.map((area) => (
            <polygon
              key={area.id}
              points={area.coords}
              onMouseEnter={() => handleAreaInteraction(area)}
              onMouseLeave={() => handleAreaInteraction(null)}
              onClick={(e) => handleAreaClick(e, area)}
              onTouchStart={(e) => handleAreaClick(e, area)}
              className={cn(
                "cursor-pointer transition-all duration-300 ease-in-out",
                "fill-transparent stroke-transparent hover:stroke-primary hover:stroke-[3px] hover:fill-primary/30",
              )}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
ENDOFFILE

# Download page từ GitHub
echo "📄 Tạo page bản đồ..."
curl -s -o app/ban-do-hanh-chinh-viet-nam/page.tsx https://raw.githubusercontent.com/aloatist/Bandohanhchinhvietnam/master/src/app/page.tsx

# Sửa imports để phù hợp với project
sed -i.bak '/SiteHeader/d' app/ban-do-hanh-chinh-viet-nam/page.tsx
sed -i.bak '/SiteFooter/d' app/ban-do-hanh-chinh-viet-nam/page.tsx
rm -f app/ban-do-hanh-chinh-viet-nam/page.tsx.bak

echo ""
echo "✨ Hoàn thành! Các file đã được tạo:"
echo "   �� app/ban-do-hanh-chinh-viet-nam/page.tsx"
echo "   🗺️ components/vinh-long-map.tsx"
echo "   📊 data/vinhlong-areas.ts"
echo "   🖼️ public/bando.webp"
echo ""
echo "🌐 Truy cập: http://localhost:3000/ban-do-hanh-chinh-viet-nam"
echo ""
echo "🗑️ Để xóa script này: rm setup-ban-do.sh"
echo ""
echo "✅ Xong! Bây giờ bạn có thể thêm vào navigation menu."
