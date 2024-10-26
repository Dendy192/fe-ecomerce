import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItems";

import "../assets/display.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
// import "swiper/swiper-bundle.css"; // Swiper styles

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latesProducts, setLatesProducts] = useState([]);
  useEffect(() => {
    setLatesProducts(products.slice(0, 10));
  }, []);

  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus omnis
          consequatur, nisi, asperiores possimus esse ratione quidem,
          consectetur officiis unde alias molestias earum suscipit maxime ex quo
          quaerat impedit eligendi!
        </p>
      </div>
      {/* rendering products */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latesProducts.map((item, index) => (
          <ProductItems
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div> */}
      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        navigation // enable arrows
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {latesProducts.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductItems
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestCollection;
