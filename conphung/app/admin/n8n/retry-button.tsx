'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';

type RetryButtonProps = {
  logId: string;
  disabled?: boolean;
};

export function RetryButton({ logId, disabled }: RetryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRetry = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/n8n/logs/${logId}/retry`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setMessage(
          data?.error ||
            data?.reason ||
            'Không thể gửi lại. Kiểm tra log và thử lại sau.',
        );
      } else {
        setMessage('Đã gửi lại payload thành công!');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể gửi lại');
    } finally {
      setLoading(false);
      // Tự động ẩn thông báo sau vài giây
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRetry}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
        Gửi lại
      </Button>
      {message && (
        <span className="text-xs text-muted-foreground max-w-[240px] text-right">
          {message}
        </span>
      )}
    </div>
  );
}
