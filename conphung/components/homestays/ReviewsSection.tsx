'use client';

import { Star } from 'lucide-react';
import { ReviewForm, ReviewList } from '@/components/reviews';

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
  hostResponse?: string | null;
  hostResponseAt?: Date | string | null;
}

interface ReviewsSectionProps {
  homestayId: string;
  reviews: Review[];
  averageRating?: number;
  totalReviews: number;
}

export function ReviewsSection({
  homestayId,
  reviews,
  averageRating = 0,
  totalReviews,
}: ReviewsSectionProps) {
  // Format reviews for new components
  const formattedReviews = reviews.map(review => ({
    id: review.id,
    rating: Number(review.overallRating),
    comment: review.content || null,
    hostResponse: review.hostResponse || null,
    hostResponseAt: review.hostResponseAt 
      ? (typeof review.hostResponseAt === 'string' ? review.hostResponseAt : review.hostResponseAt.toISOString())
      : null,
    createdAt: typeof review.createdAt === 'string' ? review.createdAt : review.createdAt.toISOString(),
    User: {
      name: review.User.name,
      image: review.User.image || null,
    },
  }));

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Đánh giá từ khách hàng</h2>
        {totalReviews > 0 && (
          <p className="text-muted-foreground">
            Xem {totalReviews} đánh giá thực tế từ khách đã lưu trú
          </p>
        )}
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 text-sm text-muted-foreground font-medium">
                {totalReviews} đánh giá
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form and List */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ReviewForm itemId={homestayId} itemType="homestay" />
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2">
          <ReviewList reviews={formattedReviews} type="homestay" />
        </div>
      </div>
    </div>
  );
}
