'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ImagePlusIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaGrid } from '@/components/media/media-grid';
import type { MediaItem } from '@/components/media/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Editor = dynamic(() => import('@/components/editor'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
});

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CategoryListResponse {
  categories?: Category[];
}

interface TagListResponse {
  tags?: Tag[];
}

interface MediaListResponse {
  media?: MediaItem[];
}

interface PostResponse {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: PostStatus;
  Category: Category[];
  Tag: Tag[];
  Media?: {
    id: string;
    url: string;
    alt: string | null;
  } | null;
  SEO?: PostFormData['seo'];
}

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  categoryIds: string[];
  tagIds: string[];
  featuredImageId?: string;
  featuredImageUrl?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
}

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    categoryIds: [],
    tagIds: [],
  });

  const loadLookups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags'),
      ]);

      if (!categoriesRes.ok) throw new Error('Failed to load categories');
      if (!tagsRes.ok) throw new Error('Failed to load tags');

      const categoriesPayload = (await categoriesRes.json()) as CategoryListResponse;
      const tagsPayload = (await tagsRes.json()) as TagListResponse;

      setCategories(categoriesPayload.categories ?? []);
      setTags(tagsPayload.tags ?? []);

      if (postId) {
        const postRes = await fetch(`/api/posts/${postId}`);
        if (!postRes.ok) throw new Error('Failed to load post');
        const post = (await postRes.json()) as PostResponse;

        setFormData({
          title: post.title ?? '',
          slug: post.slug ?? '',
          content: post.content ?? '',
          excerpt: post.excerpt ?? '',
          status: post.status ?? 'DRAFT',
          categoryIds: post.Category?.map((category) => category.id) ?? [],
          tagIds: post.Tag?.map((tag) => tag.id) ?? [],
          featuredImageId: post.Media?.id ?? undefined,
          featuredImageUrl: post.Media?.url ?? undefined,
          seo: post.SEO,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          categoryIds:
            prev.categoryIds.length > 0
              ? prev.categoryIds
              : categoriesPayload.categories && categoriesPayload.categories.length > 0
              ? [categoriesPayload.categories[0].id]
              : [],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load editor data');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const loadMediaLibrary = useCallback(async () => {
    try {
      setMediaLoading(true);
      const response = await fetch('/api/media?limit=24');
      if (!response.ok) throw new Error('Failed to load media library');

      const data = (await response.json()) as MediaListResponse;
      setMediaItems(data.media ?? []);
      setMediaError(null);
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to load media library');
    } finally {
      setMediaLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    void loadMediaLibrary();
  }, [loadMediaLibrary]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const uniqueCategoryIds = Array.from(new Set(formData.categoryIds));
    const uniqueTagIds = Array.from(new Set(formData.tagIds));

    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      status: formData.status,
      categoryIds: uniqueCategoryIds,
      tagIds: uniqueTagIds,
      featuredImageId: formData.featuredImageId,
      seo: formData.seo,
    };

    try {
      const response = await fetch(`/api/posts${postId ? `/${postId}` : ''}`, {
        method: postId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save post');

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
      setSaving(false);
    }
  };

  const handleMediaSelect = (media: MediaItem) => {
    setFormData((prev) => ({
      ...prev,
      featuredImageId: media.id,
      featuredImageUrl: media.url,
    }));
    setShowMediaDialog(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMediaError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMediaError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setMediaError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const uploadedMedia = await response.json();
      
      setFormData((prev) => ({
        ...prev,
        featuredImageId: uploadedMedia.id,
        featuredImageUrl: uploadedMedia.url,
      }));

      await loadMediaLibrary();
      setShowMediaDialog(false);
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImageId: undefined,
      featuredImageUrl: undefined,
    }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setCreatingCategory(true);
      setError(null);
      
      // Generate slug from name
      const slug = newCategoryName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim(), slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific error message from API
        throw new Error(data.error || data.details || 'Failed to create category');
      }

      const newCategory = data;
      setCategories((prev) => [...prev, newCategory]);
      setFormData((prev) => ({ ...prev, categoryIds: [newCategory.id] }));
      setNewCategoryName('');
      
      // Show success message briefly
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      console.error('Create category error:', err);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setCreatingTag(true);
      setError(null);
      
      // Generate slug from name
      const slug = newTagName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
      
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific error message from API
        throw new Error(data.error || data.details || 'Failed to create tag');
      }

      const newTag = data;
      setTags((prev) => [...prev, newTag]);
      setFormData((prev) => ({ ...prev, tagIds: [...prev.tagIds, newTag.id] }));
      setNewTagName('');
      
      // Show success message briefly
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create tag';
      setError(errorMessage);
      console.error('Create tag error:', err);
    } finally {
      setCreatingTag(false);
    }
  };

  const handleTagSelect = (value: string) => {
    setFormData((prev) => {
      if (prev.tagIds.includes(value)) {
        return prev;
      }
      return {
        ...prev,
        tagIds: [...prev.tagIds, value],
      };
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {postId ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-muted-foreground">
            {postId ? 'Update your post content' : 'Create a new article for your travel and hospitality site.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => {
                  const titleValue = event.target.value;
                  return {
                    ...prev,
                    title: titleValue,
                    slug:
                      prev.slug && prev.slug.length > 0
                        ? prev.slug
                        : titleValue
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, ''),
                  };
                })
              }
              placeholder="Enter post title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, slug: event.target.value }))
              }
              placeholder="enter-post-slug"
            />
          </div>

          <div>
            <Label>Content</Label>
            <Editor
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, excerpt: event.target.value }))
              }
              placeholder="Short summary for listings and SEO"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: PostStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <div className="space-y-2">
              <Select
                value={formData.categoryIds[0] ?? ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryIds: [value] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                />
                <Button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  size="sm"
                >
                  {creatingCategory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="space-y-2">
              <Select
                value=""
                onValueChange={handleTagSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  placeholder="New tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                />
                <Button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={creatingTag || !newTagName.trim()}
                  size="sm"
                >
                  {creatingTag ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tagIds.map((tagId) => {
                const tag = tags.find((item) => item.id === tagId);
                if (!tag) return null;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        tagIds: prev.tagIds.filter((id) => id !== tagId),
                      }))
                    }
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-secondary/80"
                  >
                    {tag.name}
                    <X className="h-3 w-3" />
                  </button>
                );
              })}
              {formData.tagIds.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select tags relevant to the destination, hotel, or experience.
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Featured Image</Label>
            <div className="mt-2">
              {formData.featuredImageId && formData.featuredImageUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={formData.featuredImageUrl}
                    alt="Featured"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute right-3 top-3"
                    onClick={handleRemoveFeaturedImage}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      <ImagePlusIcon className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Choose Featured Image</DialogTitle>
                      <DialogDescription>
                        Upload a new image or select from your media library
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Upload Section */}
                      <div className="rounded-lg border border-dashed border-border p-6">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <ImagePlusIcon className="h-10 w-10 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">Upload New Image</p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={uploading}
                              asChild
                            >
                              <span>
                                {uploading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <ImagePlusIcon className="mr-2 h-4 w-4" />
                                    Select File
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or choose from library
                          </span>
                        </div>
                      </div>

                      {mediaError && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                          {mediaError}
                        </div>
                      )}
                      {mediaLoading ? (
                        <div className="flex h-48 items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : mediaItems.length > 0 ? (
                        <MediaGrid items={mediaItems} onSelect={handleMediaSelect} />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No media files available yet. Upload images in the media library first.
                        </p>
                      )}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={loadMediaLibrary}
                          disabled={mediaLoading}
                        >
                          Refresh Library
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>SEO Settings</Label>
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="SEO Title"
                  value={formData.seo?.title ?? ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, title: event.target.value },
                    }))
                  }
                />
                <Textarea
                  placeholder="SEO Description"
                  value={formData.seo?.description ?? ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, description: event.target.value },
                    }))
                  }
                  rows={3}
                />
                <Input
                  placeholder="Keywords (comma separated)"
                  value={formData.seo?.keywords ?? ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: event.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
