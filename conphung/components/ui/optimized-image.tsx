'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  sizes?: string;
  blurDataURL?: string;
}

/**
 * Optimized Image Component với:
 * - Blur placeholder tự động
 * - Lazy loading
 * - Responsive images
 * - Error handling
 * - Loading state
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  objectFit = 'cover',
  quality = 85,
  sizes,
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder nếu không có
  const placeholder = blurDataURL || generateBlurDataURL();

  // Default sizes cho responsive images
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          className
        )}
        style={{ width, height }}
      >
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={defaultSizes}
        placeholder="blur"
        blurDataURL={placeholder}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          objectFit,
        }}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}

/**
 * Generate simple blur placeholder
 */
function generateBlurDataURL(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==';
}

/**
 * Hero Image Component - Optimized cho hero sections
 */
export function HeroImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      sizes="100vw"
      className={className}
      objectFit="cover"
    />
  );
}

/**
 * Thumbnail Image Component - Optimized cho thumbnails
 */
export function ThumbnailImage({
  src,
  alt,
  size = 200,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={75}
      sizes={`${size}px`}
      className={className}
      objectFit="cover"
    />
  );
}

/**
 * Gallery Image Component - Optimized cho galleries
 */
export function GalleryImage({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn('cursor-pointer hover:opacity-90 transition-opacity', className)}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={80}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        objectFit="cover"
      />
    </div>
  );
}
