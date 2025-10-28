'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Camera, Leaf, Trees } from 'lucide-react'
import CarouselSlider from '@/components/CarouselSlider'

export function GallerySection() {
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-5 py-2 rounded-full mb-4">
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Thư Viện Ảnh</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
              MỘT SỐ HÌNH ẢNH
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              🌿 Khám phá vẻ đẹp thiên nhiên sinh thái tại Cồn Phụng
            </p>
          </div>

          {/* Eco Tourism Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Trees className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Du lịch sinh thái</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Không gian sinh thái</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Kiến Trúc Dừa</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Độc đáo miền Tây</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Văn Hóa Địa Phương</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Trải nghiệm đích thực</p>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
            <CarouselSlider />
          </div>

          {/* Bottom Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 italic">
              ✨ Hơn 1000+ hình ảnh đẹp về thiên nhiên, văn hóa và con người Cồn Phụng
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
