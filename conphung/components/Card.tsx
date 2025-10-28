"use client";
import React from 'react';
import Image from 'next/image';
import FadeInOnScroll from "../components/FadeInOnScroll";


const Card = () => {
  return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-2 mb-10 w-full">
      <div className=" relative overflow-hidden rounded-lg  transform transition-transform duration-300 hover:scale-105 hover:shadow-xl ">
        
        <div className="content">
          <div className="back">
            <div className="back-content ">
         
            {/* Hình ảnh 1 */}
    <FadeInOnScroll>
 
 <Image
   src="/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp"
   alt="Ưu đãi tour Tết Cồn Phụng cho gia đình"
   className="w-full h-auto object-cover"
   loading="lazy"
   decoding="async"
   width={500}
   height={300}
 />

 </FadeInOnScroll>
 
            </div>
          </div>
       
        </div>
      </div>

      <div className=" relative overflow-hidden rounded-lg  transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        
        <div className="content">
          <div className="back">
            <div className="back-content">
               
            {/* Hình ảnh 3 */}
    <FadeInOnScroll>
 
 <Image
   src="/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp" 
   alt="Gói tour Tết Bến Tre 2 ngày 1 đêm"
   className="w-full h-auto object-cover"
   loading="lazy"
   decoding="async"
   width={500}
   height={300}
 />

 </FadeInOnScroll>
 
            </div>
          </div>
       
        </div>
      </div>


     </div>
  
  );
}
;

export default Card;
