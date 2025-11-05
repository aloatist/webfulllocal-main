/**
 * Template 3: Truyền Thống (Classic Traditional)
 * Phong cách: Ấm cúng, truyền thống, màu vàng cam chủ đạo
 */

export const traditionalTemplate = {
  cssVariables: {
    '--template-primary': '#f59e0b',      // Amber-500
    '--template-secondary': '#d97706',    // Amber-600
    '--template-accent': '#fbbf24',      // Amber-400
    '--template-background': '#fffbeb',   // Amber-50
    '--template-surface': '#ffffff',
    '--template-text': '#78350f',         // Amber-900
    '--template-text-light': '#92400e',   // Amber-800
    '--template-border': '#fcd34d',      // Amber-300
  },

  styles: {
    hero: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    section: 'bg-gradient-to-b from-amber-50/60 to-white',
    card: 'bg-white border-2 border-amber-200 shadow-lg hover:shadow-amber-200/50',
    button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    text: {
      heading: 'text-amber-900',
      body: 'text-amber-800',
      muted: 'text-amber-700',
    },
  },

  decorations: {
    pattern: 'traditional',
    icons: ['🏮', '🎋', '🌺', '🍊', '🎯'],
    shapes: 'organic', // Warm, rounded shapes
  },
} as const;

export function applyTraditionalStyles(element: string): string {
  const styleMap: Record<string, string> = {
    hero: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200',
    card: 'bg-white border-2 border-amber-200 shadow-lg hover:shadow-amber-200/50 rounded-lg',
    button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    section: 'bg-gradient-to-b from-amber-50/60 to-white',
  };

  return styleMap[element] || '';
}

