'use client'

import { FadeIn } from '@/components/ui/fade-in'
import { MapPin, Navigation, Leaf } from 'lucide-react'
import type { MapSection as MapData } from '@/lib/homepage/schema'

interface MapSectionProps {
  data?: MapData;
}

const defaultData: MapData = {
  heading: "ĐƯỜNG ĐẾN CỒN PHỤNG",
  description: "Hướng dẫn chi tiết cách di chuyển đến khu du lịch Cồn Phụng",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.123456789!2d106.3687357!3d10.3367211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzEyLjIiTiAxMDbCsDIyJzA3LjQiRQ!5e0!3m2!1svi!2s!4v1234567890",
  address: "Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long",
  coordinates: {
    lat: 10.3367211,
    lng: 106.3687357
  }
};

export function MapSection({ data = defaultData }: MapSectionProps) {
  if (!data) return null;

  return (
    <FadeIn delay={0.2}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-xl mb-12">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Vị Trí</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {data.heading}
            </h2>
            {data.description && (
              <p className="text-gray-600 dark:text-gray-400 ">
                {data.description}
              </p>
            )}
            {data.address && (
              <p className="text-gray-600 dark:text-gray-400 ">
                📍 {data.address}
              </p>
            )}
          </div>

          {/* Map Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 group">
            <iframe
              src={data.embedUrl}
              className="w-full h-[450px] md:h-[550px] transition-transform duration-500 group-hover:scale-105"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={data.heading}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Khoảng cách</p>
                <p className="font-semibold text-gray-900 dark:text-white">10km từ trung tâm</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Địa chỉ</p>
                <p className="font-semibold text-gray-900 dark:text-white">Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Môi trường</p>
                <p className="font-semibold text-gray-900 dark:text-white">Sinh thái xanh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
