'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeableGalleryProps {
  images: Array<{
    src: string
    alt: string
  }>
  className?: string
}

export function SwipeableGallery({ images, className }: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev))
  }

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  return (
    <>
      {/* Gallery */}
      <div
        ref={containerRef}
        className={cn('relative overflow-hidden rounded-lg bg-muted', className)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Images */}
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 aspect-[16/9]"
              onClick={() => setIsFullscreen(true)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2',
                'hidden md:flex items-center justify-center',
                'w-10 h-10 rounded-full bg-black/50 text-white',
                'hover:bg-black/70 transition-colors',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === images.length - 1}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'hidden md:flex items-center justify-center',
                'w-10 h-10 rounded-full bg-black/50 text-white',
                'hover:bg-black/70 transition-colors',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 text-white text-sm rounded">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Images */}
          <div
            className="h-full flex items-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-full flex-shrink-0 h-screen flex items-center justify-center"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2',
                  'w-12 h-12 rounded-full bg-black/50 text-white',
                  'flex items-center justify-center',
                  'disabled:opacity-30'
                )}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2',
                  'w-12 h-12 rounded-full bg-black/50 text-white',
                  'flex items-center justify-center',
                  'disabled:opacity-30'
                )}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
