import { slugify } from '@/lib/tours/utils';

/**
 * Extract hashtags from text
 * @param text - Text content to extract hashtags from
 * @returns Array of hashtag names (without #)
 */
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  
  // Regex to match hashtags: #word (supports unicode and Vietnamese)
  const hashtagRegex = /#([\w\u00C0-\u1EF9]+)/g;
  const matches = text.match(hashtagRegex) || [];
  
  // Remove # and convert to lowercase, remove duplicates
  const tags = matches
    .map(tag => tag.replace('#', '').toLowerCase().trim())
    .filter((tag, index, self) => tag && self.indexOf(tag) === index);
  
  return tags;
}

/**
 * Convert Facebook text to Markdown format
 * @param text - Original text from Facebook
 * @returns Markdown formatted text
 */
export function textToMarkdown(text: string): string {
  if (!text) return '';
  
  let markdown = text
    // Remove excessive line breaks (3+ → 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
  
  // Preserve paragraphs by splitting on double line breaks
  const paragraphs = markdown.split('\n\n').map(p => p.trim()).filter(p => p);
  markdown = paragraphs.join('\n\n');
  
  // Convert URLs to markdown links (optional enhancement)
  // markdown = markdown.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
  
  return markdown;
}

/**
 * Generate slug from title
 * @param title - Post title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  return slugify(title);
}

/**
 * Generate excerpt from content (first N characters)
 * @param content - Post content
 * @param maxLength - Maximum length (default: 200)
 * @returns Excerpt text
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  if (!content) return '';
  
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Cut at word boundary
  const excerpt = plainText.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? excerpt.substring(0, lastSpace) + '...'
    : excerpt + '...';
}

/**
 * Extract Facebook post ID from permalink or post object
 * @param postId - Facebook post ID or permalink
 * @returns Facebook post ID
 */
export function extractFacebookPostId(postId: string): string {
  // If it's already an ID (numeric or pageId_postId format), return as is
  if (/^\d+$/.test(postId) || /^\d+_\d+$/.test(postId)) {
    return postId;
  }
  
  // If it's a URL, extract the ID
  const urlMatch = postId.match(/\/posts\/(\d+)/) || postId.match(/\/(\d+)\//);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  return postId;
}

/**
 * Validate Facebook post data
 * @param post - Facebook post object
 * @returns Validation result
 */
export function validateFacebookPost(post: any): { valid: boolean; error?: string } {
  if (!post) {
    return { valid: false, error: 'Post is required' };
  }
  
  if (!post.id) {
    return { valid: false, error: 'Post ID is required' };
  }
  
  if (!post.message && !post.story) {
    return { valid: false, error: 'Post must have message or story' };
  }
  
  return { valid: true };
}

/**
 * Generate SEO metadata from Facebook post
 * @param post - Facebook post object
 * @param content - Post content (markdown)
 * @returns SEO metadata object
 */
export function generateSEOMetadata(post: any, content: string) {
  const title = post.message 
    ? post.message.substring(0, 60).replace(/\n/g, ' ').trim()
    : 'Facebook Post';
  
  const description = generateExcerpt(content, 160);
  
  return {
    title: title.length > 60 ? title.substring(0, 57) + '...' : title,
    description: description,
    keywords: extractHashtags(post.message || '').join(', '),
    ogTitle: title,
    ogDescription: description,
    ogImage: post.full_picture || post.attachments?.data?.[0]?.media?.image?.src,
  };
}
