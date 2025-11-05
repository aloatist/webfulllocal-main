'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';
import { Phone } from 'lucide-react';

interface FooterCTABlockProps {
  fields: {
    heading?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export function FooterCTABlock({ fields }: FooterCTABlockProps) {
  const { heading, description, ctaText, ctaLink } = fields;

  if (!heading && !ctaText) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {heading}
            </h2>
          )}
          
          {description && (
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-full transition-all"
            >
              <Phone className="w-5 h-5" />
              {ctaText}
            </Link>
          )}
        </div>
      </section>
    </FadeIn>
  );
}

