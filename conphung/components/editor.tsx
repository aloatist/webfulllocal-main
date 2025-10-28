'use client';

import { useCallback, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

const HeaderTool = Header as unknown as ToolConstructable;
const ListTool = List as unknown as ToolConstructable;
const QuoteTool = Quote as unknown as ToolConstructable;
const ImageEditorTool = ImageTool as unknown as ToolConstructable;
const CodeEditorTool = CodeTool as unknown as ToolConstructable;
const ChecklistTool = Checklist as unknown as ToolConstructable;
const TableTool = Table as unknown as ToolConstructable;
const EmbedTool = Embed as unknown as ToolConstructable;
const MarkerTool = Marker as unknown as ToolConstructable;
const InlineCodeTool = InlineCode as unknown as ToolConstructable;

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const initEditor = useCallback(async () => {
    const editor = new EditorJS({
      holder: 'editor',
      tools: {
        header: {
          class: HeaderTool,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        paragraph: {
          inlineToolbar: ['bold', 'italic', 'marker', 'inlineCode'],
        },
        list: {
          class: ListTool,
          inlineToolbar: true,
        },
        checklist: {
          class: ChecklistTool,
          inlineToolbar: true,
        },
        table: {
          class: TableTool,
          inlineToolbar: true,
        },
        quote: {
          class: QuoteTool,
          inlineToolbar: true,
        },
        code: {
          class: CodeEditorTool,
        },
        inlineCode: {
          class: InlineCodeTool,
        },
        marker: {
          class: MarkerTool,
        },
        embed: {
          class: EmbedTool,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              facebook: true,
              instagram: true,
              twitter: true,
              twitch: true,
            },
          },
        },
        image: {
          class: ImageEditorTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                try {
                  const formData = new FormData();
                  formData.append('file', file);

                  const response = await fetch('/api/media', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!response.ok) {
                    throw new Error('Upload failed');
                  }

                  const media = await response.json();

                  return {
                    success: 1,
                    file: {
                      url: media.url as string,
                    },
                  };
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return {
                    success: 0,
                  };
                }
              },
            },
          },
        },
      },
      data: initialValueRef.current ? JSON.parse(initialValueRef.current) : undefined,
      placeholder: 'Write engaging content with headings, embeds, tables, and more...',
      onChange: async () => {
        const data = await editor.save();
        onChangeRef.current(JSON.stringify(data));
      },
    });

    editorRef.current = editor;
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      void initEditor();
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initEditor]);

  return (
    <div className="rounded-lg border">
      <div
        id="editor"
        className="prose prose-sm max-w-none p-4"
      />
    </div>
  );
}
