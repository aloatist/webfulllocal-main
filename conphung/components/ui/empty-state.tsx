/**
 * Empty State Component
 * Provides user-friendly empty states for lists, search results, etc.
 */

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'illustration';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const variantStyles = {
    default: 'bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-300 dark:border-gray-700',
    minimal: 'bg-transparent',
    illustration: 'bg-gradient-to-br from-emerald-50/30 to-blue-50/30 dark:from-emerald-950/20 dark:to-blue-950/20 border border-gray-200 dark:border-gray-800',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-12 text-center',
        variantStyles[variant],
        className
      )}
    >
      <div className="mx-auto max-w-md space-y-4">
        {/* Icon */}
        {Icon && (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Icon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        )}

        {/* Custom children */}
        {children}

        {/* Action */}
        {(actionLabel && (actionHref || onAction)) && (
          <div className="pt-4">
            {actionHref ? (
              <Button asChild>
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onAction}>{actionLabel}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Specific Empty States for common use cases
 */

export function NoResultsFound({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      title="Không tìm thấy kết quả"
      description={
        searchTerm
          ? `Không tìm thấy kết quả cho "${searchTerm}". Hãy thử tìm kiếm với từ khóa khác.`
          : 'Không tìm thấy kết quả phù hợp. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.'
      }
      variant="minimal"
    />
  );
}

export function NoDataYet({
  title = 'Chưa có dữ liệu',
  description = 'Dữ liệu sẽ xuất hiện ở đây khi có sẵn.',
  actionLabel,
  actionHref,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={actionLabel}
      actionHref={actionHref}
      variant="default"
    />
  );
}



