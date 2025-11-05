/**
 * Parse EditorJS JSON content to render blocks
 */

interface EditorBlock {
  type: string;
  data: any;
}

export default function parseEditorContent(content: string | null | object): EditorBlock[] {
  if (!content) return [];

  try {
    // If content is already an object, use it directly
    let parsed: any;
    if (typeof content === 'string') {
      parsed = JSON.parse(content);
    } else if (typeof content === 'object') {
      parsed = content;
    } else {
      return [];
    }
    
    // Handle EditorJS structure: it might be {blocks: [...]} or {content: [...], meta: {...}, items: [...]}
    // Or the blocks might be directly in the root
    if (parsed && typeof parsed === 'object') {
      // Standard EditorJS format: {blocks: [...]}
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return parsed.blocks as EditorBlock[];
      }
      
      // Alternative structure: {content: [...], meta: {...}, items: [...]}
      // Extract the content array if it exists
      if (parsed.content && Array.isArray(parsed.content)) {
        return parsed.content as EditorBlock[];
      }
      
      // If parsed is directly an array, return it
      if (Array.isArray(parsed)) {
        return parsed as EditorBlock[];
      }
    }

    // If none of the above, return empty array
    return [];
  } catch (error) {
    console.error('Error parsing editor content:', error, content);
    return [];
  }
}

