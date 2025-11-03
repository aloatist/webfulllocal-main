import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  Media?: {
    url: string;
    alt: string | null;
  } | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentPostId: string;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  const filteredPosts = posts.filter((p) => p.id !== currentPostId).slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="mb-6 text-2xl font-semibold">Bài viết liên quan</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <Card className="group h-full transition hover:shadow-md">
              <CardContent className="p-0">
                {post.Media?.url ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                    <Image
                      src={post.Media.url}
                      alt={post.Media.alt ?? post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center rounded-t-lg bg-muted text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                  </div>
                  <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

