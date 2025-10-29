'use client';

import { useState } from 'react';
import { ReviewCard } from './ReviewCard';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewListProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    User?: {
      name: string | null;
      image: string | null;
    };
    cleanlinessRating?: number | null;
    accuracyRating?: number | null;
    communicationRating?: number | null;
    locationRating?: number | null;
    valueRating?: number | null;
  }>;
  type?: 'tour' | 'homestay';
}

const REVIEWS_PER_PAGE = 5;

export function ReviewList({ reviews, type = 'tour' }: ReviewListProps) {
  const [displayCount, setDisplayCount] = useState(REVIEWS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  
  const displayedReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;
  const remainingCount = reviews.length - displayCount;
  
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + REVIEWS_PER_PAGE, reviews.length));
      setIsLoading(false);
    }, 300);
  };
  
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed bg-muted/30 p-12 text-center">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2">Chưa có đánh giá</h3>
        <p className="text-sm text-muted-foreground">
          Hãy là người đầu tiên đánh giá {type === 'tour' ? 'tour' : 'homestay'} này
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {reviews.length} đánh giá
        </h3>
        {displayCount < reviews.length && (
          <span className="text-sm text-muted-foreground">
            Hiển thị {displayCount} / {reviews.length}
          </span>
        )}
      </div>
      
      {/* Reviews list */}
      <div className="space-y-4">
        {displayedReviews.map((review, index) => (
          <div 
            key={review.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ReviewCard review={review} type={type} />
          </div>
        ))}
      </div>
      
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Xem thêm {Math.min(REVIEWS_PER_PAGE, remainingCount)} đánh giá
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Scroll to top after loading more */}
      {!hasMore && reviews.length > REVIEWS_PER_PAGE && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Đã hiển thị tất cả {reviews.length} đánh giá
        </div>
      )}
    </div>
  );
}
