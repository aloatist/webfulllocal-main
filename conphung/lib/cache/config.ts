/**
 * Cache configuration and revalidation times
 */

export const CACHE_TIMES = {
  // Static content - rarely changes
  STATIC: 86400, // 24 hours
  
  // Homepage - changes daily
  HOMEPAGE: 3600, // 1 hour
  
  // Tours list - changes when new tours added
  TOURS_LIST: 1800, // 30 minutes
  
  // Tour detail - changes when tour updated
  TOUR_DETAIL: 3600, // 1 hour
  
  // Homestays list
  HOMESTAYS_LIST: 1800, // 30 minutes
  
  // Homestay detail
  HOMESTAY_DETAIL: 3600, // 1 hour
  
  // Blog posts list
  POSTS_LIST: 3600, // 1 hour
  
  // Blog post detail
  POST_DETAIL: 7200, // 2 hours
  
  // Reviews
  REVIEWS: 1800, // 30 minutes
  
  // Bookings (admin only)
  BOOKINGS: 300, // 5 minutes
  
  // User session
  SESSION: 900, // 15 minutes
  
  // API responses
  API_SHORT: 60, // 1 minute
  API_MEDIUM: 300, // 5 minutes
  API_LONG: 1800, // 30 minutes
} as const

export const CACHE_TAGS = {
  TOURS: 'tours',
  TOUR: (slug: string) => `tour:${slug}`,
  HOMESTAYS: 'homestays',
  HOMESTAY: (slug: string) => `homestay:${slug}`,
  POSTS: 'posts',
  POST: (slug: string) => `post:${slug}`,
  REVIEWS: 'reviews',
  BOOKINGS: 'bookings',
  USER: (id: string) => `user:${id}`,
} as const

/**
 * Get cache config for a specific page type
 */
export function getCacheConfig(pageType: keyof typeof CACHE_TIMES) {
  return {
    revalidate: CACHE_TIMES[pageType],
  }
}

/**
 * Cache headers for API routes
 */
export function getCacheHeaders(seconds: number) {
  return {
    'Cache-Control': `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`,
  }
}
