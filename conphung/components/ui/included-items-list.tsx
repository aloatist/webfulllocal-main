import React from 'react';
import { applyStyle } from '@/lib/homepage/apply-style';
import { cn } from '@/lib/utils';
import type { Style } from '@/lib/homepage/style-schema';

interface IncludedItemsListProps {
  items: string[];
  title?: string;
  className?: string;
  variant?: 'blue' | 'green' | 'orange' | 'emerald';
  style?: Style;
}

const variantStyles = {
  blue: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
    title: 'text-blue-800 dark:text-blue-300',
    firstItem: 'bg-blue-500',
    otherItems: 'text-green-800 dark:text-green-800',
  },
  green: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-500',
    title: 'text-green-800 dark:text-green-300',
    firstItem: 'bg-green-500',
    otherItems: 'text-green-800 dark:text-green-800',
  },
  orange: {
    container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500',
    title: 'text-orange-800 dark:text-orange-300',
    firstItem: 'bg-orange-500',
    otherItems: 'text-green-800 dark:text-green-800',
  },
  emerald: {
    container: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500',
    title: 'text-emerald-800 dark:text-emerald-300',
    firstItem: 'bg-emerald-500',
    otherItems: 'text-green-800 dark:text-green-800',
  },
};

export function IncludedItemsList({
  items,
  title = 'Bao gồm:',
  className = '',
  variant = 'blue',
  style,
}: IncludedItemsListProps) {
  if (!items || items.length === 0) return null;

      const styles = variantStyles[variant];
  const appliedStyle = applyStyle(style);

  // Extract color from style for icon background
  const getIconBackgroundColor = () => {
    if (!style) return 'bg-green-500'; // Default
    
    // Try to extract color from inline style
    if (appliedStyle.style?.color) {
      return ''; // Will use inline style
    }
    
    // Try to extract from className (e.g., text-blue-500 -> bg-blue-500)
    if (appliedStyle.className) {
      const colorMatch = appliedStyle.className.match(/text-(\w+)-(\d+)/);
      if (colorMatch) {
        return `bg-${colorMatch[1]}-${colorMatch[2]}`;
      }
    }
    
    return 'bg-green-500'; // Fallback to default
  };

  const iconBgColor = getIconBackgroundColor();

  return (
    <div 
      className={cn(`rounded-xl p-5 border-l-4 ${styles.container}`, className)}
    >
      {title && (
        <p className={`font-bold ${styles.title} text-lg mb-4 flex items-center gap-2`}>                                                                        
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"         
              clipRule="evenodd"
            />
          </svg>
          {title}
        </p>
      )}
      <ul className="space-y-3">
        {items.map((item, index) => {
          // Create icon style from applied style color
          const iconStyle = appliedStyle.style?.color 
            ? { backgroundColor: appliedStyle.style.color } 
            : {};

          return (
            <li
              key={index}
              className={cn("flex items-start gap-3 hover:translate-x-1 transition-transform", appliedStyle.className)}
              style={appliedStyle.style}
            >
              <div 
                className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", iconBgColor)}
                style={iconBgColor ? {} : iconStyle}
              >                                           
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">                                                                      
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"                        
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span 
                className={cn("font-medium", appliedStyle.className)}
                style={appliedStyle.style}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
