'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface MobileCardProps {
  title: string
  description?: string
  image?: string
  href?: string
  badge?: string
  price?: string
  footer?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MobileCard({
  title,
  description,
  image,
  href,
  badge,
  price,
  footer,
  onClick,
  className,
}: MobileCardProps) {
  const content = (
    <div
      className={cn(
        'bg-card rounded-lg overflow-hidden shadow-sm',
        'active:scale-[0.98] transition-transform',
        'touch-manipulation',
        className
      )}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          {badge && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base line-clamp-2 flex-1">
            {title}
          </h3>
          {href && (
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {price && (
          <div className="text-lg font-bold text-primary mb-3">
            {price}
          </div>
        )}

        {footer && (
          <div className="pt-3 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    )
  }

  return content
}

interface MobileCardListProps {
  children: React.ReactNode
  columns?: 1 | 2
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MobileCardList({
  children,
  columns = 1,
  gap = 'md',
  className,
}: MobileCardListProps) {
  return (
    <div
      className={cn(
        'grid',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        gap === 'sm' && 'gap-3',
        gap === 'md' && 'gap-4',
        gap === 'lg' && 'gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}
