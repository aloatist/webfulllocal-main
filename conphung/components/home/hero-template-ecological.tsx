'use client';

import { Button } from '@/components/ui/button';
import { Phone, Star, Check, ChevronDown, MapPin, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/fade-in';

interface HeroData {
  mainTitle?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  phone?: string;
  address?: string;
  openingHours?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  usps?: string[]; // Unique Selling Points: ["🌿 Thân Thiện Môi Trường", "🍃 Trải Nghiệm Xanh", "🌱 Chính Chủ"]
}

interface HeroEcologicalProps {
  data?: HeroData;
}

const defaultData: HeroData = {
  mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: '🌿 Du lịch sinh thái - Trải nghiệm thiên nhiên và văn hóa miền Tây',
  backgroundImage: '/uploads/anhbiadulichconphung.webp',
  phone: '+84918267715',
  address: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
  openingHours: '7:00 - 18:00',
  primaryCta: {
    text: '☎️ Đặt Tour Ngay',
    link: 'tel:+84918267715',
  },
  secondaryCta: {
    text: 'Xem Bảng Giá',
    link: '#pricing',
  },
  usps: [
    '🌿 Thân Thiện Môi Trường',
    '🍃 Trải Nghiệm Xanh',
    '🌱 Chính Chủ',
  ],
};

export function HeroEcological({ data = defaultData }: HeroEcologicalProps) {
  const displayData = { ...defaultData, ...data };
  const usps = displayData.usps || defaultData.usps || [];
  
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Background Image with Nature Overlay */}
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
        {/* Dark overlay for better text readability - INCREASED */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/75" />
        
        {/* Nature-inspired gradient overlay - REDUCED opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-green-800/25 to-teal-900/30" />
        
        {/* Animated nature elements overlay - REDUCED */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-transparent to-green-600/10 animate-pulse" 
             style={{ animationDuration: '6s' }} 
        />
        
        {/* Leaf pattern overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }}
        />
      </div>

      {/* Content - CENTERED with proper padding */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-5xl mx-auto text-center space-y-6 px-4 sm:px-6">
            
            {/* Nature Badge - ENHANCED for clarity */}
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full text-emerald-700 border-3 border-emerald-400 shadow-2xl">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">🌿 Du lịch Sinh Thái Chính Chủ</span>
              </div>
            </FadeIn>

            {/* Main Title - Nature Style - CENTERED & FIXED */}
            <FadeIn delay={0.3}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight break-words" 
                  style={{
                    textShadow: '3px 3px 6px rgba(0,0,0,0.8), -1px -1px 3px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.4)',
                    WebkitTextStroke: '1px rgba(0,0,0,0.3)',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}>
                <span className="text-emerald-200 block">Khám Phá</span>
                <span className="text-white block mt-2">
                  Thiên Nhiên Miền Tây
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle - CENTERED & FIXED */}
            <FadeIn delay={0.4}>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold max-w-3xl mx-auto px-4 break-words" 
                 style={{
                   textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.6)',
                   wordBreak: 'break-word'
                 }}>
                {data.subtitle || defaultData.subtitle}
              </p>
            </FadeIn>

            {/* Description - CENTERED & FIXED */}
            <FadeIn delay={0.5}>
              <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-medium px-4 break-words" 
                 style={{
                   textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
                   wordBreak: 'break-word'
                 }}>
                🌱 Trải nghiệm du lịch xanh, bền vững tại Cồn Phụng - 
                Nơi hòa quyện giữa thiên nhiên và văn hóa miền sông nước
              </p>
            </FadeIn>

            {/* CTAs - HIDDEN for better readability */}
            {/* Removed buttons for cleaner design */}

                        {/* Nature USPs - CENTERED & FIXED */}
            {usps.length > 0 && (
              <FadeIn delay={0.6}>
                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 pt-8 px-4">                                                    
                  {usps.map((usp, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full border-4 border-emerald-500 shadow-2xl ring-2 ring-emerald-200 whitespace-nowrap">                                              
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />                                                                    
                      <span className="text-emerald-800 text-xs sm:text-sm font-bold">{usp}</span>                                                       
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Quick Info - CENTERED & FIXED */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 pt-4 px-4 pb-8">
                {data.address && (
                  <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full border-4 border-emerald-400 shadow-2xl ring-2 ring-emerald-200 whitespace-nowrap">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <span className="hidden md:inline text-emerald-800 text-xs sm:text-sm font-bold">{data.address.split(',')[0]}</span>
                    <span className="md:hidden text-emerald-800 text-xs sm:text-sm font-bold">Vĩnh Long</span>
                  </div>
                )}
                {data.openingHours && (
                  <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full border-4 border-emerald-400 shadow-2xl ring-2 ring-emerald-200 whitespace-nowrap">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-800 text-xs sm:text-sm font-bold">Mở cửa: {data.openingHours}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - CENTERED & FIXED */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-1 sm:gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-3 border-emerald-400 shadow-xl">
          <span className="text-xs font-bold text-emerald-800 whitespace-nowrap">Khám phá thêm</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
        </div>
      </div>

      {/* Bottom Wave - REMOVED for better readability */}
    </section>
  );
}

