"use client";
import React, { useEffect, useState } from "react";

interface FadeInOnScrollProps {
  children: React.ReactNode;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState("translate-y-10"); // Mặc định: từ dưới lên
  const domRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Chọn ngẫu nhiên hướng di chuyển
    const directions = [
      "translate-y-10", // Từ dưới lên
      "-translate-y-10", // Từ trên xuống
      "translate-x-10", // Từ trái sang
      "-translate-x-10", // Từ phải sang
    ];
    setDirection(directions[Math.floor(Math.random() * directions.length)]);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 } // Hiển thị khi 10% phần tử trong viewport
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${direction}`
      }`}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
