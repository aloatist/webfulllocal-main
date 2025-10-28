"use client";

import { useCallback, useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string; // Ngày kết thúc giảm giá, định dạng "YYYY-MM-DDTHH:MM:SSZ"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Chỉ định đã chạy trên client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Đảm bảo chỉ chạy khi ở phía client

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup khi component bị unmount
  }, [calculateTimeLeft, isClient]);

  if (!isClient) {
    return null; // Không render khi server render
  }

  return (
    <div className="flex justify-center space-x-6 mt-6 text-5xl font-mono">
  <div className="text-center">
    <span className="block font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
    <span className="text-lg font-semibold tracking-wide opacity-75">NGÀY</span>
  </div>
  <div className="text-center">
    <span className="block font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
    <span className="text-lg font-semibold tracking-wide opacity-75">GIỜ</span>
  </div>
  <div className="text-center">
    <span className="block font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
    <span className="text-lg font-semibold tracking-wide opacity-75">PHÚT</span>
  </div>
  <div className="text-center">
    <span className="block font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
    <span className="text-lg font-semibold tracking-wide opacity-75">GIÂY</span>
  </div>
</div>


  );
};

export default CountdownTimer;
