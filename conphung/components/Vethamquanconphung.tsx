"use client";
import React, { useState } from "react";
import FadeInOnScroll from "../components/FadeInOnScroll";
import Image from 'next/image';

const Vethamquanconphung = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDetailsToggle = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden w-full border-2 border-emerald-100 dark:border-emerald-900/30">
      {/* Hình nền */}
      <div className="w-full lg:w-1/2 h-80 lg:h-auto overflow-hidden relative group">
        <FadeInOnScroll>
          <Image
            src="/uploads/2024/10/du-thuyen-tren-song-conphungtourisdt.com_-768x575.webp"
            alt="Du thuyền sinh thái Cồn Phụng"
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="lazy"
            width={768}
            height={575}
          />
        </FadeInOnScroll>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent group-hover:from-emerald-900/80 transition duration-500"></div>
        
        {/* Badge on Image */}
        <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Chính Chủ
        </div>
      </div>

      {/* Nội dung */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 text-gray-900 dark:text-white flex flex-col justify-center">
        <FadeInOnScroll>
          
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-3">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Vé Chính Chủ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              VÉ CỔNG CHÍNH CHỦ
            </h2>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              KHU DU LỊCH SINH THÁI CỒN PHỤNG
            </h3>
          </div>
        </FadeInOnScroll>

        <div className="space-y-4 mb-6">
        <FadeInOnScroll>
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Người lớn */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <p className="font-bold text-red-800 dark:text-red-400 text-lg">
                  Người lớn
                </p>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                50,000₫
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">/ vé</p>
            </div>

            {/* Trẻ em */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <p className="font-bold text-green-800 dark:text-green-400 text-lg">
                  Trẻ em
                </p>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                30,000₫
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">/ vé</p>
            </div>
          </div>
        </FadeInOnScroll>

          {/* Hiển thị nút chi tiết trên mobile */}
          <div className="block lg:hidden mt-4">
            <div className={`relative group`}>
              <button
               className="mt-4 bg-gradient-to-r from-emerald-600 to-green-600 w-full text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all lg:hidden flex items-center justify-center gap-2"
                onClick={handleDetailsToggle}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showDetails ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
                {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>
              <span className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>{showDetails ? "Ẩn chi tiết vé tham quan" : 
              
              
              
              "Xem chi tiết vé tham quan"}
              
              
              
              </span>
            </div>
          </div>

          {/* Nội dung chi tiết (ẩn trên mobile nếu chưa mở) */}
          <div
            className={`mt-4 text-gray-700 ${
              showDetails ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border-l-4 border-emerald-500">
              <p className="font-bold text-emerald-800 dark:text-emerald-300 text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bao gồm:
              </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">🚢 Miễn phí vé tàu khứ hồi</span>
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
                <span className="font-medium">🐊 Tham quan trại nuôi cá sấu</span>
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
                <span className="font-medium">🍬 Tham quan sản xuất kẹo Dừa</span>
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
                <span className="font-medium">🥥 Thủ công mỹ nghệ từ Dừa</span>
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
                <span className="font-medium">🏛️ Tham quan di tích Đạo Dừa</span>
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
                <span className="font-medium">🏛️ Bảo tàng Dừa</span>
              </li>
            </ul>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-l-4 border-blue-500">
              <p className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                📍 Điểm đón khách:
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bến phà Rạch Miễu cũ, thuộc xã Tân Thạch, huyện Châu Thành, tỉnh Bến Tre.
              </p>
              <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Lưu ý:</strong> Đến bến phà, vui lòng gọi Hotline để được hỗ trợ tàu đón, tránh nhầm lẫn không phải chính chủ khu du lịch Cồn Phụng.</span>
                </p>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vethamquanconphung;
