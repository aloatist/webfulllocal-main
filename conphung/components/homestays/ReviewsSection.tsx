'use client';

import { Star } from 'lucide-react';

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
  reviews: Review[];
  averageRating?: number;
  totalReviews: number;
}

export function ReviewsSection({
  reviews,
  averageRating = 0,
  totalReviews,
}: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Star className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Chưa có đánh giá</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy là người đầu tiên đánh giá homestay này
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {totalReviews} đánh giá
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border bg-card p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                {review.isAnonymous ? (
                  <span className="text-sm font-medium">?</span>
                ) : (
                  <span className="text-sm font-medium">
                    {review.User.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {review.isAnonymous ? 'Người dùng ẩn danh' : review.User.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(Number(review.overallRating))
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="mt-3 font-medium">{review.title}</h4>
                )}

                {review.content && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.content}
                  </p>
                )}

                {/* Host Response */}
                {review.hostResponse && (
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">Phản hồi từ chủ nhà</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.hostResponse}
                    </p>
                    {review.hostResponseAt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(review.hostResponseAt).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
