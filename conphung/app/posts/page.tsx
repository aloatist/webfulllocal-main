import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bài viết',
  description: 'Khám phá những bài viết mới nhất từ Cồn Phụng.',
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      Category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      Media: {
        select: {
          url: true,
          alt: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Bài viết</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Tin tức, câu chuyện và kinh nghiệm du lịch tại Cồn Phụng.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-gray-50 dark:bg-gray-800/30 p-10 text-center text-gray-600 dark:text-gray-400">
          Hiện chưa có bài viết. Vui lòng quay lại sau.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition hover:shadow-md"
            >
              {post.Media?.url ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.Media.url}
                    alt={post.Media.alt ?? post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Không có ảnh đại diện
                </div>
              )}

              <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                  </span>
                  {post.Category.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="line-clamp-3 text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold underline decoration-2 underline-offset-4 hover:decoration-emerald-600/60 transition-all no-underline"
                  >
                    Đọc bài viết
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
