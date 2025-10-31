'use client'

import * as LucideIcons from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import type { FeaturesSection as FeaturesData } from '@/lib/homepage/schema'

interface FeaturesSectionProps {
  data: FeaturesData;
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  if (!data || !data.features || data.features.length === 0) return null;

  return (
    <FadeIn delay={0.2}>
      <div className="py-12">
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.features.map((feature, index) => {
            // Get icon component from lucide-react
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Star;
            
            return (
            <StaggerItem key={index}>
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color}`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-600 group-hover:to-green-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative Element */}
                <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
              </div>
            </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </FadeIn>
  )
}
