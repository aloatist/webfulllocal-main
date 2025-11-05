/**
 * Template 4: Góc Cạnh (Geometric Angular)
 * Phong cách: Góc cạnh, hình học, màu tím và coral chủ đạo
 */

export const geometricTemplate = {
  cssVariables: {
    '--template-primary': '#8b5cf6',      // Violet-500
    '--template-secondary': '#7c3aed',    // Violet-600
    '--template-accent': '#a78bfa',       // Violet-400
    '--template-background': '#faf5ff',   // Violet-50
    '--template-surface': '#ffffff',
    '--template-text': '#581c87',         // Violet-900
    '--template-text-light': '#6d28d9',   // Violet-700
    '--template-border': '#c4b5fd',       // Violet-300
  },

  styles: {
    hero: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
    section: 'bg-gradient-to-b from-violet-50/80 to-white',
    card: 'bg-white border-2 border-violet-200 shadow-2xl hover:shadow-violet-300/50',
    button: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600',
    badge: 'bg-violet-100 text-violet-800 border-violet-300',
    text: {
      heading: 'text-violet-900',
      body: 'text-violet-800',
      muted: 'text-violet-700',
    },
  },

  decorations: {
    pattern: 'geometric-angular',
    icons: ['🔷', '◼️', '⬟', '◆', '▰'],
    shapes: 'angular', // Sharp, geometric shapes
  },
} as const;

export function applyGeometricStyles(element: string): string {
  const styleMap: Record<string, string> = {
    hero: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-300',
    card: 'bg-white border-2 border-violet-200 shadow-2xl hover:shadow-violet-300/50 rounded-lg',
    button: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white',
    badge: 'bg-violet-100 text-violet-800 border-violet-300',
    section: 'bg-gradient-to-b from-violet-50/80 to-white',
  };

  return styleMap[element] || '';
}

