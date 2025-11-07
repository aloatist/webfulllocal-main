'use client'

import { Check, Star, Sparkles, Zap, Award, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import Link from 'next/link'
import { useMemo } from 'react'
import type { TicketSection, TourPricingSection, PricingSnapshotSection, HomestaySection } from '@/lib/homepage/schema'

interface PricingSnapshotModernProps {
  pricingSnapshotData?: PricingSnapshotSection;
  ticketData?: TicketSection;
  tourData?: TourPricingSection;
  homestayData?: HomestaySection;
}

const defaultPricingOptions = [
  {
    id: 'ticket',
    name: 'Vé Tham Quan',
    price: '50,000',
    period: '/người lớn',
    popular: false,
    features: [
      'Miễn phí tàu khứ hồi',
      'Tham quan trải cá sấu',
      'Xem sản xuất kẹo dừa',
      'Thủ công mỹ nghệ dừa',
      'Tham quan di tích Đạo Dừa',
      'Bảo tàng Dừa',
    ],
    note: 'Trẻ em dưới 1m: Miễn phí',
    cta: {
      text: 'Mua Vé Ngay',
      link: 'tel:+84918267715',
    },
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/20',
    shadowColor: 'shadow-blue-500/10',
  },
  {
    id: 'tour',
    name: 'Tour Khám Phá',
    price: '500,000',
    period: '/người',
    popular: true,
    features: [
      '✅ Bao gồm vé tham quan',
      '🍲 Ăn trưa đặc sản miền Tây',
      '👨‍🏫 Hướng dẫn viên nhiệt tình',
      '🚐 Xe đưa đón (nếu có)',
      '📸 Hỗ trợ chụp ảnh',
      '🎁 Quà lưu niệm',
    ],
    note: 'Nhóm từ 10 người giảm 10%',
    cta: {
      text: 'Đặt Tour Ngay',
      link: '/tours',
    },
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
    borderColor: 'border-emerald-500/20',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'homestay',
    name: 'Lưu Trú Homestay',
    price: '500,000',
    period: '/phòng/đêm',
    popular: false,
    features: [
      '🏞️ View sông tuyệt đẹp',
      '🛏️ Phòng đầy đủ tiện nghi',
      '🍳 Ăn sáng miễn phí',
      '📶 Wi-Fi tốc độ cao',
      '❄️ Điều hòa, nước nóng',
      '🅿️ Chỗ đỗ xe miễn phí',
    ],
    note: 'Đặt từ 3 đêm giảm 15%',
    cta: {
      text: 'Đặt Phòng Ngay',
      link: 'https://cocoisland.vn',
    },
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/20',
    shadowColor: 'shadow-amber-500/10',
  },
]

export function PricingSnapshotModern({ pricingSnapshotData, ticketData, tourData, homestayData }: PricingSnapshotModernProps) {
  // Convert database data to pricingOptions format
  const pricingOptions = useMemo(() => {
    const options = [];
    
    // Ticket Card (from ticketData)
    if (ticketData) {
      // Format included items with emojis if not already formatted
      const formatFeatures = (items: string[]) => {
        return items.map(item => {
          // If item already has emoji, keep it; otherwise add based on keywords
          if (/^[🚢🐊🍬🎨🏛️🥥]/.test(item)) return item;
          
          // Map keywords to emojis
          if (item.includes('tàu') || item.includes('khứ hồi')) return `🚢 ${item.replace(/^(🚢\s*)?/, '')}`;
          if (item.includes('cá sấu') || item.includes('trại')) return `🐊 ${item.replace(/^(🐊\s*)?/, '')}`;
          if (item.includes('kẹo') || item.includes('Dừa') || item.includes('sản xuất')) return `🍬 ${item.replace(/^(🍬\s*)?/, '')}`;
          if (item.includes('thủ công') || item.includes('mỹ nghệ')) return `🎨 ${item.replace(/^(🎨\s*)?/, '')}`;
          if (item.includes('Đạo Dừa') || item.includes('di tích')) return `🏛️ ${item.replace(/^(🏛️\s*)?/, '')}`;
          if (item.includes('Bảo tàng')) return `🥥 ${item.replace(/^(🥥\s*)?/, '')}`;
          return item;
        });
      };
      
      options.push({
        id: 'ticket',
        name: ticketData.heading || 'VÉ CỔNG CHÍNH CHỦ KHU DU LỊCH CỒN PHỤNG',
        price: ticketData.prices.adult.toLocaleString('vi-VN'),
        period: '/người lớn',
        popular: false,
        features: formatFeatures(ticketData.includedItems || []),
        note: `Trẻ em: ${ticketData.prices.child.toLocaleString('vi-VN')}₫`,
        cta: {
          text: 'Mua Vé Ngay',
          link: 'tel:+84918267715',
        },
        gradient: 'from-blue-500 via-cyan-500 to-sky-500',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/20',
        shadowColor: 'shadow-blue-500/10',
      });
    }
    
    // Tour Card (from tourData - lấy tour đầu tiên active)
    if (tourData?.tours && tourData.tours.length > 0) {
      const firstTour = tourData.tours.find(t => t.isActive) || tourData.tours[0];
      
      // Format included items with emojis if not already formatted
      const formatTourFeatures = (items: string[]) => {
        return items.map(item => {
          if (/^[🚢🎭🥥🛶👨‍🏫]/.test(item)) return item;
          
          // Map keywords to emojis
          if (item.includes('tàu') || item.includes('khứ hồi')) return `🚢 ${item.replace(/^(🚢\s*)?/, '')}`;
          if (item.includes('Đờn ca') || item.includes('tài tử')) return `🎭 ${item.replace(/^(🎭\s*)?/, '')}`;
          if (item.includes('trái cây') || item.includes('theo mùa')) return `🥥 ${item.replace(/^(🥥\s*)?/, '')}`;
          if (item.includes('xuồng') || item.includes('ba lá') || item.includes('rạch')) return `🛶 ${item.replace(/^(🛶\s*)?/, '')}`;
          if (item.includes('Hướng dẫn') || item.includes('viên')) return `👨‍🏫 ${item.replace(/^(👨‍🏫\s*)?/, '')}`;
          return item;
        });
      };
      
      options.push({
        id: 'tour',
        name: firstTour.name || 'Tour Cồn Thới Sơn - Cồn Phụng',
        price: firstTour.finalPrice.toLocaleString('vi-VN'),
        period: '/người',
        popular: true,
        features: formatTourFeatures(firstTour.includedItems || []),
        note: firstTour.description || tourData.description || 'Trải nghiệm đầy đủ văn hóa miền Tây với giá ưu đãi',
        cta: {
          text: 'Đặt Tour Ngay',
          link: '/tours',
        },
        gradient: 'from-emerald-500 via-green-500 to-teal-500',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
        borderColor: 'border-emerald-500/20',
        shadowColor: 'shadow-emerald-500/20',
      });
    }
    
    // Homestay Card (from homestayData.cocoIslandCard)
    if (homestayData?.cocoIslandCard) {
      const homestayCard = homestayData.cocoIslandCard;
      
      // Format features from includedItems
      const formatHomestayFeatures = (items: string[]) => {
        return items.map(item => {
          // If item already has emoji, keep it; otherwise format
          if (/^[🚢☕🎁🏞️🛏️🍳📶❄️🧊📺🅿️⚡💨📞🛁👡]/.test(item)) return item;
          
          // Extract text after emoji if exists
          const emojiMatch = item.match(/^([^\s]+)\s+(.+)$/);
          if (emojiMatch) return item;
          
          // Map keywords to emojis
          if (item.includes('Vé tàu') || item.includes('cổng tham quan')) return `🚢 ${item}`;
          if (item.includes('ăn sáng') || item.includes('Phục vụ')) return `🍳 ${item}`;
          if (item.includes('trái cây') || item.includes('dừa tươi') || item.includes('Check in')) return `🎁 ${item}`;
          if (item.includes('View') || item.includes('sông')) return `🏞️ ${item}`;
          if (item.includes('Phòng') || item.includes('tiện nghi')) return `🛏️ ${item}`;
          if (item.includes('Wi-Fi') || item.includes('Wifi')) return `📶 ${item}`;
          if (item.includes('Điều hòa') || item.includes('nước nóng') || item.includes('Máy lạnh')) return `❄️ ${item}`;
          if (item.includes('đỗ xe') || item.includes('parking')) return `🅿️ ${item}`;
          return item;
        });
      };
      
      // Format room amenities as features
      const formatRoomAmenities = (amenities: string[]) => {
        return amenities.map(amenity => {
          // Extract emoji and text if already formatted
          const emojiMatch = amenity.match(/^([^\s]+)\s+(.+)$/);
          if (emojiMatch) return amenity;
          
          // Map keywords to emojis
          if (amenity.includes('Ấm điện') || amenity.includes('siêu tốc')) return `⚡ ${amenity}`;
          if (amenity.includes('Máy sấy') || amenity.includes('sấy tóc')) return `💨 ${amenity}`;
          if (amenity.includes('Điện thoại') || amenity.includes('bàn')) return `📞 ${amenity}`;
          if (amenity.includes('Khăn tắm')) return `🛁 ${amenity}`;
          if (amenity.includes('Dép')) return `👡 ${amenity}`;
          if (amenity.includes('Máy lạnh') || amenity.includes('Điều hòa')) return `❄️ ${amenity}`;
          if (amenity.includes('Tủ lạnh')) return `🧊 ${amenity}`;
          if (amenity.includes('Smart TV') || amenity.includes('TV')) return `📺 ${amenity}`;
          if (amenity.includes('Wifi') || amenity.includes('Wi-Fi')) return `📶 ${amenity}`;
          return amenity;
        });
      };
      
      // Combine includedItems and roomAmenities as features
      const allFeatures = [
        ...formatHomestayFeatures(homestayCard.includedItems || []),
        ...formatRoomAmenities(homestayCard.roomAmenities || []),
      ];
      
      // Calculate discount percentage if exists
      const discountPercent = homestayCard.discount > 0 
        ? `Giảm ${homestayCard.discount}%` 
        : 'Đặt từ 3 đêm giảm 15%';
      
      options.push({
        id: 'homestay',
        name: homestayData.heading || 'Lưu Trú Homestay',
        price: homestayCard.finalPrice.toLocaleString('vi-VN'),
        period: '/phòng/đêm',
        popular: false,
        features: allFeatures.length > 0 ? allFeatures : [
          '🏞️ View sông tuyệt đẹp',
          '🛏️ Phòng đầy đủ tiện nghi',
          '🍳 Ăn sáng miễn phí',
          '📶 Wi-Fi tốc độ cao',
          '❄️ Điều hòa, nước nóng',
          '🅿️ Chỗ đỗ xe miễn phí',
        ],
        note: discountPercent,
        cta: {
          text: 'Đặt Phòng Ngay',
          link: 'https://cocoisland.vn',
        },
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        borderColor: 'border-amber-500/20',
        shadowColor: 'shadow-amber-500/10',
      });
    } else {
      // Fallback to hardcoded if no homestay data
      options.push({
        id: 'homestay',
        name: 'Lưu Trú Homestay',
        price: '500,000',
        period: '/phòng/đêm',
        popular: false,
        features: [
          '🏞️ View sông tuyệt đẹp',
          '🛏️ Phòng đầy đủ tiện nghi',
          '🍳 Ăn sáng miễn phí',
          '📶 Wi-Fi tốc độ cao',
          '❄️ Điều hòa, nước nóng',
          '🅿️ Chỗ đỗ xe miễn phí',
        ],
        note: 'Đặt từ 3 đêm giảm 15%',
        cta: {
          text: 'Đặt Phòng Ngay',
          link: 'https://cocoisland.vn',
        },
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        borderColor: 'border-amber-500/20',
        shadowColor: 'shadow-amber-500/10',
      });
    }
    
    // Fallback to hardcoded if no data
    if (options.length === 0) {
      return defaultPricingOptions;
    }
    
    return options;
  }, [ticketData, tourData, homestayData]);
  
  // Get visibility settings (default to true if not set)
  const visibility = pricingSnapshotData?.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;
  
  return (
    <section id="pricing" className="py-20 md:py-28 bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            {isVisible('eyebrow') && pricingSnapshotData?.eyebrow && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2.5 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {pricingSnapshotData.eyebrow}
                </span>
              </div>
            )}
            
            {isVisible('heading') && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
                {pricingSnapshotData?.heading || 'Bảng Giá Tham Khảo'}
              </h2>
            )}
            {isVisible('description') && pricingSnapshotData?.description && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {pricingSnapshotData.description}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Pricing Cards */}
        {isVisible('pricingCards') && (
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 md:gap-10 mb-16">
          {pricingOptions.map((option, index) => (
            <StaggerItem key={option.id}>
              <Card 
                className={`
                  group relative overflow-hidden h-full border-2 transition-all duration-500
                  ${option.popular 
                    ? `border-emerald-500 ${option.shadowColor} shadow-2xl scale-105 md:scale-110` 
                    : `${option.borderColor} dark:border-gray-700 shadow-xl hover:shadow-2xl`
                  }
                  hover:-translate-y-3 bg-white dark:bg-gray-800
                `}
              >
                {/* Popular Badge - Enhanced */}
                {option.popular && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="relative">
                      <div className={`bg-gradient-to-r ${option.gradient} text-white px-5 py-2.5 rounded-bl-2xl rounded-tr-2xl shadow-xl`}>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 fill-white" />
                          <span className="text-sm font-bold">Phổ Biến Nhất</span>
                        </div>
                      </div>
                      <div className={`absolute -inset-1 bg-gradient-to-r ${option.gradient} opacity-30 blur-xl -z-10 animate-pulse`} />
                    </div>
                  </div>
                )}
                
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Floating Gradient Orbs */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`} />
                <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`} />
                
                <CardHeader className="relative p-8 md:p-10 text-center border-b border-gray-100 dark:border-gray-700">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`${option.iconBg} p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-5xl md:text-6xl font-extrabold bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                        {option.price}
                      </span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">₫</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                      {option.period}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="relative p-8 md:p-10 space-y-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`p-1 ${option.iconBg} rounded-full flex-shrink-0 mt-0.5`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Note */}
                  {option.note && (
                    <div className={`p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800`}>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 font-bold">
                          {option.note}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <Button 
                    className={`
                      w-full py-6 md:py-7 text-base md:text-lg font-bold rounded-xl
                      ${option.popular 
                        ? `bg-gradient-to-r ${option.gradient} hover:opacity-90 text-white shadow-lg ${option.shadowColor} shadow-xl` 
                        : 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-gray-900'
                      }
                      hover:scale-105 active:scale-95 transition-all duration-300
                    `}
                    asChild
                  >
                    <Link href={option.cta.link}>
                      {option.cta.text}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
          </StaggerContainer>
        )}

        {/* Trust Badges */}
        <FadeIn delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <div className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                Cam kết giá tốt nhất
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                Không phí ẩn
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                Hỗ trợ 24/7
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Payment Info */}
        {isVisible('paymentInfo') && pricingSnapshotData?.paymentInfo && (
          <FadeIn delay={0.7}>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-6 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800">                  
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">                                                                             
                  {pricingSnapshotData.paymentInfo}
                </p>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}

