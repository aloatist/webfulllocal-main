/**
 * Styled Link Component
 * Provides distinct styling for links vs buttons
 * Better accessibility with higher contrast and clear visual distinction
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface StyledLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'subtle' | 'muted';
  className?: string;
  target?: string;
  rel?: string;
  external?: boolean;
}

export function StyledLink({
  href,
  children,
  variant = 'primary',
  className,
  target,
  rel,
  external = false,
}: StyledLinkProps) {
  const variants = {
    primary: 
      'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 underline-offset-4 hover:decoration-emerald-600/60 dark:hover:decoration-emerald-400/60 font-medium transition-all',
    subtle: 
      'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline underline-offset-2 transition-colors',
    muted:
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline underline-offset-2 transition-colors',
  };

  // Auto-detect external links
  const isExternal = external || href.startsWith('http') || href.startsWith('//');
  
  // Set appropriate target and rel for external links
  const linkTarget = target || (isExternal ? '_blank' : undefined);
  const linkRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

  return (
    <Link
      href={href}
      target={linkTarget}
      rel={linkRel}
      className={cn(
        'inline-flex items-center gap-1',
        variants[variant],
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:rounded-sm',
        className
      )}
    >
      {children}
      {isExternal && (
        <svg
          className="w-3 h-3 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </Link>
  );
}

/**
 * Arrow Link - Link with arrow icon
 */
export function ArrowLink({
  href,
  children,
  variant = 'primary',
  className,
  direction = 'right',
}: StyledLinkProps & { direction?: 'left' | 'right' }) {
  const arrows = {
    right: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    ),
    left: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
      </svg>
    ),
  };

  return (
    <StyledLink href={href} variant={variant} className={cn('group', className)}>
      {direction === 'left' && <span className="group-hover:-translate-x-1 transition-transform">{arrows.left}</span>}
      {children}
      {direction === 'right' && <span className="group-hover:translate-x-1 transition-transform">{arrows.right}</span>}
    </StyledLink>
  );
}

/**
 * Button-styled Link - Looks like a button but is a link
 * Use for navigation actions that look like buttons
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'default',
  className,
}: StyledLinkProps & { size?: 'sm' | 'default' | 'lg' }) {
  const buttonVariants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        buttonVariants[variant as keyof typeof buttonVariants] || buttonVariants.primary,
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
