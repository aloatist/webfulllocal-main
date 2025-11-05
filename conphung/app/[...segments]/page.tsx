/**
 * Dynamic Catch-All Route Handler
 * 
 * This route handles all dynamic theme pages
 * It loads pages from the active theme's pages directory
 */

import { loadThemePage } from '@/lib/theme/loader';
import { convertPageComponent } from '@/lib/theme/pages-router-adapter';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    segments?: string[];
  };
}

export default async function DynamicThemePage({ params }: PageProps) {
  // Reconstruct the path from segments
  const segments = params.segments || [];
  const pagePath = segments.length > 0 ? `/${segments.join('/')}` : '/';
  
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

