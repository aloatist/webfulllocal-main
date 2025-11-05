'use client';

import { Leaf, Check, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/fade-in';
import { applyStyle } from '@/lib/homepage/apply-style';
import { cn } from '@/lib/utils';
import type { HeroSection } from '@/lib/homepage/schema';

interface HeroModernRedesignedProps {
  data?: HeroSection;
}

const defaultData: Partial<HeroSection> = {
  eyebrow: '🌿 Du lịch Sinh Thái Chính Chủ',
  mainTitle: 'Thiên Nhiên Miền Tây',
  subtitle: 'Công Trình Kiến Trúc Đạo Dừa',
  description: 'Trải nghiệm du lịch xanh, bền vững tại Cồn Phụng - Nơi hòa quyện giữa thiên nhiên và văn hóa miền sông nước',
  backgroundImage: '/uploads/anhbiadulichconphung.webp',
  phone: '+84918267715',
  address: 'Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long',
  openingHours: '7:00 - 18:00',
};

export function HeroModernRedesigned({ data }: HeroModernRedesignedProps) {
  const displayData = { ...defaultData, ...data };
  
  // Use USPs from data or default
  const usps = (displayData.usps || [
    '🌿 Thân Thiện Môi Trường',
    '🍃 Trải Nghiệm Xanh',
    '🌱 Chính Chủ',
  ]).map(text => ({ icon: Check, text }));
  
  // Apply styles
  const eyebrowStyle = applyStyle(displayData.styles?.eyebrow);
  const mainTitleStyle = applyStyle(displayData.styles?.mainTitle);
  const subtitleStyle = applyStyle(displayData.styles?.subtitle);
  const descriptionStyle = applyStyle(displayData.styles?.description);
  const primaryCtaStyle = applyStyle(displayData.primaryCta?.style);
  const secondaryCtaStyle = applyStyle(displayData.secondaryCta?.style);

  return (
    <section className="relative min-h-[85vh] max-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={displayData.backgroundImage!}
          alt={displayData.mainTitle!}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-green-900/20" />
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-24 sm:pb-28 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
              
              {/* Trust Badge */}
              {displayData.eyebrow && (
                <FadeIn delay={0.2}>
                  <div className="flex justify-center w-full pt-4 sm:pt-6">
                    <div className={cn(
                      "inline-flex items-center justify-center gap-2 bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-full border-2 border-emerald-400/50 shadow-2xl relative z-20",
                      eyebrowStyle.className
                    )} style={eyebrowStyle.style}>
                      <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className={cn("text-sm font-bold text-emerald-700 text-center", eyebrowStyle.className)} style={eyebrowStyle.style}>
                        {displayData.eyebrow}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Main Title */}
              <FadeIn delay={0.3}>
                <div className="w-full flex flex-col items-center space-y-3 md:space-y-4">
                  <h1 
                    className={cn(
                      "w-full text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] break-words",
                      mainTitleStyle.className
                    )}
                    style={{
                      textShadow: '4px 4px 12px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)',
                      letterSpacing: '-0.02em',
                      wordBreak: 'break-word',
                      ...mainTitleStyle.style
                    }}
                  >
                    <span className={cn("block text-center text-white", mainTitleStyle.className)} style={mainTitleStyle.style}>
                      {displayData.mainTitle || 'Thiên Nhiên Miền Tây'}
                    </span>
                  </h1>
                  
                  {/* Decorative Line */}
                  <div className="flex items-center justify-center gap-4 pt-2 w-full">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                    <Leaf className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                  </div>
                </div>
              </FadeIn>

              {/* Subtitle */}
              <FadeIn delay={0.4}>
                <p 
                  className={cn(
                    "w-full text-center text-xl sm:text-2xl md:text-3xl text-white font-semibold max-w-3xl mx-auto px-4 break-words",
                    subtitleStyle.className
                  )}
                  style={{
                    textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.6)',
                    letterSpacing: '0.01em',
                    wordBreak: 'break-word',
                    ...subtitleStyle.style
                  }}
                >
                  {displayData.subtitle}
                </p>
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.5}>
                <p 
                  className={cn(
                    "w-full text-center text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed font-medium px-4 break-words",
                    descriptionStyle.className
                  )}
                  style={{
                    textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
                    wordBreak: 'break-word',
                    ...descriptionStyle.style
                  }}
                >
                  {displayData.description}
                </p>
              </FadeIn>

              {/* USPs */}
              <FadeIn delay={0.6}>
                <div className="w-full flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5">
                  {usps.map((usp, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-center gap-2 bg-white/95 backdrop-blur-xl px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-emerald-500/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="p-1 bg-emerald-500/10 rounded-full flex-shrink-0">
                        <usp.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <span className="text-emerald-800 text-xs sm:text-sm font-bold whitespace-nowrap text-center">
                        {usp.text}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Scroll Indicator */}
              <FadeIn delay={0.7}>
                <div className="w-full flex justify-center items-center pt-8 md:pt-10">
                  <div className="flex flex-col items-center justify-center gap-1.5 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-full border-2 border-emerald-400/50 shadow-xl animate-bounce">
                    <span className="text-xs font-bold text-emerald-800 whitespace-nowrap text-center">Khám phá thêm</span>
                    <ChevronDown className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


