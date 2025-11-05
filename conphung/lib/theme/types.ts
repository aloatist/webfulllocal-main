/**
 * TypeScript Types for Theme System
 */

export interface ThemeConfig {
  name: string;
  version: string;
  author?: string;
  description?: string;
  preview?: string;
  domain?: string;
  parent?: string; // For child themes
  screenshot?: string;
  tags?: string[];
  homepage?: string;
}

export interface ThemeMetadata extends ThemeConfig {
  id: string;
  path: string;
  active: boolean;
  canDelete: boolean;
}

export interface ThemePageProps {
  params?: Record<string, string | string[]>;
  searchParams?: Record<string, string | string[]>;
}

export interface ThemeLayoutProps {
  children: React.ReactNode;
  params?: Record<string, string | string[]>;
}

export interface ThemeComponent {
  default: React.ComponentType<any>;
  getServerSideProps?: (context: {
    params: Record<string, string>;
    query: Record<string, string>;
    res: any;
    req: any;
  }) => Promise<{ props: any }>;
  getStaticProps?: (context: {
    params: Record<string, string>;
  }) => Promise<{ props: any }>;
  getStaticPaths?: () => Promise<{
    paths: Array<{ params: Record<string, string> }>;
    fallback: boolean | 'blocking';
  }>;
}

export interface ThemeOptions {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  [key: string]: any;
}

export interface ChildThemeResolver {
  resolvePage(themeName: string, pagePath: string): Promise<string | null>;
  resolveLayout(themeName: string, layoutName: string): Promise<string | null>;
  resolveComponent(themeName: string, componentName: string): Promise<string | null>;
}

