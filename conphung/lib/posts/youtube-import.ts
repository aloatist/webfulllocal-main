/**
 * Utility functions for importing YouTube videos as posts
 */

export interface YouTubeMetadata {
  title: string;
  description?: string;
  thumbnail_url?: string;
  author_name?: string;
  video_id: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractVideoId(url: string): string | null {
  // Remove whitespace
  url = url.trim();

  // Pattern 1: https://www.youtube.com/watch?v=VIDEO_ID
  // Pattern 2: https://youtu.be/VIDEO_ID
  // Pattern 3: https://www.youtube.com/embed/VIDEO_ID
  // Pattern 4: https://m.youtube.com/watch?v=VIDEO_ID

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch YouTube video metadata using oEmbed API
 */
export async function fetchYouTubeMetadata(videoUrl: string): Promise<YouTubeMetadata | null> {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      console.error('[YouTube Import] Invalid video ID from URL:', videoUrl);
      throw new Error('Invalid YouTube URL');
    }

    // Normalize URL for oEmbed API
    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalizedUrl)}&format=json`;

    console.log('[YouTube Import] Fetching from oEmbed URL:', oEmbedUrl);

    // Fetch YouTube metadata with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15 second timeout

    try {
      const response = await fetch(oEmbedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ConPhungTourist/1.0)',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[YouTube Import] YouTube API error: ${response.status} ${response.statusText}`);
        console.error(`[YouTube Import] Error text: ${errorText}`);
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        console.error('[YouTube Import] Invalid response format from YouTube API');
        throw new Error('Invalid response from YouTube API');
      }

      console.log('[YouTube Import] Successfully fetched metadata:', {
        title: data.title,
        hasDescription: !!data.description,
        videoId,
      });

      return {
        title: data.title || 'Untitled Video',
        description: data.description || undefined,
        thumbnail_url: data.thumbnail_url,
        author_name: data.author_name,
        video_id: videoId,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('[YouTube Import] Request timeout after 15 seconds');
        throw new Error('Request timeout: YouTube API took too long to respond');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('[YouTube Import] Error fetching YouTube metadata:', error);
    console.error('[YouTube Import] Video URL:', videoUrl);
    console.error('[YouTube Import] Error type:', error?.constructor?.name);
    console.error('[YouTube Import] Error message:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Create EditorJS content with YouTube embed and description
 */
export function createEditorJSContent(videoUrl: string, description?: string): string {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const blocks: any[] = [
    {
      type: 'embed',
      data: {
        service: 'youtube',
        source: watchUrl,
        embed: embedUrl,
        width: 600,
        height: 400,
        caption: '',
      },
    },
  ];

  // Add description as paragraph if available
  if (description && description.trim()) {
    // Clean up description (remove extra whitespace, limit length)
    // Escape HTML to prevent XSS
    const cleanDescription = description
      .trim()
      .substring(0, 2000)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    if (cleanDescription.length > 0) {
      blocks.push({
        type: 'paragraph',
        data: {
          text: cleanDescription,
        },
      });
    }
  }

  const contentJson = { blocks };
  return JSON.stringify(contentJson);
}

/**
 * Generate slug from title
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

/**
 * Extract tags from title (keywords)
 */
export function extractTagsFromTitle(title: string): string[] {
  // Common Vietnamese stop words to filter out
  const stopWords = new Set([
    'và', 'của', 'cho', 'với', 'từ', 'đến', 'trong', 'trên', 'dưới', 'về',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'các', 'những', 'một', 'hai', 'ba', 'bốn', 'năm',
  ]);

  // Extract words (Vietnamese and English)
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 5) // Limit to 5 tags
    .filter((word) => word.trim().length > 0); // Remove empty strings

  return words;
}

/**
 * Generate slug from tag name
 */
export function generateTagSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

