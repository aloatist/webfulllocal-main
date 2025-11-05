'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';
import { Phone, Sparkles } from 'lucide-react';

interface CTABlockProps {
  fields: {
    heading?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
    phone?: string;
  };
}

export function CTABlock({ fields }: CTABlockProps) {
  const { heading, description, ctaText, ctaLink, backgroundImage, phone } = fields;

  if (!heading && !ctaText) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        {backgroundImage ? (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={heading || 'CTA Banner'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 via-red-500/90 to-pink-500/90" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {heading && (
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {heading}
            </h2>
          )}
          
          {description && (
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              {description}
            </p>
          )}

          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 mb-4"
            >
              <Sparkles className="w-5 h-5" />
              {ctaText}
            </Link>
          )}

          {phone && (
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Phone className="w-5 h-5" />
              <span className="text-lg font-semibold">{phone}</span>
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}

