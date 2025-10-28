'use client';

import { CheckinStatus } from '@/lib/attendance/api';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<CheckinStatus, string> = {
  success: 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400',
  duplicate: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300',
  invalid: 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400',
};

const STATUS_LABELS: Record<CheckinStatus, string> = {
  success: 'Điểm danh thành công',
  duplicate: 'Đã điểm danh trước đó',
  invalid: 'Mã không tồn tại',
};

interface StatusBadgeProps {
  status: CheckinStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide',
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
