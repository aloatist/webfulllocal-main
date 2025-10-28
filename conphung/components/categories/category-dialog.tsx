'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryForm } from './category-form';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category | null;
  categories?: Category[];
  onSubmit: (data: Partial<Category>) => Promise<void>;
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialData,
  categories,
  onSubmit,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          initialData={initialData}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}