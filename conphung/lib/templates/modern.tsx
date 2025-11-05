/**
 * Template 2: Hiện Đại (Modern Minimalist)
 * Phong cách: Tối giản, clean, màu xanh dương và xám chủ đạo
 */

export const modernTemplate = {
  cssVariables: {
    '--template-primary': '#3b82f6',      // Blue-500
    '--template-secondary': '#2563eb',   // Blue-600
    '--template-accent': '#60a5fa',       // Blue-400
    '--template-background': '#f8fafc',  // Slate-50
    '--template-surface': '#ffffff',
    '--template-text': '#1e293b',         // Slate-800
    '--template-text-light': '#475569',   // Slate-600
    '--template-border': '#cbd5e1',      // Slate-300
  },

  styles: {
    hero: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    section: 'bg-gradient-to-b from-slate-50/80 to-white',
    card: 'bg-white border border-slate-200 shadow-xl hover:shadow-2xl backdrop-blur-sm',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    text: {
      heading: 'text-slate-900',
      body: 'text-slate-700',
      muted: 'text-slate-600',
    },
  },

  decorations: {
    pattern: 'geometric',
    icons: ['✨', '⚡', '🎯', '💎', '🔥'],
    shapes: 'geometric', // Sharp, clean lines
  },
} as const;

export function applyModernStyles(element: string): string {
  const styleMap: Record<string, string> = {
    hero: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-slate-300',
    card: 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl hover:shadow-2xl rounded-xl',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    section: 'bg-gradient-to-b from-slate-50/80 to-white',
  };

  return styleMap[element] || '';
}

