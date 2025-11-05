'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/fade-in';
interface TourListBlockProps {
  fields: {
    heading?: string;
    description?: string;
    source?: 'api' | 'manual';
    tourIds?: string[];
    limit?: number;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface Tour {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
  price?: number | null;
}

export function TourListBlock({ fields }: TourListBlockProps) {
  const {
    heading,
    description,
    source = 'api',
    tourIds = [],
    limit = 6,
    ctaText,
    ctaLink,
  } = fields;

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true);
        
        if (source === 'manual' && tourIds.length > 0) {
          // Load specific tours by IDs
          const response = await fetch(`/api/public/tours?ids=${tourIds.join(',')}`);
          if (response.ok) {
            const data = await response.json();
            setTours(data.tours || []);
          }
        } else {
          // Load from API (top tours)
          const response = await fetch(`/api/public/tours?limit=${limit}`);
          if (response.ok) {
            const data = await response.json();
            setTours(data.tours || []);
          }
        }
      } catch (error) {
        console.error('Error loading tours:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, [source, tourIds, limit]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Đang tải tours...</p>
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {(heading || description) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.slice(0, limit).map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {tour.thumbnail && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={tour.thumbnail}
                      alt={tour.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {tour.name}
                  </h3>
                  {tour.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {tour.description}
                    </p>
                  )}
                  {tour.price && (
                    <p className="text-2xl font-bold text-emerald-600">
                      {tour.price.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {ctaText && ctaLink && (
            <div className="text-center mt-8">
              <Link
                href={ctaLink}
                className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all"
              >
                {ctaText}
              </Link>
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}

