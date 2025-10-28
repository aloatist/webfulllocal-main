'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  User: {
    name: string | null;
    image?: string | null;
  };
  overallRating: number | any;
  title?: string | null;
  content?: string | null;
  createdAt: Date | string;
  isAnonymous?: boolean;
  cleanlinessRating?: number;
  accuracyRating?: number;
  locationRating?: number;
  valueRating?: number;
}

interface ModernReviewsSectionProps {
  reviews: Review[];
  ratingAverage?: number;
  reviewCount: number;
}

export function ModernReviewsSection({
  reviews,
  ratingAverage = 0,
  reviewCount,
}: ModernReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  if (reviews.length === 0) {
    return (
      <div className="py-8 border-b">
        <div className="rounded-lg border bg-card p-8 text-center">
          <Star className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Chưa có đánh giá</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hãy là người đầu tiên đánh giá homestay này
          </p>
        </div>
      </div>
    );
  }

  // Calculate category ratings
  const categoryRatings = {
    'Sạch sẽ': reviews.reduce((acc, r) => acc + (Number(r.cleanlinessRating) || Number(r.overallRating)), 0) / reviews.length,
    'Chính xác': reviews.reduce((acc, r) => acc + (Number(r.accuracyRating) || Number(r.overallRating)), 0) / reviews.length,
    'Vị trí': reviews.reduce((acc, r) => acc + (Number(r.locationRating) || Number(r.overallRating)), 0) / reviews.length,
    'Giá trị': reviews.reduce((acc, r) => acc + (Number(r.valueRating) || Number(r.overallRating)), 0) / reviews.length,
  };

  return (
    <div className="py-8 border-b">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        <h2 className="text-2xl font-bold">
          {ratingAverage.toFixed(1)} · {reviewCount} đánh giá
        </h2>
      </div>

      {/* Rating Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {Object.entries(categoryRatings).map(([category, score]) => (
          <div key={category}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{category}</span>
              <span className="text-sm font-semibold">{score.toFixed(1)}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayedReviews.map((review) => {
          const rating = Number(review.overallRating);
          const createdAt = typeof review.createdAt === 'string' 
            ? new Date(review.createdAt) 
            : review.createdAt;

          return (
            <div key={review.id} className="space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  {!review.isAnonymous && review.User.image && (
                    <AvatarImage src={review.User.image} alt={review.User.name || ''} />
                  )}
                  <AvatarFallback>
                    {review.isAnonymous 
                      ? '?' 
                      : (review.User.name?.charAt(0).toUpperCase() || 'U')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {review.isAnonymous ? 'Người dùng ẩn danh' : review.User.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(createdAt, 'MMMM yyyy', { locale: vi })}
                  </p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < rating 
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="font-semibold">{review.title}</h4>
              )}

              {/* Content */}
              {review.content && (
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {review.content}
                </p>
              )}

              {/* Show more button for long reviews */}
              {review.content && review.content.length > 200 && (
                <button className="text-sm font-semibold underline hover:no-underline">
                  Xem thêm
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Show All Button */}
      {reviews.length > 6 && (
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll 
              ? 'Thu gọn' 
              : `Xem tất cả ${reviewCount} đánh giá`
            }
          </Button>
        </div>
      )}
    </div>
  );
}
