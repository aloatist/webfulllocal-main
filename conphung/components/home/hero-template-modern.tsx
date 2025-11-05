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

interface HeroModernProps {
  data?: HeroData;
}

const defaultData: HeroData = {
  mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: '✨ Trải nghiệm du lịch hiện đại với công nghệ và tiện ích',
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
};

export function HeroModern({ data = defaultData }: HeroModernProps) {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Image with Modern Overlay */}
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
        {/* Modern gradient overlay - Clean & Minimal */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-blue-900/50 to-indigo-900/60" />
        
        {/* Animated modern gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-indigo-600/20 animate-pulse" 
             style={{ animationDuration: '10s' }} 
        />
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h18V0h2v20h18v2H22v2h18v2H22v2h18v2H22v2h18v2H22v2h20V20H22z'/%3E%3C/g%3E%3C/svg%3E")`,
             }}
        />
      </div>

      {/* Content - Clean & Centered */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Modern Badge */}
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full text-white border border-white/30 shadow-2xl">
                <Sparkles className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-semibold">✨ Trải Nghiệm Hiện Đại</span>
              </div>
            </FadeIn>

            {/* Main Title - Modern Typography */}
            <FadeIn delay={0.3}>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                  CỒN PHỤNG
                </span>
                <br />
                <span className="text-white">
                  Trải Nghiệm Mới
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle - Clean */}
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl lg:text-3xl text-slate-100 font-light max-w-3xl mx-auto tracking-wide">
                {data.subtitle || defaultData.subtitle}
              </p>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.5}>
              <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
                Du lịch thông minh với công nghệ hiện đại, dịch vụ chuyên nghiệp và trải nghiệm đẳng cấp
              </p>
            </FadeIn>

            {/* CTAs - Modern Design */}
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
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
                  className="border-2 border-white/40 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Link href={data.secondaryCta?.link || defaultData.secondaryCta!.link}>
                    Xem Chi Tiết
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Modern Features */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  <Check className="w-4 h-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">⚡ Đặt Tour Nhanh</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  <Check className="w-4 h-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">💎 Dịch Vụ Cao Cấp</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  <Check className="w-4 h-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">🔒 Bảo Mật Tốt</span>
                </div>
              </div>
            </FadeIn>

            {/* Quick Info - Modern */}
            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4 text-slate-200 text-sm">
                {data.address && (
                  <div className="flex items-center gap-2 bg-slate-900/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span className="hidden md:inline">{data.address.split(',')[0]}</span>
                    <span className="md:hidden">Vĩnh Long</span>
                  </div>
                )}
                {data.openingHours && (
                  <div className="flex items-center gap-2 bg-slate-900/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>{data.openingHours}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Modern */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2 text-slate-300">
          <span className="text-xs font-medium">Scroll để khám phá</span>
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Geometric Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="currentColor"
            className="text-white"
          />
        </svg>
      </div>
    </section>
  );
}

