import { Suspense } from 'react';
import { SearchPageContent } from './search-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm | Cồn Phụng',
  description: 'Tìm kiếm tour, homestay và bài viết tại Cồn Phụng',
};

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Tìm kiếm</h1>
        <p className="mt-2 text-muted-foreground">
          Tìm kiếm tour, homestay và bài viết tại Cồn Phụng
        </p>
      </header>

      <Suspense fallback={<SearchLoadingSkeleton />}>
        <SearchPageContent query={query} />
      </Suspense>
    </div>
  );
}

function SearchLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

