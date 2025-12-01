import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Breadcrumb } from '@/components/schema/BreadcrumbSchema';
import { RelatedPosts } from '@/components/posts/related-posts';
import { SocialShare } from '@/components/posts/social-share';
import { calculateReadingTime, formatReadingTime } from '@/lib/posts/reading-time';

type EditorBlock = {
    id?: string;
    type: string;
    data: unknown;
};

function parseEditorContent(content: string | null): EditorBlock[] | null {
    if (!content) return null;
    try {
        const data = JSON.parse(content) as {
            blocks?: Array<{ id?: string; type: string; data: unknown }>;
        };
        if (data && Array.isArray(data.blocks)) {
            return data.blocks.map((block) => ({
                id: block.id,
                type: block.type,
                data: block.data,
            }));
        }
        return null;
    } catch {
        return null;
    }
}

function renderBlock(block: EditorBlock) {
    const key = block.id ?? Math.random().toString(36).slice(2);
    switch (block.type) {
        case 'header': {
            const headerData = block.data as { text?: string; level?: number };
            const level = Math.min(Math.max(Number(headerData?.level) || 2, 1), 6);
            const headingClass = 'font-semibold leading-tight';

            switch (level) {
                case 1:
                    return (
                        <h1
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
                case 2:
                    return (
                        <h2
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
                case 3:
                    return (
                        <h3
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
                case 4:
                    return (
                        <h4
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
                case 5:
                    return (
                        <h5
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
                case 6:
                default:
                    return (
                        <h6
                            key={key}
                            className={headingClass}
                            dangerouslySetInnerHTML={{ __html: headerData?.text ?? '' }}
                        />
                    );
            }
        }
        case 'paragraph':
            return (
                <p
                    key={key}
                    className="leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{
                        __html: (block.data as { text?: string })?.text ?? '',
                    }}
                />
            );
        case 'list': {
            const listData = block.data as {
                style?: 'ordered' | 'unordered';
                items?: unknown[];
            };
            const Tag = listData?.style === 'ordered' ? 'ol' : 'ul';
            const items = Array.isArray(listData?.items) ? listData?.items : [];
            return (
                <Tag key={key} className="ml-6 space-y-2">
                    {items.map((item, index) =>
                        typeof item === 'string' ? (
                            <li
                                key={`${key}-${index}`}
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ) : null,
                    )}
                </Tag>
            );
        }
        case 'checklist':
            return (
                <ul key={key} className="space-y-2">
                    {Array.isArray((block.data as { items?: unknown[] })?.items)
                        ? (
                            block.data as {
                                items?: { text?: string; checked?: boolean }[];
                            }
                        ).items?.map((item, index) => (
                            <li key={`${key}-${index}`} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-4 w-4 rounded border border-primary text-primary">
                                    {item?.checked ? '✓' : ''}
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{ __html: item?.text ?? '' }}
                                />
                            </li>
                        ))
                        : null}
                </ul>
            );
        case 'quote':
            const quoteData = block.data as { text?: string; caption?: string };
            return (
                <blockquote
                    key={key}
                    className="border-l-4 border-primary/40 bg-muted/40 px-4 py-3 italic"
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: quoteData?.text ?? '' }}
                    />
                    {quoteData?.caption && (
                        <cite className="mt-2 block text-sm text-muted-foreground">
                            — {quoteData.caption}
                        </cite>
                    )}
                </blockquote>
            );
        case 'code':
            return (
                <pre
                    key={key}
                    className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm text-foreground"
                >
                    <code>{(block.data as { code?: string })?.code ?? ''}</code>
                </pre>
            );
        case 'table':
            const tableData = block.data as { content?: unknown };
            const rows = Array.isArray(tableData?.content)
                ? (tableData.content as unknown[])
                : [];
            return (
                <div key={key} className="overflow-x-auto">
                    <table className="w-full border-collapse overflow-hidden rounded-lg border border-border text-sm">
                        <tbody>
                            {rows.map((row, rowIndex) => {
                                if (!Array.isArray(row)) return null;
                                return (
                                    <tr key={`${key}-row-${rowIndex}`} className="divide-x">
                                        {row.map((cell, cellIndex) =>
                                            typeof cell === 'string' ? (
                                                <td
                                                    key={`${key}-cell-${cellIndex}`}
                                                    className="border border-border px-4 py-2"
                                                    dangerouslySetInnerHTML={{ __html: cell }}
                                                />
                                            ) : (
                                                <td
                                                    key={`${key}-cell-${cellIndex}`}
                                                    className="border border-border px-4 py-2"
                                                />
                                            ),
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        case 'embed':
            const embedData = block.data as {
                embed?: string;
                source?: string;
                caption?: string;
            };
            return (
                <div key={key} className="my-6 aspect-video overflow-hidden rounded-lg">
                    <iframe
                        src={embedData?.embed ?? embedData?.source ?? ''}
                        title={embedData?.caption ?? 'Embedded content'}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                    />
                </div>
            );
        case 'image': {
            const imageData = block.data as {
                file?: { url?: string };
                url?: string;
                caption?: string;
            };
            const url = imageData?.file?.url ?? imageData?.url;
            const caption = imageData?.caption;
            return url ? (
                <figure key={key} className="space-y-2">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                        <Image
                            src={url}
                            alt={caption ?? 'Post image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 70vw"
                            loading="lazy"
                            quality={85}
                        />
                    </div>
                    {caption && (
                        <figcaption className="text-sm text-muted-foreground">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            ) : null;
        }
        default:
            return null;
    }
}

interface PostDetailProps {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        createdAt: Date;
        updatedAt: Date;
        Category: Array<{
            id: string;
            name: string;
            slug: string;
        }>;
        Tag: Array<{
            id: string;
            name: string;
        }>;
        Media: {
            url: string;
            alt: string | null;
        } | null;
        User: {
            name: string | null;
        } | null;
    };
    relatedPosts?: Array<{
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        createdAt: Date;
        Media: {
            url: string;
            alt: string | null;
        } | null;
    }>;
    categorySlug: string;
    showPreviewBanner?: boolean;
}

export function PostDetail({ post, relatedPosts = [], categorySlug, showPreviewBanner = false }: PostDetailProps) {
    const blocks = parseEditorContent(post.content);
    const readingTime = calculateReadingTime(post.content);

    const breadcrumbs = [
        { name: 'Trang chủ', url: 'https://conphungtourist.com' },
        { name: 'Bài viết', url: 'https://conphungtourist.com/posts' },
        { name: post.title, url: `https://conphungtourist.com/${categorySlug}/${post.slug}` }
    ];

    return (
        <article className="mx-auto w-full max-w-4xl px-6 py-12">
            <Breadcrumb items={breadcrumbs} />
            <div className="mb-6 text-sm text-muted-foreground">
                <Link href="/posts" className="hover:underline">
                    ← Quay lại danh sách bài viết
                </Link>
            </div>

            {showPreviewBanner && (
                <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    Đây là bản xem trước của bài viết chưa được xuất bản. Chỉ mình bạn (đã đăng nhập) mới xem được trang này.
                </div>
            )}

            <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{format(new Date(post.createdAt), 'dd/MM/yyyy')}</span>
                    {post.User?.name && (
                        <>
                            <span>•</span>
                            <span>{post.User.name}</span>
                        </>
                    )}
                    <span>•</span>
                    <span>{formatReadingTime(readingTime)}</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-foreground">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {post.Category.map((category) => (
                            <span
                                key={category.id}
                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                    <SocialShare
                        title={post.title}
                        url={`/${categorySlug}/${post.slug}`}
                        description={post.excerpt || undefined}
                    />
                </div>
            </header>

            {post.Media?.url && (
                <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-xl">
                    <Image
                        src={post.Media.url}
                        alt={post.Media.alt ?? post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 80vw"
                    />
                </div>
            )}

            <section className="prose prose-neutral max-w-none space-y-6 dark:prose-invert">
                {blocks ? (
                    blocks.map(renderBlock)
                ) : (
                    <p className="text-muted-foreground">
                        Nội dung đang được cập nhật.
                    </p>
                )}
            </section>

            <div className="mt-10 space-y-6 border-t border-border pt-6">
                {post.Tag.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.Tag.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <SocialShare
                    title={post.title}
                    url={`/${categorySlug}/${post.slug}`}
                    description={post.excerpt || undefined}
                />
            </div>

            <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
        </article>
    );
}
