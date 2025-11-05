'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';

interface AboutBlockProps {
  fields: {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export function AboutBlock({ fields }: AboutBlockProps) {
  const { title, subtitle, content, image, ctaText, ctaLink } = fields;

  if (!title && !content) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            {image && (
              <div className="order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={image}
                    alt={title || 'About'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="order-1 lg:order-2">
              {subtitle && (
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {subtitle}
                  </span>
                </div>
              )}
              
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              
              {content && (
                <div
                  className="prose prose-lg dark:prose-invert mb-6"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {ctaText && ctaLink && (
                <Link
                  href={ctaLink}
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-all"
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

