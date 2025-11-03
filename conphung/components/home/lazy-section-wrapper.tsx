'use client'

import { ReactNode, useEffect, useState, useRef } from 'react'

interface LazySectionWrapperProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
}

/**
 * Lazy load sections when they come into viewport
 * Improves initial page load performance
 */
export function LazySectionWrapper({ 
  children, 
  threshold = 0.1,
  rootMargin = '100px',
  fallback = <div className="min-h-[200px]" />
}: LazySectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={sectionRef}>
      {isVisible || hasLoaded ? children : fallback}
    </div>
  )
}


