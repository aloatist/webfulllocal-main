/**
 * Child Theme Support
 * 
 * Allows themes to inherit from parent themes
 */

import { getThemeMetadata, themeExists } from '@/config/theme';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Resolve file path with parent theme fallback
 */
export async function resolveThemeFile(
  themeName: string,
  filePath: string
): Promise<string | null> {
  const config = await import('@/config/theme');
  
  // Check in current theme
  const currentThemePath = path.join(
    process.cwd(),
    config.getThemePath(themeName),
    filePath
  );
  
  try {
    await fs.access(currentThemePath);
    return currentThemePath;
  } catch {
    // File doesn't exist, try parent theme
    const themeMeta = await getThemeMetadata(themeName);
    
    if (themeMeta?.parent) {
      // Recursively check parent theme
      return resolveThemeFile(themeMeta.parent, filePath);
    }
    
    return null;
  }
}

/**
 * Resolve page with parent theme fallback
 */
export async function resolveThemePage(
  themeName: string,
  pagePath: string
): Promise<string | null> {
  const config = await import('@/config/theme');
  
  // Convert route to file path
  const normalizedPath = pagePath.startsWith('/') ? pagePath.slice(1) : pagePath;
  const segments = normalizedPath.split('/');
  
  if (segments.length === 1 && segments[0] === '') {
    return resolveThemeFile(themeName, 'pages/index.tsx');
  }
  
  const filePath = segments.map(seg => {
    if (seg.startsWith('[') && seg.endsWith(']')) {
      return seg;
    }
    return seg;
  }).join('/');
  
  return resolveThemeFile(themeName, `pages/${filePath}.tsx`);
}

/**
 * Resolve layout with parent theme fallback
 */
export async function resolveThemeLayout(
  themeName: string,
  layoutName: string = 'default'
): Promise<string | null> {
  return resolveThemeFile(themeName, `layout/${layoutName}.tsx`);
}

/**
 * Resolve component with parent theme fallback
 */
export async function resolveThemeComponent(
  themeName: string,
  componentName: string
): Promise<string | null> {
  return resolveThemeFile(themeName, `components/${componentName}.tsx`);
}

/**
 * Get all parent themes in order (for inheritance chain)
 */
export async function getThemeInheritanceChain(themeName: string): Promise<string[]> {
  const chain: string[] = [themeName];
  
  let currentTheme = themeName;
  while (true) {
    const themeMeta = await getThemeMetadata(currentTheme);
    
    if (themeMeta?.parent && await themeExists(themeMeta.parent)) {
      chain.push(themeMeta.parent);
      currentTheme = themeMeta.parent;
    } else {
      break;
    }
  }
  
  return chain;
}

