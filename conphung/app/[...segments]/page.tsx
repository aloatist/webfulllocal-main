/**
 * Dynamic Catch-All Route Handler
 * 
 * This route handles all dynamic theme pages
 * It loads pages from the active theme's pages directory
 */

import { loadThemePage } from '@/lib/theme/loader';
import { convertPageComponent } from '@/lib/theme/pages-router-adapter';
import { notFound } from 'next/navigation';

// Force dynamic rendering since we use cookies for theme preview
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface PageProps {
  params: {
    segments?: string[];
  };
}

export default async function DynamicThemePage({ params }: PageProps) {
  // Reconstruct the path from segments
  const segments = params.segments || [];
  const pagePath = segments.length > 0 ? `/${segments.join('/')}` : '/';
  
  // IMPORTANT: Skip Next.js internal paths - these should NEVER reach this route
  // Next.js should handle these before reaching this catch-all route
  // This is a safety check in case routing is misconfigured
  if (
    pagePath.startsWith('/_next/') || 
    pagePath.startsWith('/api/') || 
    pagePath.startsWith('/admin/') ||
    pagePath.startsWith('/static/') ||
    pagePath.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    // Return 404 for internal/static paths that shouldn't be here
    notFound();
  }
  
  try {
    // Load page from active theme
    const pageData = await loadThemePage(pagePath);
    
    if (!pageData) {
      notFound();
    }
    
    // Convert Pages Router component to App Router compatible
    const { Component: PageComponent, getProps } = convertPageComponent(pageData);
    
    if (!PageComponent) {
      notFound();
    }
    
    // Get props if adapter provides them
    let pageProps = { params };
    
    if (getProps) {
      try {
        const props = await getProps({ params });
        pageProps = { ...pageProps, ...props };
      } catch (error) {
        console.error('Error getting page props:', error);
      }
    }
    
    // Render page with props
    return <PageComponent {...pageProps} />;
  } catch (error) {
    console.error('Error rendering theme page:', error);
    notFound();
  }
}

// Support getStaticPaths for dynamic routes
export async function generateStaticParams() {
  // This can be populated from theme pages if needed
  // For now, we'll use dynamic rendering
  return [];
}

