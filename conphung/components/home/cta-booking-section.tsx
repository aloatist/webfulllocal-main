'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Phone, Gift, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTABookingSection() {
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 md:p-12 shadow-2xl mb-12">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '40px 40px',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border-2 border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-white font-bold text-sm">ƯU ĐÃI ĐẶC BIỆT</span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-2xl">
            🎉 Nhanh Tay Đặt Chỗ – Số Lượng Có Hạn
          </h2>
          
          <p className="text-lg md:text-xl text-white/95 text-center mb-8 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Đặt chỗ ngay hôm nay để nhận <span className="font-bold text-yellow-300">ưu đãi giá cực tốt</span> cùng các phần quà và dịch vụ VIP. 
            Đừng bỏ lỡ cơ hội trải nghiệm <span className="font-bold text-yellow-300">du lịch sinh thái</span> tại Cồn Phụng Bến Tre!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border-2 border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-white text-lg">Quà Tặng VIP</h3>
              </div>
              <p className="text-white/90 text-sm">Nhận quà tặng đặc biệt khi đặt tour ngay hôm nay</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border-2 border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-900" />
                </div>
                <h3 className="font-bold text-white text-lg">Đặt Nhanh</h3>
              </div>
              <p className="text-white/90 text-sm">Xác nhận ngay trong 5 phút, không chờ đợi</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border-2 border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-900" />
                </div>
                <h3 className="font-bold text-white text-lg">Hỗ Trợ 24/7</h3>
              </div>
              <p className="text-white/90 text-sm">Tư vấn miễn phí mọi lúc, mọi nơi</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              href="tel:+84918267715"
              className="group relative inline-flex overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-yellow-400 via-white to-yellow-400" />
              
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 px-10 py-5 text-xl font-bold text-gray-900 backdrop-blur-3xl transition-all duration-300 group-hover:scale-105 shadow-2xl">
                <Phone className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                ☎️ ĐẶT TOUR NGAY -
                <span className="ml-2 inline-flex items-center justify-center rounded-full border border-white/70 bg-white/20 px-3 py-1 text-2xl font-extrabold tracking-wide text-white shadow-lg transition-all duration-300 group-hover:bg-white/30 group-hover:text-yellow-900 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.45)]">
                  0918 267 715
                </span>
                <Sparkles className="ml-3 h-6 w-6 animate-pulse" />
              </span>
            </Link>

            <p className="mt-4 text-white/80 text-sm">
              ⏰ Ưu đãi có hạn - Chỉ áp dụng trong tháng này!
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
