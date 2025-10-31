'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/fade-in'
import { Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import type { HeroSection as HeroData } from '@/lib/homepage/schema'

interface HeroSectionProps {
  data?: HeroData;
}

const defaultData: HeroData = {
  mainTitle: "KHU DU LỊCH SINH THÁI CỒN PHỤNG BẾN TRE",
  subtitle: "Công Trình Kiến Trúc Đạo Dừa",
  description: "🌿 Du lịch sinh thái - Trải nghiệm thiên nhiên và văn hóa miền Tây. Đặt tour chính chủ để nhận ưu đãi tốt nhất!",
  phone: "+84918267715",
  address: "Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long",
  openingHours: "7:00 - 18:00",
  backgroundImage: "/uploads/anhbiadulichconphung.webp",
  primaryCta: {
    text: "☎️ Đặt Tour Ngay",
    link: "tel:+84918267715"
  },
  secondaryCta: {
    text: "Xem Tour",
    link: "/tours"
  }
};

export function HeroSection({ data = defaultData }: HeroSectionProps) {
  return (
    <FadeIn>
      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl mb-12">
        {/* Background Image */}
        <Image
          src={data.backgroundImage}
          alt={data.mainTitle}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
          <div className="mx-auto max-w-5xl w-full">
            {/* Main Title - Smaller on mobile, better positioned */}
            <FadeIn delay={0.2}>
              <h1 className="text-xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-2xl">
                {data.mainTitle}
                <span className="block text-lg sm:text-4xl md:text-5xl mt-1 sm:mt-2 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent drop-shadow-lg">
                  {data.subtitle}
                </span>
              </h1>
            </FadeIn>
            
            {/* Description */}
            <FadeIn delay={0.4}>
              <p className="text-sm sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
                {data.description}
              </p>
            </FadeIn>
            
            {/* Quick Info Cards */}
            <FadeIn delay={0.6}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Hotline</p>
                    <a
                      href={`tel:${data.phone}`}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-500/20 px-4 py-1 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:scale-105"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Địa điểm</p>
                    <p className="text-white font-semibold text-sm">{data.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Giờ mở cửa</p>
                    <p className="text-white font-semibold text-sm">{data.openingHours}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* CTA Buttons - Brighter, more prominent */}
            <FadeIn delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-2xl hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300 border-2 border-yellow-300/50"
                  asChild
                >
                  <Link href={data.primaryCta.link}>
                    <Phone className="w-5 h-5 mr-2" />
                    {data.primaryCta.text}
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 font-semibold shadow-xl"
                  asChild
                >
                  <Link href={data.secondaryCta.link}>
                    {data.secondaryCta.text}
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </FadeIn>
  )
}
