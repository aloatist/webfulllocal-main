'use client'

import { Heart, DollarSign, Headphones, Shield, Clock, Users } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Heart,
    title: 'Tận Tâm Phục Vụ',
    description: 'Chăm sóc khách hàng từ A-Z với đội ngũ nhiệt tình, tận tụy',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50 dark:bg-red-900/10',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    icon: DollarSign,
    title: 'Giá Tốt Nhất',
    description: 'Cam kết giá ưu đãi, minh bạch - Không phí ẩn',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Headphones,
    title: 'Hỗ Trợ 24/7',
    description: 'Sẵn sàng phục vụ mọi lúc, trước - trong - sau chuyến đi',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
]

const stats = [
  {
    value: '2,000+',
    label: 'Khách Hàng',
    icon: Users,
  },
  {
    value: '4.8/5',
    label: 'Đánh Giá',
    icon: Shield,
  },
  {
    value: '15+',
    label: 'Năm Kinh Nghiệm',
    icon: Clock,
  },
]

export function ValuePropositionSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Stats Bar */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-16 p-6 md:p-8 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl border border-emerald-100 dark:border-gray-700">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Features Grid */}
        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-gray-800 h-full">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Decorative Element */}
                  <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Trust Line */}
        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              ✅ Được <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bộ Công Thương</span> xác nhận - 
              Đơn vị du lịch <span className="font-semibold">uy tín, chất lượng</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}


