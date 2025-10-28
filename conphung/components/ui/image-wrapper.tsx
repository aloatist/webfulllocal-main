import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageWrapperProps {
  src: string
  alt: string
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/4' | 'auto'
  className?: string
  href?: string
  priority?: boolean
}

export function ImageWrapper({
  src,
  alt,
  aspectRatio = '4/3',
  className,
  href,
  priority = false,
}: ImageWrapperProps) {
  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
    '3/4': 'aspect-[3/4]',
    'auto': '',
  }

  const imageContent = (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg shadow-md group',
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill={aspectRatio !== 'auto'}
        width={aspectRatio === 'auto' ? 800 : undefined}
        height={aspectRatio === 'auto' ? 600 : undefined}
        className={cn(
          'transition-transform duration-500 group-hover:scale-110',
          aspectRatio !== 'auto' ? 'object-cover' : 'w-full h-auto object-cover'
        )}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {imageContent}
      </a>
    )
  }

  return imageContent
}
