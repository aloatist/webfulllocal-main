'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionEditorProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SectionEditor({
  title,
  description,
  children,
  defaultExpanded = false,
}: SectionEditorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="border-2">
      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-6 space-y-6">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
