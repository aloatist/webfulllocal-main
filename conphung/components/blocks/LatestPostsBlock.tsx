import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

type LatestPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  Media: {
    url: string;
    alt: string | null;
  } | null;
};

interface LatestPostsSectionProps {
  posts: LatestPost[];
  config?: {
    heading?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    postCount?: number;
  };
}

export function LatestPostsSection({ posts, config }: LatestPostsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-6 md:px-8 py-12 md:py-16 shadow-xl border border-emerald-100 dark:border-gray-700">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2 rounded-full mb-6">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">📰 Tin Tức & Blog</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
          {config?.heading || 'Bài Viết Mới Nhất'}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {config?.description || 'Những câu chuyện và mẹo hữu ích dành cho hành trình khám phá Cồn Phụng.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              {post.Media?.url ? (
                <>
                  <Image
                    src={post.Media.url}
                    alt={post.Media.alt ?? post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Không có ảnh
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-3 p-5">
              <div className="text-xs uppercase tracking-wide text-primary/80">
                {format(new Date(post.createdAt), 'dd/MM/yyyy')}
              </div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <div className="pt-1">
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Đọc bài viết
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={config?.ctaLink || '/posts'}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {config?.ctaText || 'Xem Tất Cả Bài Viết'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}


