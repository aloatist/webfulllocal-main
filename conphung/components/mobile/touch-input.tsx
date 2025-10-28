'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TouchInput = forwardRef<HTMLInputElement, TouchInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3', // Larger padding for touch
            'text-base', // Prevent zoom on iOS
            'rounded-lg border bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'touch-manipulation', // Optimize for touch
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

TouchInput.displayName = 'TouchInput'

interface TouchTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TouchTextarea = forwardRef<HTMLTextAreaElement, TouchTextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3',
            'text-base',
            'rounded-lg border bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-none touch-manipulation',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

TouchTextarea.displayName = 'TouchTextarea'

interface TouchSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TouchSelect = forwardRef<HTMLSelectElement, TouchSelectProps>(
  ({ label, error, helperText, className, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3',
            'text-base',
            'rounded-lg border bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'touch-manipulation',
            error && 'border-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

TouchSelect.displayName = 'TouchSelect'

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-semibold rounded-lg',
          'transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95 touch-manipulation',
          // Variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'outline' && 'border border-input bg-background hover:bg-accent',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          // Sizes - larger for touch
          size === 'sm' && 'px-4 py-2 text-sm min-h-[40px]',
          size === 'md' && 'px-6 py-3 text-base min-h-[48px]',
          size === 'lg' && 'px-8 py-4 text-lg min-h-[56px]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

TouchButton.displayName = 'TouchButton'
