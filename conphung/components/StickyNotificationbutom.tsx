"use client";
import Link from "next/link";
import styled from 'styled-components';

const StickyNotificationbutom = () => {
  return (
    <StyledWrapper>


   

      <div className="wrapper bottom-20 left-4 md:bottom-4 z-[50] animate-bounce hover:animate-none">
     
        <input type="checkbox" />
       
        <div className="btn" />
       
        <div className="tooltip"><span>
            {/* Danh sách liên hệ hiển thị khi nhấn nút */}
    
        <div className="fixed bottom-20 left-4 md:bottom-4 max-w-xs bg-white p-4 rounded-lg shadow-lg z-[50] flex flex-col space-y-2">
          <p className="mb-0 dark:text-black">
            <strong>Hotline:</strong>{" "}
            <span className="text-red-600">
              <Link href="tel:+84918267715" passHref legacyBehavior>
                <a className="text-red-600 hover:underline">0918 267 715</a>
              </Link>
            </span>
          </p>
          <p className="mb-0 dark:text-black">
            Đặt tour Ms Cương:{" "}
            <span className="text-red-600">
              <Link href="tel:+84917645039" passHref legacyBehavior>
                <a className="text-red-600 hover:underline">0917 645 039</a>
              </Link>
            </span>
          </p>
          <p className="mb-0 dark:text-black">
            Đặt tour Ms Nhiên:{""}
            <span className="text-red-600">
              <Link href="tel:+84948416066" passHref legacyBehavior>
                <a className="text-red-600 hover:underline">0948 416 066</a>
              </Link>
            </span>
          </p>
          
        </div>
    
          
          </span></div>
        
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    --background: #ffffff;
    --icon-color: #414856;
    --shape-color-01: #b8cbee;
    --shape-color-02: #7691e8;
    --shape-color-03: #fdd053;
    --width: 60px;
    --height: 60px;
    --border-radius: var(--height);
    width: var(--width);
    height: var(--height);
    position: relative;
    border-radius: var(--border-radius);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
  }
.wrapper .btn {
  background: var(--background);
  width: var(--width);
  height: var(--height);
  position: relative;
  z-index: 3;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-animation: plus-animation-reverse 0.5s ease-out forwards;
  animation: plus-animation-reverse 0.5s ease-out forwards;

  /* Thêm biểu tượng điện thoại */
  background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e74c3c"%3E%3Cpath d="M6.62 10.79a15.05 15.05 0 006.6 6.6l2.2-2.2a1 1 0 011.05-.23 11.72 11.72 0 003.7.59 1 1 0 011 1v3.55a1 1 0 01-.92 1 19.8 19.8 0 01-8.73-2.54 19.66 19.66 0 01-6.06-6.06A19.8 19.8 0 013.5 4.92a1 1 0 011-.92H8a1 1 0 011 1 11.72 11.72 0 00.58 3.69 1 1 0 01-.23 1.05z"%3E%3C/path%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
}



  .wrapper .btn::before {
    width: 4px;
    height: 20px;
  }
  .wrapper .btn::after {
    width: 20px;
    height: 4px;
  }
  .wrapper .tooltip {
    width: fit-content;
    height: 75px;
    border-radius: 70px;
    position: absolute;

    z-index: 2;
    padding: 20px 35px;
    box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05);
    opacity: 0;
    top: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: opacity 0.15s ease-in, top 0.15s ease-in, width 0.15s ease-in;
  }
  .wrapper .tooltip > span {
    position: relative;
    width: 100%;
    white-space: nowrap;
    opacity: 0;
  }

  
  .wrapper input {
    height: 100%;
    width: 100%;
    border-radius: var(--border-radius);
    cursor: pointer;
    position: absolute;
    z-index: 5;
    opacity: 0;
  }
  
  .wrapper input:checked ~ .tooltip {
    width: fit-content;
    padding: 30px;
    -webkit-animation: stretch-animation 1s ease-out forwards 0.15s;
    animation: stretch-animation 1s ease-out forwards 0.15s;
    top: -90px;
    opacity: 1;
  }

  .wrapper input:checked ~ .tooltip > span {
    opacity: 1;
  }

  @-webkit-keyframes pang-animation {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }

  @keyframes pang-animation {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }
  @-webkit-keyframes plus-animation {
    0% {
      transform: rotate(0) scale(1);
    }
    20% {
      transform: rotate(60deg) scale(0.93);
    }
    55% {
      transform: rotate(35deg) scale(0.97);
    }
    80% {
      transform: rotate(48deg) scale(0.94);
    }
    100% {
      transform: rotate(45deg) scale(0.95);
    }
  }
  @keyframes plus-animation {
    0% {
      transform: rotate(0) scale(1);
    }
    20% {
      transform: rotate(60deg) scale(0.93);
    }
    55% {
      transform: rotate(35deg) scale(0.97);
    }
    80% {
      transform: rotate(48deg) scale(0.94);
    }
    100% {
      transform: rotate(45deg) scale(0.95);
    }
  }
  @-webkit-keyframes plus-animation-reverse {
    0% {
      transform: rotate(45deg) scale(0.95);
    }
    20% {
      transform: rotate(-15deg);
    }
    55% {
      transform: rotate(10deg);
    }
    80% {
      transform: rotate(-3deg);
    }
    100% {
      transform: rotate(0) scale(1);
    }
  }
  @keyframes plus-animation-reverse {
    0% {
      transform: rotate(45deg) scale(0.95);
    }
    20% {
      transform: rotate(-15deg);
    }
    55% {
      transform: rotate(10deg);
    }
    80% {
      transform: rotate(-3deg);
    }
    100% {
      transform: rotate(0) scale(1);
    }
  }
  @-webkit-keyframes stretch-animation {
    0% {
      transform: scale(1, 1);
    }
    10% {
      transform: scale(1.1, 0.9);
    }
    30% {
      transform: scale(0.9, 1.1);
    }
    50% {
      transform: scale(1.05, 0.95);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  @keyframes stretch-animation {
    0% {
      transform: scale(1, 1);
    }
    10% {
      transform: scale(1.1, 0.9);
    }
    30% {
      transform: scale(0.9, 1.1);
    }
    50% {
      transform: scale(1.05, 0.95);
    }
    100% {
      transform: scale(1, 1);
    }
  }

 `;

export default StickyNotificationbutom;
