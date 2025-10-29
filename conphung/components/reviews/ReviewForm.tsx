'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare } from 'lucide-react';

interface ReviewFormProps {
  itemId: string;
  itemType: 'tour' | 'homestay';
  onSuccess?: () => void;
}

export function ReviewForm({ itemId, itemType, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Overall rating
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Homestay specific ratings
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);

  // Count words in comment
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(comment);
  const MAX_WORDS = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (wordCount > MAX_WORDS) {
      setError(`Nội dung quá dài! Vui lòng giới hạn trong ${MAX_WORDS} từ (hiện tại: ${wordCount} từ)`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = itemType === 'tour' 
        ? `/api/tours/${itemId}/reviews`
        : `/api/homestays/${itemId}/reviews`;

      const payload: any = {
        rating,
        comment: comment.trim() || null,
      };

      // Tours need fullName (anonymous reviews)
      if (itemType === 'tour') {
        payload.fullName = session.user?.name || 'Người dùng';
      }

      // Add homestay specific ratings if applicable
      if (itemType === 'homestay') {
        if (cleanlinessRating > 0) payload.cleanlinessRating = cleanlinessRating;
        if (accuracyRating > 0) payload.accuracyRating = accuracyRating;
        if (communicationRating > 0) payload.communicationRating = communicationRating;
        if (locationRating > 0) payload.locationRating = locationRating;
        if (valueRating > 0) payload.valueRating = valueRating;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Không thể gửi đánh giá');
      }

      // Reset form
      setRating(0);
      setComment('');
      setCleanlinessRating(0);
      setAccuracyRating(0);
      setCommunicationRating(0);
      setLocationRating(0);
      setValueRating(0);
      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="rounded-xl border-2 bg-muted/30 p-6 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Đăng nhập để đánh giá</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Bạn cần đăng nhập để có thể viết đánh giá
        </p>
        <Button onClick={() => router.push('/login')}>
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
        size="lg"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Viết đánh giá
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border-2 bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Viết đánh giá của bạn</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Đóng
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Đánh giá tổng thể <span className="text-destructive">*</span>
        </label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size="lg"
          showValue
        />
      </div>

      {/* Homestay Detailed Ratings */}
      {itemType === 'homestay' && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-sm">Đánh giá chi tiết (tùy chọn)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Vệ sinh</label>
              <StarRating
                rating={cleanlinessRating}
                interactive
                onChange={setCleanlinessRating}
                size="md"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Chính xác</label>
              <StarRating
                rating={accuracyRating}
                interactive
                onChange={setAccuracyRating}
                size="md"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Giao tiếp</label>
              <StarRating
                rating={communicationRating}
                interactive
                onChange={setCommunicationRating}
                size="md"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Vị trí</label>
              <StarRating
                rating={locationRating}
                interactive
                onChange={setLocationRating}
                size="md"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Giá trị</label>
              <StarRating
                rating={valueRating}
                interactive
                onChange={setValueRating}
                size="md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Comment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Nhận xét của bạn
          </label>
          <span className={`text-xs font-medium ${
            wordCount > MAX_WORDS 
              ? 'text-destructive' 
              : wordCount > MAX_WORDS * 0.9 
                ? 'text-orange-500' 
                : 'text-muted-foreground'
          }`}>
            {wordCount} / {MAX_WORDS} từ
          </span>
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          rows={5}
          className={`resize-none ${
            wordCount > MAX_WORDS ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị công khai
          </p>
          {wordCount > MAX_WORDS && (
            <p className="text-xs text-destructive font-medium">
              Vượt quá {wordCount - MAX_WORDS} từ!
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={loading}
          className="flex-1"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={loading || rating === 0 || wordCount > MAX_WORDS}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi đánh giá'
          )}
        </Button>
      </div>
    </form>
  );
}
