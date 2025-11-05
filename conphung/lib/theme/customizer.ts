/**
 * Theme Customizer
 * 
 * WordPress-like customizer for themes
 * Stores options in database or local storage
 */

import { prisma } from '@/lib/prisma';
import { getActiveTheme } from '@/config/theme';

export interface ThemeCustomizerOptions {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    fontFamily?: string;
    headingFont?: string;
    fontSize?: string;
  };
  layout?: {
    containerWidth?: string;
    spacing?: string;
  };
  [key: string]: any;
}

const CUSTOMIZER_SETTINGS_KEY = 'theme_customizer_settings';

/**
 * Get customizer options for active theme
 */
export async function getCustomizerOptions(themeName?: string): Promise<ThemeCustomizerOptions> {
  try {
    const theme = themeName || await getActiveTheme();
    
    // Try database first
    const settings = await prisma.websiteTemplateSettings.findFirst({
      where: {
        activeTemplate: theme as any, // Type casting for compatibility
      },
    });
    
    if (settings?.customSettings) {
      const customSettings = settings.customSettings as any;
      if (customSettings[CUSTOMIZER_SETTINGS_KEY]) {
        return customSettings[CUSTOMIZER_SETTINGS_KEY];
      }
    }
    
    // Return default options
    return getDefaultCustomizerOptions();
  } catch (error) {
    console.error('Error getting customizer options:', error);
    return getDefaultCustomizerOptions();
  }
}

/**
 * Save customizer options
 */
export async function saveCustomizerOptions(
  options: ThemeCustomizerOptions,
  themeName?: string
): Promise<void> {
  try {
    const theme = themeName || await getActiveTheme();
    
    // Get or create settings
    let settings = await prisma.websiteTemplateSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.websiteTemplateSettings.create({
        data: {
          activeTemplate: 'ECOLOGICAL', // Default
          customSettings: {},
        },
      });
    }
    
    // Update custom settings
    const customSettings = (settings.customSettings || {}) as any;
    customSettings[CUSTOMIZER_SETTINGS_KEY] = options;
    
    await prisma.websiteTemplateSettings.update({
      where: { id: settings.id },
      data: {
        customSettings,
      },
    });
  } catch (error) {
    console.error('Error saving customizer options:', error);
    throw error;
  }
}

/**
 * Get default customizer options
 */
function getDefaultCustomizerOptions(): ThemeCustomizerOptions {
  return {
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      text: '#1f2937',
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: '16px',
    },
    layout: {
      containerWidth: '1280px',
      spacing: 'normal',
    },
  };
}

/**
 * Generate CSS variables from customizer options
 */
export function generateCustomizerCSS(options: ThemeCustomizerOptions): string {
  const { colors = {}, typography = {}, layout = {} } = options;
  
  let css = ':root {\n';
  
  // Colors
  if (colors.primary) css += `  --theme-primary: ${colors.primary};\n`;
  if (colors.secondary) css += `  --theme-secondary: ${colors.secondary};\n`;
  if (colors.accent) css += `  --theme-accent: ${colors.accent};\n`;
  if (colors.background) css += `  --theme-background: ${colors.background};\n`;
  if (colors.text) css += `  --theme-text: ${colors.text};\n`;
  
  // Typography
  if (typography.fontFamily) css += `  --theme-font-family: ${typography.fontFamily};\n`;
  if (typography.headingFont) css += `  --theme-heading-font: ${typography.headingFont};\n`;
  if (typography.fontSize) css += `  --theme-font-size: ${typography.fontSize};\n`;
  
  // Layout
  if (layout.containerWidth) css += `  --theme-container-width: ${layout.containerWidth};\n`;
  if (layout.spacing) css += `  --theme-spacing: ${layout.spacing};\n`;
  
  css += '}';
  
  return css;
}

