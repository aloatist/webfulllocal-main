/**
 * Template 1: Sinh Thái (Ecological)
 * Phong cách: Tự nhiên, gần gũi, màu xanh lá cây chủ đạo
 */

export const ecologicalTemplate = {
  // CSS Variables cho template này
  cssVariables: {
    '--template-primary': '#10b981',      // Emerald-500
    '--template-secondary': '#059669',    // Emerald-600
    '--template-accent': '#34d399',       // Emerald-400
    '--template-background': '#f0fdf4',   // Green-50
    '--template-surface': '#ffffff',
    '--template-text': '#065f46',         // Emerald-800
    '--template-text-light': '#047857',   // Emerald-700
    '--template-border': '#86efac',       // Emerald-300
  },

  // Component styles
  styles: {
    hero: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
    section: 'bg-gradient-to-b from-green-50/50 to-white',
    card: 'bg-white border-2 border-emerald-200 shadow-lg hover:shadow-emerald-200/50',
    button: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    text: {
      heading: 'text-emerald-900',
      body: 'text-emerald-800',
      muted: 'text-emerald-700',
    },
  },

  // Decorative elements
  decorations: {
    pattern: 'leaf-pattern',
    icons: ['🌿', '🍃', '🌱', '🌳', '🦋'],
    shapes: 'organic', // Rounded, flowing shapes
  },
} as const;

// Helper function to apply template styles
export function applyEcologicalStyles(element: string): string {
  const styleMap: Record<string, string> = {
    hero: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200',
    card: 'bg-white border-2 border-emerald-200 shadow-lg hover:shadow-emerald-200/50 rounded-2xl',
    button: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    section: 'bg-gradient-to-b from-green-50/50 to-white',
  };

  return styleMap[element] || '';
}

