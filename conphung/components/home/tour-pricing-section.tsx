'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { Ship, Leaf, MapPin, Star } from 'lucide-react'
import Tourconphungthoison from '@/components/Tourconphungthoison'
import type { TourPricingSection as TourData } from '@/lib/homepage/schema'
import { applyStyle } from '@/lib/homepage/apply-style'
import { cn } from '@/lib/utils'

interface TourPricingSectionProps {
  data?: TourData;
}

const defaultData: TourData = {
  eyebrow: "Tour khám phá",
  heading: "TOUR KHÁM PHÁ TRONG NGÀY CỒN THỚI SƠN – CỒN PHỤNG",
  description: "Trải nghiệm đầy đủ văn hóa miền Tây với giá ưu đãi",
  tours: [{
    id: "tour-1",
    name: "Tour Cồn Thới Sơn - Cồn Phụng",
    description: "Tour khám phá đầy đủ 2 cồn nổi tiếng nhất miền Tây",
    originalPrice: 600000,
    discount: 0,
    finalPrice: 600000,
    currency: "₫",
    imageUrl: "/uploads/tour-thumbnail.jpg",
    duration: "1 ngày",
    isActive: true,
    order: 1,
    includedItems: [
      "🚢 Vé tàu khứ hồi",
      "🎭 Nghe Đờn ca tài tử Nam Bộ",
      "🥥 Thưởng thức trái cây theo mùa",
      "🛶 Đi xuồng ba lá trong rạch dừa",
      "👨‍🏫 Hướng dẫn viên địa phương"
    ]
  }]
};

export function TourPricingSection({ data = defaultData }: TourPricingSectionProps) {
  if (!data) return null;

  // Get visibility settings (default to true if not set)
  const visibility = data.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;

  // Merge data with defaultData to ensure all fields are present
  const mergedData = {
    ...defaultData,
    ...data,
    bottomNote: data.bottomNote || defaultData.bottomNote || '💡 Bao gồm: Xe đưa đón + Du thuyền + Ăn trưa + Hướng dẫn viên',
  };

  // Debug: Log styles in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[TourPricingSection] Styles:', {
      heading: data.styles?.heading,
      hasHeadingStyles: !!data.styles?.heading,
      fontSize: data.styles?.heading?.typography?.fontSize,
    });
  }

  // Apply styles
  const headingStyle = applyStyle(data.styles?.heading);
  const eyebrowStyle = applyStyle(data.styles?.eyebrow);
  const descriptionStyle = applyStyle(data.styles?.description);
  
  // Default heading classes - only apply if no custom styles are set
  const hasCustomGradient = data.styles?.heading?.colors?.gradient;
  const hasCustomFontSize = data.styles?.heading?.typography?.fontSize;
  const hasCustomFontWeight = data.styles?.heading?.typography?.fontWeight;
  
  // Default fontSize classes - only apply if no custom fontSize is set
  // Note: We use responsive classes for default, but when custom fontSize is set,
  // we should NOT apply default responsive classes to avoid conflicts
  const defaultFontSizeClasses = !hasCustomFontSize 
    ? "text-3xl md:text-5xl"
    : "";
  
  // If custom fontSize exists, ensure default responsive classes are completely removed
  // This prevents md:text-5xl from overriding text-lg on desktop
  
  // Default fontWeight classes - only apply if no custom fontWeight is set
  const defaultFontWeightClasses = !hasCustomFontWeight
    ? "font-bold"
    : "";
  
  // Default gradient classes - only apply if no custom gradient is set
  const defaultGradientClasses = !hasCustomGradient 
    ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent"
    : "";
  
  // Debug: Log applied styles
  if (process.env.NODE_ENV === 'development') {
    console.log('[TourPricingSection] Applied styles:', {
      headingClassName: headingStyle.className,
      headingInlineStyle: headingStyle.style,
      hasCustomFontSize,
      defaultFontSizeClasses,
      finalHeadingClasses: cn(
        "mb-4",
        defaultFontSizeClasses,
        defaultFontWeightClasses,
        defaultGradientClasses,
        headingStyle.className
      ),
    });
  }

  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            {isVisible('eyebrow') && data.eyebrow && (
              <div className={cn(
                "inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-5 py-2 rounded-full mb-4",
                eyebrowStyle.className
              )} style={eyebrowStyle.style}>
                <Ship className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{data.eyebrow}</span>
              </div>
            )}
            
            {isVisible('heading') && (
              <h2 
                className={cn(
                  "mb-4",
                  // Apply custom styles first (higher priority)
                  headingStyle.className,
                  // Then apply defaults only if no custom styles
                  !hasCustomFontSize && defaultFontSizeClasses,
                  !hasCustomFontWeight && defaultFontWeightClasses,
                  !hasCustomGradient && defaultGradientClasses,
                )} 
                style={headingStyle.style}
              >
                {data.heading}
              </h2>
            )}
            {isVisible('description') && (
              <p className={cn(
                "text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg",
                descriptionStyle.className
              )} style={descriptionStyle.style}>
                {data.description}
              </p>
            )}
          </div>

          {/* Tour Highlights */}
          {isVisible('highlights') && data.highlights && data.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {data.highlights.map((highlight, index) => {
                // Icon mapping
                const iconMap: Record<string, typeof Ship> = {
                  Ship: Ship,
                  Leaf: Leaf,
                  MapPin: MapPin,
                  Star: Star,
                };
                const IconComponent = iconMap[highlight.icon || 'Ship'] || Ship;
                
                // Gradient colors based on icon
                const gradientMap: Record<string, string> = {
                  Ship: 'from-blue-500 to-cyan-500',
                  Leaf: 'from-green-500 to-emerald-500',
                  MapPin: 'from-orange-500 to-red-500',
                  Star: 'from-yellow-500 to-orange-500',
                };
                const gradient = gradientMap[highlight.icon || 'Ship'] || 'from-blue-500 to-cyan-500';
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-center">{highlight.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tour Pricing Table */}
          {isVisible('tours') && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-100 dark:border-blue-900/30">
              {data.tours && data.tours.length > 0 ? (
                <Tourconphungthoison
                  includedItems={data.tours[0].includedItems}
                  originalPrice={data.tours[0].originalPrice}
                  discount={data.tours[0].discount}
                  finalPrice={data.tours[0].finalPrice}
                  currency={data.tours[0].currency}
                  imageUrl={data.tours[0].imageUrl}
                  includedItemsStyle={data.styles?.includedItems}
                />
              ) : (
                <Tourconphungthoison />
              )}
            </div>
          )}

          {/* Bottom Note */}
          {isVisible('bottomNote') && mergedData.bottomNote && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
                <Ship className="w-5 h-5 text-blue-600" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {mergedData.bottomNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
