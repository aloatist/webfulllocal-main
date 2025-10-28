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
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      featuredImage: {
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
        <p className="mt-2 text-muted-foreground">
          Tin tức, câu chuyện và kinh nghiệm du lịch tại Cồn Phụng.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-10 text-center text-muted-foreground">
          Hiện chưa có bài viết. Vui lòng quay lại sau.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition hover:shadow-md"
            >
              {post.featuredImage?.url ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt ?? post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-muted text-muted-foreground">
                  Không có ảnh đại diện
                </div>
              )}

              <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                  </span>
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold leading-tight text-foreground">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-2">
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
      )}
    </div>
  );
}
