import { Skeleton } from '@/components/ui/skeleton'

export function LoadingCard() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

export function LoadingImage({ aspectRatio = '16/9' }: { aspectRatio?: string }) {
  const aspectClasses = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    'square': 'aspect-square',
  }

  return (
    <Skeleton 
      className={`w-full ${aspectClasses[aspectRatio as keyof typeof aspectClasses] || 'aspect-[16/9]'}`} 
    />
  )
}

export function LoadingText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

export function LoadingButton() {
  return <Skeleton className="h-10 w-24" />
}
