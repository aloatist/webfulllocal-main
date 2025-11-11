'use client';

import { Button } from '@/components/ui/button';
import { Phone, Check, ChevronDown, MapPin, Clock, Zap } from 'lucide-react';
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

interface HeroGeometricProps {
  data?: HeroData;
}

const defaultData: HeroData = {
  mainTitle: 'KHU DU LỊCH SINH THÁI CỒN PHỤNG',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: '🔷 Trải nghiệm độc đáo với phong cách góc cạnh, năng động và hiện đại',
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

export function HeroGeometric({ data = defaultData }: HeroGeometricProps) {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Background Image with Geometric Overlay */}
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
        {/* Bold geometric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/70 via-purple-900/60 to-fuchsia-900/70" />
        
        {/* Animated geometric gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-purple-600/25 to-fuchsia-600/30" 
             style={{ 
               animation: 'geometricPulse 8s ease-in-out infinite',
             }} 
        />
        
        {/* Angular geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }}
        />
        
        {/* Diagonal geometric lines */}
        <div className="absolute inset-0 opacity-5"
             style={{
               background: `repeating-linear-gradient(
                 45deg,
                 transparent,
                 transparent 10px,
                 rgba(139, 92, 246, 0.3) 10px,
                 rgba(139, 92, 246, 0.3) 20px
               )`,
             }}
        />
      </div>

      {/* Content - Angular & Dynamic */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Geometric Badge - Angular Design */}
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-violet-100/90 backdrop-blur-xl px-5 py-2.5 border-2 border-violet-300 text-violet-900 shadow-2xl"
                   style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                <Zap className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-bold">🔷 PHONG CÁCH GÓC CẠNH</span>
              </div>
            </FadeIn>

            {/* Main Title - Bold Angular Typography */}
            <FadeIn delay={0.3}>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                  CỒN PHỤNG
                </span>
                <br />
                <span className="text-white" style={{ textShadow: '4px 4px 0px rgba(139, 92, 246, 0.5)' }}>
                  ĐỘC ĐÁO
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle - Angular */}
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl lg:text-3xl text-violet-100 font-bold max-w-3xl mx-auto tracking-wide">
                {data.subtitle || defaultData.subtitle}
              </p>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.5}>
              <p className="text-base md:text-lg text-violet-200 max-w-2xl mx-auto leading-relaxed font-semibold">
                Trải nghiệm du lịch với phong cách hiện đại, góc cạnh và năng động
              </p>
            </FadeIn>

            {/* CTAs - Angular Design */}
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-6 text-lg font-black shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105 active:scale-95 border-2 border-violet-400"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
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
                  className="border-2 border-violet-400 bg-violet-900/30 backdrop-blur-xl text-white hover:bg-violet-900/50 px-8 py-6 text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  <Link href={data.secondaryCta?.link || defaultData.secondaryCta!.link}>
                    Xem Chi Tiết
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Geometric Features */}
            <FadeIn delay={0.7}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6">
                <div className="flex items-center gap-2 bg-violet-900/40 backdrop-blur-xl px-4 py-2 border-2 border-violet-400 shadow-lg"
                     style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                  <Check className="w-4 h-4 text-violet-300" />
                  <span className="text-white text-sm font-bold">⚡ Nhanh Chóng</span>
                </div>
                <div className="flex items-center gap-2 bg-violet-900/40 backdrop-blur-xl px-4 py-2 border-2 border-violet-400 shadow-lg"
                     style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                  <Check className="w-4 h-4 text-violet-300" />
                  <span className="text-white text-sm font-bold">🔷 Độc Đáo</span>
                </div>
                <div className="flex items-center gap-2 bg-violet-900/40 backdrop-blur-xl px-4 py-2 border-2 border-violet-400 shadow-lg"
                     style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                  <Check className="w-4 h-4 text-violet-300" />
                  <span className="text-white text-sm font-bold">💜 Năng Động</span>
                </div>
              </div>
            </FadeIn>

            {/* Quick Info - Angular */}
            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4 text-violet-200 text-sm font-semibold">
                {data.address && (
                  <div className="flex items-center gap-2 bg-violet-900/50 backdrop-blur-sm px-3 py-1.5 border border-violet-400"
                       style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                    <MapPin className="w-4 h-4 text-violet-300" />
                    <span className="hidden md:inline">{data.address.split(',')[0]}</span>
                    <span className="md:hidden">Vĩnh Long</span>
                  </div>
                )}
                {data.openingHours && (
                  <div className="flex items-center gap-2 bg-violet-900/50 backdrop-blur-sm px-3 py-1.5 border border-violet-400"
                       style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                    <Clock className="w-4 h-4 text-violet-300" />
                    <span>{data.openingHours}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Angular */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2 text-violet-300">
          <span className="text-xs font-bold">Scroll để khám phá</span>
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Angular Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0,40L48,50C96,60,192,80,288,85.3C384,90,480,80,576,75C672,70,768,70,864,75C960,80,1056,90,1152,85.3C1248,80,1344,60,1392,50L1440,40L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="currentColor"
            className="text-white"
          />
        </svg>
      </div>

      {/* Add CSS for geometric pulse animation */}
      <style jsx>{`
        @keyframes geometricPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}

