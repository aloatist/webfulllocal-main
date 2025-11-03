'use client'

import { Check, Star, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const pricingOptions = [
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
    color: 'from-blue-500 to-cyan-500',
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
    color: 'from-emerald-500 to-green-500',
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
    color: 'from-amber-500 to-orange-500',
  },
]

export function PricingSnapshotSection() {
  return (
    <section id="pricing" className="py-20 md:py-24 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Giá Ưu Đãi
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Bảng Giá Tham Khảo
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Giá ưu đãi - Minh bạch - Không phí ẩn - Cam kết giá tốt nhất
            </p>
          </div>
        </FadeIn>

        {/* Pricing Cards */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {pricingOptions.map((option, index) => (
            <StaggerItem key={option.id}>
              <Card 
                className={`
                  relative overflow-hidden h-full border-2 
                  ${option.popular 
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-500/10 scale-105 md:scale-110' 
                    : 'border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl'
                  }
                  transition-all duration-300 hover:-translate-y-2
                  bg-white dark:bg-gray-800
                `}
              >
                {/* Popular Badge */}
                {option.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-bl-2xl rounded-tr-xl shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-white" />
                        <span className="text-sm font-bold">Phổ Biến Nhất</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5`} />
                
                <CardHeader className="relative p-6 md:p-8 text-center border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                        {option.price}
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">₫</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.period}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="relative p-6 md:p-8 space-y-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Note */}
                  {option.note && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 font-medium">
                        💡 {option.note}
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <Button 
                    className={`
                      w-full py-6 text-base font-bold
                      ${option.popular 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/30' 
                        : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100'
                      }
                      text-white dark:text-gray-900
                      hover:scale-105 active:scale-95 transition-all
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

        {/* Bottom Note */}
        <FadeIn delay={0.6}>
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              💳 Hỗ trợ thanh toán: Tiền mặt • Chuyển khoản • Ví điện tử • 
              <span className="font-semibold text-emerald-600 dark:text-emerald-400"> Miễn phí hủy trong 24h</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}


