/**
 * Theme Configuration System
 * 
 * This module handles theme detection, loading, and management
 * Similar to WordPress theme system but for Next.js
 */

import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export interface ThemeConfig {
  name: string;
  version: string;
  author?: string;
  description?: string;
  preview?: string;
  domain?: string; // For multi-tenant support
  parent?: string; // For child themes
}

export interface ThemeMetadata {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  preview?: string;
  domain?: string;
  parent?: string;
  path: string; // Physical path to theme folder
  active: boolean;
  canDelete: boolean;
}

const THEME_COOKIE_NAME = 'active_theme';
const PREVIEW_COOKIE_NAME = 'preview_theme';
const DEFAULT_THEME = 'default';
const THEMES_DIR = process.env.THEMES_DIR || 'templates';

/**
 * Get active theme from multiple sources (priority order):
 * 1. Domain-based theme (multi-tenant)
 * 2. Cookie
 * 3. Database (optional)
 * 4. Environment variable
 * 5. Default theme
 */
export async function getActiveTheme(): Promise<string> {
  try {
    // 0. Check preview theme first (highest priority for testing)
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get(PREVIEW_COOKIE_NAME);
    if (previewCookie?.value) {
      const previewTheme = previewCookie.value;
      // Verify preview theme exists
      if (await themeExists(previewTheme)) {
        return previewTheme;
      }
    }

    // 1. Check domain-based theme (multi-tenant)
    const domainTheme = await getThemeByDomain();
    if (domainTheme) {
      return domainTheme;
    }

    // 2. Check cookie
    const themeCookie = cookieStore.get(THEME_COOKIE_NAME);
    if (themeCookie?.value) {
      return themeCookie.value;
    }

    // 3. Check database (if using database storage)
    const dbTheme = await getThemeFromDatabase();
    if (dbTheme) {
      return dbTheme;
    }

    // 4. Check environment variable
    if (process.env.ACTIVE_THEME) {
      return process.env.ACTIVE_THEME;
    }

    // 5. Default theme
    return DEFAULT_THEME;
  } catch (error) {
    console.error('Error getting active theme:', error);
    return DEFAULT_THEME;
  }
}

/**
 * Get theme by domain (multi-tenant support)
 */
async function getThemeByDomain(): Promise<string | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // Check domain-to-theme mapping
    // Can be stored in database, env, or config file
    const domainThemeMap: Record<string, string> = {
      // Example: 'domain1.com': 'theme1',
      // Add your domain mappings here or load from database
      ...(process.env.DOMAIN_THEME_MAP ? JSON.parse(process.env.DOMAIN_THEME_MAP) : {}),
    };

    // Extract domain without port
    const domain = host.split(':')[0];
    
    if (domainThemeMap[domain]) {
      return domainThemeMap[domain];
    }

    // Check wildcard subdomain
    const subdomain = domain.split('.')[0];
    if (subdomain && domainThemeMap[`*.${domain.split('.').slice(1).join('.')}`]) {
      return domainThemeMap[`*.${domain.split('.').slice(1).join('.')}`];
    }

    return null;
  } catch (error) {
    console.error('Error getting theme by domain:', error);
    return null;
  }
}

/**
 * Get theme from database (optional)
 */
async function getThemeFromDatabase(): Promise<string | null> {
  try {
    // If you're using Prisma to store theme settings
    const { prisma } = await import('@/lib/prisma');
    const settings = await prisma.websiteTemplateSettings.findFirst();
    
    if (settings?.activeTemplate) {
      // Map old template system to new theme system if needed
      return mapLegacyTemplateToTheme(settings.activeTemplate);
    }
    
    return null;
  } catch (error) {
    // Database not available or table doesn't exist
    return null;
  }
}

/**
 * Map legacy template system to new theme system
 */
function mapLegacyTemplateToTheme(template: string): string {
  const mapping: Record<string, string> = {
    'ECOLOGICAL': 'default',
    'MODERN': 'modern',
    'TRADITIONAL': 'traditional',
    'GEOMETRIC': 'geometric',
  };
  
  return mapping[template] || DEFAULT_THEME;
}

