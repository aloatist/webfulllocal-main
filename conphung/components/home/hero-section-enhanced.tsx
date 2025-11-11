'use client'

import { Button } from '@/components/ui/button'
import { Phone, Star, Check, ChevronDown, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/ui/fade-in'

interface HeroData {
  mainTitle?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  phone?: string
  address?: string
  openingHours?: string
  primaryCta?: {
    text: string
    link: string
  }
  secondaryCta?: {
    text: string
    link: string
  }
}

interface HeroSectionProps {
  data?: HeroData
}

const defaultData: HeroData = {
  mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: '🌿 Du lịch sinh thái - Trải nghiệm thiên nhiên và văn hóa miền Tây. Đặt tour chính chủ để nhận ưu đãi tốt nhất!',
  backgroundImage: '/uploads/anhbiadulichconphung.webp',
  phone: '+84918267715',
  address: 'Tờ bản đồ số 3, thửa đất số 32, ấp 10 (ấp Tân Vinh), xã Phú Túc, tỉnh Vĩnh Long',
  openingHours: '7:00 - 18:00',
  primaryCta: {
    text: '☎️ Đặt Tour Ngay',
    link: 'tel:+84918267715',
  },
  secondaryCta: {
    text: 'Xem Bảng Giá',
    link: '#pricing',
  },
}

export function HeroSectionEnhanced({ data = defaultData }: HeroSectionProps) {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage || defaultData.backgroundImage!}
          alt={data.mainTitle || defaultData.mainTitle!}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay - Enhanced for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        {/* Animated Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-blue-900/30 animate-pulse" 
             style={{ animationDuration: '8s' }} 
        />
      </div>

      {/* Content - Centered & Prominent */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Trust Badge */}
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20 shadow-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8/5 ⭐ Hơn 2,000 khách hàng hài lòng</span>
              </div>
            </FadeIn>

            {/* Main Title */}
            <FadeIn delay={0.3}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Khám Phá Thiên Nhiên
                <br />
                <span className="text-emerald-400 drop-shadow-lg">
                  Miền Tây Sông Nước
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-medium max-w-3xl mx-auto drop-shadow-md">
                {data.subtitle || defaultData.subtitle}
              </p>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.5}>
              <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
                Trải nghiệm du lịch sinh thái độc đáo tại Cồn Phụng - 
                Công trình kiến trúc Đạo Dừa nổi tiếng
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 active:scale-95"
                >
                  <Link href={data.primaryCta?.link || defaultData.primaryCta!.link}>
                    <Phone className="mr-2 h-5 w-5" />
                    Đặt Tour Ngay - {data.phone?.replace('+84', '0') || '0918267715'}
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Link href={data.secondaryCta?.link || defaultData.secondaryCta!.link}>
                    Xem Bảng Giá
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* USPs - Quick Highlights */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Giá tốt nhất</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Miễn phí hủy</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Hỗ trợ 24/7</span>
                </div>
              </div>
            </FadeIn>

            {/* Quick Info Bar */}
            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4 text-white/80 text-sm">
                {data.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="hidden md:inline">{data.address.split(',')[0]}</span>
                    <span className="md:hidden">Vĩnh Long</span>
                  </div>
                )}
                {data.openingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Mở cửa: {data.openingHours}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium">Khám phá thêm</span>
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="currentColor"
            className="text-white dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  )
}


