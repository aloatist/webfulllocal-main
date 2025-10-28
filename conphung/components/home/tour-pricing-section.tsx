'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Ship, Leaf, MapPin, Star } from 'lucide-react'
import Tourconphungthoison from '@/components/Tourconphungthoison'

export function TourPricingSection() {
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-5 py-2 rounded-full mb-4">
              <Ship className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Tour Du Lịch</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
              BẢNG GIÁ VÉ TOUR
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              🌿 Tour khám phá sinh thái miền Tây - Trải nghiệm đích thực
            </p>
          </div>

          {/* Tour Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Ship className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-center">Du Thuyền</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Tham quan sông nước</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-center">Sinh Thái</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Du lịch sinh thái mát</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-center">2 Cồn</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Thới Sơn & Phụng</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-center">Đặc Sản</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Ẩm thực miền Tây</p>
            </div>
          </div>

          {/* Tour Title */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
                <Ship className="w-8 h-8" />
                TOUR KHÁM PHÁ TRONG NGÀY
                <Leaf className="w-8 h-8" />
              </h3>
              <p className="text-white/90 text-center mt-2 text-lg">
                Cồn Thới Sơn - Cồn Phụng
              </p>
            </div>
          </div>

          {/* Tour Pricing Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-100 dark:border-blue-900/30">
            <Tourconphungthoison />
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
              <Ship className="w-5 h-5 text-blue-600" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                💡 Bao gồm: Xe đưa đón + Du thuyền + Ăn trưa + Hướng dẫn viên
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
