'use client'

import * as LucideIcons from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import type { FeaturesSection as FeaturesData } from '@/lib/homepage/schema'

interface FeaturesSectionProps {
  data?: FeaturesData;
}

const defaultData: FeaturesData = {
  features: [
    {
      icon: "Heart",
      title: "TẬN TÂM VỚI KHÁCH HÀNG",
      description: "Chúng tôi luôn tâm niệm phải tận tâm chăm sóc khách hàng từ những việc nhỏ nhất",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: "DollarSign",
      title: "ĐẢM BẢO MỨC GIÁ TỐT NHẤT",
      description: "Giá tour dịch vụ cung cấp đến quý khách luôn là mức giá ưu đãi hấp dẫn nhất",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: "Headphones",
      title: "HỖ TRỢ KHÁCH HÀNG 24/7",
      description: "Chúng tôi luôn sẵn sàng phục vụ quý khách trước, trong và sau chuyến đi",
      color: "from-blue-500 to-cyan-500"
    }
  ]
};

export function FeaturesSection({ data = defaultData }: FeaturesSectionProps) {
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
