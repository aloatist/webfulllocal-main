/**
 * Build-Time Theme Support
 * 
 * Pre-render theme pages at build time for better performance
 */

import { getAllThemes } from '@/config/theme';
import { getAllThemeRoutes } from './loader';
import { getActiveTheme } from '@/config/theme';

/**
 * Generate static params for all theme pages
 * This allows Next.js to pre-render theme pages at build time
 */
export async function generateThemeStaticParams(): Promise<
  Array<{ segments: string[] }>
> {
  try {
    const themes = await getAllThemes();
    const allParams: Array<{ segments: string[] }> = [];
    
    // For each theme, get all routes
    for (const theme of themes) {
      // Temporarily set active theme to get routes
      const routes = await getAllThemeRoutes();
      
      for (const route of routes) {
        // Convert route to segments
        const segments = route === '/' 
          ? [] 
          : route.split('/').filter(Boolean);
        
        allParams.push({ segments });
      }
    }
    
    // Remove duplicates
    const uniqueParams = Array.from(
      new Map(allParams.map(p => [p.segments.join('/'), p])).values()
    );
    
    return uniqueParams;
  } catch (error) {
    console.error('Error generating theme static params:', error);
    return [];
  }
}

/**
 * Pre-validate theme pages at build time
 */
export async function validateThemePages(themeName: string): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  
  try {
    const { getThemeMetadata, themeExists } = await import('@/config/theme');
    
    // Check theme exists
    if (!(await themeExists(themeName))) {
      errors.push(`Theme "${themeName}" does not exist`);
      return { valid: false, errors };
    }
    
    // Check theme.json exists and is valid
    const metadata = await getThemeMetadata(themeName);
    if (!metadata) {
      errors.push(`Theme "${themeName}" missing or invalid theme.json`);
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!metadata.name) {
      errors.push(`Theme "${themeName}" missing name in theme.json`);
    }
    if (!metadata.version) {
      errors.push(`Theme "${themeName}" missing version in theme.json`);
    }
    
    // Check pages directory exists
    const fs = await import('fs/promises');
    const path = await import('path');
    const { getThemePath } = await import('@/config/theme');
    
    const pagesDir = path.join(process.cwd(), getThemePath(themeName), 'pages');
    try {
      await fs.access(pagesDir);
    } catch {
      errors.push(`Theme "${themeName}" missing pages directory`);
    }
    
    // Check index page exists
    const indexPage = path.join(pagesDir, 'index.tsx');
    try {
      await fs.access(indexPage);
    } catch {
      errors.push(`Theme "${themeName}" missing pages/index.tsx`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Error validating theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { valid: false, errors };
  }
}

/**
 * Validate all themes at build time
 */
export async function validateAllThemes(): Promise<{
  themes: Record<string, { valid: boolean; errors: string[] }>;
  allValid: boolean;
}> {
  const themes = await getAllThemes();
  const results: Record<string, { valid: boolean; errors: string[] }> = {};
  
  for (const theme of themes) {
    const validation = await validateThemePages(theme.id);
    results[theme.id] = validation;
  }
  
  const allValid = Object.values(results).every(r => r.valid);
  
  return { themes: results, allValid };
}

