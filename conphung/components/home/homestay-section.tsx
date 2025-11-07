'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Home, Leaf, Wifi, Coffee, Bed, Star } from 'lucide-react'
import HomestayCocoIsland from '@/components/HomestayCocoIsland'
import type { HomestaySection as HomestaySectionType } from '@/lib/homepage/schema'
import * as LucideIcons from 'lucide-react'

interface HomestaySectionProps {
  data?: HomestaySectionType;
}

const defaultData: HomestaySectionType = {
  eyebrow: 'Lưu Trú',
  heading: 'LƯU TRÚ HOMESTAY SINH THÁI',
  subheading: 'COCO ISLAND CỒN PHỤNG',
  description: '🌿 Nghỉ dưỡng giữa thiên nhiên - Trải nghiệm homestay xanh mát',
  amenities: [
    { icon: 'Leaf', label: 'Sinh Thái' },
    { icon: 'Wifi', label: 'Wifi Free' },
    { icon: 'Coffee', label: 'Ăn Sáng' },
    { icon: 'Bed', label: 'Tiện Nghi' },
    { icon: 'Star', label: 'Chất Lượng' },
  ],
  highlights: [
    { icon: 'Leaf', title: 'Không Gian Xanh', description: 'Giữa rừng dừa, gần sông nước, thoáng mát' },
    { icon: 'Home', title: 'Phòng Hiện Đại', description: 'Đầy đủ tiện nghi, sạch sẽ, thoải mái' },
    { icon: 'Star', title: 'Dịch Vụ Tốt', description: 'Phục vụ tận tình, chu đáo 24/7' },
  ],
  bottomNote: '💡 Đặt phòng sớm để nhận giá tốt nhất và chọn phòng đẹp',
  isActive: true,
};

export function HomestaySection({ data }: HomestaySectionProps = {}) {
  if (!data || !data.isActive) return null;

  // Get visibility settings (default to true if not set)
  const visibility = data.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;

  const displayData = data || defaultData;
  
  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
                {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            {isVisible('eyebrow') && displayData.eyebrow && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-5 py-2 rounded-full mb-4">
                <Home className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{displayData.eyebrow}</span>
              </div>
            )}
            
            {isVisible('heading') && (
              <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {displayData.heading}
              </h2>
            )}
            {isVisible('subheading') && displayData.subheading && (
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                {displayData.subheading}
              </h3>
            )}
            {isVisible('description') && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                {displayData.description}
              </p>
            )}
          </div>

          {/* Amenities Grid */}
          {isVisible('amenities') && displayData.amenities && displayData.amenities.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {displayData.amenities.map((amenity, index) => {
                const IconComponent = (LucideIcons as any)[amenity.icon] || LucideIcons.Star;
                const gradients = [
                  'from-green-500 to-emerald-500',
                  'from-blue-500 to-cyan-500',
                  'from-orange-500 to-red-500',
                  'from-purple-500 to-pink-500',
                  'from-yellow-500 to-orange-500',
                ];
                return (
                  <div key={index} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm text-center">{amenity.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Highlights */}
          {isVisible('highlights') && displayData.highlights && displayData.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {displayData.highlights.map((highlight, index) => {
                const IconComponent = (LucideIcons as any)[highlight.icon] || LucideIcons.Star;
                const gradients = [
                  'from-green-500 to-emerald-500',
                  'from-blue-500 to-cyan-500',
                  'from-orange-500 to-yellow-500',
                ];
                return (
                  <div key={index} className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-6 h-6" />
                      <h4 className="font-bold text-lg">{highlight.title}</h4>
                    </div>
                    <p className="text-white/90 text-sm">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Homestay Content */}
          {isVisible('cocoIslandCard') && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-100 dark:border-orange-900/30">
              <HomestayCocoIsland 
                imageUrl={displayData.cocoIslandCard?.imageUrl}
                originalPrice={displayData.cocoIslandCard?.originalPrice}
                discount={displayData.cocoIslandCard?.discount}
                finalPrice={displayData.cocoIslandCard?.finalPrice}
                currency={displayData.cocoIslandCard?.currency}
                includedItems={displayData.cocoIslandCard?.includedItems}
                roomAmenities={displayData.cocoIslandCard?.roomAmenities}
              />
            </div>
          )}

          {/* Bottom Note */}
          {isVisible('bottomNote') && displayData.bottomNote && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
                <Home className="w-5 h-5 text-orange-600" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {displayData.bottomNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
