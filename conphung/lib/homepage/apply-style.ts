import type { Style } from './style-schema';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

/**
 * Apply style to a component and return className and inline styles
 */
export function applyStyle(style?: Style): { className: string; style: CSSProperties } {
  if (!style) {
    return { className: '', style: {} };
  }

  const classes: string[] = [];
  const inlineStyles: CSSProperties = {};

  // Typography
  if (style.typography) {
    const { fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textTransform } = style.typography;
    
    if (fontSize) {
      // Apply fontSize for both mobile and desktop to override any responsive classes
      classes.push(`text-${fontSize}`);
      // Also apply for desktop to ensure it overrides md: breakpoint
      classes.push(`md:text-${fontSize}`);
    }
    if (fontWeight) {
      const weightMap: Record<string, string> = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      };
      classes.push(weightMap[fontWeight] || '');
    }
    if (lineHeight) classes.push(`leading-${lineHeight}`);
    if (letterSpacing) classes.push(`tracking-${letterSpacing}`);
    if (textAlign) classes.push(`text-${textAlign}`);
    if (textTransform) {
      const transformMap: Record<string, string> = {
        none: '',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
      };
      if (transformMap[textTransform]) classes.push(transformMap[textTransform]);
    }
  }

  // Colors
  if (style.colors) {
    const { textColor, bgColor, gradient, borderColor } = style.colors;
    
    if (textColor && !textColor.startsWith('#')) classes.push(textColor);
    if (bgColor && !bgColor.startsWith('#')) classes.push(bgColor);
    if (gradient) classes.push(`bg-gradient-to-r ${gradient}`);
    if (borderColor && !borderColor.startsWith('#')) classes.push(borderColor);
    
    // Handle hex colors as inline styles
    if (textColor?.startsWith('#')) inlineStyles.color = textColor;
    if (bgColor?.startsWith('#')) inlineStyles.backgroundColor = bgColor;
    if (borderColor?.startsWith('#')) inlineStyles.borderColor = borderColor;
  }

  // Effects
  if (style.effects) {
    const { shadow, blur, opacity, animation, hoverEffect } = style.effects;
    
    if (shadow && shadow !== 'none') classes.push(`shadow-${shadow}`);
    if (blur && blur !== 'none') classes.push(`blur-${blur}`);
    if (opacity !== undefined) inlineStyles.opacity = opacity / 100;
    if (animation && animation !== 'none') classes.push(`animate-${animation}`);
    if (hoverEffect && hoverEffect !== 'none') {
      const hoverMap: Record<string, string> = {
        scale: 'hover:scale-105',
        lift: 'hover:-translate-y-2',
        glow: 'hover:shadow-lg',
        shimmer: 'hover:animate-pulse',
      };
      if (hoverMap[hoverEffect]) classes.push(hoverMap[hoverEffect]);
    }
  }

  // Spacing
  if (style.spacing) {
    const { padding, margin, gap } = style.spacing;
    if (padding) classes.push(padding);
    if (margin) classes.push(margin);
    if (gap) classes.push(gap);
  }

  return {
    className: cn(classes.filter(Boolean)),
    style: inlineStyles,
  };
}

