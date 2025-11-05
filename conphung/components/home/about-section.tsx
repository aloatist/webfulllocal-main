'use client';

import Image from 'next/image';
import parseEditorContent from '@/lib/posts/parse-editor-content';
import { FadeIn } from '@/components/ui/fade-in';
import type { AboutSection as AboutSectionType } from '@/lib/homepage/schema';

interface AboutSectionProps {
  data?: AboutSectionType;
}

export function AboutSection({ data }: AboutSectionProps) {
  if (!data || !data.isActive) return null;

  // Parse EditorJS content - handle both string and object formats
  let contentBlocks: ReturnType<typeof parseEditorContent> | null = null;
  if (data.content) {
    try {
      if (typeof data.content === 'string') {
        contentBlocks = parseEditorContent(data.content);
      } else if (typeof data.content === 'object') {
        // If it's already an object, stringify it first
        // Handle EditorJS structure: might be {blocks: [...]} or {content: [...], meta: {...}, items: [...]}
        const contentObj = data.content as any;
        
        // If it has the structure {content, meta, items}, extract the content
        if (contentObj.content && Array.isArray(contentObj.content)) {
          // This is not standard EditorJS format, but handle it
          contentBlocks = contentObj.content;
        } else if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
          // Standard EditorJS format
          contentBlocks = contentObj.blocks;
        } else if (Array.isArray(contentObj)) {
          // Already an array of blocks
          contentBlocks = contentObj;
        } else {
          // Try to stringify and parse
          contentBlocks = parseEditorContent(JSON.stringify(data.content));
        }
      }
    } catch (error) {
      console.error('Error parsing about content:', error);
      contentBlocks = [];
    }
  }
  
  // Ensure contentBlocks is an array
  if (contentBlocks && !Array.isArray(contentBlocks)) {
    contentBlocks = [];
  }

  if (!data.title && (!contentBlocks || contentBlocks.length === 0)) return null;

  return (
    <FadeIn delay={0.2}>
            <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={`grid gap-8 md:gap-12 items-center ${data.image ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            {/* Image */}
            {data.image && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">                                                                     
                <Image
                  src={data.image}
                  alt={data.title || 'About'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className={`space-y-6 ${!data.image ? 'max-w-4xl mx-auto' : ''}`}>
              {data.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {data.title}
                </h2>
              )}
              {contentBlocks && Array.isArray(contentBlocks) && contentBlocks.length > 0 && (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {contentBlocks.map((block, i) => {
                    if (!block || typeof block !== 'object') return null;
                    
                    const blockType = block.type;
                    const blockData = block.data;
                    
                    if (!blockData || typeof blockData !== 'object') return null;
                    
                    try {
                      if (blockType === 'paragraph') {
                        const text = typeof blockData.text === 'string' ? blockData.text : '';
                        return text ? <p key={i} dangerouslySetInnerHTML={{ __html: text }} /> : null;
                      }
                      if (blockType === 'header') {
                        const level = Math.min(Math.max(Number(blockData.level) || 2, 1), 6);
                        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                        const text = typeof blockData.text === 'string' ? blockData.text : '';
                        return text ? <Tag key={i} dangerouslySetInnerHTML={{ __html: text }} /> : null;
                      }
                      if (blockType === 'list') {
                        const Tag = blockData.style === 'ordered' ? 'ol' : 'ul';
                        const items = Array.isArray(blockData.items) ? blockData.items : [];
                        return (
                          <Tag key={i}>
                            {items.map((item: any, j: number) => {
                              const itemText = typeof item === 'string' ? item : (typeof item === 'object' && item?.text) ? item.text : '';
                              return itemText ? <li key={j} dangerouslySetInnerHTML={{ __html: itemText }} /> : null;
                            })}
                          </Tag>
                        );
                      }
                    } catch (error) {
                      console.error('Error rendering block:', error, block);
                      return null;
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

