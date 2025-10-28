'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileBottomBarProps {
  price: number | string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  onBookClick: () => void;
}

export function MobileBottomBar({ 
  price, 
  currency = 'VND',
  rating,
  reviewCount,
  onBookClick 
}: MobileBottomBarProps) {
  const formattedPrice = Number(price).toLocaleString('vi-VN');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-between gap-4">
        {/* Price & Rating */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">
              {formattedPrice}
            </span>
            <span className="text-sm text-muted-foreground">
              {currency}
            </span>
            <span className="text-xs text-muted-foreground">/ đêm</span>
          </div>
          
          {rating && reviewCount && reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Book Button */}
        <Button 
          size="lg" 
          className="px-8"
          onClick={onBookClick}
        >
          Đặt ngay
        </Button>
      </div>
    </div>
  );
}
