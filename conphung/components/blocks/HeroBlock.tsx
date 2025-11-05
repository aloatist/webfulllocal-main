'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';

interface HeroBlockProps {
  fields: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    phone?: string;
    address?: string;
    openingHours?: string;
  };
}

export function HeroBlock({ fields }: HeroBlockProps) {
  const {
    title,
    subtitle,
    description,
    backgroundImage = '/uploads/anhbiadulichconphung.webp',
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    phone,
    address,
    openingHours,
  } = fields;

  return (
    <FadeIn>
      <section className="relative min-h-[85vh] max-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {backgroundImage && (
            <Image
              src={backgroundImage}
              alt={title || 'Hero Banner'}
              fill
              priority
              quality={90}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {subtitle && (
            <div className="mb-4 text-lg md:text-xl font-medium text-emerald-300">
              {subtitle}
            </div>
          )}
          
          {title && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {title}
            </h1>
          )}
          
          {description && (
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
              {description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryCtaText && primaryCtaLink && (
              <Link
                href={primaryCtaLink}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {primaryCtaText}
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-full border-2 border-white/30 hover:border-white/50 transition-all"
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>

          {/* Info Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
            {phone && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                📞 {phone}
              </div>
            )}
            {openingHours && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                🕐 {openingHours}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

