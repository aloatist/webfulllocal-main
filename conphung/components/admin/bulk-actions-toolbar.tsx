'use client';

import { useState } from 'react';
import { Trash2, Edit, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete?: () => void;
  onBulkPublish?: () => void;
  onBulkUnpublish?: () => void;
  onBulkExport?: () => void;
  isAllSelected: boolean;
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
  onBulkExport,
  isAllSelected,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={isAllSelected ? onDeselectAll : onSelectAll}
          className="h-8"
        >
          {isAllSelected ? (
            <CheckSquare className="mr-2 h-4 w-4" />
          ) : (
            <Square className="mr-2 h-4 w-4" />
          )}
          {isAllSelected ? 'Bỏ chọn tất cả' : `Chọn tất cả (${totalCount})`}
        </Button>
        <div className="text-sm font-medium">
          Đã chọn: <span className="text-primary">{selectedCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onBulkPublish && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkPublish}
            className="h-8"
          >
            <Eye className="mr-2 h-4 w-4" />
            Xuất bản
          </Button>
        )}
        
        {onBulkUnpublish && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkUnpublish}
            className="h-8"
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Ẩn
          </Button>
        )}

        {onBulkExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="h-8"
          >
            Xuất dữ liệu
          </Button>
        )}

        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="h-8"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