/**
 * Set active theme (stores in cookie)
 */
export async function setActiveTheme(themeName: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, themeName, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
}

/**
 * Get theme path
 */
export function getThemePath(themeName?: string): string {
  const theme = themeName || DEFAULT_THEME;
  return `${THEMES_DIR}/${theme}`;
}

/**
 * Get theme public assets path
 */
export function getThemePublicPath(themeName?: string): string {
  const theme = themeName || DEFAULT_THEME;
  return `/themes/${theme}`;
}

/**
 * Validate theme exists
 */
export async function themeExists(themeName: string): Promise<boolean> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const themePath = path.join(process.cwd(), getThemePath(themeName));
    
    // Check if theme directory exists
    const stats = await fs.stat(themePath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Get theme metadata from theme.json
 */
export async function getThemeMetadata(themeName: string): Promise<ThemeConfig | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const themePath = path.join(process.cwd(), getThemePath(themeName));
    const configPath = path.join(themePath, 'theme.json');
    
    const configContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configContent) as ThemeConfig;
  } catch (error) {
    console.error(`Error reading theme metadata for ${themeName}:`, error);
    return null;
  }
}

/**
 * Get all available themes
 */
export async function getAllThemes(): Promise<ThemeMetadata[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const themesPath = path.join(process.cwd(), THEMES_DIR);
    
    // Check if themes directory exists
    try {
      await fs.access(themesPath);
    } catch {
      // Create themes directory if it doesn't exist
      await fs.mkdir(themesPath, { recursive: true });
      return [];
    }
    
    const entries = await fs.readdir(themesPath, { withFileTypes: true });
    const themes: ThemeMetadata[] = [];
    const activeTheme = await getActiveTheme();
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const themeName = entry.name;
        const themePath = path.join(themesPath, themeName);
        const configPath = path.join(themePath, 'theme.json');
        
        try {
          // Check if theme.json exists
          await fs.access(configPath);
          const config = await getThemeMetadata(themeName);
          
          if (config) {
            themes.push({
              id: themeName,
              name: config.name || themeName,
              version: config.version || '1.0.0',
              author: config.author,
              description: config.description,
              preview: config.preview,
              domain: config.domain,
              parent: config.parent,
              path: themePath,
              active: themeName === activeTheme,
              canDelete: themeName !== activeTheme && themeName !== DEFAULT_THEME,
            });
          }
        } catch {
          // Skip themes without theme.json
        }
      }
    }
    
    return themes;
  } catch (error) {
    console.error('Error getting all themes:', error);
    return [];
  }
}

/**
 * Check if theme can be deleted
 */
export async function canDeleteTheme(themeName: string): Promise<boolean> {
  const activeTheme = await getActiveTheme();
  return themeName !== activeTheme && themeName !== DEFAULT_THEME;
}

/**
 * Get theme layout path
 */
export function getThemeLayoutPath(themeName: string, layoutName: string = 'default'): string {
  return `${getThemePath(themeName)}/layout/${layoutName}.tsx`;
}

/**
 * Get theme page path
 */
export function getThemePagePath(themeName: string, pagePath: string): string {
  // Convert route path to file path
  // /about -> pages/about.tsx
  // /blog/[slug] -> pages/blog/[slug].tsx
  const normalizedPath = pagePath.startsWith('/') ? pagePath.slice(1) : pagePath;
  const segments = normalizedPath.split('/');
  
  if (segments.length === 1 && segments[0] === '') {
    return `${getThemePath(themeName)}/pages/index.tsx`;
  }
  
  // Check for dynamic routes
  const filePath = segments.map(seg => {
    // Handle dynamic segments [slug], [...catchall], etc.
    if (seg.startsWith('[') && seg.endsWith(']')) {
      return seg;
    }
    return seg;
  }).join('/');
  
  return `${getThemePath(themeName)}/pages/${filePath}.tsx`;
}

