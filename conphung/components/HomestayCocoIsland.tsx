"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import FadeInOnScroll from './FadeInOnScroll'; // Import hiệu ứng nếu dùng component này

const HomestayCocoIsland = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-stretch bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden w-full border-2 border-orange-100 dark:border-orange-900/30">
      {/* Hình nền */}
      <div className="w-full lg:w-1/2 h-80 lg:h-auto relative overflow-hidden group">
        <Image
          src="/uploads/2024/10/coco-island-con-phung-ben-tre40-1024x768-2-768x576.webp"
          alt="Homestay sinh thái Coco Island Cồn Phụng"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          width={768}
          height={576}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-orange-900/20 to-transparent group-hover:from-orange-900/80 transition duration-500"></div>
        
        {/* Eco Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
          Sinh Thái
        </div>
        
        {/* Discount Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
          -30%
        </div>
      </div>

      {/* Nội dung */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 text-gray-900 dark:text-white flex flex-col justify-center space-y-6">
        <FadeInOnScroll>
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full mb-3">
              <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">Homestay Sinh Thái</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              LƯU TRÚ HOMESTAY SINH THÁI
            </h2>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              COCO ISLAND CỒN PHỤNG
            </h3>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giá gốc</p>
                <p className="text-2xl font-bold text-gray-400 dark:text-gray-500 line-through">
                  800,000₫
                </p>
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                -30%
              </div>
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
                560,000₫
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">/ phòng / 2 khách</p>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Nút nhấn "Xem chi tiết" (ẩn trên màn hình lớn) */}
        <button
          className="mt-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all lg:hidden flex items-center justify-center gap-2"
          onClick={() => setDetailsVisible(!detailsVisible)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={detailsVisible ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
          {detailsVisible ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>

        {/* Nội dung chi tiết */}
        <div className={`text-gray-800 dark:text-gray-200 ${detailsVisible ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border-l-4 border-orange-500 mb-6">
            <p className="font-bold text-orange-800 dark:text-orange-300 text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bao gồm:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">🚢 Vé tàu khứ hồi và vé cổng tham quan KDL Cồn Phụng</span>
              </li>
                <li className="flex items-center">
                <svg
                  className="w-3.5 h-3.5 me-2 text-green-800 dark:text-green-800 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="font-medium">☕ Phục vụ ăn sáng (Tô + ly)</span>
              </li>
                <li className="flex items-center">
                <svg
                  className="w-3.5 h-3.5 me-2 text-green-800 dark:text-green-800 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="font-medium">🎁 Check in phòng tặng kèm: trái cây + dừa tươi/khách, cafe gói + trà gói + nước suối miễn phí</span>
              </li>
            </ul>
          </div>
        
          <FadeInOnScroll>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border-l-4 border-blue-500">
              <p className="font-bold text-blue-800 dark:text-blue-300 text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                TIỆN NGHI & VẬT DỤNG TRONG PHÒNG:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">⚡</span>
                  <span className="text-sm">Ấm điện siêu tốc</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">💨</span>
                  <span className="text-sm">Máy sấy tóc</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">📞</span>
                  <span className="text-sm">Điện thoại bàn</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">🛁</span>
                  <span className="text-sm">Khăn tắm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">👡</span>
                  <span className="text-sm">Dép</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">❄️</span>
                  <span className="text-sm">Máy lạnh</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">🧊</span>
                  <span className="text-sm">Tủ lạnh</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">📺</span>
                  <span className="text-sm">Smart TV</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">📶</span>
                  <span className="text-sm">Wifi miễn phí</span>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
};

export default HomestayCocoIsland;
