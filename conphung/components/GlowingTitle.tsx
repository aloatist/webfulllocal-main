"use client";
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface GlowingTitleProps {
  children: React.ReactNode;
}

// Tạo animation phát sáng
const glowing = keyframes`
  0% {
    text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
  }
  50% {
    text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff;
  }
  100% {
    text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
  }
`;

// Styled component cho div phát sáng
const StyledDiv = styled.div`
 font-size: 2.5rem;
  font-weight: bold;
  color: #000; /* Màu chữ mặc định ở chế độ sáng */
  text-align: center;
  transition: all 0.3s ease-in-out;

  /* Hiệu ứng cho chế độ tối */
  .dark & {
    color: #fff;
    animation: ${glowing} 2s infinite;
    text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff;

    &:hover {
      color: #0f0;
      animation: ${glowing} 1.5s infinite;
      text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0, 0 0 40px #0f0;
    }
  }
`;

const GlowingTitle: React.FC<GlowingTitleProps> = ({ children }) => {
  return <StyledDiv>{children}</StyledDiv>;
};

export default GlowingTitle;
