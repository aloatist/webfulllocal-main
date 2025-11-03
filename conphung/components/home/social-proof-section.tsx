'use client'

import { Star, Quote, User, Calendar, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: '',
    rating: 5,
    date: '15/01/2025',
    content: 'Trải nghiệm tuyệt vời! Cảnh đẹp, nhân viên nhiệt tình, ăn uống ngon. Gia đình tôi rất hài lòng và sẽ quay lại.',
    tourType: 'Tour 1 ngày',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: '',
    rating: 5,
    date: '10/01/2025',
    content: 'Homestay sạch sẽ, view đẹp, giá cả hợp lý. Rất phù hợp cho gia đình có trẻ nhỏ. Sẽ giới thiệu cho bạn bè.',
    tourType: 'Homestay 2N1Đ',
  },
  {
    id: 3,
    name: 'Lê Hoàng C',
    avatar: '',
    rating: 5,
    date: '05/01/2025',
    content: 'Hướng dẫn viên nhiệt tình, giải thích kỹ về văn hóa Đạo Dừa. Tour rất đáng giá, recommend mạnh!',
    tourType: 'Tour văn hóa',
  },
]

const trustStats = [
  { value: '2,000+', label: 'Khách Hàng', icon: User },
  { value: '15+', label: 'Năm Kinh Nghiệm', icon: Calendar },
  { value: '98%', label: 'Hài Lòng', icon: ThumbsUp },
]

export function SocialProofSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            {/* Rating Stars */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i} 
                  className="w-7 h-7 md:w-8 md:h-8 fill-yellow-400 text-yellow-400 drop-shadow-md" 
                />
              ))}
              <span className="text-3xl md:text-4xl font-bold ml-3 text-gray-900 dark:text-white">
                4.8<span className="text-gray-500 text-2xl">/5</span>
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Hơn 2,000+ đánh giá 5 sao từ khách hàng đã trải nghiệm
            </p>
          </div>
        </FadeIn>

        {/* Trust Stats */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            {trustStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Reviews Grid */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <StaggerItem key={review.id}>
              <Card className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800">
                <CardContent className="p-6 md:p-8 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-emerald-500/20" />
                  
                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base italic">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  
                  {/* Tour Type Tag */}
                  <div className="inline-flex px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                    {review.tourType}
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-emerald-500/20">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">
                          {review.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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

        {/* Bottom CTA */}
        <FadeIn delay={0.6}>
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🌟 Trở thành khách hàng hài lòng tiếp theo!
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Đặt tour ngay để nhận ưu đãi tốt nhất và trải nghiệm dịch vụ 5 sao
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

