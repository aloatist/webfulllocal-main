'use client';

import { Button } from '@/components/ui/button';
import { Phone, Star, Check, ChevronDown, MapPin, Clock, Sparkles } from 'lucide-react';
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
}

interface HeroTraditionalProps {
  data?: HeroData;
}

const defaultData: HeroData = {
  mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: '🏮 Trải nghiệm văn hóa truyền thống miền Tây đậm đà bản sắc',
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
};

export function HeroTraditional({ data = defaultData }: HeroTraditionalProps) {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Background Image with Traditional Overlay */}
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
        {/* Warm traditional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/60 via-orange-900/50 to-yellow-900/60" />
        
        {/* Animated warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/25 via-orange-600/20 to-yellow-600/25 animate-pulse" 
             style={{ animationDuration: '7s' }} 
        />
        
        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.3'%3E%3Cpath d='M40 40v-8h8v8h-8zm0 0v8h-8v-8h8zm0 0h-8v-8h8v8zm0 0h8v8h-8v-8zM0 0h16v16H0V0zm64 0h16v16H64V0zM0 64h16v16H0V64zm64 0h16v16H64V64z'/%3E%3C/g%3E%3C/svg%3E")`,
             }}
        />
      </div>

      {/* Content - Warm & Welcoming */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Traditional Badge */}
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-amber-100/90 backdrop-blur-md px-5 py-2.5 rounded-full text-amber-900 border-2 border-amber-300 shadow-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold">🏮 Văn Hóa Truyền Thống</span>
              </div>
            </FadeIn>

            {/* Main Title - Traditional Style */}
            <FadeIn delay={0.3}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                <span className="text-amber-200">ĐẶC SẮC</span>
                <br />
                <span className="text-yellow-100">
                  Miền Tây Sông Nước
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl lg:text-3xl text-amber-50 font-medium max-w-3xl mx-auto drop-shadow-lg">
                {data.subtitle || defaultData.subtitle}
              </p>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.5}>
              <p className="text-base md:text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
                🎋 Khám phá văn hóa đậm đà bản sắc miền Tây tại Cồn Phụng - 
                Nơi lưu giữ những giá trị truyền thống quý báu
              </p>
            </FadeIn>

            {/* CTAs - Warm Colors */}
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105 active:scale-95 border-2 border-amber-400"
                >
                  <Link href={data.primaryCta?.link || defaultData.primaryCta!.link}>
                    <Phone className="mr-2 h-5 w-5" />
                    Đặt Tour Ngay
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-2 border-amber-200 bg-amber-50/20 backdrop-blur-sm text-white hover:bg-amber-100/30 px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Link href={data.secondaryCta?.link || defaultData.secondaryCta!.link}>
                    Xem Bảng Giá
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Traditional USPs */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6">
                <div className="flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-300 shadow-md">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-900 text-sm font-semibold">🎋 Đậm Đà Bản Sắc</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-300 shadow-md">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-900 text-sm font-semibold">🏮 Văn Hóa Truyền Thống</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-300 shadow-md">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-900 text-sm font-semibold">🌺 Ấm Cúng</span>
                </div>
              </div>
            </FadeIn>

            {/* Quick Info */}
            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4 text-orange-50 text-sm">
                {data.address && (
                  <div className="flex items-center gap-2 bg-amber-900/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-amber-300" />
                    <span className="hidden md:inline">{data.address.split(',')[0]}</span>
                    <span className="md:hidden">Vĩnh Long</span>
                  </div>
                )}
                {data.openingHours && (
                  <div className="flex items-center gap-2 bg-amber-900/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>Mở cửa: {data.openingHours}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Traditional */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2 text-amber-200">
          <span className="text-xs font-medium">Khám phá thêm</span>
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Warm Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="currentColor"
            className="text-amber-50"
          />
        </svg>
      </div>
    </section>
  );
}

