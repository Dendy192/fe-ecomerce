import React, { useState } from "react";
import { assets } from "../assets/assets";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";

const Hero = ({ setHeroLoading }) => {
  const [imageUrls, setImageUrls] = useState([
    assets.hero_img,
    assets.hero_img1,
  ]);

  return (
    <div className="relative  mt-[80px] sm:flex-row border border-gray-400 z-0">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        navigation
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }} // Enable autoplay
        modules={[Navigation, Autoplay]}
        className="heroSweeper "
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt={`Banner ${index + 1}`}
              className="w-full sm:w-1/2  object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
