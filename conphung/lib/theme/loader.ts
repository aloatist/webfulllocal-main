/**
 * Theme Loader
 * 
 * Handles dynamic loading of theme pages, layouts, and components
 */

import { getActiveTheme, getThemePath, getThemePagePath, themeExists } from '@/config/theme';
import { resolveThemePage } from './child-theme';
import { notFound } from 'next/navigation';

/**
 * Load theme page dynamically
 */
export async function loadThemePage(pagePath: string) {
  try {
    const activeTheme = await getActiveTheme();
    
    // Ensure theme exists
    if (!(await themeExists(activeTheme))) {
      console.warn(`Theme ${activeTheme} not found, falling back to default`);
      const defaultTheme = 'default';
      if (await themeExists(defaultTheme)) {
        return loadThemePageFromTheme(defaultTheme, pagePath);
      }
      throw new Error('Default theme not found');
    }
    
    return loadThemePageFromTheme(activeTheme, pagePath);
  } catch (error) {
    console.error('Error loading theme page:', error);
    notFound();
  }
}

/**
 * Load page from specific theme
 */
async function loadThemePageFromTheme(themeName: string, pagePath: string) {
  try {
    const path = await import('path');
    const fs = await import('fs/promises');
    
    // Resolve page with child theme support
    const resolvedPath = await resolveThemePage(themeName, pagePath);
    
    if (!resolvedPath) {
      return null;
    }
    
    // Convert absolute path to import path
    // Remove process.cwd() and convert to relative import
    const relativePath = resolvedPath.replace(process.cwd() + '/', '');
    const importPath = `@/${relativePath}`;
    
    // Dynamic import the page
    // Use eval to support dynamic imports (App Router limitation)
    let pageModule;
    try {
      pageModule = await import(importPath);
    } catch {
      // Try direct path if alias doesn't work
      const directPath = resolvedPath.replace(process.cwd(), '.');
      pageModule = await import(directPath);
    }
    
    return {
      default: pageModule.default,
      getServerSideProps: pageModule.getServerSideProps,
      getStaticProps: pageModule.getStaticProps,
      getStaticPaths: pageModule.getStaticPaths,
    };
  } catch (error) {
    console.error(`Error loading page from theme ${themeName}:`, error);
    return null;
  }
}

/**
 * Load theme layout dynamically
 */
export async function loadThemeLayout(layoutName: string = 'default') {
  try {
    const activeTheme = await getActiveTheme();
    const path = await import('path');
    const fs = await import('fs/promises');
    
    if (!(await themeExists(activeTheme))) {
      // Fallback to default
      if (await themeExists('default')) {
        return loadThemeLayoutFromTheme('default', layoutName);
      }
      return null;
    }
    
    const layoutPath = path.join(
      process.cwd(),
      getThemePath(activeTheme),
      'layout',
      `${layoutName}.tsx`
    );
    
    try {
      await fs.access(layoutPath);
    } catch {
      // Layout doesn't exist, try parent theme or return null
      return null;
    }
    
    // Dynamic import
    const layoutModule = await import(`@/${getThemePath(activeTheme)}/layout/${layoutName}.tsx`);
    return layoutModule.default;
  } catch (error) {
    console.error('Error loading theme layout:', error);
    return null;
  }
}

/**
 * Check if theme page exists
 */
export async function themePageExists(pagePath: string): Promise<boolean> {
  try {
    const activeTheme = await getActiveTheme();
    const path = await import('path');
    const fs = await import('fs/promises');
    
    const pageFilePath = getThemePagePath(activeTheme, pagePath);
    const absolutePath = path.join(process.cwd(), pageFilePath);
    
    try {
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

/**
 * Get all theme routes (for sitemap, etc.)
 */
export async function getAllThemeRoutes(): Promise<string[]> {
  try {
    const activeTheme = await getActiveTheme();
    const path = await import('path');
    const fs = await import('fs/promises');
    
    const pagesDir = path.join(process.cwd(), getThemePath(activeTheme), 'pages');
    
    try {
      await fs.access(pagesDir);
    } catch {
      return [];
    }
    
    const routes: string[] = [];
    const walkDir = async (dir: string, prefix: string = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await walkDir(fullPath, path.join(prefix, entry.name));
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const route = path.join(prefix, entry.name.replace(/\.(tsx|ts)$/, ''));
          
          // Convert file path to route path
          // pages/about.tsx -> /about
          // pages/blog/[slug].tsx -> /blog/[slug]
          let routePath = route.replace(/^pages\//, '/').replace(/\/index$/, '');
          if (routePath === '') routePath = '/';
          
          routes.push(routePath);
        }
      }
    };
    
    await walkDir(pagesDir);
    return routes;
  } catch (error) {
    console.error('Error getting theme routes:', error);
    return [];
  }
}

