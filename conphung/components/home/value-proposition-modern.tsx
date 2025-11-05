'use client'

import { Heart, DollarSign, Headphones, Shield, Clock, Users, Sparkles, Award } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Heart,
    title: 'Tận Tâm Phục Vụ',
    description: 'Chăm sóc khách hàng từ A-Z với đội ngũ nhiệt tình, tận tụy',
    gradient: 'from-red-500 via-pink-500 to-rose-500',
    bgGradient: 'from-red-50 to-pink-50',
    iconBg: 'bg-gradient-to-br from-red-500 to-pink-500',
  },
  {
    icon: DollarSign,
    title: 'Giá Tốt Nhất',
    description: 'Cam kết giá ưu đãi, minh bạch - Không phí ẩn',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-green-50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
  },
  {
    icon: Headphones,
    title: 'Hỗ Trợ 24/7',
    description: 'Sẵn sàng phục vụ mọi lúc, trước - trong - sau chuyến đi',
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
]

const stats = [
  {
    value: '2,000+',
    label: 'Khách Hàng',
    icon: Users,
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    value: '4.8/5',
    label: 'Đánh Giá',
    icon: Award,
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    value: '15+',
    label: 'Năm Kinh Nghiệm',
    icon: Clock,
    gradient: 'from-blue-500 to-cyan-500',
  },
]

export function ValuePropositionModern() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        
        {/* Stats Bar - Modern Design */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-20">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
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
            ))}
          </div>
        </FadeIn>

        {/* Section Header */}
        <FadeIn delay={0.2}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2.5 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                Tại Sao Chọn Chúng Tôi
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
              Giá Trị Nổi Bật
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm du lịch tốt nhất cho mọi khách hàng
            </p>
          </div>
        </FadeIn>

        {/* Features Grid - Modern Cards */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white dark:bg-gray-800 h-full">
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Floating Gradient Orbs */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
                <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 md:p-10 text-center space-y-6">
                  {/* Icon with Modern Design */}
                  <div className="flex justify-center">
                    <div className={`relative inline-flex p-5 rounded-3xl ${feature.iconBg} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                    {feature.description}
                  </p>
                  
                  {/* Decorative Line */}
                  <div className="flex items-center justify-center">
                    <div className={`h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full opacity-50 group-hover:opacity-100 group-hover:w-24 transition-all duration-500`} />
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Trust Line - Enhanced */}
        <FadeIn delay={0.6}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-8 py-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
                ✅ Được <span className="font-bold text-emerald-600 dark:text-emerald-400">Bộ Công Thương</span> xác nhận • 
                Đơn vị du lịch <span className="font-bold">uy tín, chất lượng hàng đầu</span>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}


