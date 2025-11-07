'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Camera, Leaf, Trees } from 'lucide-react'
import CarouselSlider from '@/components/CarouselSlider'
import type { GallerySection as GalleryData } from '@/lib/homepage/schema'
import { cn } from '@/lib/utils'

interface GallerySectionProps {
  data?: GalleryData;
}

const defaultData: GalleryData = {
  heading: "MỘT SỐ HÌNH ẢNH",
  description: "Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của Cồn Phụng",
  ecoFeatures: [
    {
      title: "Du lịch sinh thái",
      subtitle: "Không gian sinh thái",
      icon: "trees",
    },
    {
      title: "Kiến Trúc Dừa",
      subtitle: "Độc đáo miền Tây",
      icon: "building",
    },
    {
      title: "Văn Hóa Địa Phương",
      subtitle: "Trải nghiệm đích thực",
      icon: "leaf",
    },
  ],
  bottomText: "✨ Hơn 1000+ hình ảnh đẹp về thiên nhiên, văn hóa và con người Cồn Phụng",
  isVisible: true,
  images: [
    { url: "/uploads/2024/10/22196236_901710536664938_7027468764014750282_n.webp", alt: "Cồn Phụng - Du lịch sinh thái" },
    { url: "/uploads/2024/10/22405754_905859629583362_7823146011914182650_n-1.webp", alt: "Cồn Phụng - Khung cảnh thiên nhiên" },
    { url: "/uploads/2024/10/bang-tieu-bieu-song-cuu-long-600-x-600-.webp", alt: "Bảng tiêu biểu sông Cửu Long" },
    { url: "/uploads/2024/10/banh-xeo-con-phung.webp", alt: "Bánh xèo Cồn Phụng - Đặc sản miền Tây" },
    { url: "/uploads/2024/10/cabubinhconphungbentre.conphungtourist.com_.webp", alt: "Cà búp bình Cồn Phụng" },
    { url: "/uploads/2024/10/catituongchienxu.conphungtourist.com_-1024x767-1.webp", alt: "Cá tứ tượng chiên xù" },
    { url: "/uploads/2024/10/cocoislandconphugbentre-1024x767-1.webp", alt: "Coco Island Cồn Phụng" },
    { url: "/uploads/2024/10/coco-island-con-phung-ben-tre41-1024x576-1.webp", alt: "Homestay Coco Island Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com8.webp", alt: "Du lịch Cồn Phụng Bến Tre" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com9.webp", alt: "Tham quan Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp", alt: "Cồn Phụng - Điểm du lịch sinh thái" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp", alt: "Vẻ đẹp Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp", alt: "Trải nghiệm du lịch Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp", alt: "Cồn Phụng - Vườn dừa xanh mát" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp", alt: "Cảnh quan Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com15.webp", alt: "Du lịch miền Tây - Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com16.webp", alt: "Khu du lịch Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com17.webp", alt: "Thiên nhiên Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com18.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com19.webp", alt: "Du lịch sinh thái Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com20.webp", alt: "Cồn Phụng Bến Tre" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com21.webp", alt: "Văn hóa miền Tây tại Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com22.webp", alt: "Cồn Phụng - Trải nghiệm độc đáo" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com23.webp", alt: "Cảnh đẹp Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com26.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com27.webp", alt: "Cồn Phụng - Điểm đến hấp dẫn" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com28.webp", alt: "Thiên nhiên hoang sơ Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com29.webp", alt: "Cồn Phụng - Khám phá miền Tây" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com30.webp", alt: "Du lịch Cồn Phụng - Trải nghiệm" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com33.webp", alt: "Cồn Phụng - Vẻ đẹp tự nhiên" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com34.webp", alt: "Khu du lịch sinh thái Cồn Phụng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com35.webp", alt: "Cồn Phụng - Điểm đến du lịch" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com36.webp", alt: "Tham quan Cồn Phụng Bến Tre" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com37.webp", alt: "Cồn Phụng - Cảnh quan đẹp" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com38.webp", alt: "Du lịch Cồn Phụng - Thiên nhiên" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com40.webp", alt: "Cồn Phụng - Vườn dừa" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com41.webp", alt: "Cồn Phụng - Trải nghiệm văn hóa" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com42.webp", alt: "Du lịch Cồn Phụng - Hoạt động" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com44.webp", alt: "Cồn Phụng - Điểm đến lý tưởng" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com45.webp", alt: "Cồn Phụng - Vẻ đẹp miền Tây" },
    { url: "/uploads/2024/11/dulichconphungbentre_conphungtourist.com46.webp", alt: "Du lịch Cồn Phụng - Khám phá" }
  ]
};

export function GallerySection({ data, className }: GallerySectionProps & { className?: string }) {
  if (!data || !data.isVisible) return null;

  // Get visibility settings (default to true if not set)
  const visibility = data.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;

  // Merge data with defaults
  const displayData = data || defaultData;
  const images = displayData.images || defaultData.images;
  const ecoFeatures = displayData.ecoFeatures || defaultData.ecoFeatures || [];
  const bottomText = displayData.bottomText || defaultData.bottomText || '';

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12 max-w-4xl mx-auto", className)}>
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-5 py-2 rounded-full mb-4">
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Thư Viện Ảnh</span>
            </div>
            
            {isVisible('heading') && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
                {displayData.heading}
              </h2>
            )}
            {isVisible('description') && displayData.description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-6">
                {displayData.description}
              </p>
            )}

            {/* Eco Tourism Features - Below description */}
            {isVisible('ecoFeatures') && ecoFeatures && ecoFeatures.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" role="region" aria-label="Eco Tourism Features">
                {ecoFeatures.map((feature, index) => {
                  const iconGradients = [
                    'from-green-500 to-emerald-500',
                    'from-blue-500 to-cyan-500',
                    'from-lime-500 to-green-500',
                  ];
                  const gradient = iconGradients[index % iconGradients.length];
                  
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                        {feature.icon === 'trees' && <Trees className="w-6 h-6 text-white" />}
                        {feature.icon === 'building' && (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                          </svg>
                        )}
                        {feature.icon === 'leaf' && <Leaf className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{feature.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Text - Below Eco Tourism Features */}
            {isVisible('bottomText') && bottomText && (
              <div className="text-center mb-8">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  {bottomText}
                </p>
              </div>
            )}
          </div>

          {/* Carousel */}
          {isVisible('images') && images && images.length > 0 && (
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
              <CarouselSlider images={images} />
            </div>
          )}
      </div>
    </div>
  )
}
