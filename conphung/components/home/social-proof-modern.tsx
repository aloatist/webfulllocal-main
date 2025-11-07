'use client'

import { Star, Quote, User, Calendar, ThumbsUp, CheckCircle, Sparkles, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { SocialProofSection } from '@/lib/homepage/schema'
import * as LucideIcons from 'lucide-react'

interface SocialProofModernProps {
  data?: SocialProofSection;
}

const defaultReviews = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: '',
    rating: 5,
    date: '15/01/2025',
    content: 'Trải nghiệm tuyệt vời! Cảnh đẹp, nhân viên nhiệt tình, ăn uống ngon. Gia đình tôi rất hài lòng và sẽ quay lại.',
    tourType: 'Tour 1 ngày',
    verified: true,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: '',
    rating: 5,
    date: '10/01/2025',
    content: 'Homestay sạch sẽ, view đẹp, giá cả hợp lý. Rất phù hợp cho gia đình có trẻ nhỏ. Sẽ giới thiệu cho bạn bè.',
    tourType: 'Homestay 2N1Đ',
    verified: true,
  },
  {
    id: '3',
    name: 'Lê Hoàng C',
    avatar: '',
    rating: 5,
    date: '05/01/2025',
    content: 'Hướng dẫn viên nhiệt tình, giải thích kỹ về văn hóa Đạo Dừa. Tour rất đáng giá, recommend mạnh!',
    tourType: 'Tour văn hóa',
    verified: true,
  },
]

const defaultTrustStats = [
  { value: '2,000+', label: 'Khách Hàng', icon: 'User', gradient: 'from-emerald-500 to-green-500' },
  { value: '15+', label: 'Năm Kinh Nghiệm', icon: 'Calendar', gradient: 'from-blue-500 to-cyan-500' },
  { value: '98%', label: 'Hài Lòng', icon: 'ThumbsUp', gradient: 'from-amber-500 to-orange-500' },
]

export function SocialProofModern({ data }: SocialProofModernProps = {}) {
  if (!data || !data.isVisible) return null;

  // Get visibility settings (default to true if not set)
  const visibility = data.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;

  const displayData = data || {
    eyebrow: 'Đánh Giá Từ Khách Hàng',
    heading: 'Khách Hàng Nói Gì Về Chúng Tôi',
    description: 'Hơn 2,000+ đánh giá 5 sao từ khách hàng đã trải nghiệm',
    overallRating: 4.8,
    ratingText: '4.8/5',
    testimonials: defaultReviews,
    trustStats: defaultTrustStats,
    bottomCTAText: '🌟 Trở thành khách hàng hài lòng tiếp theo!',
    bottomCTADescription: 'Đặt tour ngay để nhận ưu đãi tốt nhất và trải nghiệm dịch vụ 5 sao',
    isActive: true,
    isVisible: true,
  };
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            {/* Rating Stars */}
            {isVisible('overallRating') && (displayData.overallRating || displayData.ratingText) && (
              <div className="flex items-center justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className="w-8 h-8 md:w-10 md:h-10 fill-yellow-400 text-yellow-400 drop-shadow-lg" 
                  />
                ))}
                <span className="text-4xl md:text-5xl font-extrabold ml-4 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
                  {displayData.ratingText || `${displayData.overallRating}`}
                  {displayData.ratingText && !displayData.ratingText.includes('/') && (
                    <span className="text-2xl md:text-3xl text-gray-500">/5</span>
                  )}
                </span>
              </div>
            )}
            
            {isVisible('eyebrow') && displayData.eyebrow && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2.5 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {displayData.eyebrow}
                </span>
              </div>
            )}
            
            {isVisible('heading') && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
                {displayData.heading}
              </h2>
            )}
            {isVisible('description') && displayData.description && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {displayData.description}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Trust Stats - Enhanced */}
        {isVisible('trustStats') && displayData.trustStats && displayData.trustStats.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-16">
              {displayData.trustStats.map((stat, index) => {
                const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.Star;
                return (
                  <div 
                    key={index} 
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-10 text-white" />
                        </div>
                      </div>
                      <div className={`text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* Reviews Grid - Enhanced */}
        {isVisible('testimonials') && displayData.testimonials && displayData.testimonials.length > 0 && (
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 md:gap-10">
            {displayData.testimonials.map((review, index) => (
            <StaggerItem key={review.id}>
              <Card className="group relative overflow-hidden h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white dark:bg-gray-800">
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating Gradient Orbs */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 rounded-full blur-3xl transition-opacity duration-500" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-full blur-3xl transition-opacity duration-500" />
                
                <CardContent className="relative p-8 md:p-10 space-y-6">
                  {/* Rating & Quote */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-5 h-5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
                        />
                      ))}
                    </div>
                    <Quote className="w-12 h-12 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors" />
                  </div>
                  
                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-medium">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  
                  {/* Tour Type Tag & Verified */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs md:text-sm font-bold">
                      <Award className="w-4 h-4" />
                      {review.tourType}
                    </div>
                    {review.verified && (
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Đã xác thực
                      </div>
                    )}
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-3 border-emerald-500/30 group-hover:border-emerald-500/50 transition-colors">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold text-lg">
                          {review.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white text-base">
                            {review.name}
                          </p>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {review.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
        )}

        {/* Bottom CTA - Enhanced */}
        {isVisible('bottomCTA') && (displayData.bottomCTAText || displayData.bottomCTADescription) && (
          <FadeIn delay={0.6}>
            <div className="mt-16 text-center">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-900/20 p-10 md:p-12 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-emerald-500 rounded-full">
                      <Star className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  {displayData.bottomCTAText && (
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                      {displayData.bottomCTAText}
                    </h3>
                  )}
                  {displayData.bottomCTADescription && (
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
                      {displayData.bottomCTADescription}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Cam kết hoàn tiền nếu không hài lòng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}

