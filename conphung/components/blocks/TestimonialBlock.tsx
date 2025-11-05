'use client';

import { Star, Quote } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialBlockProps {
  fields: {
    heading?: string;
    description?: string;
    testimonials?: Array<{
      name?: string;
      avatar?: string;
      rating?: number;
      content?: string;
      date?: string;
      tourType?: string;
    }>;
  };
}

export function TestimonialBlock({ fields }: TestimonialBlockProps) {
  const { heading, description, testimonials = [] } = fields;

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800">
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

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <Quote className="w-8 h-8 text-emerald-500 mb-4" />
                  
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {testimonial.content && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {testimonial.name && (
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                      )}
                      {testimonial.tourType && (
                        <p className="text-sm text-gray-500">{testimonial.tourType}</p>
                      )}
                      {testimonial.date && (
                        <p className="text-xs text-gray-400">{testimonial.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </FadeIn>
  );
}

