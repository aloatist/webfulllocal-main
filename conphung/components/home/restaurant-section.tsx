'use client'

import Image from 'next/image'
import { FadeIn } from '@/components/ui/fade-in'
import { Check, UtensilsCrossed } from 'lucide-react'

const specialties = [
  'Cá tai tượng chiên xù',
  'Bánh xèo củ hủ dừa',
  'Cá lóc nướng trui',
  'Gà quay',
  'Xôi phồng',
  'Các loại lẩu chua miền tây',
  'Lẩu mắm',
]

export function RestaurantSection() {
  return (
    <FadeIn delay={0.3}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden shadow-xl p-8 md:p-12 mb-12">
        {/* Image */}
        <div className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src="/uploads/2024/12/nhahangconphung.conphungtourist.com.webp"
              alt="Nhà hàng Khu Du Lịch Cồn Phụng"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sức chứa</p>
                  <p className="font-bold text-gray-900 dark:text-white">2,000+ khách</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Nhà Hàng</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            NHÀ HÀNG KHU DU LỊCH CỒN PHỤNG
          </h2>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Nhà hàng KDL Cồn Phụng Bến Tre với nhiều khu riêng biệt, cạnh bờ sông, rộng rãi, thoáng mát. 
            Chuyên tổ chức tiệc, gala, hội nghị với hệ thống âm thanh, sân khấu, màn hình LED hiện đại.
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Đặc sản miền Tây & món ăn từ dừa:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialties.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-emerald-500 pl-4">
            Ngoài đặc sản vùng miền, nhà hàng còn phục vụ các món ăn Châu Âu, Châu Á, 
            các vùng miền Bắc Trung Nam.
          </p>
        </div>
      </div>
    </FadeIn>
  )
}
