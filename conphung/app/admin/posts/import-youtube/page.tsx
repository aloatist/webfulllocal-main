'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportResult {
  success: boolean;
  videoUrl: string;
  videoId?: string;
  postId?: string;
  slug?: string;
  error?: string;
}

interface ImportResponse {
  success: boolean;
  message: string;
  results: ImportResult[];
  summary: {
    total: number;
    success: number;
    failed: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ImportYouTubePage() {
  const router = useRouter();
  const [urls, setUrls] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [seoDescription, setSeoDescription] = useState<string>('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('/api/categories?limit=1000');
      if (!response.ok) {
        throw new Error('Không thể tải danh mục');
      }
      const data = await response.json();
      const categoriesList = Array.isArray(data) ? data : (data.categories || []);
      setCategories(categoriesList);
      
      // Tự động chọn category "Video YouTube" nếu có
      const videoCategory = categoriesList.find(
        (cat: Category) => cat.slug === 'video-youtube' || cat.name === 'Video YouTube'
      );
      if (videoCategory) {
        setSelectedCategoryId(videoCategory.id);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Không thể tải danh sách danh mục');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImport = async () => {
    // Parse URLs from textarea (one per line)
    const urlList = urls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urlList.length === 0) {
      setError('Vui lòng nhập ít nhất một URL YouTube');
      return;
    }

    if (!selectedCategoryId) {
      setError('Vui lòng chọn danh mục cho các bài viết');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/posts/import-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: urlList,
          categoryId: selectedCategoryId,
          featuredImageUrl: featuredImageUrl.trim() || undefined,
          seo: {
            title: seoTitle.trim() || undefined,
            description: seoDescription.trim() || undefined,
            keywords: seoKeywords.trim() || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to import videos';
        console.error('Import error:', {
          status: response.status,
          error: errorMessage,
          details: data,
        });
        throw new Error(errorMessage);
      }

      setResult(data);
    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Video YouTube</h1>
        <p className="text-muted-foreground">
          Nhập danh sách URL YouTube để tự động tạo bài viết. Mỗi URL một dòng.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách URL YouTube</CardTitle>
          <CardDescription>
            Dán các link YouTube vào đây, mỗi link một dòng. Ví dụ:
            <br />
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              https://www.youtube.com/watch?v=VIDEO_ID
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              disabled={loading || loadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cho các bài viết" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Chọn danh mục để gán cho tất cả các bài viết được import
            </p>
          </div>

          <div>
            <Label htmlFor="featuredImage">Ảnh nổi bật (URL)</Label>
            <Input
              id="featuredImage"
              type="url"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg (để trống sẽ dùng thumbnail từ YouTube)"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              URL ảnh nổi bật. Nếu để trống, hệ thống sẽ tự động sử dụng thumbnail từ YouTube video.
            </p>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Thiết lập SEO</h3>
            
            <div>
              <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Tiêu đề SEO (để trống sẽ dùng title từ YouTube)"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tiêu đề SEO cho tất cả các bài viết. Nếu để trống, sẽ dùng title từ YouTube.
              </p>
            </div>

            <div>
              <Label htmlFor="seoDescription">Mô tả SEO</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Mô tả SEO (để trống sẽ dùng description từ YouTube)"
                rows={3}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mô tả SEO cho tất cả các bài viết. Nếu để trống, sẽ dùng description từ YouTube.
              </p>
            </div>

            <div>
              <Label htmlFor="seoKeywords">Tag SEO (phân cách bằng dấu phẩy)</Label>
              <Input
                id="seoKeywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="tag1, tag2, tag3"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Các tag SEO, phân cách bằng dấu phẩy. Áp dụng cho tất cả các bài viết.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="urls">URLs (mỗi URL một dòng)</Label>
            <Textarea
              id="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID_1&#10;https://www.youtube.com/watch?v=VIDEO_ID_2&#10;https://youtu.be/VIDEO_ID_3"
              rows={10}
              className="font-mono text-sm"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Hỗ trợ các định dạng: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={loading || !urls.trim() || !selectedCategoryId || loadingCategories}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                'Import Videos'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/posts')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Kết quả Import</CardTitle>
            <CardDescription>
              {result.summary.success} thành công, {result.summary.failed} thất bại
              trong tổng số {result.summary.total} video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.results.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  {item.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {item.videoUrl}
                      </a>
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>
                    {item.success && item.slug && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Bài viết:
                        </span>
                        <a
                          href={`/admin/posts/${item.postId}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {item.slug}
                        </a>
                      </div>
                    )}
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {result.summary.success > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={() => router.push('/admin/posts')}
                  variant="default"
                >
                  Xem danh sách bài viết
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

