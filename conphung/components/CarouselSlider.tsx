'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import Image from 'next/image';
import styled from 'styled-components';

interface CarouselSliderProps {
  images?: Array<{ url: string; alt?: string; caption?: string }>;
}

const defaultImages = [
  "/uploads/2024/10/22196236_901710536664938_7027468764014750282_n.webp",
  "/uploads/2024/10/22405754_905859629583362_7823146011914182650_n-1.webp",
  "/uploads/2024/10/bang-tieu-bieu-song-cuu-long-600-x-600-.webp",
  "/uploads/2024/10/banh-xeo-con-phung.webp",
  "/uploads/2024/10/cabubinhconphungbentre.conphungtourist.com_.webp",
  "/uploads/2024/10/catituongchienxu.conphungtourist.com_-1024x767-1.webp",
  "/uploads/2024/10/cocoislandconphugbentre-1024x767-1.webp",
  "/uploads/2024/10/coco-island-con-phung-ben-tre41-1024x576-1.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com8.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com9.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com15.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com16.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com17.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com18.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com19.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com20.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com21.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com22.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com23.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com26.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com27.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com28.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com29.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com30.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com33.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com34.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com35.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com36.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com37.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com38.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com40.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com41.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com42.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com44.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com45.webp",
  "/uploads/2024/11/dulichconphungbentre_conphungtourist.com46.webp",
];

const CarouselSlider = ({ images }: CarouselSliderProps = {}) => {
  // Use provided images or fallback to default
  const imageList = images && images.length > 0
    ? images.map(img => typeof img === 'string' ? { url: img, alt: '' } : img)
    : defaultImages.map(url => ({ url, alt: 'Gallery image' }));

  return (
    <StyledWrapper>
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        navigation
        pagination={{ clickable: true }}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        speed={800}
        coverflowEffect={{
          rotate: 0.3,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          1024: {
            slidesPerView: 4,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            },
          },
        }}
        className="mySwiper card"
      >
        {imageList.map((image, index) => (
          <SwiperSlide
            key={index}
            className="group relative p-2"
            style={{ height: '400px', position: 'relative' }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden transform transition-all duration-700 ease-out will-change-transform group-hover:scale-[1.05] group-hover:z-10">
              {/* Image Container */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || image.caption || `Gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    // Fallback to a placeholder or hide the image
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Gradient Overlay - Light */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] blur-xl"></div>
                </div>
              </div>

              {/* Border Glow */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-emerald-400/50 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              {/* Shadow Effect */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-400/0 via-green-400/0 to-teal-400/0 group-hover:from-emerald-400/20 group-hover:via-green-400/20 group-hover:to-teal-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .swiper-slide {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .swiper-slide-active {
    transform: scale(1.05);
    z-index: 2;
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.8;
  }

  /* Smooth transitions for all slides */
  .swiper-slide-shadow-left,
  .swiper-slide-shadow-right {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1),
      transparent
    ) !important;
    border-radius: 12px;
  }

  /* Navigation buttons styling */
  .swiper-button-next,
  .swiper-button-prev {
    color: rgba(34, 197, 94, 0.8);
    transition: all 0.3s ease;
    
    &:hover {
      color: rgba(34, 197, 94, 1);
      transform: scale(1.1);
    }
    
    &::after {
      font-size: 24px;
      font-weight: bold;
    }
  }

  /* Pagination dots styling */
  .swiper-pagination-bullet {
    background: rgba(34, 197, 94, 0.5);
    width: 12px;
    height: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(34, 197, 94, 0.8);
      transform: scale(1.2);
    }
  }

  .swiper-pagination-bullet-active {
    background: rgba(34, 197, 94, 1);
    width: 32px;
    border-radius: 6px;
    transform: scale(1);
  }

  /* Media Queries cho màn hình lớn */
  @media (min-width: 1024px) {
    .card {
      max-width: none;
      width: auto;
      height: 550px;
      background-color: rgba(0, 0, 0, 0.8);
      padding: 20px 0;
    }

    .swiper-slide {
      width: 25%;
      height: 450px;
      padding: 8px;
    }

    .swiper-slide-active {
      transform: scale(1.08);
    }
  }

  /* Performance optimization */
  @supports (will-change: transform) {
    .swiper-slide {
      will-change: transform;
    }
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    .swiper-slide,
    .swiper-slide * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export default CarouselSlider;
