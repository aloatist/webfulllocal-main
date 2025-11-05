'use client'

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { ImageWrapper } from '@/components/ui/image-wrapper'
import { Shield, Award, FileCheck } from 'lucide-react'
import type { CertificatesSection as CertificatesData } from '@/lib/homepage/schema'

interface CertificatesSectionCompactProps {
  data?: CertificatesData;
}

const defaultCertificates = [
  {
    name: 'Giấy Phép Lữ Hành',
    description: 'Quốc tế hợp pháp',
    imageUrl: '/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp',
    icon: '✅',
  },
  {
    name: 'Giấy Kinh Doanh',
    description: 'Đăng ký hợp lệ',
    imageUrl: '/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp',
    icon: '🏢',
  },
  {
    name: 'An Toàn Thực Phẩm',
    description: 'Đảm bảo vệ sinh',
    imageUrl: '/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp',
    icon: '🍴',
  },
]

const iconMap: Record<string, typeof Award> = {
  '✅': Award,
  '🏢': FileCheck,
  '🍴': Shield,
}

const colorMap: Record<number, string> = {
  0: 'from-green-500 to-emerald-500',
  1: 'from-blue-500 to-cyan-500',
  2: 'from-orange-500 to-red-500',
}

export function CertificatesSectionCompact({ data }: CertificatesSectionCompactProps) {
  const certificates = data?.certificates || defaultCertificates;
  const eyebrow = data?.eyebrow || 'Giấy Phép & Chứng Nhận';
  const heading = data?.heading || 'Đơn Vị Du Lịch Uy Tín';
  const description = data?.description || 'Được cấp phép và công nhận bởi các cơ quan chức năng';
  const bottomNote = data?.bottomNote || '✅ Được Bộ Công Thương xác nhận - Đơn vị du lịch uy tín';
  return (
    <FadeIn delay={0.2}>
      <div className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          
          {/* Header - Compact */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-4 py-2 rounded-full mb-3">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {eyebrow}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {description}
            </p>
          </div>

          {/* Trust Badges - Horizontal on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {certificates.map((cert, index) => {
              const IconComponent = iconMap[cert.icon || '✅'] || Award;
              const color = colorMap[index] || colorMap[0];
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      {cert.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {cert.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Images Gallery - Compact Grid */}
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            {certificates.map((cert, index) => {
              const color = colorMap[index] || colorMap[0];
              return (
                <StaggerItem key={index}>
                  <div className="relative group cursor-pointer">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-xl md:rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`} />
                    <div className="relative">
                      <ImageWrapper
                        src={cert.imageUrl}
                        alt={cert.name}
                        aspectRatio="3/4"
                        href={cert.imageUrl}
                        className="rounded-lg md:rounded-xl"
                      />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Bottom Verification Badge */}
          {bottomNote && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 md:px-6 py-3 rounded-full shadow-lg border border-blue-100 dark:border-blue-900">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm md:text-base">
                  {bottomNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  )
}


