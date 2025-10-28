'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Ticket, Leaf, Users, Clock } from 'lucide-react'
import Vethamquanconphung from '@/components/Vethamquanconphung'

export function TicketSection() {
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-5 py-2 rounded-full mb-4">
              <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Vé Tham Quan</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
              VÉ THAM QUAN KHU DU LỊCH SINH THÁI
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              CỒN PHỤNG BẾN TRE
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              🌿 Trải nghiệm thiên nhiên xanh mát - Giá vé ưu đãi cho mọi lứa tuổi
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Sinh Thái Xanh</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Không gian thiên nhiên</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Gia Đình & Nhóm</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Giá ưu đãi nhóm</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Mở Cửa Cả Ngày</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">7:00 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Ticket Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/30">
            <Vethamquanconphung />
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                💡 Mẹo: Đặt vé trước để nhận ưu đãi tốt nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
