/**
 * Calculate reading time for post content
 * Based on average reading speed of 200 words per minute
 */

export function calculateReadingTime(content: string | null): number {
  if (!content) return 0;

  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');

  // Count words (split by whitespace and filter empty strings)
  const words = textContent.trim().split(/\s+/).filter(Boolean);

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(words.length / wordsPerMinute);

  // Minimum 1 minute
  return Math.max(1, readingTime);
}

/**
 * Format reading time as human-readable string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 phút đọc';
  }
  return `${minutes} phút đọc`;
}

