// components/StickyNotification.js
"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const StickyNotification = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {isVisible ? (
        <div
          className={`fixed top-30 right-4 max-w-xs bg-lime-800 p-1 rounded-lg shadow-lg z-[999999] hidden md:flex flex-col items-center space-y-1 transition-all duration-500 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
          }`}
        >
          {/* Nút đóng */}
          <button
            onClick={toggleVisibility}
            className="absolute top-2 right-2 text-white text-sm bg-red-800 rounded-full px-2 py-1 hover:bg-red-700"
          >
            Đóng
          </button>

          {/* Hình ảnh phía trên */}
          <Link href="http://online.gov.vn/Home/WebDetails/98345" passHref legacyBehavior>
            <a className="flex flex-col items-center space-y-1">
              <Image
                decoding="async"
                className="w-20 object-cover rounded-md"
                src="/uploads/2022/10/aaa-300x109.jpg.webp"
                alt="Logo Bộ công thương"
                width={300}
                height={109}
              />
              {/* Thông báo phía dưới */}
              <p className="text-yellow-300 dark:text-yellow-400 text-xs font-semibold text-center">
                Trang web chính thức của Khu du lịch Cồn Phụng Bến Tre được Bộ Công Thương xác nhận
              </p>
            </a>
          </Link>
        </div>
      ) : (
        <button
          onClick={toggleVisibility}
          className="fixed top-30 right-4 bg-lime-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-lime-900 transition-all duration-300 z-[999999] hidden md:block"
        >
          Hiện thông báo
        </button>
      )}
    </>
  );
};

export default StickyNotification;
