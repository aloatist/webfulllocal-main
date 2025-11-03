import React from 'react'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  variant?: 'primary' | 'subtle' | 'button'
  className?: string
}

/**
 * Enhanced Link component with better contrast and accessibility
 * Variants:
 * - primary: Emerald color with underline (for body links)
 * - subtle: Gray color, underline on hover (for nav links)  
 * - button: No underline, looks like button (for CTAs)
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 underline-offset-4 hover:decoration-emerald-600/60 font-medium',
      subtle: 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline underline-offset-2',
      button: 'no-underline',
    }

    return (
      <NextLink
        ref={ref}
        className={cn(
          'transition-colors focus-visible-strong',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'


