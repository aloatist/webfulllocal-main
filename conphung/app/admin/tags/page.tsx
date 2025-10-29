'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TagForm, type TagFormValues } from '@/components/tags/tag-form';
import { Edit2, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

interface TagsResponse {
  tags?: Tag[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('Không thể tải thẻ');
      }

      const data = (await response.json()) as TagsResponse | Tag[];
      const nextTags = Array.isArray(data)
        ? data
        : Array.isArray(data?.tags)
          ? data.tags ?? []
          : [];

      setTags(nextTags);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thẻ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUpdate = async (values: TagFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
    };

    try {
      const response = selectedTag
        ? await fetch(`/api/tags/${selectedTag.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/tags', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          typeof errorPayload?.error === 'string'
            ? errorPayload.error
            : 'Không thể lưu thẻ';
        throw new Error(message);
      }

      const tag = (await response.json()) as Tag;

      setTags((prev) =>
        selectedTag
          ? prev.map((item) => (item.id === tag.id ? tag : item))
          : [tag, ...prev]
      );

      setSelectedTag(null);
      setDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu thẻ');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa thẻ này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          typeof errorPayload?.error === 'string'
            ? errorPayload.error
            : 'Không thể xóa thẻ';
        throw new Error(message);
      }

      setTags((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
    setError(err instanceof Error ? err.message : 'Không thể xóa thẻ');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thẻ</h1>
          <p className="text-muted-foreground">
            Quản lý thẻ bài viết và thông tin mô tả.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedTag(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm thẻ
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-32 text-right">Bài viết</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {tag.description ?? '—'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {tag._count?.posts ?? 0}
                </TableCell>
                <TableCell>
                  {format(new Date(tag.updatedAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTag(tag);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {tags.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm">
                  Chưa có thẻ nào. Hãy tạo thẻ đầu tiên để bắt đầu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTag ? 'Chỉnh sửa thẻ' : 'Tạo thẻ mới'}
            </DialogTitle>
          </DialogHeader>
          <TagForm
            initialData={
              selectedTag
                ? {
                    id: selectedTag.id,
                    name: selectedTag.name,
                    slug: selectedTag.slug,
                    description: selectedTag.description ?? undefined,
                  }
                : undefined
            }
            onSubmit={handleCreateUpdate}
            onCancel={() => {
              setSelectedTag(null);
              setDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
