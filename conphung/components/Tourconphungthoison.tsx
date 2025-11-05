"use client";
import { useState } from 'react';
import Image from 'next/image';
import FadeInOnScroll from './FadeInOnScroll';
import { IncludedItemsList } from '@/components/ui/included-items-list';

import type { Style } from '@/lib/homepage/style-schema';

interface TourSectionProps {
  includedItems?: string[];
  originalPrice?: number;
  discount?: number;
  finalPrice?: number;
  currency?: string;
  imageUrl?: string;
  includedItemsStyle?: Style;
}

const defaultIncludedItems = [
  "🚢 Vé tàu khứ hồi",
  "🌊 Đi tàu trên sông Tiền, ngắm nhìn Tứ Linh Long - Lân - Quy - Phụng",
  "🏛️ Tham quan công trình kiến trúc Đạo Dừa, Bảo tàng Dừa",
  "🍵 Thưởng thức trà mật ong hoa nhãn, bánh mứt tại nhà vườn",
  "🎵 Nghe giao lưu Đờn ca tài tử Nam Bộ, thưởng thức trái cây theo mùa",
  "🚣 Đi xuồng ba lá trong rạch dừa nước",
  "🍬 Tham quan và thưởng thức đặc sản kẹo dừa Bến Tre",
  "🐊 Tham quan trại nuôi cá sấu, cá chép bú bình, bóng nước",
  "👨‍🏫 Hướng dẫn viên du lịch địa phương",
];

export default function TourSection({
  includedItems = defaultIncludedItems,
  originalPrice = 300000,
  discount = 50,
  finalPrice = 149000,
  currency = "₫",
  imageUrl = "/uploads/toursinhthaiconphungbentre-2.webp",
  includedItemsStyle,
}: TourSectionProps = {} as TourSectionProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const toggleDetails = () => setIsDetailsVisible(!isDetailsVisible);

  return (
    <div className="flex flex-col lg:flex-row items-stretch bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-100 dark:border-blue-900/30">
      {/* Hình ảnh */}
            <div className="lg:w-1/2 h-80 lg:h-auto relative group overflow-hidden">
        <Image
          src={imageUrl}
          alt="Tour sinh thái Cồn Phụng Bến Tre"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"                                                              
          loading="lazy"
          width={767}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent group-hover:from-blue-900/80 transition duration-500"></div>
        
                {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">                                                                        
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />                             
              </svg>
              Giảm {discount}%
            </div>
          </div>
        )}
      </div>

            {/* Nội dung */}
      <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
      <FadeInOnScroll>
    {/* Pricing Cards */}
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 mb-6">
      <div className="flex items-center justify-between mb-4">
                <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giá gốc</p>                                                                              
          <p className="text-2xl font-bold text-gray-400 dark:text-gray-500 line-through">                                                                      
            {originalPrice.toLocaleString('vi-VN')}{currency}
          </p>
        </div>
        {discount > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">                                                                        
            -{discount}%
          </div>
        )}
      </div>
      <div className="border-t-2 border-dashed border-orange-300 dark:border-orange-700 pt-4">
        <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          Ưu đãi tháng này:
        </p>
        <p className="text-4xl font-bold text-green-600 dark:text-green-400">
          {finalPrice.toLocaleString('vi-VN')}{currency}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">/ khách</p>
      </div>
    </div>
  </FadeInOnScroll>
       
        {/* Nội dung trên điện thoại */}
        <div className="block lg:hidden">
       
          <button
            onClick={toggleDetails}
           className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all lg:hidden flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDetailsVisible ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
            {isDetailsVisible ? 'Ẩn chi tiết' : 'Xem chi tiết'}
          </button>
        </div>

                {/* Nội dung chi tiết */}
        {(isDetailsVisible || !isDetailsVisible) && (
          <div className={`mt-4 ${isDetailsVisible ? 'block' : 'hidden'} lg:block`}>                                                                            
            <IncludedItemsList 
              items={includedItems} 
              variant="blue" 
              style={includedItemsStyle}
            />
          </div>
        )}
      </div>
    </div>
  );
}
