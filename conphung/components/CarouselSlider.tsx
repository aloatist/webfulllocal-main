'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
//import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import styled from 'styled-components';

const CarouselSlider = () => {
  const images = [
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
        {images.map((imageUrl, index) => (
          <SwiperSlide
            key={index}
            className="transform transition-transform duration-500 hover:scale-105 hover:rotate-2 hover:shadow-1xl p-1 rounded-lg "
            style={{ height: '400px', position: 'relative' }}
          >
            <Image
              src={imageUrl}
              alt={`dulichconphungbentre_conphungtourist.com ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              style={{ objectFit: 'cover' }}
              className="rounded-lg glowing-image "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
 

  /* Media Queries cho màn hình lớn */
  @media (min-width: 1024px) {
    .card {
      max-width: none;
      width:auto;
      height:550px;
      background-color: rgba(0, 0, 0, 0.8); /* Màu đen với độ trong suốt 50% */

    }

    .swiper-slide {
      width: 25%; /* Mỗi slide chiếm 25% chiều rộng container */
     height: 450px;
    }
   
  }
`;

export default CarouselSlider;
