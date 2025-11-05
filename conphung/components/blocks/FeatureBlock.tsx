'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in';
import * as LucideIcons from 'lucide-react';

interface FeatureBlockProps {
  fields: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    features?: Array<{
      icon?: string;
      title?: string;
      description?: string;
    }>;
  };
}

export function FeatureBlock({ fields }: FeatureBlockProps) {
  const { eyebrow, heading, description, features = [] } = fields;

  if (features.length === 0) {
    return null;
  }

  return (
    <FadeIn delay={0.2}>
      <section className="py-20 md:py-28 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {(eyebrow || heading || description) && (
            <div className="text-center mb-12">
              {eyebrow && (
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {eyebrow}
                  </span>
                </div>
              )}
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
            {features.map((feature, index) => {
              // Try to get icon from lucide-react, fallback to emoji or default
              const IconComponent = feature.icon
                ? ((LucideIcons as any)[feature.icon] || null)
                : null;

              return (
                <StaggerItem key={index}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                    {/* Icon */}
                    {IconComponent ? (
                      <div className="relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    ) : feature.icon ? (
                      <div className="relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-2xl">
                        {feature.icon}
                      </div>
                    ) : null}

                    {/* Content */}
                    <div className="relative">
                      {feature.title && (
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                      )}
                      {feature.description && (
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </FadeIn>
  );
}

