'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomestayGalleryProps {
  images: Array<{
    url: string;
    alt?: string;
  }>;
}

export function HomestayGallery({ images }: HomestayGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Không có hình ảnh</span>
      </div>
    );
  }

  // Single image layout
  if (images.length === 1) {
    return (
      <div 
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={images[0].url}
          alt={images[0].alt || 'Homestay image'}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>
    );
  }

  // Mosaic Grid layout for 2+ images
  if (images.length >= 2) {
    return (
      <>
        <div className="relative grid gap-2 rounded-xl overflow-hidden">
          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                  onClick={() => {
                    setActiveIndex(index);
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 512px"
                  />
                </div>
              ))}
            </div>
          )}

          {images.length === 3 && (
            <>
              <div
                className="relative aspect-[16/9] cursor-pointer overflow-hidden"
                onClick={() => {
                  setActiveIndex(0);
                  setIsModalOpen(true);
                }}
              >
                <Image
                  src={images[0].url}
                  alt={images[0].alt || 'Main image'}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {images.slice(1).map((image, index) => (
                  <div
                    key={index + 1}
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                    onClick={() => {
                      setActiveIndex(index + 1);
                      setIsModalOpen(true);
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Image ${index + 2}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 512px"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Airbnb-style Mosaic Grid for 4+ images */}
          {images.length >= 4 && (
            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[500px]">
              {/* Main large image - 2x2 */}
              <div
                className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group"
                onClick={() => {
                  setActiveIndex(0);
                  setIsModalOpen(true);
                }}
              >
                <Image
                  src={images[0].url}
                  alt={images[0].alt || 'Main image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              
              {/* Top right images */}
              {images.slice(1, 3).map((image, index) => (
                <div
                  key={index + 1}
                  className="relative cursor-pointer overflow-hidden group"
                  onClick={() => {
                    setActiveIndex(index + 1);
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Image ${index + 2}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
              
              {/* Bottom right images */}
              {images.slice(3, 5).map((image, index) => (
                <div
                  key={index + 3}
                  className="relative cursor-pointer overflow-hidden group"
                  onClick={() => {
                    setActiveIndex(index + 3);
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Image ${index + 4}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {/* Show all photos button on last image */}
                  {index === 1 && images.length > 5 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(0);
                        setIsModalOpen(true);
                      }}
                      className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Xem tất cả {images.length} ảnh
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Mobile: Simple grid */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer overflow-hidden"
                onClick={() => {
                  setActiveIndex(index);
                  setIsModalOpen(true);
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={index === 0}
                />
                {index === 3 && images.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-semibold text-sm">
                    +{images.length - 4} ảnh
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Gallery */}
        <GalleryModal
          images={images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialIndex={activeIndex}
        />
      </>
    );
  }

  // Swiper for many images
  return (
    <>
      <div className="space-y-2">
        {/* Main Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="aspect-[16/9] w-full rounded-xl"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-full w-full cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbs Swiper */}
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={6}
          freeMode
          watchSlidesProgress
          className="h-20"
          breakpoints={{
            320: { slidesPerView: 4 },
            640: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-20 cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.alt || `Thumb ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal Gallery */}
      <GalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={activeIndex}
      />
    </>
  );
}

// Modal Gallery Component
function GalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  images: Array<{ url: string; alt?: string }>;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative h-[80vh] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
