'use client'

import Image from 'next/image'
import { FadeIn } from '@/components/ui/fade-in'
import { Sparkles } from 'lucide-react'
import type { PromotionSection as PromotionData } from '@/lib/homepage/schema'

interface PromotionSectionProps {
  data?: PromotionData;
}

const defaultData: PromotionData = {
  eyebrow: "Ưu đãi đặc biệt",
  heading: "🎉 GIẢM GIÁ 30% CHO TẤT CẢ CÁC GÓI TOUR",
  description: "Đặt tour trước 7 ngày để nhận ưu đãi tốt nhất. Áp dụng cho nhóm từ 10 người. Số lượng có hạn!",
  imageUrl: "/uploads/combo-3-con-phung-768x768.webp",
  discount: "30%",
  isActive: true
};

export function PromotionSection({ data = defaultData }: PromotionSectionProps) {
  if (!data || !data.isActive) return null;

  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-lime-600 p-8 md:p-12 shadow-2xl mb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">{data.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {data.heading}
            </h2>
            <p className="text-white/90 text-lg">
              {data.description}
            </p>
            {data.discount && (
              <div className="mt-4 inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-xl">
                Giảm {data.discount}
              </div>
            )}
          </div>
          
          {/* Promotion Image */}
          {data.imageUrl && (
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 group">
                <Image
                  src={data.imageUrl}
                  alt={data.heading}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </FadeIn>
  )
}
