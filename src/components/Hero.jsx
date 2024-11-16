import React from "react";
import { assets } from "../assets/assets";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";

const Hero = () => {
  const imageUrls = [assets.hero_img, assets.hero_img1];
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 ">
      {/* hero left side
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      hero right side
      <img className="w-full sm:w-1/2" src={assets.hero_img} alt="" /> */}

      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        navigation
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }} // Enable autoplay
        modules={[Navigation, Autoplay]}
        className="w-full "
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            {console.log(url)}
            <img
              src={url}
              alt={`Banner ${index + 1}`}
              className="w-full sm:w-1/2"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
