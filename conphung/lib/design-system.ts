/**
 * Design System - Unified Colors, Typography, Spacing
 * Implements Week 1 recommendations for consistent design
 */

// ============================================
// COLOR SYSTEM (60-30-10 Rule)
// ============================================

export const colors = {
  // PRIMARY - Nature/Eco Tourism (60% usage)
  primary: {
    50: '#f0fdf4',   // Backgrounds
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',  // Main CTA
    600: '#059669',  // Hover states
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',  // Text
  },
  
  // SECONDARY - Warm/Welcoming (30% usage)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Accents
    600: '#d97706',  // Hover
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // NEUTRAL - Gray scale (10% usage)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // SEMANTIC COLORS
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
} as const;

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

export const typography = {
  // Font Sizes (Mobile → Desktop)
  fontSize: {
    // Display (Hero only)
    'display-lg': 'text-5xl md:text-7xl',      // 48px → 72px
    'display': 'text-4xl md:text-6xl',         // 36px → 60px
    
    // Headings
    'h1': 'text-4xl md:text-5xl',             // 36px → 48px
    'h2': 'text-3xl md:text-4xl',             // 30px → 36px
    'h3': 'text-2xl md:text-3xl',             // 24px → 30px
    'h4': 'text-xl md:text-2xl',              // 20px → 24px
    'h5': 'text-lg md:text-xl',               // 18px → 20px
    'h6': 'text-base md:text-lg',             // 16px → 18px
    
    // Body
    'body-lg': 'text-lg',                     // 18px
    'body': 'text-base',                      // 16px
    'body-sm': 'text-sm',                     // 14px
    'caption': 'text-xs',                     // 12px
  },
  
  // Font Weights
  fontWeight: {
    normal: 'font-normal',      // 400
    medium: 'font-medium',      // 500
    semibold: 'font-semibold',  // 600
    bold: 'font-bold',          // 700
  },
  
  // Line Heights
  lineHeight: {
    tight: 'leading-tight',     // 1.25
    normal: 'leading-normal',   // 1.5
    relaxed: 'leading-relaxed', // 1.625
    loose: 'leading-loose',     // 2
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
  }
} as const;

// ============================================
// SPACING SYSTEM
// ============================================

export const spacing = {
  // Section Spacing (Vertical)
  section: {
    sm: 'py-12 md:py-16',      // 48px → 64px
    md: 'py-16 md:py-20',      // 64px → 80px
    lg: 'py-20 md:py-24',      // 80px → 96px
    xl: 'py-24 md:py-32',      // 96px → 128px
  },
  
  // Container Padding (Horizontal)
  container: {
    sm: 'px-4 md:px-6',        // 16px → 24px
    md: 'px-4 md:px-6 lg:px-8', // 16px → 24px → 32px
    lg: 'px-6 md:px-8 lg:px-12', // 24px → 32px → 48px
  },
  
  // Card/Component Padding
  card: {
    sm: 'p-4',                 // 16px
    md: 'p-6 md:p-8',          // 24px → 32px
    lg: 'p-8 md:p-12',         // 32px → 48px
  },
  
  // Element Gaps (Flex/Grid)
  gap: {
    xs: 'gap-2',               // 8px
    sm: 'gap-4',               // 16px
    md: 'gap-6',               // 24px
    lg: 'gap-8',               // 32px
    xl: 'gap-12',              // 48px
  },
  
  // Stack Spacing (Vertical)
  stack: {
    xs: 'space-y-2',           // 8px
    sm: 'space-y-4',           // 16px
    md: 'space-y-6',           // 24px
    lg: 'space-y-8',           // 32px
    xl: 'space-y-12',          // 48px
  }
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: 'rounded-none',
  sm: 'rounded-sm',        // 2px
  base: 'rounded',         // 4px
  md: 'rounded-md',        // 6px
  lg: 'rounded-lg',        // 8px
  xl: 'rounded-xl',        // 12px
  '2xl': 'rounded-2xl',    // 16px
  '3xl': 'rounded-3xl',    // 24px
  full: 'rounded-full',
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: 'shadow-sm',
  base: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  base: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300',
} as const;

// ============================================
// BREAKPOINTS (for reference)
// ============================================

export const breakpoints = {
  sm: '640px',   // Tailwind sm
  md: '768px',   // Tailwind md
  lg: '1024px',  // Tailwind lg
  xl: '1280px',  // Tailwind xl
  '2xl': '1536px', // Tailwind 2xl
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modalBackdrop: 'z-40',
  modal: 'z-50',
  popover: 'z-60',
  tooltip: 'z-70',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get section className with spacing
 */
export function getSectionClass(size: 'sm' | 'md' | 'lg' | 'xl' = 'lg') {
  return `${spacing.section[size]} ${spacing.container.md}`;
}

/**
 * Get heading className with typography
 */
export function getHeadingClass(level: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  return `${typography.fontSize[level]} ${typography.fontWeight.bold} ${typography.lineHeight.tight}`;
}

/**
 * Get card className with styling
 */
export function getCardClass(variant: 'default' | 'hover' = 'default') {
  const base = `${radius['2xl']} ${shadows.md} ${spacing.card.md}`;
  
  if (variant === 'hover') {
    return `${base} ${transitions.base} hover:${shadows.xl} hover:-translate-y-2`;
  }
  
  return base;
}

/**
 * Get button className
 */
export function getButtonClass(variant: 'primary' | 'secondary' | 'outline' = 'primary') {
  const base = `${radius.lg} ${spacing.card.sm} ${typography.fontWeight.semibold} ${transitions.fast}`;
  
  switch (variant) {
    case 'primary':
      return `${base} bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95`;
    case 'secondary':
      return `${base} bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95`;
    case 'outline':
      return `${base} border-2 border-current hover:bg-current/10 hover:scale-105 active:scale-95`;
    default:
      return base;
  }
}

// ============================================
// EXPORT ALL
// ============================================

export const designSystem = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  getSectionClass,
  getHeadingClass,
  getCardClass,
  getButtonClass,
} as default;


