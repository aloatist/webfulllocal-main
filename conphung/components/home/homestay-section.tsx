'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Home, Leaf, Wifi, Coffee, Bed, Star } from 'lucide-react'
import HomestayCocoIsland from '@/components/HomestayCocoIsland'

export function HomestaySection() {
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-5 py-2 rounded-full mb-4">
              <Home className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Lưu Trú</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              LƯU TRÚ HOMESTAY SINH THÁI
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              COCO ISLAND CỒN PHỤNG
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              🌿 Nghỉ dưỡng giữa thiên nhiên - Trải nghiệm homestay xanh mát
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">Sinh Thái</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">Wifi Free</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">Ăn Sáng</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">Tiện Nghi</p>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">Chất Lượng</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="w-6 h-6" />
                <h4 className="font-bold text-lg">Không Gian Xanh</h4>
              </div>
              <p className="text-white/90 text-sm">Giữa rừng dừa, gần sông nước, thoáng mát</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-6 h-6" />
                <h4 className="font-bold text-lg">Phòng Hiện Đại</h4>
              </div>
              <p className="text-white/90 text-sm">Đầy đủ tiện nghi, sạch sẽ, thoải mái</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" />
                <h4 className="font-bold text-lg">Dịch Vụ Tốt</h4>
              </div>
              <p className="text-white/90 text-sm">Phục vụ tận tình, chu đáo 24/7</p>
            </div>
          </div>

          {/* Homestay Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-100 dark:border-orange-900/30">
            <HomestayCocoIsland />
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
              <Home className="w-5 h-5 text-orange-600" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                💡 Đặt phòng sớm để nhận giá tốt nhất và chọn phòng đẹp
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
