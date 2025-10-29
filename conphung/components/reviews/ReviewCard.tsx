'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    hostResponse?: string | null;
    hostResponseAt?: string | null;
    adminResponse?: string | null;
    respondedAt?: string | null;
    User?: {
      name: string | null;
      image: string | null;
    };
    // Homestay specific ratings
    cleanlinessRating?: number | null;
    accuracyRating?: number | null;
    communicationRating?: number | null;
    locationRating?: number | null;
    valueRating?: number | null;
  };
  type?: 'tour' | 'homestay';
}

const MAX_COMMENT_LENGTH = 300;
const MAX_RESPONSE_LENGTH = 200;

export function ReviewCard({ review, type = 'tour' }: ReviewCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  
  const userName = review.User?.name || 'Người dùng ẩn danh';
  const userImage = review.User?.image;
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: vi,
  });
  
  const comment = review.comment || '';
  const isCommentLong = comment.length > MAX_COMMENT_LENGTH;
  const displayComment = isCommentExpanded || !isCommentLong 
    ? comment 
    : comment.slice(0, MAX_COMMENT_LENGTH) + '...';
  
  const response = review.hostResponse || review.adminResponse || '';
  const isResponseLong = response.length > MAX_RESPONSE_LENGTH;
  const displayResponse = isResponseExpanded || !isResponseLong
    ? response
    : response.slice(0, MAX_RESPONSE_LENGTH) + '...';

  return (
    <div className="rounded-xl border-2 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div>
            <h4 className="font-semibold">{userName}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span suppressHydrationWarning>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="flex flex-col items-end">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-sm font-bold text-primary mt-1">
            {review.rating.toFixed(1)}/5
          </span>
        </div>
      </div>

      {/* Comment */}
      {comment && (
        <div className="mb-4">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
            {displayComment}
          </p>
          {isCommentLong && (
            <button
              onClick={() => setIsCommentExpanded(!isCommentExpanded)}
              className="mt-2 text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium"
            >
              {isCommentExpanded ? (
                <>
                  Thu gọn <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Xem thêm <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Response from Host/Admin */}
      {(review.hostResponse || review.adminResponse) && (
        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  {type === 'homestay' ? 'Phản hồi từ chủ nhà' : 'Phản hồi từ người quản lý'}
                </span>
                {(review.hostResponseAt || review.respondedAt) && (
                  <span className="text-xs text-blue-600 dark:text-blue-400" suppressHydrationWarning>
                    {formatDistanceToNow(new Date(review.hostResponseAt || review.respondedAt!), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {displayResponse}
                </p>
                {isResponseLong && (
                  <button
                    onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                    className="mt-2 text-xs text-blue-700 dark:text-blue-300 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    {isResponseExpanded ? (
                      <>
                        Thu gọn <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Xem thêm <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Homestay Detailed Ratings */}
      {type === 'homestay' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t">
          {review.cleanlinessRating && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Vệ sinh</span>
              <StarRating rating={review.cleanlinessRating} size="sm" />
            </div>
          )}
          {review.accuracyRating && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Chính xác</span>
              <StarRating rating={review.accuracyRating} size="sm" />
            </div>
          )}
          {review.communicationRating && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Giao tiếp</span>
              <StarRating rating={review.communicationRating} size="sm" />
            </div>
          )}
          {review.locationRating && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Vị trí</span>
              <StarRating rating={review.locationRating} size="sm" />
            </div>
          )}
          {review.valueRating && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Giá trị</span>
              <StarRating rating={review.valueRating} size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
