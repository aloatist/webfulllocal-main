// components/GsapScrollEffect.tsx
"use client";
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GsapScrollEffect = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    gsap.fromTo(
      ".gsap-scroll-effect",
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: ".gsap-scroll-effect",
          start: "top 0%",      // Bắt đầu xuất hiện khi phần tử gần màn hình
          end: "bottom top+=5", // Mất dần khi gần cuộn hết trang
          scrub: true,            // Giúp hiệu ứng cuộn mượt mà theo vị trí cuộn
        },
      }
    );
  }, []);

  return (
    <div className="gsap-scroll-effect text-center mt-10">
      {children}
    </div>
  );
};

export default GsapScrollEffect;
