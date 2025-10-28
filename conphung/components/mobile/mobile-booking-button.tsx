'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBookingButtonProps {
  children: React.ReactNode
  label?: string
  className?: string
}

export function MobileBookingButton({
  children,
  label = 'Đặt ngay',
  className,
}: MobileBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 z-40',
          'md:hidden', // Hide on desktop
          'flex items-center gap-2 px-6 py-3',
          'bg-primary text-primary-foreground',
          'rounded-full shadow-lg',
          'font-semibold',
          'active:scale-95 transition-transform',
          'touch-manipulation',
          className
        )}
      >
        <Calendar className="w-5 h-5" />
        {label}
      </button>

      {/* Bottom Sheet Modal - Mobile Only */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">{label}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
