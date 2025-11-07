'use client'

import Image from 'next/image'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in'
import { Video, Car, Bike, Navigation, Leaf } from 'lucide-react'
import type { VideoGuideSection as VideoData } from '@/lib/homepage/schema'

interface VideoGuideSectionProps {
  data?: VideoData;
}

const defaultData: VideoData = {
  heading: "VIDEO HƯỚNG DẪN ĐƯỜNG ĐI",
  description: "Xem video để biết cách di chuyển đến Cồn Phụng dễ dàng nhất từ TP.HCM và các tỉnh lân cận",
  isVisible: true,
  videos: [
    {
      title: "Hướng dẫn đi Cồn Phụng từ TP.HCM",
      url: "https://www.youtube.com/watch?v=example1",
      thumbnail: "placeholder", // Will use gradient placeholder
      duration: "5:30"
    },
    {
      title: "Trải nghiệm 1 ngày tại Cồn Phụng",
      url: "https://www.youtube.com/watch?v=example2",
      thumbnail: "placeholder", // Will use gradient placeholder
      duration: "8:45"
    }
  ]
};

export function VideoGuideSection({ data = defaultData }: VideoGuideSectionProps) {
  if (!data || !data.isVisible) return null;

  // Get visibility settings (default to true if not set)
  const visibility = data.visibility || {};
  const isVisible = (field: keyof typeof visibility) => visibility[field] !== false;

  if (!isVisible('videos') || !data.videos || data.videos.length === 0) return null;

  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-5 py-2 rounded-full mb-4">
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Hướng Dẫn</span>
            </div>
            
            {isVisible('heading') && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                {data.heading}
              </h2>
            )}
            {isVisible('description') && data.description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                {data.description}
              </p>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Dễ Tìm Đường</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Chỉ dẫn rõ ràng</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Cảnh Đẹp</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Dọc đường sinh thái</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Đa Phương Tiện</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Xe máy, ô tô</p>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          {isVisible('videos') && (
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.videos.map((video, index) => (
              <StaggerItem key={index}>
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Video Thumbnail */}
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative aspect-video overflow-hidden"
                  >
                    {/* Placeholder Background (always shown) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center">
                      <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                        <svg 
                          className="w-12 h-12 text-white ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Thumbnail Image (if exists) */}
                    {video.thumbnail && !video.thumbnail.includes('placeholder') && (
                      <Image 
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={(e) => {
                          // Hide image on error, show placeholder
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Title Overlay on Thumbnail */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/40 to-transparent">
                      <h3 className="text-lg font-bold text-emerald-400 drop-shadow-lg">
                        {video.title}
                      </h3>
                    </div>
                  </a>

                  {/* Title Below Thumbnail */}
                  <div className="p-5 bg-white dark:bg-gray-800">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span>{video.duration || 'Xem video hướng dẫn chi tiết'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
              <Navigation className="w-5 h-5 text-emerald-600" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                💡 Mẹo: Sử dụng Google Maps để dẫn đường chính xác nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
