import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  )
}

/**
 * Card Skeleton - Loading state for card components
 */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4", className)}>
      <Skeleton className="h-48 w-full" /> {/* Image */}
      <Skeleton className="h-6 w-3/4" /> {/* Title */}
      <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
      <Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" /> {/* Price/Badge */}
        <Skeleton className="h-10 w-28" /> {/* Button */}
      </div>
    </div>
  )
}

/**
 * List Skeleton - Loading state for list items
 */
function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Table Skeleton - Loading state for tables
 */
function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, CardSkeleton, ListSkeleton, TableSkeleton }
