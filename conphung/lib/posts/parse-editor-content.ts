/**
 * Parse EditorJS JSON content to render blocks
 */

interface EditorBlock {
  type: string;
  data: any;
}

export default function parseEditorContent(content: string | null): EditorBlock[] {
  if (!content) return [];

  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    
    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      return [];
    }

    return parsed.blocks as EditorBlock[];
  } catch (error) {
    console.error('Error parsing editor content:', error);
    return [];
  }
}

