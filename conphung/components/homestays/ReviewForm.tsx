'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  homestayId: string;
  homestayTitle: string;
  bookingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  homestayId,
  homestayTitle,
  bookingId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rating states
  const [overallRating, setOverallRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [checkinRating, setCheckinRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  
  // Review content
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      setError('Vui lòng chọn đánh giá tổng thể');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/public/homestays/${homestayId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          overallRating,
          cleanlinessRating: cleanlinessRating || undefined,
          communicationRating: communicationRating || undefined,
          checkinRating: checkinRating || undefined,
          accuracyRating: accuracyRating || undefined,
          locationRating: locationRating || undefined,
          valueRating: valueRating || undefined,
          title: title || undefined,
          content: content || undefined,
          isAnonymous,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Không thể gửi đánh giá');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const RatingInput = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (rating: number) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <Star
              className={`h-8 w-8 ${
                rating <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Đánh giá: {homestayTitle}
        </h3>
        <p className="text-sm text-muted-foreground">
          Chia sẻ trải nghiệm của bạn để giúp người khác
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Overall Rating - Required */}
      <div className="rounded-lg border bg-card p-4">
        <RatingInput
          label="Đánh giá tổng thể *"
          value={overallRating}
          onChange={setOverallRating}
        />
      </div>

      {/* Detailed Ratings - Optional */}
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h4 className="font-medium text-sm">Đánh giá chi tiết (tùy chọn)</h4>
        
        <RatingInput
          label="Độ sạch sẽ"
          value={cleanlinessRating}
          onChange={setCleanlinessRating}
        />
        
        <RatingInput
          label="Giao tiếp"
          value={communicationRating}
          onChange={setCommunicationRating}
        />
        
        <RatingInput
          label="Check-in"
          value={checkinRating}
          onChange={setCheckinRating}
        />
        
        <RatingInput
          label="Độ chính xác"
          value={accuracyRating}
          onChange={setAccuracyRating}
        />
        
        <RatingInput
          label="Vị trí"
          value={locationRating}
          onChange={setLocationRating}
        />
        
        <RatingInput
          label="Giá trị"
          value={valueRating}
          onChange={setValueRating}
        />
      </div>

      {/* Review Content */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tiêu đề (tùy chọn)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tóm tắt trải nghiệm của bạn"
            className="w-full rounded-md border px-3 py-2 text-sm"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nội dung đánh giá (tùy chọn)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={5}
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {content.length}/1000 ký tự
          </p>
        </div>
      </div>

      {/* Anonymous Option */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="anonymous" className="text-sm">
          Đánh giá ẩn danh
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={submitting || overallRating === 0}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </div>
    </form>
  );
}
