"use client";
import React from 'react';
import Image from 'next/image';

const siteBaseUrl = "https://conphungtourist.com";

const TourSection = () => {
  return (
    <div className="my-8">

  <h3 className="text-2xl font-semibold flex items-center gap-3 mb-6 justify-center ">
    TOUR MỚI NHẤT
  </h3>

  <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-50 rounded-md shadow-inner dark:text-black ">
    {tourData.map((tour, index) => (
      <div
        key={index}
        className="min-w-[250px] bg-white   shadow-lg rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      >
        <div className="relative">
          <a href={tour.link} aria-label={tour.title}>
            <Image
              src={tour.image}
              alt={tour.title}
              className="w-full h-60 object-cover rounded-t-lg mb-2"
              width={500} height={300} 
            />
          </a>
        </div>
        <div className="text-center p-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
            {tour.category}
          </p>
          <h4 className="font-semibold text-lg text-gray-800">
          
              {tour.title}
          
          </h4>
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-center mt-8">

    <a
      href={`${siteBaseUrl}/danh-muc-san-pham/tour-moi-nhat/`}
      target="_blank"
      rel="noopener noreferrer"
      className="border w-80 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
    >
      Xem thêm tour
      <i className="icon-angle-right ml-2 text-xl"></i>
    </a>
 
  </div>
</div>

  );
};

const tourData = [
  {
    link: `${siteBaseUrl}/san-pham/du-lich-ben-tre-ca-mau-3-ngay-2-dem/`,
    title: 'Du lịch Bến Tre Cà Mau 3 ngày 2 đêm',
    category: 'Tour Bến Tre',
    image: '/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp',
  },
  {
    link: `${siteBaseUrl}/san-pham/du-lich-ben-tre-ha-tien/`,
    title: 'Du lịch Bến Tre Hà Tiên 2 Ngày 2 Đêm',
    category: 'TOUR MỚI NHẤT',
    image: '/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp',
  },
  {
    link: `${siteBaseUrl}/tour-noi-bat/tour-bong-bong-vung-xanh-con-phung/`,
    title: 'Tour Bong Bóng Vùng Xanh Cồn Phụng | Tham Quan Sông Nước Miền Tây',
    category: 'TOUR MỚI NHẤT',
    image: '/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp',
  },
  {
    link: `${siteBaseUrl}/tour-moi-nhat/tour-tra-vinh-2n1d-con-phung-cona-hotel/`,
    title: 'TOUR TRÀ VINH 2N1Đ – CỒN CHIM – CỒN PHỤNG – HOMESTAY COCO ISLAND',
    category: 'TOUR MỚI NHẤT',
    image: '/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp',
  },
  {
    link: `${siteBaseUrl}/tour-moi-nhat/du-lich-con-phung-diem-den-giao-duc-sinh-thai-mien-tay/`,
    title: 'DU LỊCH CỒN PHỤNG ĐIỂM ĐẾN GIÁO DỤC SINH THÁI MIỀN TÂY',
    category: 'TOUR MỚI NHẤT',
    image: '/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp',
  },
];

export default TourSection;
