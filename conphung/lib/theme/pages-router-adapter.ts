/**
 * Pages Router Adapter
 * 
 * Adapter to support getServerSideProps, getStaticProps, getStaticPaths
 * from Pages Router in App Router environment
 */

import { ThemeComponent } from './types';

/**
 * Adapter for getServerSideProps
 * Converts Pages Router pattern to App Router async component
 */
export function adaptServerSideProps<T>(
  getServerSideProps: (context: {
    params: Record<string, string>;
    query: Record<string, string>;
    res: any;
    req: any;
  }) => Promise<{ props: T }>
) {
  return async (props: { params: Record<string, string | string[]> }) => {
    // Convert params
    const convertedParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(props.params || {})) {
      convertedParams[key] = Array.isArray(value) ? value[0] : value;
    }
    
    // Call getServerSideProps
    const result = await getServerSideProps({
      params: convertedParams,
      query: {},
      res: {} as any,
      req: {} as any,
    });
    
    return result.props;
  };
}

/**
 * Adapter for getStaticProps
 * For use in App Router, we'll use it in generateStaticParams context
 */
export function adaptStaticProps<T>(
  getStaticProps: (context: {
    params: Record<string, string>;
  }) => Promise<{ props: T }>
) {
  return async (props: { params: Record<string, string | string[]> }) => {
    // Convert params
    const convertedParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(props.params || {})) {
      convertedParams[key] = Array.isArray(value) ? value[0] : value;
    }
    
    // Call getStaticProps
    const result = await getStaticProps({ params: convertedParams });
    
    return result.props;
  };
}

/**
 * Convert Pages Router component to App Router compatible
 */
export function convertPageComponent(pageModule: ThemeComponent): {
  Component: React.ComponentType<any>;
  getProps?: (props: { params: Record<string, string | string[]> }) => Promise<any>;
} {
  const Component = pageModule.default;
  
  if (pageModule.getServerSideProps) {
    return {
      Component,
      getProps: adaptServerSideProps(pageModule.getServerSideProps),
    };
  }
  
  if (pageModule.getStaticProps) {
    return {
      Component,
      getProps: adaptStaticProps(pageModule.getStaticProps),
    };
  }
  
  return { Component };
}

/**
 * Support for getStaticPaths
 * Returns paths for static generation
 */
export async function getStaticPathsFromTheme(
  getStaticPaths: () => Promise<{
    paths: Array<{ params: Record<string, string> }>;
    fallback: boolean | 'blocking';
  }>
): Promise<Array<{ params: Record<string, string> }>> {
  try {
    const result = await getStaticPaths();
    return result.paths || [];
  } catch (error) {
    console.error('Error getting static paths:', error);
    return [];
  }
}

