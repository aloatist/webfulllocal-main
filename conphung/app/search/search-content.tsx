'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2, MapPin, Home, FileText, Calendar, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  type: 'tour' | 'homestay' | 'post';
  url: string;
  excerpt?: string;
  price?: number;
  location?: string;
  meta?: Record<string, any>;
}

export function SearchPageContent({ query: initialQuery }: { query: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>(searchParams?.get('type') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams?.get('maxPrice') || '');
  const [cityFilter, setCityFilter] = useState<string>(searchParams?.get('city') || '');

  useEffect(() => {
    if (!searchParams) return;
    
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';
    const city = searchParams.get('city') || '';
    
    setQuery(q);
    setTypeFilter(type);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setCityFilter(city);
    
    if (q.trim()) {
      setHasSearched(true);
      void performSearch(q, type, minP, maxP, city);
    }
  }, [searchParams]);

  const performSearch = async (
    searchQuery: string,
    type?: string,
    minPriceParam?: string,
    maxPriceParam?: string,
    cityParam?: string
  ) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
      });
      
      if (type) params.append('type', type);
      if (minPriceParam) params.append('minPrice', minPriceParam);
      if (maxPriceParam) params.append('maxPrice', maxPriceParam);
      if (cityParam) params.append('city', cityParam);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      updateUrlAndSearch();
    }
  };

  const updateUrlAndSearch = () => {
    const params = new URLSearchParams({
      q: query.trim(),
    });
    
    if (typeFilter) params.append('type', typeFilter);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (cityFilter) params.append('city', cityFilter);
    
    router.push(`/search?${params.toString()}`);
    void performSearch(query.trim(), typeFilter, minPrice, maxPrice, cityFilter);
  };

  const clearFilters = () => {
    setTypeFilter('');
    setMinPrice('');
    setMaxPrice('');
    setCityFilter('');
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    void performSearch(query.trim());
  };

  const hasActiveFilters = typeFilter || minPrice || maxPrice || cityFilter;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return <Calendar className="w-4 h-4" />;
      case 'homestay':
        return <Home className="w-4 h-4" />;
      case 'post':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tour':
        return 'Tour';
      case 'homestay':
        return 'Homestay';
      case 'post':
        return 'Bài viết';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'tour':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'homestay':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'post':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tour, homestay, bài viết..."
            className="h-12 pl-12 pr-32 text-lg"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Bộ lọc
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {[typeFilter, minPrice, maxPrice, cityFilter].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            <Button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="h-8"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Tìm kiếm'
              )}
            </Button>
          </div>
        </div>
        {query.trim().length > 0 && query.trim().length < 2 && (
          <p className="text-sm text-muted-foreground">
            Vui lòng nhập ít nhất 2 ký tự
          </p>
        )}
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Bộ lọc:</span>
            {typeFilter && (
              <Badge variant="secondary" className="gap-1">
                Loại: {typeFilter === 'tour' ? 'Tour' : typeFilter === 'homestay' ? 'Homestay' : 'Bài viết'}
                <button
                  onClick={() => {
                    setTypeFilter('');
                    updateUrlAndSearch();
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {minPrice && (
              <Badge variant="secondary" className="gap-1">
                Từ: {Number(minPrice).toLocaleString('vi-VN')} VNĐ
                <button
                  onClick={() => {
                    setMinPrice('');
                    updateUrlAndSearch();
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="secondary" className="gap-1">
                Đến: {Number(maxPrice).toLocaleString('vi-VN')} VNĐ
                <button
                  onClick={() => {
                    setMaxPrice('');
                    updateUrlAndSearch();
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {cityFilter && (
              <Badge variant="secondary" className="gap-1">
                Thành phố: {cityFilter}
                <button
                  onClick={() => {
                    setCityFilter('');
                    updateUrlAndSearch();
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Xóa tất cả
            </Button>
          </div>
        )}
        
        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loại</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="post">Bài viết</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giá tối thiểu (VNĐ)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giá tối đa (VNĐ)</label>
                  <Input
                    type="number"
                    placeholder="Không giới hạn"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thành phố</label>
                  <Input
                    type="text"
                    placeholder="Ví dụ: Vĩnh Long"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
                <Button type="button" onClick={updateUrlAndSearch}>
                  Áp dụng
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
          <p className="text-muted-foreground">
            Không có kết quả nào phù hợp với từ khóa &quot;{query}&quot;
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([type, typeResults]) => (
            <div key={type}>
              <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                {getTypeIcon(type)}
                {getTypeLabel(type)} ({typeResults.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {typeResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {result.type !== 'post' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeBadgeColor(result.type)}`}
                        >
                          {getTypeIcon(result.type)}
                          {getTypeLabel(result.type)}
                        </span>
                        {result.price && (
                          <span className="text-sm font-semibold text-primary">
                            {formatPrice(result.price)}
                          </span>
                        )}
                      </div>
                      <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary transition">
                        {result.title}
                      </h3>
                      {result.excerpt && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {result.excerpt}
                        </p>
                      )}
                      {result.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{result.location}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Bắt đầu tìm kiếm</h3>
          <p className="text-muted-foreground">
            Nhập từ khóa vào ô tìm kiếm để tìm tour, homestay hoặc bài viết
          </p>
        </div>
      )}
    </div>
  );
}

